// global initialization of elements
const addQue = document.getElementById('addQue');
const area = document.getElementById('area');
const whenFocused = document.getElementById('whenFocused');
const addText = document.getElementById('addText');
const addCheckBox = document.getElementById('addCheckBox');

// main array to be returned at submit
let main =
[
    {
        "form": "",
        "saved": false,
        "id": ""
    },
];
/* structure:
    [
        {
            "form": "formtitle",
            "saved": false,
            "id": "form_id"
        },

        {
            "q": 1,
            "textarea": [
                            "ques text",
                            "follow up text"
            ],
            "checkbox": [
                            "option 1",
                            "option 2",
                            "option 3",
                            "option 4",
            ],
            "radio": [
                        "option 1",
                        "option 2"
            ],
            "other": true/false,
            "display": [
                            "t0",
                            "c1",
                            "c2", 
                            "c3",
                            "c4",
                            "oo",
                            "t1",
                            "r0",
                            "r1"
            ]
        }
    ]
*/

let resp_json = {
    "id": recMain[0].id,
    "saved": false,
    "questions": [
        //{
            // "q": 1,
            // "checkbox": [
            //                 "option 1",
            //                 "option 2",
            //                 "option 3",
            //                 "option 4",
            //             ],
            // "radio": [
            //             "option 1",
            //             "option 2"
            //          ],
            // "other": "text"
        //}
    ]

}

let otherOpType = ''
let otherBalance = 0

// global var that contains the HTML element that is currently selected to be edited
let eleToEdit

let selectionEleQ
let selectionEleType
let selectionEleId

// global var to store total question number 
let qNo = 1;
let titleNo = 1;
let DisplayNo = 1;


window.onload = function() {
    console.log('Loaded', recMain)
    main = recMain

    recMain.forEach((question, index) => {
        if (index === 0) {
            // document.getElementById('formTitle').value = question.form
            return
        }
        console.log('Question:', question)
        if (question.q === 0) return

        qNo = question.q

        iQue(question.required)
        resp_json.questions.push({
            "q": qNo,
            "checkbox": [],
            "radio": [],
            "other": ""
        });

        otherOpType = ''
        otherBalance = 0

        question.display.forEach((element, index) => {
            const eleType = element[0]
            const eleId = element.slice(1)

            switch (eleType) {
                case 't':
                    insert('tBox', question.textarea[eleId], eleId)
                    break

                case 'i':
                    insert('cBox', question.checkbox[eleId], eleId)
                    otherOpType = 'i'
                    break

                case 'r':
                    insert('rBut', question.radio[eleId], eleId)
                    otherOpType = 'r'
                    break

                case 'o':
                    insert('other', '<p>Other</p>', "0")
                    otherBalance++
                    break
            }

        })
    })


}   

// Event that triggers when the 'Add Question'
// is clicked to add a new question
function iQue(required) {
    // create a div
    const addBox = document.createElement('div');
    
    // adding attributes to the div
    addBox.id = `que${qNo}`;
    addBox.className = "questionBox"

    if (required)
        addBox.classList.add('requiredDisplay')
    // addBox.classList.add(
    //     'animate__animated', 'animate__fadeInUp'
    // );
    addBox.setAttribute("tabindex", `${qNo}`)
    addBox.setAttribute("onclick", `currentEle(${addBox.id})`)
    // addBox.setAttribute("style", "transform: translate(50px, 100px); transition: 1000ms")
    // addBox.innerHTML = 
    //     `
    //     <div class="removeOptionDiv" id="div-qq" onclick="currentEle(${addBox.id})">
    //         <div class="questionHeader" onclick="currentEle(${addBox.id})">
    //             <span style="font-size: 0.85rem; font-weight: 800;">
    //                 Field <span id="qN${qNo}">${DisplayNo}</span>
    //             </span>
    //         </div>

    //         <div class="removeImg" title="Remove">
    //             <img src="${ImgUrl}" class="removeImgIcon" onclick="removeElement(${qNo}, 'q', 'q')">
    //         </div>
    //     </div>
    //     `;

    area.appendChild(addBox);
    
    // As new question is created, a new object has to 
    // be added in our main[] array
    // mainOBJ = {
    //     "q": qNo,
    //     "textarea": [],
    //     "checkbox": [],
    //     "radio": [],
    //     "display": [],
    // };
    // main.push(mainOBJ);
    
    eleToEdit = addBox; // setting the current Element to Edit as the newly
        // added text box

    // whenFocused.style.display = 'contents' // display edit itmes in navbar

    // qNo++; // increasing question number by 1
    DisplayNo++;
}

// function makeRemoveDiv(q, eleType, eleId, eleToEditQ) {
//     const removeParentDiv = document.createElement('div')
//     const removeChildDiv = document.createElement('div')
//     const removeImage = document.createElement('img')

//     removeImage.setAttribute(
//         'src', `${ImgUrl}`
//     )
//     removeImage.className = 'removeImgIcon'
//     removeImage.setAttribute('onclick', `removeElement(${q}, '${eleType}', ${eleId})`)

//     removeChildDiv.className = 'removeImg'

//     removeChildDiv.appendChild(removeImage)

//     removeParentDiv.className = 'removeOptionDiv'

//     // This id is completely useless except for the fact that it helps a lot
//     // & i mean A LOT when user deletes an Element
//     // So basically on deleting an element, we set the div with this id to display: "none"
//     removeParentDiv.id = `div-q${eleToEditQ}${eleType}${eleId}`
//     removeParentDiv.appendChild(removeChildDiv)
    
//     return removeParentDiv

// }

// updates current question number when the 'div#que_n' is clicked
// triggers onclick: div#que${n}
function currentEle(qId) {
    eleToEdit = qId
}

function insert(type, txt, existingEl) {
    const eleToEditQ = eleToEdit.id.slice(3)
    switch (type) { 
        case 'tBox':
            typeIdentifier = 't'
            mainRoute = main[atIndex(eleToEditQ, main)].textarea
            break

        case 'cBox':
            typeIdentifier = 'i'
            mainRoute = main[atIndex(eleToEditQ, main)].checkbox
            break
            
        case 'rBut':
            typeIdentifier = 'r'
            mainRoute = main[atIndex(eleToEditQ, main)].radio
            break

        case 'other':
            typeIdentifier = 'o'
            mainRoute = main[atIndex(eleToEditQ, main)].other
            break
    }

    // this section includes the declaration of the elements 
    // required for : checkbox, radio button
    const wraperLabel = document.createElement("label");
    const parentDiv = document.createElement("div");
    const customLabel = document.createElement("label");
    const customSpan = document.createElement("span");
    const elInput = document.createElement('input');
    const textInput = document.createElement('textarea')

    // this section includes the declaration of the elements
    // required for: text area
    const elInputText = document.createElement("span");
    const br = document.createElement("br");
    // const existingEl = mainRoute.length

    console.log((otherOpType === 'i' && type === 'other'))

    if (type === 'cBox' || (otherOpType === 'i' && type === 'other')) { 
        parentDiv.className = 'checkbox-wrapper-39'
        customSpan.className = 'checkbox'

        elInput.setAttribute("type", "checkbox");
        elInput.id = `iq${eleToEditQ}${typeIdentifier}${existingEl}`
        elInput.setAttribute(
            "onclick", `selectBox(${eleToEditQ}, '${typeIdentifier}', ${existingEl})`
        );
    } 
    else if (type === 'rBut' || (otherOpType === 'r' && type === 'other')) {
        parentDiv.className = 'radioBut-wrapper-39'
        customSpan.className = 'radioBut'

        elInput.setAttribute("type", "radio");
        elInput.setAttribute("name", `${eleToEditQ}rb`);
        elInput.id = `iq${eleToEditQ}${typeIdentifier}${existingEl}`
        elInput.setAttribute(
            "onclick", `selectBox(${eleToEditQ}, '${typeIdentifier}', ${existingEl})`
        );
    }

    // elInput.id = `q${eleToEditQ}c${existingEl}`;
    // elInput.className = "checkbox";

    // elInputText.setAttribute("type", "text")
    // elInputText.setAttribute(
    //     "oninput", `update(${eleToEditQ}, '${typeIdentifier}', ${existingEl})`
    // );
    // elInputText.setAttribute(
    //     "onselect", `selectedEle(${eleToEditQ}, '${typeIdentifier}', ${existingEl})`
    // );
    // elInputText.setAttribute(
    //     "onclick",
    //     `selectedEle(${eleToEditQ}, '${typeIdentifier}', ${existingEl}); toggleStylising(event, 1)`
    // );
    // elInputText.setAttribute(
    //     "onfocusout", `toggleStylising(event, 0)`
    // );
    txt = txt.replace(/\n/g, '<br>');

    elInputText.innerHTML = txt;
    // elInputText.style.borderBottom = '2px dotted #bde0fe'
    // set id of checkbox textarea as `i{$var}`
    elInputText.id = `q${eleToEditQ}${typeIdentifier}${existingEl}`; 
    elInputText.className = "";
    
    // const removeDiv = makeRemoveDiv(eleToEditQ, typeIdentifier, existingEl, eleToEditQ)

    if (typeIdentifier === 'i' || typeIdentifier === 'r' || typeIdentifier === 'o') {
        customLabel.appendChild(elInput)
        customLabel.appendChild(customSpan)
        parentDiv.appendChild(customLabel)    
        wraperLabel.appendChild(parentDiv)
        wraperLabel.appendChild(elInputText)

        wraperLabel.style.display = 'flex'

        eleToEdit.appendChild(wraperLabel);
    
    }
    else {
        parentDiv.appendChild(elInputText);
        parentDiv.appendChild(br)
        eleToEdit.appendChild(parentDiv);
    
    }

    if (type === 'other') {
        textInput.setAttribute("type", "text")
        textInput.setAttribute(
            "oninput", `update(${eleToEditQ}, '${typeIdentifier}', ${existingEl})`
        );
        textInput.style.borderBottom = '2px dotted #bde0fe'
        // set id of checkbox textarea as `i{$var}`
        textInput.id = `oq${eleToEditQ}${typeIdentifier}${existingEl}`; 
        textInput.className = "textBox";
        textInput.style.display = 'none'

        wraperLabel.appendChild(textInput)
    }
        
    // removeDiv.classList.add(
    //     'animate__animated', 'animate__fadeInUp'
    // )


    // mainRoute.push('')

    // main[eleToEditQ].display.push(`${typeIdentifier}${existingEl}`)
    // pusing in display array

    // selectedEle(eleToEditQ, typeIdentifier, existingEl)
    // toggleStylising(event, 1)
}

// checkbox Textarea updation on input
function update(q, tI, elId) {
    updateEl = document.getElementById(`oq${q}o0`)

    if (updateEl.value == null || updateEl.value.trim() === '')
        updateEl.style.borderBottom = '2px dotted #bde0fe'
    else
        updateEl.setAttribute('style', 'border-bottome: auto')

    // resizing time!
    updateEl.style.height = 'auto'
    updateEl.style.height = updateEl.scrollHeight + "px"

    // updating the main
    switch (tI) {
        case 'o':
            resp_json.questions[atIndex(q, resp_json.questions)].other = updateEl.value
            break;
    }
}


function selectBox(q, tI, elId) {
    // console.log('select:', q, elId)
    i = 0
    while (resp_json.questions[i].q != q) i++

    switch (tI) { 
        case 'i':
            selectBoxQuery = resp_json.questions[i].checkbox
            break
        
        case 'r':

            if (document.getElementById(`iq${q}r${elId}`).checked &&
                resp_json.questions[i].radio[0] === elId) {
                resp_json.questions[i].radio = [ ]
                document.getElementById(`iq${q}r${elId}`).checked = false
            } else {
                resp_json.questions[i].radio = [elId]
            }

            if (document.getElementById(`iq${q}o0`) === undefined) return
            
            document.getElementById(`oq${q}o0`).style.display = 'none'
            document.getElementById(`q${q}o0`).innerHTML = '<p>Other </p>'
            resp_json.questions[i].other = ''

            return

        case 'o':
            console.log(`iq${q}o0`, document.getElementById(`iq${q}o0`).checked)
            if (document.getElementById(`oq${q}o0`).style.display === 'none' || document.getElementById(`iq${q}o0`).checked) {
                document.getElementById(`oq${q}o0`).style.display = 'block'
                document.getElementById(`q${q}o0`).innerHTML = '<p>Other: </p>'
                resp_json.questions[i].other = document.getElementById(`oq${q}o0`).value
            } else {
                document.getElementById(`oq${q}o0`).style.display = 'none'
                document.getElementById(`q${q}o0`).innerHTML = '<p>Other </p>'
                resp_json.questions[i].other = ''
            }

            if (document.getElementById(`iq${q}o0`).type === 'radio') {
                resp_json.questions[i].radio = [-1]
                return
            }

            selectBoxQuery = resp_json.questions[i].checkbox
            elId = -1
            break
    }

    flag = 0; j = 0
    selectBoxQuery.forEach((el, index) => {
        // console.log('el=', el, index, elId, el === elId)
        if (el === elId) {
            flag = 1
            j = index
            // return
        }
    });

    if (flag === 1)
        selectBoxQuery[j] = ''
    else {
        for (j in selectBoxQuery) {
            // console.log(j, selectBoxQuery[j])
            if (selectBoxQuery[j] === '') {
                selectBoxQuery[j] = elId
                return
            }
        }
        selectBoxQuery.push(elId)
    }
}

function submitForm() {
    let review = false
    recMain.forEach((question, index) => {
        if (index === 0 || review) {
            // document.getElementById('formTitle').value = question.form
            return
        }
        if (question.q === 0) return

        // console.log(checkForCharInArray('i', question.display), checkForCharInArray('r', question.display))

        if (question.required) {
            console.log(resp_json.questions[atIndex(question.q, resp_json.questions)], question.q, resp_json)
            if ((resp_json.questions[atIndex(question.q, resp_json.questions)].checkbox.length === 0 ||
                resp_json.questions[atIndex(question.q, resp_json.questions)].checkbox.every(element => element === '')) &&
                (resp_json.questions[atIndex(question.q, resp_json.questions)].radio.length === 0 ||
                resp_json.questions[atIndex(question.q, resp_json.questions)].radio.every(element => element === '')) &&
                resp_json.questions[atIndex(question.q, resp_json.questions)].other === '' &&
                (checkForCharInArray('i', question.display) || checkForCharInArray('r', question.display))
            ) {
                
                document.getElementById('additionalInfo').innerHTML = 
                    `<h2 style="margin-bottom: 1rem">Incomplete Submission</h2>
                    <i>Please fill all the required fields</i>`;
                customConfirm(-1)
                review = true
                return
            }
        }

        function checkForCharInArray(char, arrayOfStrings) {
            // Loop through each string in the array
            for (let i = 0; i < arrayOfStrings.length; i++) {
                // Check if the current string contains the character
                if (arrayOfStrings[i].includes(char)) {
                    // If the character is found in any string, return true
                    return true;
                }
            }
            // If the character is not found in any string, return false
            return false;
        }
        
    });

    if (review) return

    fetch('/submitForm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(dataToSend)
        body: JSON.stringify(resp_json)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from Flask:', data);
        if (!data.success) {
            document.getElementById('additionalInfo').innerHTML = 
                `<h2 style="margin-bottom: 1rem">Unauthorised Submission</h2>
                <i>${data.error}</i>`;
            customConfirm(-1)
            return
        } else {
            document.getElementById('submit').remove()
            document.getElementById('area').style.display = 'none'
            document.getElementById('successSubmit').style.display = 'block'

            if (!main[0].AMS) document.getElementById('AMSallow').style.display = 'none'
            document.getElementById('AMSallow').innerHTML = 
                `<a href="http://localhost:5000/display/${main[0].id}" style="color: blue; text-decoration: underline;">Fill another submission</a>`
                
        }
        // if (main[0].saved === true) return
        // main[0].saved = true
        // main[0].id = data.id
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('additionalInfo').innerHTML = 
            `<h2 style="margin-bottom: 1rem">Server Error</h2>
            <i>${data.error}</i>`;
        customConfirm(-1)
        return
    });
}

function toggleStylising(event, flag) {
    // console.log(event, event.relatedTarget)

    const buttons = ['boldButton', 'italicButton', 'strikeButton', 'quoteButton', 
        'codeButton', 'h1Button', 'h2Button', 'h3Button', 'ulButton'];

    if (flag) {
        buttons.forEach(button => {
            document.getElementById(button).removeAttribute('disabled')
        })

        return
    }

    flag = 0
    buttons.forEach(button => {
        if (event.relatedTarget === document.getElementById(button)) {
            flag = 1
        }
    })

    if (flag) return
    if (event.relatedTarget != null) {
        if (event.relatedTarget.tagName.toLowerCase() == 'textarea') return
    }

    buttons.forEach(button => {
        document.getElementById(button).setAttribute('disabled', 'true')
    })

}

function atIndex (q, arr) {
    for (let j = 0; j < arr.length; j++)
        if (arr[j].q == q)
            return j

    return -1
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
        document.getElementById("overlay").style.display = "none";
        return true
    }
}