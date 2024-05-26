from flask import Flask, render_template, request, redirect, make_response, url_for
from flask import jsonify

import mysql.connector
import datetime
import json
import mistune
import string

# mongodb+srv://ayaan:tanu0909@cluster0.gusgocs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

app = Flask(__name__, static_url_path='/static')

# Connect to the MySQL database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="survey"
)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        mail = request.form['email']
        # mobno = request.form['phone']
        print(username, password, mail)

        cursor = db.cursor(buffered=True)
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if user is not None:
            return jsonify(
                {
                    "success": False,
                    "error": "Username already taken. Please choose a different username."
                }
            )

        cursor.execute(
            "INSERT INTO users (username, password, mail) VALUES (%s, %s, %s)", 
            (username, password, mail)
        )
        db.commit()

        cursor.execute(
            f"""
            CREATE TABLE user_{username} (
                formname VARCHAR(20),
                formid VARCHAR(30),
                at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
        db.commit()

        cursor.execute(
            f"""
            CREATE TABLE user_{username}_h (
                formid VARCHAR(30),
                at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                id INT
            );
            """
        )
        db.commit()

        # Continue with cookies and redirect to main.html
        response = make_response(redirect('/main'))
        response.set_cookie('username', username)
        return response

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Check if the user exists in the database
        cursor = db.cursor(buffered=True)
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if user is None:
            return jsonify({'success': False, 'error': 'Invalid username or password'})

        if str(user[1]) != str(password):
            return jsonify({'success': False, 'error': 'Invalid password'})

        response = make_response(redirect('/profile'))
        response.set_cookie('username', username)

        return response

    return render_template('login.html')

@app.route('/')
@app.route('/main')
def main():
    username = request.cookies.get('username')

    if username is None:
        return redirect('/login')

    return redirect('/profile')

@app.route('/create')
def create():
    username = request.cookies.get('username')

    if username is None:
        return render_template('login.html')
    
    i = 1
    cursor = db.cursor(buffered=True)
    while True:
        cursor.execute(
            f"SELECT formname from user_{username} WHERE formname = 'Form {i}';"
        )
        formn = cursor.fetchone()

        if formn is None:
            break
        
        i += 1 
    
    return render_template('newCreate.html', username=username, formn=i)

@app.route('/saveForm', methods=['POST'])
def saveForm():
    username = request.cookies.get('username')
    data = request.json

    print('\n', data, '\n',json.dumps(data[1]['textarea'], ensure_ascii=False))

    returnJson = { }
    cursor = db.cursor(buffered=True)

    if not data[0]['saved']:
        x = datetime.datetime.now().strftime("%d%m%y%H%M%S")
        form_id = username + "_" + x
        prop_id = form_id + "_p"
        returnJson = {'id': form_id}
        data[0]['id'] = form_id

        cursor.execute(
            f"""CREATE TABLE {form_id} (
                q INT, textarea JSON, checkbox JSON, radio JSON, other BOOLEAN, required BOOLEAN, display JSON
                );
            """
        )

        cursor.execute(
            f"""CREATE TABLE {prop_id} (
                author VARCHAR(20) DEFAULT "{username}",
                form VARCHAR(20), description LONGTEXT,
                modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                startdate DATE DEFAULT CURRENT_DATE,
                enddate DATE,
                active BOOLEAN DEFAULT TRUE,
                AMS BOOLEAN DEFAULT FALSE
                );
            """
        )

        cursor.execute(
            f"""CREATE TABLE {form_id}_s (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(20) NOT NULL,
                    submission JSON NOT NULL
                );
            """
        )

        cursor.execute(
            f"""INSERT INTO user_{username} 
                (formname, formid) VALUES ("{data[0]['form']}", "{form_id}");
            """
        )

        db.commit()

    cursor.execute(f"SELECT form FROM {data[0]['id']}_p")
    currentFormTitle = cursor.fetchone()

    # updating the form title in user_{username} if changed
    if currentFormTitle is not data[0]['form']:
        cursor.execute(
            f"UPDATE user_{username} SET formname = '{data[0]['form']}' WHERE formid = '{data[0]['id']}';"
        )
        db.commit()

    cursor.execute(f"DELETE FROM {data[0]['id']}_p")

    cursor.execute(
        f"""INSERT INTO {data[0]['id']}_p 
            (form, description, active, AMS) VALUES (
                "{data[0]['form']}", "{data[0]['description']}", {data[0]['active']}, {data[0]['AMS']}
            );
        """
    )

    cursor.execute(f"DELETE FROM {data[0]['id']}")

    for i in range(1, len(data)):
        cols = ""
        values = ""
        for j in data[i].keys():
            c = "["
            if type(data[i][j]) == list:
                for k in range(len(data[i][j])):
                    if c == "[":
                        c = c + "\\\"" + data[i][j][k].replace("\"", "\\\\\\\"").replace('\n', '\\\\n') + "\\\""
                    else:
                        c = c + ", \\\"" + data[i][j][k].replace("\"", "\\\\\\\"").replace('\n', '\\\\n') + "\\\""
                c = "JSON_QUOTE(\"" + c + "]\")"
            else:
                c = str(data[i][j])
            
            if cols == "":
                cols = j
                values = c
            else:
                cols = cols + ", " + j 
                values = values + ", " + c

        query = f"""INSERT INTO {data[0]['id']}
            ({cols}) VALUES ({values});
        """
        print(query)
        cursor.execute(query)
    

    db.commit()

    # print('reading data back:')
    # cursor.execute(f"SELECT * FROM {data[0]['id']}")

    # # Fetch all rows
    # rows = cursor.fetchall()
    # for row in rows:
    #     for i in row:
    #         if type(i) == bytes:
    #             print(json.loads(i.decode('utf-8')))
    #             continue
    #         print(i)


    # print("Received JSON:", data)
    return jsonify(returnJson)

def parseList(data):
    markdown = mistune.create_markdown(
        plugins=['subscript', 'superscript', 'spoiler', 'strikethrough']
    )
    returnList = []
    for i in range(len(data)):
        # data[i] = data[i].replace('<br>', ' \n')
        data[i] = data[i].replace('<br>', '')

        a = markdown(data[i])
        print('list: ', a, '\n\t', mistune.html(a), '\n\t', data[i], '\n')
        returnList.append(mistune.html(a)[:-2]) # removing the last two \n\n

    return returnList

@app.route('/display/<form_id>')
def display(form_id):
    username = request.cookies.get('username')
    cursor = db.cursor(buffered=True)

    cursor.execute(f"SELECT * FROM {form_id}_p")
    prop = cursor.fetchall()
    
    main = [
    {
        "author": prop[0][0],
        "form": prop[0][1],
        "description": prop[0][2],
        "active": prop[0][6],
        "AMS": prop[0][7],
        "id": form_id
    }, ]
    q = 0
    textarea = [ ]
    checkbox = [ ]
    radio = [ ]
    other = False
    required = True
    display = [ ]

    if not main[0]['AMS'] and username != main[0]['author']:
        cursor.execute(f"SELECT username FROM {form_id}_s WHERE username = '{username}'")
        users = cursor.fetchall()
        if len(users) > 0:
            return jsonify({"success": False, "error": "You have already submitted this form"})


    if main[0]['active'] == 0 and username != main[0]['author']:
        return "This form is not active"
    
    cursor.execute(f"SELECT * FROM {form_id}")
    rows = cursor.fetchall()

    for row in rows:
        q = row[0]
        if q == 0 : continue

        print ((row[1].decode('utf-8')).replace('\\\\n', ' <br>\\\\n'), '\n')
        textarea = parseList(json.loads(json.loads((row[1].decode('utf-8')).replace('\\\\n', ' <br>\\\\n'))))
        checkbox = parseList(json.loads(json.loads((row[2].decode('utf-8')).replace('\\\\n', ' <br>\\\\n'))))
        radio = parseList(json.loads(json.loads((row[3].decode('utf-8')).replace('\\\\n', ' <br>\\\\n'))))
        other = row[4]
        required = row[5]
        display = json.loads(json.loads((row[6].decode('utf-8'))))

        print(q, textarea, checkbox, radio, other, required, display)

        main.append({
            'q': q,
            'textarea': textarea,
            'checkbox': checkbox,
            'radio': radio,
            'other': other,
            'required': required,
            'display': display
        })
    
    print(main)

    return render_template('display.html', username=username, main=main)

@app.route('/submitForm', methods=['POST'])
def submitForm():
    username = request.cookies.get('username')
    data = request.json
    print('\n', data, '\n')
    print('\n', data['questions'], '\n')

    cursor = db.cursor(buffered=True)

    cursor.execute(f"SELECT * FROM {data['id']}_p")
    prop = cursor.fetchall()

    if not prop[0][7]:
        cursor.execute(f"SELECT username FROM {data['id']}_s WHERE username = '{username}'")
        users = cursor.fetchall()
        if len(users) > 0:
            return jsonify({"success": False, "error": "You have already submitted this form"})

    if prop[0][6] == 0:
        return jsonify({'success': False, 'error': 'Form is not active'})

    query = f"""INSERT INTO {data['id']}_s
                       (username, submission) VALUES
                       ("{username}", JSON_QUOTE("{data['questions']}"));
                   """
    print(query)

    cursor.execute(query)

    # storing formid into user_{username} history
    cursor.execute(
        f"""    
            SET @last_id = LAST_INSERT_ID();
        """
    )
    cursor.execute(
        f"""    
            INSERT INTO user_{username}_h (formid, id) VALUES ('{data['id']}', @last_id);
        """
    )

    db.commit()

    return jsonify({'success': True})

@app.route('/profile')
def redirectProfile():
    username = request.cookies.get('username')
    if username is None:
        return redirect('/login')
        
    formDetails = []

    cursor = db.cursor(buffered=True)

    cursor.execute(f"SELECT formname, formid FROM user_{username}")
    forms = cursor.fetchall()

    for form in forms:
        cursor.execute(f"SELECT * FROM {form[1]}_p")
        prop = list(cursor.fetchone())
        prop.append(form[1])
        formDetails.append(prop)

    cursor.execute(f"SELECT * FROM user_{username}_h")
    history = cursor.fetchall()

    historyForms = []
    for form in history:
        cursor.execute(f"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '{form[0]}_p')")
        exists = cursor.fetchone()[0]

        if not exists:
            prop = ['Form Deleted'] * 7
        else:
            cursor.execute(f"SELECT * FROM {form[0]}_p")
            prop = list(cursor.fetchone())

        prop.append(form)
        historyForms.append(prop)

    print(formDetails, '\n', historyForms, '\n')

    return render_template(
        'profile.html', username=username, forms=formDetails, history=historyForms
    )

@app.route('/analyse/<form_id>')
def analyse(form_id):
    username = request.cookies.get('username')
    cursor = db.cursor(buffered=True)

    cursor.execute(f"SELECT author FROM {form_id}_p")
    author = cursor.fetchone()

    if author[0] != username:
        return "You are not authorized to view this page."
    
    
    # getting the questions
    
    cursor.execute(f"SELECT * FROM {form_id}")
    rows = cursor.fetchall()
    
    main = [{
        "id": form_id
    }, ]
    q = 0
    textarea = [ ]
    checkbox = [ ]
    radio = [ ]
    other = 0
    required = True
    display = [ ]

    for row in rows:
        q = row[0]
        if q == 0 : continue

        # print ((row[1].decode('utf-8')).replace('\\\\n', ' <br>\\\\n'), '\n')
        print('here:', row[4])
        textarea = parseList(json.loads(json.loads((row[1].decode('utf-8')))))
        checkbox = parseList(json.loads(json.loads((row[2].decode('utf-8')))))
        radio = parseList(json.loads(json.loads((row[3].decode('utf-8')))))
        other = row[4]
        required = row[5]
        display = json.loads(json.loads((row[6].decode('utf-8'))))

        print(q, textarea, checkbox, radio, other, required, display)

        main.append({
            'q': q,
            'textarea': textarea,
            'checkbox': checkbox,
            'radio': radio,
            'other': other,
            'required': required,
            'display': display
        })
    
    print(main)

    # getting the form properties
    cursor.execute(f"SELECT * FROM {form_id}_p")
    formProps = cursor.fetchone()

    # getting all the submissions
    cursor.execute(f"SELECT * FROM {form_id}_s")
    submissions = cursor.fetchall()

    # mapping the tuples to lists
    submissions = list(map(lambda x: list(x), submissions))


    for submission in submissions:
        submission[2] = json.loads(submission[2].decode('utf-8'))
        # print(submission[2], '\n') 

    return render_template(
        'analyse.html',username=username, main=main, props=formProps, sub=submissions
    )

@app.route('/edit/<form_id>')
def edit(form_id):
    username = request.cookies.get('username')
    cursor = db.cursor(buffered=True)

    cursor.execute(f"SELECT author FROM {form_id}_p")
    author = cursor.fetchone()

    if author[0] != username:
        return "You are not authorized to view this page."

    cursor.execute(f"SELECT * FROM {form_id}_p")
    prop = cursor.fetchall()
    print(prop)

    cursor.execute(f"SELECT * FROM {form_id}")
    rows = cursor.fetchall()
    
    main = [
    {
        "author": prop[0][0],
        "form": prop[0][1],
        "description": prop[0][2],
        "active": prop[0][6],
        "AMS": prop[0][7],
        "id": form_id
    }, ]
    q = 0
    textarea = [ ]
    checkbox = [ ]
    radio = [ ]
    other = 0
    required = True
    display = [ ]

    for row in rows:
        q = row[0]
        if q == 0 : continue

        print ((row[1].decode('utf-8')).replace('\\\\n', ' <br>\\\\n'), '\n')
        textarea = json.loads(json.loads((row[1].decode('utf-8'))))
        checkbox = json.loads(json.loads((row[2].decode('utf-8'))))
        radio = json.loads(json.loads((row[3].decode('utf-8'))))
        other = row[4]
        required = row[5]
        display = json.loads(json.loads((row[6].decode('utf-8'))))

        print(q, textarea, checkbox, radio, other, required, display)

        main.append({
            'q': q,
            'textarea': textarea,
            'checkbox': checkbox,
            'radio': radio,
            'other': other,
            'required': required,
            'display': display
        })
    
    print(main)

    return render_template('edit.html', username=username, main=main)

@app.route('/trash', methods=['POST'])
def trash():
    username = request.cookies.get('username')
    data = str(request.json)

    cursor = db.cursor(buffered=True)
    cursor.execute(f"SELECT author FROM {data}_p")
    author = cursor.fetchone()

    if author[0] != username:
        return jsonify({'success': False, 'error': 'You are not authorized to delete this form'})
    
    cursor.execute(f"DROP TABLE {data}")
    cursor.execute(f"DROP TABLE {data}_p")
    cursor.execute(f"DROP TABLE {data}_s")
    cursor.execute(f"DELETE FROM user_{username} WHERE formid = '{data}'")
    db.commit()
    
    return jsonify({'success': True})

@app.route('/change/<chng>', methods=['POST'])
def change(chng):
    username = request.cookies.get('username')
    data = request.json
    print('\n/chng', data)
    
    if username is None:
        return redirect('/login')
    
    cursor = db.cursor(buffered=True)

    if chng == 'mail':
        cursor.execute(f"UPDATE `users` SET mail = '{data['newmail']}' WHERE username = 'admin';")
        db.commit()

        return jsonify({'success': True})
    
    elif chng == 'password':
        cursor.execute(f"UPDATE `users` SET password = '{data['newpswd']}' WHERE username = 'admin';")
        db.commit()

        return jsonify({'success': True})
    
    return jsonify({'success': False, 'error': 'Unknow Format'})

@app.route('/logout', methods=['POST', 'GET'])
def logout():
    response = redirect(url_for('login'))
    for cookie_name in request.cookies:
        response.delete_cookie(cookie_name)
    
    return response

@app.route('/regmail')
def regmail():
    username = request.cookies.get('username')
    if username is None:
        return redirect('/login')
    
    cursor = db.cursor(buffered=True)
    cursor.execute(f"SELECT mail FROM users WHERE username = '{username}'")
    mail = cursor.fetchone()[0]

    return jsonify({'success': True, 'mail': mail})

@app.route('/delete/<user>', methods=['POST'])
def delete(user):
    username = request.cookies.get('username')
    data = request.json
    print(data)
    if username != user:
        return jsonify({'success': False, 'error': 'You are not authorized to delete this account'})
    if data['auth'] == False:
        return jsonify({'success': False, 'error': 'Authentication Failed'})

    cursor = db.cursor(buffered=True)
    cursor.execute(f"SELECT * FROM user_{user}")
    forms = cursor.fetchall()

    for form in forms:
        cursor.execute(f"DROP TABLE {form[1]}")
        cursor.execute(f"DROP TABLE {form[1]}_p")
        cursor.execute(f"DROP TABLE {form[1]}_s")

    cursor.execute(f"DROP TABLE user_{user}")
    cursor.execute(f"DROP TABLE user_{user}_h")
    
    cursor.execute(f"DELETE FROM users WHERE username = '{user}'")
    db.commit()
    
    return redirect('/logout')

@app.route('/status', methods=['POST'])
def status():
    username = request.cookies.get('username')
    data = request.json

    if username is None:
        return jsonify({'success': False, 'error': 'You are not logged in'})
    
    cursor = db.cursor(buffered=True)

    cursor.execute(f"SELECT author FROM {data['formId']}_p")
    author = cursor.fetchone()
    if author[0] != username:
        return jsonify({'success': False, 'error': 'You are not authorized to change the status of this form'})

    cursor.execute(
        f"""UPDATE {data['formId']}_p 
            SET active = {data['active']}
            ;
        """
    )
    db.commit()

    return jsonify({'success': True, 'username': username})

@app.route('/viewform/<form_id>/<id>')
def viewForm(form_id, id):
    username = request.cookies.get('username')
    cursor = db.cursor(buffered=True)

    cursor.execute(f"SELECT * FROM {form_id}_p")
    prop = cursor.fetchall()

    cursor.execute(f"SELECT * FROM {form_id}")
    rows = cursor.fetchall()
    
    main = [
    {
        "author": prop[0][0],
        "form": prop[0][1],
        "description": prop[0][2],
        "active": prop[0][6],
        "id": form_id
    }, ]
    q = 0
    textarea = [ ]
    checkbox = [ ]
    radio = [ ]
    other = 0
    display = [ ]

    for row in rows:
        q = row[0]
        if q == 0 : continue

        print ((row[1].decode('utf-8')).replace('\\\\n', ' <br>\\\\n'), '\n')
        textarea = parseList(json.loads(json.loads((row[1].decode('utf-8')).replace('\\\\n', ' <br>\\\\n'))))
        checkbox = parseList(json.loads(json.loads((row[2].decode('utf-8')).replace('\\\\n', ' <br>\\\\n'))))
        radio = parseList(json.loads(json.loads((row[3].decode('utf-8')).replace('\\\\n', ' <br>\\\\n'))))
        other = row[4]
        display = json.loads(json.loads((row[5].decode('utf-8'))))

        print(q, textarea, checkbox, radio, display)

        main.append({
            'q': q,
            'textarea': textarea,
            'checkbox': checkbox,
            'radio': radio,
            'other': other,
            'display': display
        })
    
    print(main)

    # time to get the specific submission
    cursor.execute(f"SELECT * FROM {form_id}_s WHERE id = {id}")
    submission = cursor.fetchone()
    submission = json.loads(submission[2].decode('utf-8'))
    
    return render_template('viewHistory.html', username=username, main=main, submission=submission)

if __name__ == '__main__':
    app.run()
