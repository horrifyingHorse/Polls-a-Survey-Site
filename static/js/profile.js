let actveEl = 'f'
let TrashFlag = ''
let TrashFile = '' 
let TrashDiv

window.onload = function() {
    srno = 1
    formList.reverse().forEach(el => {
        const parentDiv = document.createElement('div');
        parentDiv.classList.add('tableBox', 'tableBoxContent');
        parentDiv.id = `sr${srno}f`;

        const srnoDiv = document.createElement('div');
        srnoDiv.className = 'srno';
        srnoDiv.innerHTML = srno;

        const formNameDiv = document.createElement('div');
        formNameDiv.className = 'formName';
        formNameDiv.innerHTML = el[1];

        const formDescDiv = document.createElement('div');
        formDescDiv.className = 'formDesc';
        formDescDiv.innerHTML = el[2];

        const dateDiv = document.createElement('div');
        dateDiv.className = 'formDate';
        dateDiv.innerHTML = el[3];

        const viewButton = document.createElement('button');
        viewButton.className = 'formButtons';
        viewButton.innerHTML = 'View';
        viewButton.onclick = function() {
            window.location.href = '/display/' + el[formList[0].length - 1];
        }

        const editButton = document.createElement('button');
        editButton.className = 'formButtons';
        editButton.innerHTML = 'Edit';
        editButton.onclick = function() {
            window.location.href = '/edit/' + el[formList[0].length - 1];
        }

        const analyzeButton = document.createElement('button');
        analyzeButton.className = 'formButtons';
        analyzeButton.innerHTML = 'Analyse';
        analyzeButton.onclick = function() {
            window.location.href = '/analyse/' + el[formList[0].length - 1];
        }

        const moveToTrash = document.createElement('div');
        moveToTrash.classList.add('formTrash');
        moveToTrash.innerHTML = 
            `<img src="${ImgUrl}" style="width: 1.5rem; height: 1.5rem">`;
        moveToTrash.setAttribute('onclick', `moveThatTrash('${el[formList[0].length - 1]}', ${parentDiv.id})`)

        const status = document.createElement('label');
        status.className = 'switch tooltip';

        chkd = ""
        stat = "Offline"
        if (el[6]) {
            chkd = "checked"
            stat = "Active"
        }

        status.innerHTML = 
        `<input type="checkbox" ${chkd} id="swStatusIn${srno}"
            onclick="switchButton(${srno}, '${el[formList[0].length - 1]}')">
        <span class="tooltiptext" id="switchStatus${srno}">${stat}</span>
        `

        parentDiv.appendChild(srnoDiv);
        parentDiv.appendChild(formNameDiv);
        parentDiv.appendChild(formDescDiv);
        parentDiv.appendChild(dateDiv);
        parentDiv.appendChild(status);
        parentDiv.appendChild(viewButton);
        parentDiv.appendChild(editButton);
        parentDiv.appendChild(analyzeButton);
        parentDiv.appendChild(moveToTrash);
        
        document.getElementById('myFormsTable').appendChild(parentDiv);

        srno += 1;
    });

    srno = 1
    historyList.reverse().forEach(el => {
        const parentDiv = document.createElement('div');
        parentDiv.classList.add('tableBox', 'tableBoxContent');;
        parentDiv.id = `sr${srno}h`;

        const srnoDiv = document.createElement('div');
        srnoDiv.className = 'srno';
        srnoDiv.innerHTML = srno;

        const formNameDiv = document.createElement('div');
        formNameDiv.className = 'formName';
        formNameDiv.innerHTML = el[1];

        const formDescDiv = document.createElement('div');
        formDescDiv.className = 'formDesc';
        formDescDiv.innerHTML = el[2];

        const formAuthor = document.createElement('div');
        formAuthor.className = 'formAuthor';
        formAuthor.innerHTML = el[0];

        const dateDiv = document.createElement('div');
        dateDiv.className = 'formDate';
        dateDiv.innerHTML = el[7][1];

        const viewButton = document.createElement('button');
        viewButton.className = 'formButtons';
        viewButton.innerHTML = 'View';
        viewButton.onclick = function() {
            window.location.href = '/viewform/' + el[7][0] + '/' + el[7][2];
        }

        parentDiv.appendChild(srnoDiv);
        parentDiv.appendChild(formNameDiv);
        parentDiv.appendChild(formDescDiv);
        parentDiv.appendChild(formAuthor);
        parentDiv.appendChild(dateDiv);
        parentDiv.appendChild(viewButton);

        
        document.getElementById('historyTable').appendChild(parentDiv);

        srno += 1;
    });
}

function switchButton(srn, fid) {
    let status = false;
    console.log(`swStatusIn${srn}`, this)
    if (document.getElementById(`swStatusIn${srn}`).checked) {
        status = true;
        document.getElementById(`switchStatus${srn}`).innerHTML = "Active";
    } else {
        document.getElementById(`switchStatus${srn}`).innerHTML = "Offline";
    }

    fetch('/status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(dataToSend)
        body: JSON.stringify({'active': status, 'formId': fid})
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from Flask:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

}

function searchForms() {
    // document.getElementById('sr1').getElementsByClassName('formName')[0].innerHTML
    const searchQuery = document.getElementById('search').value.toLowerCase();

    let srno = 1;
    while (document.getElementById(`sr${srno}${actveEl}`) !== null) {
        const el = document.getElementById(`sr${srno}${actveEl}`);
        const formName = el.getElementsByClassName('formName')[0].innerHTML.toLowerCase();
        const formDesc = el.getElementsByClassName('formDesc')[0].innerHTML.toLowerCase();
        const formDate = el.getElementsByClassName('formDate')[0].innerHTML.toLowerCase();


        if (formName.includes(searchQuery) ||
            formDesc.includes(searchQuery) || 
            formDate.includes(searchQuery))
        {
            el.style.display = 'flex';
        } else {
            el.style.display = 'none';
        }

        if (actveEl == 'h') {
            const formAuthor = el.getElementsByClassName('formAuthor')[0].innerHTML.toLowerCase();
            if (formAuthor.includes(searchQuery)) {
                el.style.display = 'flex';
            }
        }

        srno++
    }
}



function navbarDisplay(displayId) {
    document.getElementById('area').style.display = 'none'
    document.getElementById('myForms').setAttribute('class', '')

    document.getElementById('history_area').style.display = 'none'
    document.getElementById('history').setAttribute('class', '')

    document.getElementById('profile_area').style.display = 'none'
    document.getElementById('profile').setAttribute('class', '')

    switch (displayId) {   
        case 0:
            document.getElementById('area').style.display = 'block'
            document.getElementById('myForms').className = 'active'
            actveEl = 'f'
            break

        case 1:
            document.getElementById('history_area').style.display = 'block'
            document.getElementById('history').className = 'active'
            actveEl = 'h'
            break

        case 2:
            document.getElementById('profile_area').style.display = 'block'
            document.getElementById('profile').className = 'active'
            getEmail()
            actveEl = 'p'
            break

    }
}

function match(id) {
    let var1 = document.getElementById('newpswd')
    let var2 = document.getElementById('newpswd2')
    let button = document.getElementById('changePwd')

    if (id === 0) {
        var1 = document.getElementById("newmail")
        var2 = document.getElementById("newmail2")
        button = document.getElementById("changeBut")
    }

    if (var1.value == var2.value) button.removeAttribute('disabled')
    else button.setAttribute('disabled', 'true')

}

function chng(event, id) {
    event.preventDefault();
    if (id === 0) {
        let newMail = {
            "newmail": document.getElementById('newmail').value
        }

        fetch('/change/mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify(dataToSend)
            body: JSON.stringify(newMail)
        })
        .then(response => response.json())
        .then(data => {
            console.log('received', data)
        })
        .catch(error => {
            console.error('Error:', error);
        });
        getEmail()
    } else {
        let newPass = {
            "newpswd": document.getElementById('newpswd').value
        }

        fetch('/change/password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify(dataToSend)
            body: JSON.stringify(newPass)
        })
        .then(response => response.json())
        .then(data => {
            console.log('received', data)
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

function getEmail() {
    fetch('/regmail', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('mail').innerHTML = data.mail
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function customConfirm(flag) {
    // Show the overlay when the page loads
    if (flag === -1) {
        document.getElementById("overlay").style.display = "block";
        return
    }

    if (flag === 0) {
        document.getElementById("overlay").style.display = "none";
        return false
    }
    if (flag === 1) {
        console.log(flag, TrashFlag, TrashFile)
        document.getElementById("overlay").style.display = "none";

        switch (TrashFlag) {
            case 'trash':
                moveThatTrash('', '',true)
                break
            case 'delete':
                deleteAccount(true)
                break
        }
        return true
    }

    // Handle form submission
    // document.getElementById("descriptionForm").addEventListener("submit", function(event) {
    //   event.preventDefault(); // Prevent form submission
    // //   var description = document.getElementById("descriptionInput").value;
    // //   // Do something with the description, e.g., send it to the server
    // //   console.log("Description submitted:", description);
    //   // Hide the overlay
    //   document.getElementById("overlay").style.display = "none";
    //   document.getElementById("formTitle").value = main[0].form
    // });
}

document.getElementById('logout').addEventListener('click', () => {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(dataToSend)
        body: JSON.stringify({'logout': true})
    })
    .then(response => response)
    .then(data => {
        window.location.href = data.url
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function deleteAccount(confirmAuth=false) {
    if (!confirmAuth) {
        document.getElementById('additionalInfo').innerHTML =  
            `<i>Your Account Will be <b>permanently deleted</b> along with your information
             and surveys.<br><br>Are you sure you want to proceed?</i>`;
        TrashFlag = 'delete'
        customConfirm(-1)
        return
    }

    fetch(`/delete/${username}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(dataToSend)
        body: JSON.stringify({'auth': true})
    })
    .then(response => response)
    .then(data => {
        window.location.href = data.url
    })
    .catch(error => {
        console.error('Error:', error);
    });

    TrashFlag = ''
}

function moveThatTrash(incomingTrash='', divTrash=document.createElement('div'), confirmAuth=false) {
    if (!confirmAuth) {
        document.getElementById('additionalInfo').innerHTML =  
            `<i>The Survey and all its submissions will be permanently
            deleted.<br><br>You want to continue?</i>`;
        TrashFlag = 'trash'
        TrashFile = incomingTrash
        TrashDiv = divTrash
        customConfirm(-1)
        return
    }

    TrashDiv.remove()
    fetch('/trash', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(dataToSend)
        body: JSON.stringify(TrashFile)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from Flask:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    TrashFlag = ''

}