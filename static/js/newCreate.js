// global initialization of elements
const addQue = document.getElementById('addQue');
const area = document.getElementById('area');
const whenFocused = document.getElementById('whenFocused');
const addText = document.getElementById('addText');
const addCheckBox = document.getElementById('addCheckBox');

// main array to be returned at submit
const main = [ ]
/* structure:
    [
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
                <img src="./data/trash-solid.svg" class="removeImgIcon" onclick="removeElement(${qNo}, 'q', 'q')">
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
    whenFocused.style.display = 'contents' // display edit itmes in navbar

    qNo++; // increasing question number by 1
    DisplayNo++;
}

function makeRemoveDiv(q, eleType, eleId) {
    const removeParentDiv = document.createElement('div')
    const removeChildDiv = document.createElement('div')
    const removeImage = document.createElement('img')

    removeImage.setAttribute(
        'src', './data/trash-solid.svg'
    )
    removeImage.className = 'removeImgIcon'
    removeImage.setAttribute('onclick', `removeElement(${q}, '${eleType}', ${eleId})`)

    removeChildDiv.className = 'removeImg'

    removeChildDiv.appendChild(removeImage)

    removeParentDiv.className = 'removeOptionDiv'

    // This id is completely useless except for the fact that it helps a lot
    // & i mean A LOT when user deletes an Element
    // So basically on deleting an element, we set the div with this id to display: "none"
    removeParentDiv.id = `div-${eleType}${eleId}`
    removeParentDiv.appendChild(removeChildDiv)
    
    return removeParentDiv

}


// inserting a Text Box
// Event triggers onclick: Add Text Box
function iTextBox() {
    // creating a textarea element
    const textBox = document.createElement("textarea")
    const eleToEditQ = eleToEdit.id.slice(3); // getting question numebr
    
    // this counts total number of text box
    // present in the eleToEdit i.e. current question
    const existingTextBox = main[eleToEditQ - 1].textarea.length

    // adding attributes to the textarea 
    textBox.id = `t${existingTextBox}`;
    textBox.className = "textBox";
    // triggering a function textBoxUpdate(ques_num, index_to_edit) oninput
    textBox.setAttribute("oninput", `textBoxUpdate(${eleToEditQ}, ${existingTextBox})`);
    textBox.setAttribute("onselect", `selectedEle(${eleToEditQ}, 't', ${existingTextBox})`);
   
    textBox.style.borderBottom = '2px dotted #bde0fe'
    textBox.classList.add(
        'animate__animated', 'animate__fadeInUp'
    );

    // creating a 'remove' element option
    // this is what will be appended to area
    const removeDiv = makeRemoveDiv(eleToEditQ, "t", existingTextBox)
    removeDiv.appendChild(textBox)

    eleToEdit.appendChild(removeDiv);
    main[eleToEditQ - 1].textarea.push('') // pushing an empty string in main[]

    main[eleToEditQ - 1].display.push(`t${existingTextBox}`) 
    // pushing id in display so that while displaying, order is maintained in main[]
}

// Updates the text inside textarea in main[]
// function triggers oninput: textBox
function textBoxUpdate(q, tId) {
    const parentQue = document.getElementById(`que${q}`)
    const textBox =
        parentQue.getElementsByTagName('textarea')//[tId].value;
    
    // the code below is in response to the fact that the TagName textarea 
    // is used not only in 'Text Box' but also in other functionalities like
    // 'CheckBox' and 'RadioButtons'

    // This code filters out those 'textarea's that has id beginning with 't'
    // denoting textbox and increases counter i that keeps count of number of
    // textbox and this process loops until the counter is equal to tId

    let i = 0
    for (i in textBox) {
        if (textBox[i].id[0] === 't') {
            if (textBox[i].id.slice(1) == tId)
                break;
        }
    }

    // setting bottom border if the textarea is empty
    if (textBox[i].value == null || textBox[i].value.trim() === '')
        textBox[i].style.borderBottom = '2px dotted #bde0fe'
    else
        textBox[i].setAttribute('style', 'border-bottome: auto');
        

    // resizing textarea when a new line is inserted or removed
    textBox[i].style.height = 'auto'
    textBox[i].style.height = textBox[i].scrollHeight + "px"



    main[q - 1].textarea[tId] = textBox[i].value

}

// updates current question number when the 'div#que_n' is clicked
// triggers onclick: div#que${n}
function currentEle(qId) {
    eleToEdit = qId
}


// insert checkbox
// teriggers onclick: Add Check Box
function iCheckBox() {
    const customCheckBoxDiv = document.createElement("div");
    const customLabel = document.createElement("label");
    const customSpan = document.createElement("span");

    const cBoxInput = document.createElement('input');
    const cBoxInputText = document.createElement("textarea");
    const br = document.createElement("br");
    const eleToEditQ = eleToEdit.id.slice(3)
    const existingCheckBox = main[eleToEditQ - 1].checkbox.length
    
    customCheckBoxDiv.className = 'checkbox-wrapper-39'
    customSpan.className = 'checkbox'

    cBoxInput.setAttribute("type", "checkbox");
    cBoxInput.id = `c${existingCheckBox}`;
    // cBoxInput.className = "checkbox";

    cBoxInputText.setAttribute("type", "text")
    cBoxInputText.setAttribute(
        "oninput", `checkBoxUpdate(${eleToEditQ}, ${existingCheckBox})`
    );
    cBoxInputText.style.borderBottom = '2px dotted #bde0fe'
    // set id of checkbox textarea as `i{$var}`
    cBoxInputText.id = `i${existingCheckBox}`; 
    cBoxInputText.className = "checkBoxTextarea";
    
    const removeDiv = makeRemoveDiv(eleToEditQ, "i", existingCheckBox)

    customLabel.appendChild(cBoxInput)
    customLabel.appendChild(customSpan)
    customCheckBoxDiv.appendChild(customLabel)    
    removeDiv.appendChild(customCheckBoxDiv);
    removeDiv.appendChild(cBoxInputText);
    removeDiv.appendChild(br)
    removeDiv.classList.add(
        'animate__animated', 'animate__fadeInUp'
    )

    eleToEdit.appendChild(removeDiv);
    
    main[eleToEditQ - 1].checkbox.push('')

    main[eleToEditQ - 1].display.push(`i${existingCheckBox}`)
    // pusing in display array
}

// checkbox Textarea updation on input
function checkBoxUpdate(q, cId) {
    const parentQue = document.getElementById(`que${q}`)
    const checkBox =
        parentQue.getElementsByTagName('textarea')//[cId].value;

    // same logic that is used in function textBoxUpdate()

    let i = 0
    for (i in checkBox) {
        if (checkBox[i].id[0] === 'i') {
            if (checkBox[i].id.slice(1) == cId)
                break;
        }
    }

    //
    if (checkBox[i].value == null || checkBox[i].value.trim() === '')
        checkBox[i].style.borderBottom = '2px dotted #bde0fe'
    else
        checkBox[i].setAttribute('style', 'border-bottome: auto');

    // resizing time!
    checkBox[i].style.height = 'auto'
    checkBox[i].style.height = checkBox[i].scrollHeight + "px"

    main[q - 1].checkbox[cId] = checkBox[i].value
}

// insert checkbox  
// teriggers onclick: Add Radio Button
function iRadio() {
    const customRadioButDiv = document.createElement("div");
    const customLabel = document.createElement("label");
    const customSpan = document.createElement("span");

    const rButInput = document.createElement('input');
    const rButInputText = document.createElement("textarea");
    const br = document.createElement("br");
    const eleToEditQ = eleToEdit.id.slice(3)
    const existingRadioBut = main[eleToEditQ - 1].radio.length
    
    customRadioButDiv.className = 'radioBut-wrapper-39'
    customSpan.className = 'radioBut'

    rButInput.setAttribute("type", "radio");
    rButInput.setAttribute("name", `${eleToEditQ}rb`);
    // rButInput.id = `r${existingRadioBut}`;
    // cBoxInput.className = "checkbox";

    rButInputText.setAttribute("type", "text")
    rButInputText.setAttribute(
        "oninput", `radioButUpdate(${eleToEditQ}, ${existingRadioBut})`
    );
    rButInputText.style.borderBottom = '2px dotted #bde0fe'
    // set id of checkbox textarea as `i{$var}`
    rButInputText.id = `r${existingRadioBut}`; 
    rButInputText.className = "radioButTextarea";
    
    const removeDiv = makeRemoveDiv(eleToEditQ, "r", existingRadioBut)

    customLabel.appendChild(rButInput)
    customLabel.appendChild(customSpan)
    customRadioButDiv.appendChild(customLabel)    
    removeDiv.appendChild(customRadioButDiv);
    removeDiv.appendChild(rButInputText);
    removeDiv.appendChild(br)
    removeDiv.classList.add(
        'animate__animated', 'animate__fadeInUp'
    )

    eleToEdit.appendChild(removeDiv);
    
    main[eleToEditQ - 1].radio.push('')

    main[eleToEditQ - 1].display.push(`r${existingRadioBut}`)
    // pusing in display array
}


// checkbox Textarea updation on input
function radioButUpdate(q, cId) {
    const parentQue = document.getElementById(`que${q}`)
    const radioBut =
        parentQue.getElementsByTagName('textarea')//[cId].value;

    // same logic that is used in function textBoxUpdate()

    let i = 0
    for (i in radioBut) {
        if (radioBut[i].id[0] === 'r') {
            if (radioBut[i].id.slice(1) == cId)
                break;
        }
    }

    //
    if (radioBut[i].value == null || radioBut[i].value.trim() === '')
        radioBut[i].style.borderBottom = '2px dotted #bde0fe'
    else
        radioBut[i].setAttribute('style', 'border-bottome: auto');

    // resizing time!
    radioBut[i].style.height = 'auto'
    radioBut[i].style.height = radioBut[i].scrollHeight + "px"

    main[q - 1].radio[cId] = radioBut[i].value
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
        main[q - 1].q = 0
        main[q - 1].display = []
        main[q - 1].checkbox = []
        main[q - 1].radio = []
        main[q - 1].textarea = []

        // document.getElementById(`que${q}`).id = "none"
        let i = 0
        
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
        parentQue.getElementsByClassName('removeOptionDiv')

    // same logic that is used in function textBoxUpdate()
    let i = 0
    for (i in eleToRemove) {
        if (eleToRemove[i].id === `div-${eleType}${eleId}`)
            break;
    }
    // setting Parent Element display as "none"
    eleToRemove[i].style.display = "none";

    // Now updating for back-end
    // removing id in 'display'
    for (i in main[q - 1].display) {
        if (main[q - 1].display[i] == `${eleType}${eleId}`)
            break;
    }
    main[q - 1].display[i] = ''

    // This updates the data in specific
    switch (eleType) {
        case 't':
            findIn = main[q - 1].textarea
            break;
        
        case 'i':
            findIn = main[q - 1].checkbox
            break;

        case 'r':
            findIn = main[q - 1].radio
            break;
    }

    findIn[eleId] = ''

    eleToEdit = parentQue
}

// Function to add markdown syntax to selected text in textarea
function addMarkdownSyntax(tag) {
    const textarea = document.getElementById(`que${selectionEleQ}`).get; // Get the currently focused textarea
    const start = textarea.selectionStart; // Get the start position of the selection
    const end = textarea.selectionEnd; // Get the end position of the selection
    const selectedText = textarea.value.substring(start, end); // Get the selected text
    const textBefore = textarea.value.substring(0, start); // Text before the selection
    const textAfter = textarea.value.substring(end); // Text after the selection

    // Modify the selected text with markdown syntax
    const newText = `${textBefore}${tag}${selectedText}${tag}${textAfter}`;

    // Update the textarea value with the modified text
    textarea.value = newText;
    console.log(textarea, newText)

    // Adjust the cursor position to include the selected text with markdown syntax
    textarea.selectionStart = start + tag.length;
    textarea.selectionEnd = end + tag.length;
}

function selectedEle(ele, eleType, eleId) {
    selectionEleQ = ele
    selectionEleType = eleType
    selectionEleId = eleId
    console.log(selectionEleQ, selectionEleType, eleId)
}

// Event listeners for styling options in the navbar
// document.getElementById('boldButton').addEventListener('click', () => addMarkdownSyntax('**'));
// document.getElementById('italicButton').addEventListener('click', () => addMarkdownSyntax('_'));
// document.getElementById('strikeButton').addEventListener('click', () => addMarkdownSyntax('~~'));
// document.getElementById('quoteButton').addEventListener('click', () => addMarkdownSyntax('>'));
// document.getElementById('codeButton').addEventListener('click', () => addMarkdownSyntax('```'));
// document.getElementById('h1Button').addEventListener('click', () => addMarkdownSyntax('# '));
// document.getElementById('h2Button').addEventListener('click', () => addMarkdownSyntax('## '));
// document.getElementById('h3Button').addEventListener('click', () => addMarkdownSyntax('### '));
// document.getElementById('ulButton').addEventListener('click', () => addMarkdownSyntax('- '));
// document.getElementById('olButton').addEventListener('click', () => addMarkdownSyntax('1. '));
