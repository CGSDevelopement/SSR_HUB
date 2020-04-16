const Notes = {
    props: ['filter', 'addC'],
    methods: {
        checkFields(){ 
            let inputs = document.querySelector('#Notes').querySelectorAll("input");
            let check = true;
            inputs.forEach(item => {
                if (item.value === "") {
                    item.classList.add("error");
                    check = false;
                } else {
                    item.classList.remove("error");
                }
            });
            return check;
        },
        clearFields() {
            Array.prototype.slice.call(document.querySelector("#Notes").querySelectorAll("input")).forEach(item => {
                item.innerHTML = "";
                item.value = "";
                item.classList.remove("error");
            })
            document.querySelector('.pd').value = "";
            document.querySelector("#Notes").querySelector("#r-notes").value = "";
        },
        generate() {
            if(this.checkFields()){
            let inputs = document.querySelector("#Notes").querySelectorAll(".inputs");
            inputs = Array.from(inputs).reduce((acc, cur) => {
                acc.push(cur.value);
                return acc;
            }, [])
            document.querySelector('#r-notes').value = this.generateTemplate(inputs);
            this.addC({
                value: `Type: ${inputs[5]} Case #: ${inputs[0]} AP: ${inputs[9]}`,
                notes: []
            });
            document.querySelector('#r-notes').select('r-notes');
            document.execCommand('copy');
            }
        },
        addNotes() {
            document.querySelector('#final').value += document.querySelector('#r-notes').value
        },
        generateTemplate(data) {
            return `M/T: ${data[1]}\n
SER#: ${data[2]}\n
Case#: ${data[0]} OS: ${data[3]} Static: y Issue: ${data[6]} Tech name/ID: ${data[4]}
Parts ordered previously: ${data[7]}\n
PD: ${data[8]}\n
Source: experience/lenovo.com/onsite tech\n
AP: ${data[9]}\n
Parts ordered and sent to DP; ${data[10]}\n
Parts located: ${data[11]}\n
SSR, Parts ordered to DP, Call SSR support while OS if issue not resolved.\n
================================================================\n`;
        },
        saveNotes() {
            let text = document.querySelector("#final").value;
            let filename = new Date() + '.txt'
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    },
    template: ` 
        <div class="field-wrapper" id="Notes">
        <section class="left-fields">
            <div class='grouped-input'>
                <label for="Case">Case #:
                    <input type="text"  id="case" class='inputs' placeholder="Case #">
                </label>
                <label>Machine type:
                    <input @keydown="this.filter" id="mt" type="text"  class='inputs' placeholder="Machine type">
                </label>
                <label>Serial Number:
                    <input type="text" class='inputs' id="sn" placeholder="Serial Number">
                </label>
                <label>Onsite:
                    <Select type="text" class='inputs'>
                        <option>Yes</option>
                        <option>No</option>
                    </Select>
                </label>
                <label>Name/ID:
                    <input type="text" placeholder="#" class='inputs'>
                </label>
                <label>Cancel Suppresion:
                    <select class='inputs'>
                        <option>IBM</option>
                        <option>BARRISTAR</option>
                    </select>
                </label>
            </div>
            <label>Issue:
                <input type="text" placeholder="-" class='inputs'>
            </label>
            <label>Parts ordered:
                <input type="text" placeholder="Previous parts ordered here" class='inputs'>
            </label>
            <label>PD:
                <textarea type="text" rows="4" placeholder="Tech Stated" class='inputs pd'></textarea>
            </label>
            <label>AP:
                <input type="text" placeholder="Fcode here" class='inputs'>
            </label>
            <label>sent to DP:
                <input type="text" placeholder="Parts ordered on this case" class='inputs' >
            </label>
            <label>Part origin:
                <select class='inputs'>
                    <option>Tech</option>
                    <option>MT</option>
                    <option>MTM</option>
                    <option>Team Lead</option>
                    <option>LTA</option>
                    <option>Lenovo</option>
                </select>
            </label>
        </section>
        <section class="right-fields">
            <button @click="generate" class="styleButton" >Generate</button>
            <button @click="clearFields" class="styleButton" >Reset</button>
            <button @click='addNotes' class="styleButton" >Add to notes</button>
            <button @click='saveNotes' class="styleButton" >Save all notes to file</button>
            <textarea id="r-notes" placeholder='Current notes'></textarea>
            <textarea id="final" placeholder='All notes'></textarea>
        </section>
    </div>
    `
}

const CancelSuppresions = {
    props: ['data', 'updateC'],
    data() {
        return {
            cancels: []
        }
    },
    mounted() {
        this.cancels = this.data;
    },
    methods: {
        removeC(index) {
            this.cancels = [...this.cancels.slice(0, index), ...this.cancels.slice(index + 1, this.cancels.length)];
            this.updateC(this.cancels);
        },
        addNote(e, index) {
            if (e.key === 'Enter' && e.target.value !== '') {
                this.cancels[index].notes.push(e.target.value);
                this.updateC(this.cancels);
            }
        }
    },
    template: `
    <div class="field-wrapper">
    <section class="left-fields">
        <div v-for="(items, index) in this.cancels">
            <p>{{items.value}} <button @click="()=>{removeC(index)}">Remove</button></p>
            <p v-for='notes in items.notes'>{{notes}}</p>
            <input type='text' @keydown='(e)=>addNote(e, index)' placeholder='Add a note and press enter to save'/>
        </div>
        </section>
        <section class="right-fields">
        </section>
    </div>
    `
}

const EscalationTemplate = {
    methods: {
        clearFields() {
            Array.prototype.slice.call(document.querySelector("#Escalations").querySelectorAll("input")).forEach(item => {
                item.innerHTML = "";
                item.value = "";
            })
            document.querySelector("#Escalations").querySelector(".cd").value = "";
            document.querySelector("#Escalations").querySelector("#escalationNotes").value = "";
        },
        generate() {
            let inputs = document.querySelector("#Escalations").querySelectorAll(".inputs");
            inputs = Array.from(inputs).reduce((acc, cur) => {
                acc.push(cur.value);
                return acc;
            }, [])
            document.querySelector('#escalationNotes').value = this.generateTemplate(inputs);
            document.querySelector('#escalationNotes').select('r-notes');
            document.execCommand('copy');
        },
        generateTemplate(data) {
            return `ESCALATION TEMPLATE
Date: ${new Date}\n
Customer Name: ${data[0]}\n
Company Name: ${data[1]}\n
Customer Address: ${data[2]}\n
Customer Phone Number: ${data[3]}\n
Alternate Phone Number: ${data[4]}\n
Customer E-mail: ${data[5]}\n
Current Case: ${data[6]}\n
Previous Cases:${data[7]}\n
M/T: ${data[8]}\n
Model #: ${data[9]}\n
Serial #: ${data[10]}\n
Customer Desired Action: ${data[11]}\n
WARRANTY START DATE: ${data[12]}\n
Location: ${data[13]}\n
Customer's Full Description of Situation & History: ${data[14]}\n`;
        }
    },
    template: `
    <div class="field-wrapper" id='Escalations'>
        <section class="left-fields">
            <label>Customer Name:
                    <input type="text" id="ename" class="inputs" placeholder="Name">
            </label>
            <label>Company Name:
                    <input type="text" id="ebname" class="inputs" placeholder="Company">
            </label>
            <label>Customer Address:
                    <input type="text" id="eaddress" class="inputs" placeholder="Address">
            </label>
            <label>Customer Phone Number:
                    <input type="text" id="ephone" class="inputs" placeholder="Number">
            </label>
            <label>Alternate Phone Number:
                    <input type="text" class="inputs" placeholder="Number">
            </label>
            <label>Customer E-mail:
                    <input type="text" id="eemail" class="inputs" placeholder="Customer E-mail:">
            </label>
                <span class="grouped-input">
                    <label>Current Case:
                        <input type="text" id="ecase" class="inputs" placeholder="#">
                    </label>
                    <label>Previous Cases:
                        <input type="text" class="inputs" placeholder="#">
                    </label>
                    <label>M/T:
                        <input type="text" id="emt" class="inputs" placeholder="#">
                    </label>
                    <label>Model #:
                        <input type="text" class="inputs" placeholder="#">
                    </label>
                    <label>Serial #:
                        <input type="text" id="esn" class="inputs" placeholder="#">
                    </label>
                    <label>Customer Desired Action:
                        <select class="inputs">
                            <option>Repair</option>
                            <option>Replace</option>
                            <option>Refund</option>
                        </select>
                    </label>
                    <label>Location:
                        <select class="inputs">
                            <option>US</option>
                            <option>CA</option>
                        </select>
                    </label>
                    <label>Warranty Start Date:
                        <input type="text" class="inputs" placeholder="#">
                    </label>

                </span>
                <label>Customer's Full Description of Situation &amp; History:
                    <textarea type="text" rows="4" class="inputs cd" placeholder="-"></textarea>
                </label>
        </section>
        <section class="right-fields">
            <button @click="generate" class="styleButton">Generate</button>
            <button @click="clearFields" class="styleButton">Reset</button>
            <textarea id="escalationNotes"></textarea>
        </section>
    </div>      
    `
}


const Status = {
    methods: {
    checkFields(){ 
        let inputs = document.querySelector('#Status').querySelectorAll("input");
        let check = true;
        inputs.forEach(item => {
            if (item.value === "") {
                item.classList.add("error");
                check = false;
            } else {
                item.classList.remove("error");
            }
        });
        return check;
    },
    clearFields() {
        Array.prototype.slice.call(document.querySelector("#Status").querySelectorAll("input")).forEach(item => {
            item.innerHTML = "";
            item.value = "";
            item.classList.remove("error");
        })
        document.querySelector('.pd').value = "";
        document.querySelector("#Status").querySelector("#r-notes").value = "";
    },
    generate() {
        if(this.checkFields()){
        let inputs = document.querySelector("#Status").querySelectorAll(".inputs");
        inputs = Array.from(inputs).reduce((acc, cur) => {
            acc.push(cur.value);
            return acc;
        }, [])
        document.querySelector('#r-notes').value = this.generateTemplate(inputs);
        document.querySelector('#r-notes').select('r-notes');
        document.execCommand('copy');
        }
    },
    addNotes() {
        document.querySelector('#final').value += document.querySelector('#r-notes').value
    },
    generateTemplate(data) {
        return `
Case#: ${data[0]}\n
Name: ${data[1]}\n
Issue: ${data[2]}\n
Description: ${data[3]}\n
Resolution: ${data[4]}\n
================================================================\n`;
    }
    },
    template: `
        <div class="field-wrapper" id="Status">
        <section class="left-fields">
            <div class='grouped-input'>
                <label for="Case">Case #:
                    <input type="text"  id="case" class='inputs' placeholder="Case #">
                </label>
                <label>Name:
                    <input type="text" id="name" placeholder="name" class='inputs'>
                </label>
            </div>
            <label>Issue:
                <input type="text" placeholder="-" class='inputs'>
            </label>
            <label>Description:
                <textarea type="text" rows="4" placeholder="What happened" class='inputs pd'></textarea>
            </label>
            <label>Solution:
                <input type="text" placeholder="-" class='inputs'>
            </label>
        </section>
        <section class="right-fields">
            <button @click="generate" class="styleButton" >Generate</button>
            <button @click="clearFields" class="styleButton" >Reset</button>
            <button @click='addNotes' class="styleButton" >Add to notes</button>
            <textarea id="r-notes" placeholder='Current notes'></textarea>
            <textarea id="final" placeholder='All notes'></textarea>
        </section>
    </div>
    `
}


const Tips = {
    props:['Tips'],
    template: `
    <div class="field-wrapper">
        <section class="left-fields">
            <div class="tip" v-for="tip in Tips">
            <p>{{tip.Title}}</p>
            <p>{{tip.Meta}}</p>
            <a :href="tip.Link" target="_Blank">Click here to access tip</a>
            </div>
        </section>
    </div>
    `
}

const Nav = {
    props: ['handle', 'Tips', 'CS'],
    methods: {
        clicked(data) {
            this.handle(data);
        }
    },
    template: `
        <div id="nav">
            <a class='nav-item' @click="clicked('Notes')">SSR Notes</a>
            <a class='nav-item' @click="clicked('Status')">Status Notes</a>
            <a class='nav-item' @click="clicked('CancelSup')">Cancel Suppesions: {{this.CS}}</a>
            <a class='nav-item' @click="clicked('Escalation')">Escalation Template</a>
            <a class='nav-item' @click="clicked('Tips')">Tips: {{Tips.length}}</a>
            <a class='nav-item' href="http://training.atlanta.cgsinc.com/ThinkNews/#/links" target="_Blank">Links</a>
        </div>
    `
}

const App = {
    mounted() {
        window.addEventListener("beforeunload", function (event) {
            event.returnValue = "You have unsaved changes.";
        });
        fetch('http://training.atlanta.cgsinc.com/THinkNews/data/tips.json').then(res => res.json())
        .then(data =>{
            this.tips = data.tips._Entries
            this.filteredTips = this.tips.slice();
        })
    },
    methods: {
        changePage(value) {
            this.currentPage = value;
        },
        filterTips(e) {
            let value = e.target.value;
            this.filteredTips = this.tips.filter(item => item.Meta.toUpperCase().includes(value.toUpperCase()));
        },
        addCancelSuppression(data) {
            this.cancelSup.push(data);
        },
        remCancelSuppression(array) {
            this.cancelSup = array;
        }
    },
    data() {
        return {
            cancelSup: [],
            tips: [],
            currentPage: 'Notes',
            filteredTips: []
        }
    },
    components: {
        Notes,
        CancelSuppresions,
        EscalationTemplate,
        Tips,
        Nav,
        Status
    },
    template: `
    <div class='app-wrapper'>
        <div class='title-bar'>
            <h3>SSR HUB</h3>
        </div>
        <div class='page-wrapper'>
            <Nav :handle="changePage" :CS='this.cancelSup.length' :Tips='this.filteredTips'/>
            <keep-alive>
                <Notes :filter="filterTips"  :addC="addCancelSuppression" v-if="this.currentPage === 'Notes'" />
            </keep-alive>
            <keep-alive>
                <Status v-if="this.currentPage === 'Status'" />
            </keep-alive>
            <CancelSuppresions :data="this.cancelSup" :updateC="remCancelSuppression" v-if="this.currentPage === 'CancelSup'" />
            <keep-alive>
                <EscalationTemplate v-if="this.currentPage === 'Escalation'" />
            </keep-alive>
            <keep-alive>
                <Tips :Tips='this.filteredTips' v-if="this.currentPage === 'Tips'" />
            </keep-alive>
        </div>
    </div>
    `
}

new Vue({
    render: h => h(App),
}).$mount(`#app`);



