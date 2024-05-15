// global initialization of elements
const addQue = document.getElementById('addQue');
const gen_area = document.getElementById('general_area');
const adv_area = document.getElementById('advanced_area');
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
let qNo = 0;
let titleNo = 1;
let DisplayNo = 1;

let area = gen_area

let hiddenLabels = [];

const newLegendClickHandler = function (e, legendItem) {
    // console.log(e)  // --> Event
    // console.log(legendItem)  // --> LegendItem containing details of legend, index, etc.
    // console.log(this) // --> Chart instance


    // Default click handler v2.x.x
    var index = legendItem.index;
    var chart = this.chart;
    var i, ilen, meta;

    for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
        meta = chart.getDatasetMeta(i);
        // toggle visibility of index if exists
        if (meta.data[index]) {

            meta.data[index].hidden = !meta.data[index].hidden;
        }
    }
    
    chart.update();

    // return

    // Custom click handler
    refQ = this.chart.canvas.id.slice(1, 2)  // reference question, which is to be hidden
    refIndex = legendItem.index  // reference index of selected option
    refType = this.chart.canvas.id.slice(2, 3)  // type of question, i for checkbox, r for radio
    toHide = !legendItem.hidden  // toHide is the opposite of the current state of the selected option
    // CinstancesSkipped = false
    // RinstancesSkipped = false

    hiddenLabelsFlag = false  // flag to check if the hidden label is already present in the list


    // if the selected option is to be hidden, then the label is to be added to the list
    if (toHide) {
        cmpStr = ''   // replacing empty string with an object
    } else {
        // if the selected option is to be shown, then the label is to be removed from the list
        cmpStr = {
                "refQ": refQ,
                "refIndex": refIndex,
                "refType": refType,
                "toHide": false
            }
    }
    for (i = 0; i < hiddenLabels.length; i++) {
        // console.log(cmpStr, ' =? ', hiddenLabels[i], (hiddenLabels[i] === cmpStr))
        // comparing the selected option with the hidden labels
        if (JSON.stringify(hiddenLabels[i]) === JSON.stringify(cmpStr)) {
            hiddenLabelsFlag = true
            // if the selected option is to be shown, then the label is removed from the list
            if (!toHide) {
                hiddenLabels[i] = ''
                break
            }
            
            // if the selected option is to be hidden, then the label is
            // added to an empty slot in the list
            hiddenLabels[i] = {
                "refQ": refQ,
                "refIndex": refIndex,
                "refType": refType,
                "toHide": !toHide
            };
            break
        }
    }
    // if the selected option is to be hidden, and there's no empty slot in list
    // then the label is pushed into the list
    if (!hiddenLabelsFlag && toHide) {
        // console.log('push')
        hiddenLabels.push({
            "refQ": refQ,
            "refIndex": refIndex,
            "refType": refType,
            "toHide": !toHide
        });
    }

    // Collecting the data for the chart
    // for each element in the main questions, we go through the responses
    // and update the chart data
    recMain.forEach((question, index) => {
        if (index === 0) {
            // document.getElementById('formTitle').value = question.form
            return
        }

        // CinstancesSkipped = false
        // RinstancesSkipped = false
        
        // arrays to store the number of instances of each option
        /*
            The length of the array is equal to the number of options in the question
            Value at an Index of the array corresponds to the number of instances of that option
            format:
                [option1_instances, option2_instances, option3_instances, ...]
        */
        let analyticChx = new Array(question.checkbox.length + question.other).fill(0);  
        let analyticRdx = new Array(question.radio.length + question.other).fill(0);
        let otherValues = [ ]

        containsOther = question.other

        // for each response, we go through the questions and update the chart data
        recSub.forEach(resp => {
            // check for reference questions and their options
            // if optios found in the hidden labels list, then skip the instance
            for (hiddenLabel of hiddenLabels) {
                if (hiddenLabel === '') {
                    continue
                }
                // console.log('hiddenLabel: ', hiddenLabel)
                // console.log(refIndex, recMain[atIndex(refQ, recMain)].radio.length)
                // console.log(question.q, resp[2][atIndex(question.q, resp[2])])
                refQ = hiddenLabel.refQ
                refIndex = hiddenLabel.refIndex
                refType = hiddenLabel.refType
                toHide = !hiddenLabel.toHide
                if (refIndex === recMain[atIndex(refQ, recMain)].checkbox.length && containsOther) console.log('Other')
                if (refType === 'i') {
                    if (resp[2][atIndex(refQ, resp[2])].checkbox.includes(refIndex) // || 
                    // (refIndex === recMain[atIndex(refQ, recMain)].checkbox.length && containsOther)
                    && toHide) {
                        // if (refQ == index) CinstancesSkipped = true
                        return
                    }
                    if (refIndex === recMain[atIndex(refQ, recMain)].checkbox.length && containsOther &&
                        resp[2][atIndex(refQ, resp[2])].checkbox.includes(-1) && toHide) {
                            return
                    }
                } else {
                    if (resp[2][atIndex(refQ, resp[2])].radio.includes(refIndex) // ||
                    // (refIndex === recMain[atIndex(refQ, recMain)].radio.length && containsOther)
                    && toHide) {
                        // if (refQ == index) RinstancesSkipped = true
                        return
                    }
                    if (refIndex === recMain[atIndex(refQ, recMain)].radio.length && containsOther &&
                        resp[2][atIndex(refQ, resp[2])].radio.includes(-1) && toHide) {
                            return
                    }
                }
            }

            // console.log(question, CinstancesSkipped, RinstancesSkipped)

            curr_other = 0
            resp[2][atIndex(question.q, resp[2])].checkbox.forEach(el => {
                if (el !== '') {
                    if (el === -1) { 
                        analyticChx[analyticChx.length - 1] += 1
                        otherValues.push(resp[2][atIndex(question.q, resp[2])].other)
                    }
                    else analyticChx[el] += 1;

                    // console.log(analyticRdx)
                }
            });
            // if (question.other) analyticChx.push(curr_other)

            curr_other = 0
            resp[2][atIndex(question.q, resp[2])].radio.forEach(el => {
                if (el !== '') {
                    if (el === -1) { 
                        analyticRdx[analyticRdx.length - 1] += 1
                        otherValues.push(resp[2][atIndex(question.q, resp[2])].other)
                    }
                    else analyticRdx[el] += 1;

                    // console.log(analyticRdx)
                }
            });
            // if (question.other) analyticRdx.push(curr_other)
        });

        // console.log('que: ' , question)
        // console.log(question.other)
        // console.log('update: ', analyticChx, analyticRdx)

        /* 
            Since finding and updating charts was a mess in each and every
            question, we try to find a chart associated with the question
            if found, we update the data and update the chart
        */
        let chartToUpdate = findChartByCanvasID(`q${question.q}icanvas`)

        if (chartToUpdate != null) {
            // console.log('????')
            // console.log(chartToUpdate)

            // console.log('updating: ', `q${question.q}icanvas`)

            if (analyticChx.length < chartToUpdate.legend.legendItems.length)
                analyticChx.push(0)
            else if (analyticChx.length > chartToUpdate.legend.legendItems.length) 
                analyticChx.pop()
            
            chartToUpdate.data.datasets[0].data = analyticChx
            chartToUpdate.update()
            // shoveAChartUp(analyticChx, question.checkbox)
        }

        chartToUpdate = findChartByCanvasID(`q${question.q}rcanvas`)
        if (chartToUpdate != null) {  
            // console.log('updating: ', `q${question.q}rcanvas`)

            if (analyticRdx.length < chartToUpdate.legend.legendItems.length)
                analyticRdx.push(0)
            else if (analyticRdx.length > chartToUpdate.legend.legendItems.length)
                analyticRdx.pop()

            chartToUpdate.data.datasets[0].data = analyticRdx
            chartToUpdate.update()
            // shoveAChartUp(analyticRdx, question.radio)
        }
        
        updateSelectOptions(question.q, otherValues)

        // previous messy approach:

        // if (!analyticChx.every(item => item === 0) || CinstancesSkipped) {
        //     console.log('????')
        //     const chartToUpdate = findChartByCanvasID(`q${index}icanvas`)
        //     console.log(chartToUpdate)
        //     chartToUpdate.data.datasets[0].data = analyticChx
        //     chartToUpdate.update()
        //     // shoveAChartUp(analyticChx, question.checkbox)
        // }

        // if (!analyticRdx.every(item => item === 0)  || RinstancesSkipped) {  
        //     const chartToUpdate = findChartByCanvasID(`q${index}rcanvas`)
        //     chartToUpdate.data.datasets[0].data = analyticRdx
        //     chartToUpdate.update()
        //     // shoveAChartUp(analyticRdx, question.radio)
        // }
    });
    
};


window.onload = function() {
    console.log('Loaded', recMain)
    main = recMain

    // Display content of the General Analysis
    iQue()
    insert('tBox', "__display_data_", 0)    

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

        question.display.forEach((element, indx) => {
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
                    insert('other', '<p>Other:</p>', 0)
                    // if(otherOpType === 'i') question.checkbox.push('<p>Other:</p>')
                    // else if(otherOpType === 'r') question.radio.push('<p>Other:</p>')

                    break
            }
        })

        // Checking the need of analysis
        if (question.checkbox.length > 0 || question.radio.length > 0) {
            let analyticChx = new Array(question.checkbox.length + question.other).fill(0);
            let analyticRdx = new Array(question.radio.length + question.other).fill(0);
            let otherValues = [ ]

            console.log('original: ', analyticChx, analyticRdx, question.other)

            recSub.forEach(resp => {
                curr_other = 0
                resp[2][atIndex(question.q, resp[2])].checkbox.forEach(el => {
                    if (el !== '') {
                        if (el === -1) { 
                            analyticChx[analyticChx.length - 1] += 1
                            otherValues.push(resp[2][atIndex(question.q, resp[2])].other)
                        }
                        else analyticChx[el] += 1;
                    }
                });
                // if (question.other) analyticChx.push(curr_other)

                curr_other = 0
                resp[2][atIndex(question.q, resp[2])].radio.forEach(el => {
                    if (el !== '') {
                        if (el === -1) { 
                            analyticRdx[analyticRdx.length - 1] += 1
                            otherValues.push(resp[2][atIndex(question.q, resp[2])].other)
                        }
                        else analyticRdx[el] += 1;

                        // console.log(analyticRdx)
                    }
                });
                // if (question.other) analyticRdx.push(curr_other)
            });

            console.log(analyticChx, analyticRdx)
            console.log(question.other, otherValues)

            if (!analyticChx.every(item => item === 0)) {
                if (question.other)
                    shoveAChartUp(analyticChx, [...question.checkbox, "<p>Other:</p>"], question.q, 'i')
                else
                    shoveAChartUp(analyticChx, question.checkbox, question.q, 'i')
            }

            if (!analyticRdx.every(item => item === 0)) {  
                if(question.other)
                    shoveAChartUp(analyticRdx, [...question.radio, "<p>Other:</p>"], question.q, 'r')
                else
                    shoveAChartUp(analyticRdx, question.radio, question.q, 'r')
            }

            updateSelectOptions(question.q, otherValues)

        }

        
    })

    //Organising the Advanced Analysis
    area = adv_area
    srno = 1
    recSub.forEach(el => {
        const parentDiv = document.createElement('div');
        parentDiv.classList.add('tableBox', 'tableBoxContent');

        const srnoDiv = document.createElement('div');
        srnoDiv.className = 'srno';
        srnoDiv.innerHTML = srno;

        const formNameDiv = document.createElement('div');
        formNameDiv.className = 'formName';
        formNameDiv.innerHTML = el[1];

        // const formDescDiv = document.createElement('div');
        // formDescDiv.className = 'formDesc';
        // formDescDiv.innerHTML = el[1];


        parentDiv.appendChild(srnoDiv);
        parentDiv.appendChild(formNameDiv);
        // parentDiv.appendChild(formDescDiv);
        // parentDiv.appendChild(viewButton);
        // parentDiv.appendChild(editButton);
        // parentDiv.appendChild(analyzeButton);
        
        area.appendChild(parentDiv);

        srno += 1;
    });
}

function updateSelectOptions(q, ops) {
    const select = document.getElementById(`sq${q}`);
    if(!select) return

    // let outdatedOps = document.getElementsByClassName('easytoremove')
    // for (let i = 0; i < outdatedOps.length; i++) {
    //     outdatedOps[i].remove()
    // }
    select.innerHTML = '';

    ops.forEach(option => {
        const opt = document.createElement('option');
        opt.innerHTML = option;
        select.appendChild(opt);
    });

}

function findChartByCanvasID(canvasID) {
    for (var i = 0; i < Object.keys(Chart.instances).length; i++) {
        var chart = Chart.instances[i];
        if (chart.canvas.id === canvasID) {
            return chart;
        }
    }
    return null; // Chart not found
}

function shoveAChartUp(analytic, question, q, typeIdentifier) {
    console.log(analytic, question)
    const canvasRdx = document.createElement('canvas');
    canvasRdx.id = `q${q}${typeIdentifier}canvas`
    canvasRdx.setAttribute(
        'style', "width:100%;max-width:400px; height: 400px; max-height:400px"
    );
    eleToEdit.appendChild(canvasRdx);

    const CdataRdx = {
        labels: question.map(removeTags),
        datasets: [
            {
                label: 'Form',
                data: analytic,
                backgroundColor: ['#9766FF', '#008265', '#F9F871','#FF956B','#FF6499', '#0089A1','#0080FF', '#FAEAFF', '#B70000', '#3A7183'],
                color: 'white',
                borderColor: '#1b1b1b',
            }
        ]
    };

    ctx = document.getElementById(`q${q}${typeIdentifier}canvas`).getContext('2d')

    var options = {
        responsive: true,
        title: {
            display: false,
            text: 'Chart.js Doughnut Chart'
        },
        animation: {
            animateScale: true,
            animateRotate: true
        },
        tooltips: {
            enabled: true,
            mode: 'label',
            callbacks: {
                label: function(tooltipItem, data) {
                    // console.log(tooltipItem, data)
                    return data.labels[tooltipItem.index];  // return the label to show
                },
                footer: function(tooltipItem, data) {
                    // To display the percentage of the selected option

                    // console.log(tooltipItem, data)

                    // somehow the tooltipItem is an array of objects
                    // unlike in the previous case where it was an object
                    var dataset = data.datasets[tooltipItem[0].datasetIndex];
                    var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                    return previousValue + currentValue;
                    });
                    var currentValue = dataset.data[tooltipItem[0].index];
                    var precentage = Math.floor(((currentValue/total) * 100)+0.5);   

                    return `${data.datasets[0].data[tooltipItem[0].index]} (${precentage}%)`;
                }
            }
        },
        legend: {
            labels: {
                fontColor: "white",
                fontSize: 16,
            },
            onClick: newLegendClickHandler  // custom legend click handler
        }
    };  
    
    a = new Chart(ctx, {
        type: 'pie',
        data: CdataRdx,
        options: options
    });

    console.log(a)
}

function removeTags(html) {
    return html.replace(/<(?!br\s*\/?)[^>]+>/gi, '');
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

    if (eleToEditQ == 0) typeIdentifier = 't'
    else {
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
    }

    const wraperLabel = document.createElement("label");
    const parentDiv = document.createElement("div");
    const customLabel = document.createElement("label");
    const customSpan = document.createElement("span");
    const elInput = document.createElement('input');

    const elInputText = document.createElement("span");
    const br = document.createElement("br");

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

    txt = txt.replace(/\n/g, '<br>');


    if(txt === "__display_data_") {
        if (props[6]) stat = 'Active'
        else stat = 'Offline'
        elInputText.innerHTML =
            `Total Responses: ${recSub.length} <br>
             Total Unique Responses: ${unique(recSub)} <br>
             Status: ${stat} <br>
            `;
    } else
        elInputText.innerHTML = txt;

    elInputText.id = `q${eleToEditQ}${typeIdentifier}${existingEl}`; 
    elInputText.className = "";


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

//     <select>
//     <option selected>Open this select menu</option>
//     <option>One</option>
//     <option>Two</option>
//     <option>Three</option>
//   </select>

    if (typeIdentifier === 'o') {
        const otherSelect = document.createElement('select');
        otherSelect.id = `sq${eleToEditQ}`

        wraperLabel.appendChild(otherSelect)
    }
        
}

function unique(arr) {
    return arr.filter((value, index, self) => 
        self.findIndex(item => item[1] === value[1]) === index
    ).length;
}

function navbarDisplay(displayId) {
    document.getElementById('advanced_area').style.display = 'none'
    document.getElementById('advanced').setAttribute('class', '')

    document.getElementById('general_area').style.display = 'none'
    document.getElementById('general').setAttribute('class', '')

    switch (displayId) {   
        case 0:
            document.getElementById('general_area').style.display = 'block'
            document.getElementById('general').className = 'active'
            break

        case 1:
            document.getElementById('advanced_area').style.display = 'block'
            document.getElementById('advanced').className = 'active'
            break

    }
}

function atIndex(q, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].q == q) {
            return i
        }
    }
    return -1
}