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
        "form": document.getElementById('formTitle').value,
        "description": "",
        "active": true,
        "saved": false,
        "AMS": false,
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
            "required": true/false,
            "display": [
                            "t0",
                            "c1",
                            "c2", 
                            "c3",
                            "c4",
                            "t1",
                            "r0",
                            "r1"
                       ]
        }
    ]
*/

// global var that contains the HTML element that is currently selected to be edited
let eleToEdit

let selectionEleQ
let selectionEleType
let selectionEleId

// global var to store total question number 
let qNo = 1;
let titleNo = 1;
let DisplayNo = 1;

// flag for whether data is being loaded
let presentingData = true
let globalExistingEl = 0
let globalInsertText


dragula([document.getElementById('area')], {
    isContainer: function (el) {
        return false; // only elements in drake.containers will be taken into account
    },
    moves: function (el, source, handle, sibling) {
        return handle.classList.contains('handle');
    },
    accepts: function (el, target, source, sibling) {
        return true; // elements can be dropped in any of the `containers` by default
    },
    invalid: function (el, handle) {
        return false; // don't prevent any drags from initiating by default
    },
    direction: 'vertical',             // Y axis is considered when determining where an element would be dropped
    copy: false,                       // elements are moved by default, not copied
    copySortSource: false,             // elements in copy-source containers can be reordered
    revertOnSpill: true,              // spilling will put the element back where it was dragged from, if this is true
    removeOnSpill: false,              // spilling will `.remove` the element, if this is true
    mirrorContainer: document.body,    // set the element that gets mirror elements appended
    ignoreInputTextSelection: true,     // allows users to select input text, see details below
    slideFactorX: 0,               // allows users to select the amount of movement on the X axis before it is considered a drag instead of a click
    slideFactorY: 0,               // allows users to select the amount of movement on the Y axis before it is considered a drag instead of a click
    })
    .on('drag', function (el) {
        console.log(el, 'drag')
        el.classList.remove('animate__fadeInUp')
        el.classList.remove('animate__animated')
        document.getElementById(`con${el.id.slice(3)}`)
            .style.display = 'none';
        el.style
    })
    // .on('drop', function (el) {
    //     console.log('drop')
    // })
    // .on('over', function (el) {
    //     console.log('over')
    // })
    .on('out', function (el) {
        console.log(el, 'out')
        document.getElementById(`con${el.id.slice(3)}`)
            .style.display = 'block';
        currentEle(document.getElementById(`con${el.id.slice(3)}`))

        // Rearranging the fields in the main array
        allFields = document.getElementById('area').getElementsByClassName('questionBox')
        let tempMain = [main[0]]
        for (let i = 0; i < allFields.length; i++) {
            // tempMain.push(main[allFields[i].id.slice(3)])

            tempMain.push(main[atIndex(allFields[i].id.slice(3))])
        }
        main = tempMain
    }
);


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

        question.display.forEach((element, index) => {
            const eleType = element[0]
            const eleId = element.slice(1)
            globalExistingEl = eleId


            switch (eleType) {
                case 't':
                    globalInsertText = question.textarea[eleId]
                    insert('tBox')
                    break

                case 'i':
                    globalInsertText = question.checkbox[eleId]
                    insert('cBox')
                    break

                case 'r':
                    globalInsertText = question.radio[eleId]
                    insert('rBut')
                    break

                case 'o':
                    insert('other')
                    break
            }

        })

        console.log(document.getElementById(`f${question.q}`))
        if (!question.required) toggleRequired(document.getElementById(`f${question.q}`))
    })


    presentingData = false
    if (!main[0].active) document.getElementById('switchStatusIn').checked = false
    if (main[0].AMS) document.getElementById('AMSin').checked = true
}

// Event that triggers when the 'Add Question'
// is clicked to add a new question
function iQue() {
    // create a div
    const addBox = document.createElement('div');
    // create a div for the content of the question
    const contentBox = document.createElement('div')
    contentBox.id = `con${qNo}`
    
    // adding attributes to the div
    addBox.id = `que${qNo}`;
    addBox.className = "questionBox"
    addBox.classList.add(
        'animate__animated', 'animate__fadeInUp'
    );
    addBox.setAttribute("tabindex", `${qNo}`)
    addBox.setAttribute("onclick", `currentEle(${contentBox.id})`)
    addBox.setAttribute("style", `display: flex; padding-left: 0`)
    // addBox.setAttribute("style", "transform: translate(50px, 100px); transition: 1000ms")

    div2 = document.createElement('div')
    div2.innerHTML = 
        `<div class="removeOptionDiv" id="div-qq" onclick="currentEle(${contentBox.id})">
            <div class="questionHeader" onclick="currentEle(${contentBox.id})">
                <span style="font-size: 0.85rem; font-weight: 800; cursor: pointer;"
                    id="f${qNo}" class="required" onclick="toggleRequired(this)">
                    Field <span id="qN${qNo}">${DisplayNo}</span>
            </span>
            </div>

            <div class="removeImg" title="Remove">
                <img src="${ImgUrl}" class="removeImgIcon" onclick="removeElement(${qNo}, 'q', 'q')">
            </div>
        </div>
        `
    div2.appendChild(contentBox)

    addBox.innerHTML = 
        `
        <div class="handle">
        
        </div>
        `;
    

    addBox.appendChild(div2)

    area.appendChild(addBox);
    
    // As new question is created, a new object has to 
    // be added in our main[] array
    if (!presentingData) {
        mainOBJ = {
            "q": qNo,
            "textarea": [],
            "checkbox": [],
            "radio": [],
            "other": false,
            "required": true,
            "display": [],
        };
        main.push(mainOBJ);
    }
    
    eleToEdit = contentBox; // setting the current Element to Edit as the newly
        // added text box

    // whenFocused.style.display = 'contents' // display edit itmes in navbar

    qNo++; // increasing question number by 1
    DisplayNo++;

    dragula([contentBox], {
        isContainer: function (el) {
            return false; // only elements in drake.containers will be taken into account
        },
        moves: function (el, source, handle, sibling) {
            return true; // elements are always draggable by default
        },
        accepts: function (el, target, source, sibling) {
            return true; // elements can be dropped in any of the `containers` by default
        },
        invalid: function (el, handle) {
            return false; // don't prevent any drags from initiating by default
        },
        direction: 'vertical',             // Y axis is considered when determining where an element would be dropped
        copy: false,                       // elements are moved by default, not copied
        copySortSource: false,             // elements in copy-source containers can be reordered
        revertOnSpill: false,              // spilling will put the element back where it was dragged from, if this is true
        removeOnSpill: false,              // spilling will `.remove` the element, if this is true
        mirrorContainer: document.body,    // set the element that gets mirror elements appended
        ignoreInputTextSelection: true,     // allows users to select input text, see details below
        slideFactorX: 0,               // allows users to select the amount of movement on the X axis before it is considered a drag instead of a click
        slideFactorY: 0,               // allows users to select the amount of movement on the Y axis before it is considered a drag instead of a click
        })
        .on('drag', function (el) {
            console.log(el, 'drag')
            el.classList.remove('animate__fadeInUp')
            el.classList.remove('animate__animated')
            // document.getElementById(`con${el.id.slice(3)}`)
            //     .style.display = 'none';
            // el.style
        })
        .on('out', function (el) {
            console.log(el, 'out')
            // document.getElementById(`con${el.id.slice(3)}`)
            //     .style.display = 'block';

            q = el.id.slice(5)
            cutAt = 0
            if (q.includes('t')) cutAt = q.indexOf('t')
            else if (q.includes('i')) cutAt = q.indexOf('i')
            else if (q.includes('r')) cutAt = q.indexOf('r')
            else if (q.includes('o')) cutAt = q.indexOf('o')
            
            q = q.slice(0, cutAt)
            console.log(q)

            currentEle(document.getElementById(`con${q}`))

            // Rearranging the fields in the main array
            const contentEle = document.getElementById(`con${q}`)
            allFields = contentEle.getElementsByClassName('removeOptionDiv')
            let tempDisp = []
            for (let i = 0; i < allFields.length; i++) {
                id = allFields[i].id
                tempDisp.push(
                    id.slice(id.indexOf(`div-q${q}`) + `div-q${q}`.length)
                );
            }
            main[atIndex(q)].display = tempDisp
        }
    );
}

function makeRemoveDiv(q, eleType, eleId, eleToEditQ) {
    const removeParentDiv = document.createElement('div')
    const removeChildDiv = document.createElement('div')
    const removeImage = document.createElement('img')

    removeImage.setAttribute(
        'src', `${ImgUrl}`
    )
    removeImage.className = 'removeImgIcon'
    if (eleId === 'q') removeImage.setAttribute('onclick', `removeElement(${q}, 'q', 'q')`)
    else if (eleId === 'o') removeImage.setAttribute('onclick', `removeElement(${q}, 'o', 'o')`)
    else removeImage.setAttribute('onclick', `removeElement(${q}, '${eleType}', ${eleId})`)

    removeChildDiv.className = 'removeImg'

    removeChildDiv.appendChild(removeImage)

    removeParentDiv.className = 'removeOptionDiv'

    // This id is completely useless except for the fact that it helps a lot
    // & i mean A LOT when user deletes an Element
    // So basically on deleting an element, we set the div with this id to display: "none"
    removeParentDiv.id = `div-q${eleToEditQ}${eleType}${eleId}`
    removeParentDiv.appendChild(removeChildDiv)
    
    return removeParentDiv

}


// updates current question number when the 'div#que_n' is clicked
// triggers onclick: div#que${n}
function currentEle(qId) {
    eleToEdit = qId
    console.log('currentEle: ', qId)

    var parent = document.getElementById(`que${qId.id.slice(3)}`)
    var children = parent.getElementsByTagName("*");
    var focused = false;
    
    // Check if any child is focused
    for (var i = 0; i < children.length; i++) {
        if (children[i] === document.activeElement) {
            focused = true;
            break;
        }
    }
    
    // If none of the children are focused, focus the parent div
    if (!focused) {
        parent.focus();
    }

    toggleOtherOp(qId.id.slice(3))
}

function insert(type) {
    const eleToEditQ = eleToEdit.id.slice(3)
    switch (type) { 
        case 'tBox':
            typeIdentifier = 't'
            if (!presentingData) mainRoute = main[eleToEditQ].textarea
            break

        case 'cBox':
            typeIdentifier = 'i'
            if (!presentingData) mainRoute = main[eleToEditQ].checkbox
            break
            
        case 'rBut':
            typeIdentifier = 'r'
            if (!presentingData) mainRoute = main[eleToEditQ].radio
            break
        
        case 'other':
            typeIdentifier = 'o'
            mainRoute = main[atIndex(eleToEditQ)].other
            break
    }

    // this section includes the declaration of the elements 
    // required for : checkbox, radio button
    const parentDiv = document.createElement("div");
    const customLabel = document.createElement("label");
    const customSpan = document.createElement("span");
    const elInput = document.createElement('input');

    // this section includes the declaration of the elements
    // required for: text area
    const elInputText = document.createElement("textarea");
    const br = document.createElement("br");
    let existingEl = globalExistingEl
    if (!presentingData) existingEl = mainRoute.length
    if (typeIdentifier == 'o') { existingEl = 0 }

    if (type === 'cBox') { 
        parentDiv.className = 'checkbox-wrapper-39'
        customSpan.className = 'checkbox'

        elInput.setAttribute("type", "checkbox");
    } 
    else if (type === 'rBut') {
        parentDiv.className = 'radioBut-wrapper-39'
        customSpan.className = 'radioBut'

        elInput.setAttribute("type", "radio");
        elInput.setAttribute("name", `${eleToEditQ}rb`);
    }

    // elInput.id = `q${eleToEditQ}c${existingEl}`;
    // elInput.className = "checkbox";

    elInputText.setAttribute("type", "text")
    elInputText.setAttribute(
        "oninput", `update(${eleToEditQ}, '${typeIdentifier}', ${existingEl})`
    );
    elInputText.setAttribute(
        "onselect", `selectedEle(${eleToEditQ}, '${typeIdentifier}', ${existingEl})`
    );
    elInputText.setAttribute(
        "onclick",
        `selectedEle(${eleToEditQ}, '${typeIdentifier}', ${existingEl}); toggleStylising(event, 1)`
    );
    elInputText.setAttribute(
        "onfocusout", `toggleStylising(event, 0)`
    );
    if (!presentingData) elInputText.style.borderBottom = '2px dotted #bde0fe'
    // set id of checkbox textarea as `i{$var}`
    elInputText.id = `q${eleToEditQ}${typeIdentifier}${existingEl}`; 
    elInputText.className = "textBox";
    if (presentingData) elInputText.value = globalInsertText
    
    const removeDiv = makeRemoveDiv(eleToEditQ, typeIdentifier, existingEl, eleToEditQ)

    if (typeIdentifier === 'i' || typeIdentifier === 'r') {
        customLabel.appendChild(elInput)
        customLabel.appendChild(customSpan)
        parentDiv.appendChild(customLabel)    
        removeDiv.appendChild(parentDiv);
    }

    if (typeIdentifier === 'o') {
        elInputText.value = 'Other'
        elInputText.classList.add('otherOption')
        elInputText.style.borderBottom = '2px dotted #bde0fe'
    }

    removeDiv.appendChild(elInputText);
    removeDiv.appendChild(br)
    removeDiv.classList.add(
        'animate__animated', 'animate__fadeInUp'
    )

    eleToEdit.appendChild(removeDiv);

    if (typeIdentifier === 'o') {
        // mainRoute = true this doesn't work
        // edit: got it why it doesnt, it's because its passed by value
        // as it is not an array, which is passed by reference
        if (!presentingData)  main[atIndex(eleToEditQ)].other = true
        toggleStylising(event, 0)
    } else {
        if (!presentingData) mainRoute.push('')
        toggleStylising(event, 1)
    } 

    if (!presentingData) main[atIndex(eleToEditQ)].display.push(`${typeIdentifier}${existingEl}`)
    // pusing in display array

    selectedEle(eleToEditQ, typeIdentifier, existingEl)
    toggleStylising(event, 1)

    if (presentingData) update(eleToEditQ, typeIdentifier, existingEl)
}

// checkbox Textarea updation on input
function update(q, tI, elId) {
    if (q === -9) 
        updateEl = document.getElementById('propTitle')
    else if (q === -8)
        updateEl = document.getElementById('propDesc')
    else
        updateEl = document.getElementById(`q${q}${tI}${elId}`)

    if (updateEl.value == null || updateEl.value.trim() === '')
        updateEl.style.borderBottom = '2px dotted #bde0fe'
    else
        updateEl.setAttribute('style', 'border-bottome: auto')

    // resizing time!
    updateEl.style.height = 'auto'
    updateEl.style.height = updateEl.scrollHeight + "px"

    // updating the main
    switch (tI) {
        case 't':
            main[atIndex(q)].textarea[elId] = updateEl.value
            break;
        
        case 'i':
            main[atIndex(q)].checkbox[elId] = updateEl.value
            break;

        case 'r':
            main[atIndex(q)].radio[elId] = updateEl.value
            break;
    }
}


// function to add Title Box
function iTitleBox() {

}


// This Function Deletes an Element
// triggers onclick: RemoveImg
function removeElement(q, eleType, eleId) {
    // Checking if the Element to Delete is an Entire Question
    if (eleType === 'q' && eleId === 'q') {
        // document.getElementById(`que${q}`).className = 'animate__zoomOut'
        document.getElementById(`que${q}`).classList.add(
            'animate__animated', 'animate__zoomOut'
        );
        setTimeout(() => {
            document.getElementById(`que${q}`).style.display = 'none'
            document.getElementById(`que${q}`).remove()
        }, 250);
        
        // free the memory
        main[atIndex(q)].display = []
        main[atIndex(q)].checkbox = []
        main[atIndex(q)].radio = []
        main[atIndex(q)].textarea = []
        main[atIndex(q)].other = false

        main[atIndex(q)].q = 0

        // document.getElementById(`que${q}`).id = "none"
        let i = 0
        
        // updating the display number of the questions
        for (i = q + 1; i < qNo; i++) {
            // let updateQues = document.getElementById(`que${i}`)
            // updateQues.id = `que${i - 1}`
            let updateQuesSpan = document.getElementById(`qN${i}`)
            if (updateQuesSpan) updateQuesSpan.innerHTML = updateQuesSpan.innerHTML - 1
            // document.getElementById(`que${i}`).classList.add(
            //     'animate__animated', 'animate__slideInUp'
            // );
        }

        DisplayNo--

        return
    } else if (eleType === 'o' && eleId === 'o') {
        document.getElementById(`div-q${q}o0`).classList.add(
            'animate__animated', 'animate__zoomOut'
        );
        setTimeout(() => {
            document.getElementById(`div-q${q}o0`).style.display = 'none'
            document.getElementById(`div-q${q}o0`).remove()
        }, 250);

        main[atIndex(q)].other = false

        for (i in main[atIndex(q)].display) {
            if (main[atIndex(q)].display[i] == `${eleType}${eleId}`)
                break;
        }

        main[atIndex(q)].display[i] = ''

        document.getElementById('addOther').removeAttribute('disabled')

        return
    }

    // get question Element
    const parentQue = document.getElementById(`que${q}`)

    // since all the Parent elements, containing textarea etc,
    // have class 'removeOptionDiv'
    const eleToRemove =
        document.getElementById(`div-q${q}${eleType}${eleId}`)

    // same logic that is used in function textBoxUpdate()
    // let i = 0
    // for (i in eleToRemove) {
    //     if (eleToRemove[i].id === `div-${eleType}${eleId}`)
    //         break;
    // }
    
    // setting Parent Element display as "none"
    eleToRemove.style.display = "none";
    eleToRemove.remove()

    // Now updating for back-end
    // removing id in 'display'
    for (i in main[atIndex(q)].display) {
        if (main[atIndex(q)].display[i] == `${eleType}${eleId}`)
            break;
    }
    main[atIndex(q)].display[i] = ''

    // This updates the data in specific
    switch (eleType) {
        case 't':
            findIn = main[atIndex(q)].textarea
            break;
        
        case 'i':
            findIn = main[atIndex(q)].checkbox
            break;

        case 'r':
            findIn = main[atIndex(q)].radio
            break;
    }

    findIn[eleId] = ''

    eleToEdit =  document.getElementById(`con${q}`)
}

// Function to add markdown syntax to selected text in textarea
function addMarkdownSyntax(tag, twice) {
    if (selectionEleQ === -1) 
        textarea = document.getElementById('formTitle')
    else
        textarea = document.getElementById(
            `q${selectionEleQ}${selectionEleType}${selectionEleId}`
    ); // Get the currently focused textarea

    const start = textarea.selectionStart;  // Get the start position of the selection
    const end = textarea.selectionEnd;  // Get the end position of the selection
    let selectedText = textarea.value.substring(start, end);  // Get the selected text

    // Modify the selected text with markdown syntax
    if (twice) {
        if (selectedText === '') selectedText = ' '
        
        if (tag == ' ^') newText = `${tag}${selectedText}^`
        else if (tag == ' ~') newText = `${tag}${selectedText}~`
        else if (tag == ' >!') newText = `${tag}${selectedText}!<`
        else newText = `${tag}${selectedText}${tag}`;
    }
    else {
        newText = `${tag}${selectedText}`;
    }

    // Replace the selected text with the modified text
    textarea.setRangeText(newText, start, end, 'end');
    textarea.focus();

    update(selectionEleQ, selectionEleType, selectionEleId)
}

function selectedEle(ele, eleType, eleId) {
    selectionEleQ = ele
    selectionEleType = eleType
    selectionEleId = eleId

    toggleOtherOp(ele)
}

function navbarDisplay(displayId) {
    document.getElementById('insert').style.display = 'none'
    document.getElementById('insert_btn').setAttribute('class', '')

    document.getElementById('home').style.display = 'none'
    document.getElementById('home_btn').setAttribute('class', '')
    
    switch (displayId) {   
        case 0:
            document.getElementById('home').style.display = 'block'
            document.getElementById('home_btn').className = 'active'
            break

        case 1:
            document.getElementById('insert').style.display = 'block'
            document.getElementById('insert_btn').className = 'active'
            break

    }
}

function toggleStylising(event, flag) {
    // console.log(event, event.relatedTarget)

    const buttons = ['boldButton', 'italicButton', 'strikeButton', 'quoteButton', 
        'codeButton', 'h1Button', 'h2Button', 'h3Button', 'ulButton', 'supButton',
        'subButton', 'spoilButton'];

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

function displayProps() {
    // Show the overlay when the page loads
    document.getElementById("overlay").style.display = "block";
    document.getElementById("propTitle").value = main[0].form
    document.getElementById("propDesc").value = main[0].description

    // Handle form submission
    document.getElementById("descriptionForm").addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent form submission
    //   var description = document.getElementById("descriptionInput").value;
    //   // Do something with the description, e.g., send it to the server
    //   console.log("Description submitted:", description);
      // Hide the overlay
      document.getElementById("overlay").style.display = "none";
      document.getElementById("formTitle").value = main[0].form
    });
}

function saveForm() {
    // Sending JSON to Flask using fetch
    main[0].form = document.getElementById('formTitle').value
    console.log(main) // main is the array to be sent to Flask
    return new Promise((resolve, reject) => {
        fetch('/saveForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify(dataToSend)
            body: JSON.stringify(main)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from Flask:', data);
            if (main[0].saved === true) return
            main[0].saved = true
            main[0].id = data.id
            resolve()
        })
        .catch(error => {
            console.error('Error:', error);
            reject(error)
        });
    });
}

function openNewWindow() {
    window.open(`/display/${main[0].id}`, '_blank');
}

function viewForm() {
    event.preventDefault();
    saveForm().then(setTimeout(openNewWindow, 100))
}

function atIndex (q) {
    for (let j = 1; j < main.length; j++)
        if (main[j].q == q)
            return j

    return -1
}

function toggleOtherOp(q) {
    // console.log('Other: ', main[atIndex(q)].other)
    if (main[atIndex(q)].other)
        document.getElementById('addOther').setAttribute('disabled', 'true')
    else
        document.getElementById('addOther').removeAttribute('disabled')
}

function status(that) {
    if(that.checked) {
        document.getElementById('switchStatus').innerHTML = "Active"
        main[0].active = true;
    }
    else {
        document.getElementById('switchStatus').innerHTML = "Offline"
        main[0].active = false;
    }
}

function AMS(that) {
    if(that.checked) {
        document.getElementById('AMS').innerHTML = "Allowed"
        main[0].AMS = true;
    }
    else {
        document.getElementById('AMS').innerHTML = "Not Allowed"
        main[0].AMS = false;
    }

}

function toggleRequired(that) {
    that.classList.toggle('required')
    main[atIndex(that.id.slice(1), main)].required = !main[that.id.slice(1)].required
}