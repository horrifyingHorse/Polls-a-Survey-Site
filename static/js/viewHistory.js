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

        iQue()
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

    recSub.forEach((question, index )=> {
        console.log('Sub:', question)
        console.log('Checkbox:', question.checkbox)
        question.checkbox.forEach((el, index) => {
            if (!el) return

            if (el == -1) {
                document.getElementById(`iq${question.q}o0`).checked = true
                document.getElementById(`q${question.q}o0`).innerHTML = `<p>Other: </p>`
                document.getElementById(`oq${question.q}o0`).value = question.other
                update(question.q, 'o', 0)
            } else 
                document.getElementById(`iq${question.q}i${el}`).checked = true
            
        });

        console.log('Radio:', question.radio)   
        question.radio.forEach((el, index) => {
            if (el === '') return

            if (el == -1) {
                document.getElementById(`rq${question.q}o0`).checked = true
                document.getElementById(`q${question.q}o0`).innerHTML = `<p>Other: </p>`
                document.getElementById(`oq${question.q}o0`).value = question.other
                update(question.q, 'o', 0)
            } else 
                document.getElementById(`rq${question.q}r${el}`).checked = true
        });
    });


}   

// Event that triggers when the 'Add Question'
// is clicked to add a new question
function iQue() {
    // create a div
    const addBox = document.createElement('div');
    
    // adding attributes to the div
    addBox.id = `que${qNo}`;
    addBox.className = "questionBox"
    
    addBox.setAttribute("tabindex", `${qNo}`)
    addBox.setAttribute("onclick", `currentEle(${addBox.id})`)

    area.appendChild(addBox);
    
    
    eleToEdit = addBox; // setting the current Element to Edit as the newly

    DisplayNo++;
}

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
        elInput.setAttribute("onclick", "event.preventDefault()")
        // elInput.disabled = true
    } 
    else if (type === 'rBut' || (otherOpType === 'r' && type === 'other')) {
        parentDiv.className = 'radioBut-wrapper-39'
        customSpan.className = 'radioBut'

        elInput.setAttribute("type", "radio");
        elInput.setAttribute("name", `${eleToEditQ}rb`);
        elInput.id = `rq${eleToEditQ}${typeIdentifier}${existingEl}`
        elInput.setAttribute("onclick", "event.preventDefault()")
    }
    txt = txt.replace(/\n/g, '<br>');

    elInputText.innerHTML = txt;
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
        // set id of checkbox textarea as `i{$var}`
        textInput.id = `oq${eleToEditQ}${typeIdentifier}${existingEl}`; 
        textInput.className = "textBox";
        textInput.classList.add('otherOption')
        // textInput.setAttribute("onclick", "event.preventDefault()")
        textInput.disabled = true

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
    // switch (tI) {
    //     case 'o':
    //         resp_json.questions[atIndex(q, resp_json.questions)].other = updateEl.value
    //         break;
    // }
}

function atIndex (q, arr) {
    for (let j = 1; j < arr.length; j++)
        if (arr[j].q == q)
            return j

    return -1
}