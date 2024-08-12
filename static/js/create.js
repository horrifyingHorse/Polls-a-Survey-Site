const addQue = document.getElementById('addQue');
const area = document.getElementById('area');
const whenFocused = document.getElementById('whenFocused');
const addText = document.getElementById('addText');
const addCheckBox = document.getElementById('addCheckBox');

// const whenFocusedContent = [
//     document.getElementById('addText'),
//     document.getElementById('addCheckBox'),
// ];

const main = [ ]

let ques = document.querySelectorAll('.questionBox')
let eleToEdit //= document.getElementById('que1')

console.log(ques)

let qNo = 1;

// Add another question
addQue.addEventListener('click', () => {
    // create a div
    const addBox = document.createElement('div');
    
    addBox.id = `que${qNo}`;
    addBox.className = "questionBox"
    addBox.setAttribute("tabindex", `${qNo}`)
    addBox.innerHTML = 
        `
        <div class="questionHeader">
            <span style="font-size: 1.5rem; font-weight: 800;">
                Que<span id="qN">${qNo}</span>
            </span>
        </div>
        `;

    area.appendChild(addBox);

    addNewListen(addBox);
    
    mainOBJ = {
        "q": qNo,
        "textarea": [],
        "checkbox": [],
        "radio": [],
        "display": "",
    };
    main.push(mainOBJ);
    
    eleToEdit = addBox;

    qNo++;
});

function addNewListen(ele) {
    ele.addEventListener('click', () => {
        whenFocused.style.display = 'contents';
        eleToEdit = ele;
        console.log("focued", ele.id,);
    });

    ele.addEventListener('focusout', () => {
        
        // whenFocused.style.display = 'none';
        // console.log("Focus out :(", ele.id);  
            
    });
}

function addTextListener(ele, num, exTB) {
    ele.addEventListener('input', () => {
        main[num - 1]
            .textarea[exTB] = ele.value;
    });
}

addText.addEventListener('click', () => {
    const textBox = document.createElement('textarea')
    const eleToEditQ = eleToEdit.id.slice(3);
    const existingTextBox = main[eleToEditQ - 1].textarea.length
    
    textBox.id = `t${existingTextBox}`;
    textBox.className = "textBox";

    eleToEdit.appendChild(textBox);

    addTextListener(
        eleToEdit.querySelector(`#t${existingTextBox}`), eleToEditQ, existingTextBox
    );
        
});

function addCheckBoxListener (ele, num, exCB) {
    ele.addEventListener('input', () => {
        main[num]
            .checkbox[exCB] = ele.value;
    });
}

addCheckBox.addEventListener('click', () => {
    const label = document.createElement("label");
    const cBoxInput = document.createElement('input');
    const cBoxInputText = document.createElement("textarea");
    const br = document.createElement("br");
    const eleToEditQ = eleToEdit.id.slice(3)
    const existingCheckBox = main[eleToEditQ - 1].checkbox.length
    
    cBoxInput.setAttribute("type", "checkbox");
    cBoxInput.id = `c${existingCheckBox}`;
    cBoxInput.className = "checkbox";

    cBoxInputText.setAttribute("type", "text")
    cBoxInputText.id = `i${existingCheckBox}`; // set id of checkbox textarea as `i{$var}`
    cBoxInputText.className = "";

    label.appendChild(cBoxInput);
    label.appendChild(cBoxInputText);
    label.appendChild(br)

    eleToEdit.appendChild(label);

    addCheckBoxListener(
        eleToEdit.querySelector(`#i${existingCheckBox}`), eleToEditQ, existingCheckBox
    )
})