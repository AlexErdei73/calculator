function add(a, b){
    return a + b;
}

function subtract(a, b){
    return a - b;
}

function multiply(a, b){
    return a * b;
}

function divide(a, b){
    if (b!=0) {
        return a / b;
    } else {
        return 'ERROR';
    }
}

function operate(a, b, operator){
    switch (operator) {
        case '+':
            return add(a, b);
        break;
        case '-':
            return subtract(a, b);
        break;
        case '*':
            return multiply(a, b);
        break;
        case '/':
            return divide(a, b);
        break;
    }
}

function precedence(operator){
    switch (operator){
        case '=':
            return 0;
        brake;
        case '+': 
            return 0;
        brake;
        case '-':
            return 0;
        brake;
        case '*':
            return 1;
        brake;
        case '/':
            return 1;
        brake;
    }
}

//give back integer if the result is nearly one
function round(input){
    return Math.round(input * 1e10) / 1e10;
}

//check if there is decimal point
function isDecimal(inputString) {
    if (inputString.indexOf('.') == -1){
        return false;
    } else {
        return true;
    }
}

function numberOfDigits(inputString) {
    if (inputString[0] == '-') {
        inputString = inputString.slice(1);
    }
    const len = inputString.length;
    if (isDecimal(inputString)) {
        return len - 1;
    } else {
        return len;
    }
}

function addDigitToDisplay(digitString) {
    if (isKeyOp(prevKey) || display == '0') {
        display = digitString;
    } else if (numberOfDigits(display) < 10) {
            if (digitString != '.' || !isDecimal(display)) {
                display = display + digitString;
            }
    }
}

function deleteDigitFromDisplay() {
    if (numberOfDigits(display) > 1) {
        display = display.slice(0, display.length - 1);
    } else {
        display = '0';
    }
}

function toggleSign() {
    if (display == '0') return
    if (display[0] == '-') {
        display = display.slice(1);
    } else {
        display = '-' + display;
    }
}

//restrict the number of digits lower than 10
//be able to show ERROR message too
function updateDisplay(key) {
    const divDisplay = document.querySelector('.display');
    if (!isNaN(displayValue) && isKeyOp(key)) {
        const value = round(displayValue);
        const absValue = Math.abs(displayValue);
        if (absValue > 9999999999 || absValue < 0.000000001 && absValue > 0){
            display = displayValue.toExponential(6);
        } else { 
            display = value.toString();
            let len = 10;
            if (value < 0) { len++; }
            if (isDecimal(display)) { len++; }
            display = display.slice(0, len);
        }
    } else if (isKeyOp(key)) {
        display = displayValue;
        initialize();
    } 
    divDisplay.textContent = display;
}

function updateValue() {
   if (!isNaN(display)) {
        displayValue = Number(display);
   } 
}

function isKeyOp(key){
    const opKeys = ['+','-','*','/','=','AC'];
    return (opKeys.indexOf(key) > -1);
}

function isKeyNumber(key){
    const numKeys = ['0','1','2','3','4','5','6','7','8','9','.','C','+/-'];
    return (numKeys.indexOf(key) > -1);
}

//calculate according the math rules
function calcWithPrecedence(nextOp){
    if (precedence(op) < precedence(nextOp)) { //save the current calculation for later
        oldA = a;                              //when the next one needs to go first 
        oldOp = op;
    } else {
        if (op != ''){  //do the current calculation when it goes first
            b = displayValue;
            displayValue = operate(a, b, op);
        } 
        if (oldOp != '' && precedence(op) > precedence(nextOp)) { //go back to the saved calculation                                                     
            oldB = displayValue;                                       //when the next calculation comes later
            displayValue = operate(oldA, oldB, oldOp);
            oldOp = '';
        }
    }
    a = displayValue;  //input the result for the next operation
}

//Handle when the white '.number' keys clicked
function numberKeyPress(key){
    if (!isKeyNumber(key)) return
    if (key == 'C') {
        key = deleteDigitFromDisplay();
    } else if (key == '+/-') {
        toggleSign();
    } else {
        addDigitToDisplay(key);
    }
    prevKey = key;  //save the previous key, because it shows when the number input starts 
    updateValue();
    updateDisplay(key);
}

function initialize(){
    oldA = NaN;
    oldOp = '';
    oldB = NaN;

    a = NaN;
    op = '';
    b = NaN;
            
    //prevKey = '';
}

function tryToCalc(key){
    if (op != '' && !Number.isNaN(a) && !isKeyOp(prevKey)) {  //do your calculation when all the input available
        b = displayValue;
        saveOperation();
        calcWithPrecedence(key);
        updateDisplay(key);
        op = '';
    } else {
        if (displayValue == 'ERROR') return
        a = displayValue; //input the first operand from the display unless your full input is ready
        op = prevKey;
    }
}

//Save the operation for later use at the special calculation
function saveOperation(){
    preA = a;
    preOp = op;
    preB = b;
}

function loadOperation(){
    a = preA;
    op = preOp;
    b = preB;
}

function deletePreOp(){
    preA = NaN;
    preOp = '';
    preB = NaN;
}

//Calculate results for faulty input when '=' pushed
function calcSpecial(key) {
    loadOperation();
    a = displayValue;
    if (isKeyOp(prevKey)) {
        if (prevKey != '=') {
            op = prevKey;
            b = displayValue;
        }
    }
    saveOperation();
    displayValue = operate(a, b, op);
    updateDisplay(key);
    prevKey = key;
}

function operatorKeyPress(key){
    if (!isKeyOp(key)) return
    switch (key){
        case 'AC':
            initialize();
            deletePreOp();
            prevKey = '';
            display = '0';
            updateValue();
            updateDisplay(key);
        break;
        case '=':
            tryToCalc(key);
            if (op != '') {
                calcSpecial(key);
            } 
            initialize();
            prevKey = key; //save the previous key, because it shows when the number input starts
        break;
        default:
            tryToCalc(key);
            op = key;
            prevKey = key; // see above
        break;
    }
} 


function onMouseClick(e){
    const key = e.target.textContent;
    numberKeyPress(key);
    operatorKeyPress(key);
}

const KEYLIST = [{name: '0', key: '0', id: 'id0'},
                 {name: '1', key: '1', id: 'id1'},
                 {name: '2', key: '2', id: 'id2'},
                 {name: '3', key: '3', id: 'id3'},
                 {name: '4', key: '4', id: 'id4'},
                 {name: '5', key: '5', id: 'id5'},
                 {name: '6', key: '6', id: 'id6'},
                 {name: '7', key: '7', id: 'id7'},
                 {name: '8', key: '8', id: 'id8'},
                 {name: '9', key: '9', id: 'id9'},
                 {name: 'Backspace', key: 'C', id: 'idc'},
                 {name: '.', key: '.', id: 'iddot'},
                 {name: 'Delete', key: 'AC', id: 'idac'},
                 {name: '=', key: '=', id: 'idequal'},
                 {name: 'Enter', key: '=', id: 'idequal'},
                 {name: ' ', key: '+/-', id: 'idsign'},
                 {name: '+', key: '+', id: 'idadd'},
                 {name: '-', key: '-', id: 'idsub'},
                 {name: '*', key: '*', id: 'idmul'},
                 {name: '/', key: '/', id: 'iddiv'}];

function getKey(name){
    const element = KEYLIST.find(item => item.name === name );
    if (!element) return
    return element.key;
}

function getId(name){
    const element = KEYLIST.find(function(item){
       return (item.name === name); 
    });
    if (!element) return
    return element.id;
}

function onKeyDown(e){
    const name = e.key;
    console.log(name);
    const key = getKey(name);
    const id = '#' + getId(name);
    if (!key) return
    numberKeyPress(key);
    operatorKeyPress(key);
    const div = document.querySelector(id);
    div.classList.add('down');
}

function onKeyUp(e){
    const name = e.key;
    const key = getKey(name);
    let id = getId(name);
    if (!id) return
    id = '#' + id;
    const div = document.querySelector(id);
    div.classList.remove('down');
}

//Change the key when it's pushed down
function onMouseDown(e) {
    e.target.classList.add('down');
}

//Change back the key when it's released
function onMouseUp(e) {
    e.target.classList.remove('down');
}

//Add the func event handler for the event to all the elements of the elements array 
function addEventHandler(event, func, elements){
    elements.forEach(function(element) {
        element.addEventListener(event, func);
    });
}



//main program

//current operands and operator
let a = NaN;
let op = '';
let b = NaN;

//previous operands and operator
let oldA = NaN;
let oldOp ='';
let oldB = NaN;

//space for saving operation for special calculation
let preA = NaN;
let preOp = '';
let preB = NaN;

let prevKey = '';  //store the previous keypress to decide when to start number input

let display = '0';
let displayValue = 0;
updateDisplay();

const allKeys = document.querySelectorAll('.key');

addEventHandler('click', onMouseClick, allKeys);  //this is the useful functionality

addEventHandler('mousedown', onMouseDown, allKeys);   //do a little css effect
addEventHandler('mouseup', onMouseUp, allKeys);       //when the keys are pushed and released

window.addEventListener('keydown', onKeyDown);     //keyboard support
window.addEventListener('keyup', onKeyUp);