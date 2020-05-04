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
            return round(add(a, b));
        break;
        case '-':
            return round(subtract(a, b));
        break;
        case '*':
            return round(multiply(a, b));
        break;
        case ':':
            return round(divide(a, b));
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
        case ':':
            return 1;
        brake;
    }
}

//give back integer if the result is nearly one
function round(input){
    const rounded = Math.round(input);
    const relError = Math.abs(rounded - input) / input;
    if (relError < 1e-7) {
        return rounded;
    } else return input;
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
    const len = inputString.length;
    if (isDecimal(inputString)) {
        return len - 1;
    } else {
        return len;
    }
}

function addDigitToDisplay(digitString) {
    if (display == '0' || isKeyOp(prevKey)) {
        display = digitString;
    } else if (digitString != '.' || !isDecimal(display) && digitString == '.') {
        if (numberOfDigits(display) < 10) {
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
    if (isNaN(display) || display == '0') return
    const disp = Number(display);
    display = (-disp).toString();
    updateDisplay();
}

//restrict the number of digits lower than 10
//be able to show ERROR message too
function updateDisplay() {
    const divDisplay = document.querySelector('.display');
    if (!isNaN(display)) {
        const value = Number(display);
        if (numberOfDigits(display) > 10){
            display = value.toPrecision(9);
            if (numberOfDigits(display) > 10){
                display = value.toExponential(6);
            } 
        }
    } 
    divDisplay.textContent = display;
}

function isKeyOp(key){
    const opKeys = ['+','-','*',':','=','AC'];
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
            b = Number(display);
            display = operate(a, b, op).toString();
        } 
        if (oldOp != '' && precedence(op) > precedence(nextOp)) { //go back to the saved calculation                                                     
            oldB = Number(display);                               //when the next calculation comes later
            display = operate(oldA, oldB, oldOp).toString();
            oldOp = '';
        }
    }
    a = Number(display);  //input the result for the next operation
}

//Handle when the white '.number' keys clicked
function numberKeyPress(key){
    if (!isKeyNumber(key)) return
    if (key == 'C') {
        deleteDigitFromDisplay();
    } else if (key == '+/-') {
        toggleSign();
    } else {
        addDigitToDisplay(key);
    }
    updateDisplay();
    prevKey = key;
}

function initialize(){
    oldA = NaN;
    oldOp = '';
    oldB = NaN;

    a = NaN;
    op = '';
    b = NaN;
            
    prevKey = '';
}

function tryToCalc(key){
    if (op != '' && !Number.isNaN(a) && !isKeyOp(prevKey)) {  //do your calculation when all the input available
        b = Number(display);
        calcWithPrecedence(key);
        updateDisplay();
    } else {
        a = Number(display); //input the first operand from the display unless your full input is ready
    }
}

function operatorKeyPress(key){
    if (!isKeyOp(key)) return
    switch (key){
        case 'AC':
            initialize();
            display = '0';
            updateDisplay();
        break;
        case '=':
            tryToCalc(key);
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

const KEYLIST = [{code: 96, key: '0', id: 'id0'},
                 {code: 97, key: '1', id: 'id1'},
                 {code: 98, key: '2', id: 'id2'},
                 {code: 99, key: '3', id: 'id3'},
                 {code: 100, key: '4', id: 'id4'},
                 {code: 101, key: '5', id: 'id5'},
                 {code: 102, key: '6', id: 'id6'},
                 {code: 103, key: '7', id: 'id7'},
                 {code: 104, key: '8', id: 'id8'},
                 {code: 105, key: '9', id: 'id9'},
                 {code: 8, key: 'C', id: 'idc'},
                 {code: 110, key: '.', id: 'iddot'},
                 {code: 46, key: 'AC', id: 'idac'},
                 {code: 13, key: '=', id: 'idequal'},
                 {code: 16, key: '+/-', id: 'idsign'},
                 {code: 107, key: '+', id: 'idadd'},
                 {code: 109, key: '-', id: 'idsub'},
                 {code: 106, key: '*', id: 'idmul'},
                 {code: 111, key: ':', id: 'iddiv'}];

function getKey(keyCode){
    const element = KEYLIST.find(key => key.code === keyCode );
    if (!element) return
    return element.key;
}

function getId(keyCode){
    const element = KEYLIST.find(function(key){
       return (key.code === keyCode); 
    });
    if (!element) return
    return element.id;
}

function onKeyDown(e){
    const keyCode = e.keyCode;
    const key = getKey(keyCode);
    const id = '#' + getId(keyCode);
    if (!key) return
    numberKeyPress(key);
    operatorKeyPress(key);
    const div = document.querySelector(id);
    div.classList.add('down');
}

function onKeyUp(e){
    const keyCode = e.keyCode;
    const key = getKey(keyCode);
    let id = getId(keyCode);
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
let display = '0';
updateDisplay();

//current operands and operator
let a = NaN;
let op = '';
let b = NaN;

//previous operands and operator
let oldA = NaN;
let oldOp ='';
let oldB = NaN;

let prevKey = '';  //store the previous keypress to decide when to start number input

const allKeys = document.querySelectorAll('.key');

addEventHandler('click', onMouseClick, allKeys);  //this is the useful functionality

addEventHandler('mousedown', onMouseDown, allKeys);   //do a little css animation 
addEventHandler('mouseup', onMouseUp, allKeys);  //when the keys are pushed and released

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);