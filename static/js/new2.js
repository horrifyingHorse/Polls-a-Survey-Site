// global initialization of elements
const addQue = document.getElementById('addQue');
const area = document.getElementById('area');
const whenFocused = document.getElementById('whenFocused');
const addText = document.getElementById('addText');
const addCheckBox = document.getElementById('addCheckBox');

function displayProps() {
    // Show the overlay when the page loads
    document.getElementById("overlay").style.display = "block";
    document.getElementById("propTitle").value = main[0].form

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
  

// main array to be returned at submit
const main =
[
    {
        "form": document.getElementById('formTitle').value,
        "description": "",
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

// Event that triggers when the 'Add Question'
// is clicked to add a new question
function iQue() {
    // create a div
    const addBox = document.createElement('div');
    
    // adding attributes to the div
    addBox.id = `que${qNo}`;
    addBox.className = "questionBox"
    addBox.classList.add(
        'animate__animated', 'animate__fadeInUp'
    );
    addBox.setAttribute("tabindex", `${qNo}`)
    addBox.setAttribute("onclick", `currentEle(${addBox.id})`)
    // addBox.setAttribute("style", "transform: translate(50px, 100px); transition: 1000ms")
    addBox.innerHTML = 
        `
        <div class="removeOptionDiv" id="div-qq" onclick="currentEle(${addBox.id})">
            <div class="questionHeader" onclick="currentEle(${addBox.id})">
                <span style="font-size: 0.85rem; font-weight: 800;">
                    Field <span id="qN${qNo}">${DisplayNo}</span>
                </span>
            </div>

            <div class="removeImg" title="Remove">
                <img src="${ImgUrl}" class="removeImgIcon" onclick="removeElement(${qNo}, 'q', 'q')">
            </div>
        </div>
        `;

    area.appendChild(addBox);
    
    // As new question is created, a new object has to 
    // be added in our main[] array
    mainOBJ = {
        "q": qNo,
        "textarea": [],
        "checkbox": [],
        "radio": [],
        "display": [],
    };
    main.push(mainOBJ);
    
    eleToEdit = addBox; // setting the current Element to Edit as the newly
        // added text box

    // whenFocused.style.display = 'contents' // display edit itmes in navbar

    qNo++; // increasing question number by 1
    DisplayNo++;
}

function makeRemoveDiv(q, eleType, eleId, eleToEditQ) {
    const removeParentDiv = document.createElement('div')
    const removeChildDiv = document.createElement('div')
    const removeImage = document.createElement('img')

    removeImage.setAttribute(
        'src', `${ImgUrl}`
    )
    removeImage.className = 'removeImgIcon'
    removeImage.setAttribute('onclick', `removeElement(${q}, '${eleType}', ${eleId})`)

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
}

function insert(type) {
    const eleToEditQ = eleToEdit.id.slice(3)
    switch (type) { 
        case 'tBox':
            typeIdentifier = 't'
            mainRoute = main[eleToEditQ].textarea
            break

        case 'cBox':
            typeIdentifier = 'i'
            mainRoute = main[eleToEditQ].checkbox
            break
            
        case 'rBut':
            typeIdentifier = 'r'
            mainRoute = main[eleToEditQ].radio
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
    const existingEl = mainRoute.length

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
    elInputText.style.borderBottom = '2px dotted #bde0fe'
    // set id of checkbox textarea as `i{$var}`
    elInputText.id = `q${eleToEditQ}${typeIdentifier}${existingEl}`; 
    elInputText.className = "textBox";
    
    const removeDiv = makeRemoveDiv(eleToEditQ, typeIdentifier, existingEl, eleToEditQ)

    if (typeIdentifier === 'i' || typeIdentifier === 'r') {
        customLabel.appendChild(elInput)
        customLabel.appendChild(customSpan)
        parentDiv.appendChild(customLabel)    
        removeDiv.appendChild(parentDiv);
    }

    removeDiv.appendChild(elInputText);
    removeDiv.appendChild(br)
    removeDiv.classList.add(
        'animate__animated', 'animate__fadeInUp'
    )

    eleToEdit.appendChild(removeDiv);
    
    mainRoute.push('')

    main[eleToEditQ].display.push(`${typeIdentifier}${existingEl}`)
    // pusing in display array

    selectedEle(eleToEditQ, typeIdentifier, existingEl)
    toggleStylising(event, 1)
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
            main[q].textarea[elId] = updateEl.value
            break;
        
        case 'i':
            main[q].checkbox[elId] = updateEl.value
            break;

        case 'r':
            main[q].radio[elId] = updateEl.value
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
        }, 250);
        
        // free the memory
        main[q].q = 0
        main[q].display = []
        main[q].checkbox = []
        main[q].radio = []
        main[q].textarea = []

        // document.getElementById(`que${q}`).id = "none"
        let i = 0
        
        // updating the display number of the questions
        for (i = q + 1; i < qNo; i++) {
            // let updateQues = document.getElementById(`que${i}`)
            // updateQues.id = `que${i - 1}`
            let updateQuesSpan = document.getElementById(`qN${i}`)
            updateQuesSpan.innerHTML = updateQuesSpan.innerHTML - 1
            // document.getElementById(`que${i}`).classList.add(
            //     'animate__animated', 'animate__slideInUp'
            // );
        }

        DisplayNo--

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

    // Now updating for back-end
    // removing id in 'display'
    for (i in main[q].display) {
        if (main[q].display[i] == `${eleType}${eleId}`)
            break;
    }
    main[q].display[i] = ''

    // This updates the data in specific
    switch (eleType) {
        case 't':
            findIn = main[q].textarea
            break;
        
        case 'i':
            findIn = main[q].checkbox
            break;

        case 'r':
            findIn = main[q].radio
            break;
    }

    findIn[eleId] = ''

    eleToEdit = parentQue
}

// Function to add markdown syntax to selected text in textarea
function addMarkdownSyntax(tag, twice) {
    if (selectionEleQ === -1) 
        textarea = document.getElementById('formTitle')
    else
        textarea = document.getElementById(
            `q${selectionEleQ}${selectionEleType}${selectionEleId}`
    ); // Get the currently focused textarea

    const start = textarea.selectionStart; // Get the start position of the selection
    const end = textarea.selectionEnd; // Get the end position of the selection
    let selectedText = textarea.value.substring(start, end); // Get the selected text

    // Modify the selected text with markdown syntax
    if (twice) {
        if (selectedText === '') selectedText = ' '
        newText = `${tag}${selectedText}${tag}`;
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
}

function navbarDisplay(displayId) {
    document.getElementById('insert').style.display = 'none'
    document.getElementById('insert_btn').setAttribute('class', '')

    document.getElementById('home').style.display = 'none'
    document.getElementById('home_btn').setAttribute('class', '')
    
    // document.getElementById('properties').style.display = 'none'
    // document.getElementById('properties_btn').setAttribute('class', '')
    switch (displayId) {   
        case 0:
            document.getElementById('home').style.display = 'block'
            document.getElementById('home_btn').className = 'active'
            break

        case 1:
            document.getElementById('insert').style.display = 'block'
            document.getElementById('insert_btn').className = 'active'
            break

        // case 2:
        //     document.getElementById('properties').style.display = 'block'
        //     document.getElementById('properties_btn').className = 'active'
        //     break
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