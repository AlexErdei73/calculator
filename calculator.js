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
        case '/':
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
        case '/':
            return 1;
        brake;
    }
}

function round(input){
    const rounded = Math.round(input);
    const relError = Math.abs(rounded - input) / input;
    if (relError < 1e-7) {
        return rounded;
    } else return input;
}

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
    if (display == '0' || isPrevKeyOp()) {
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

function updateDisplay() {
    const divDisplay = document.querySelector('.display');
    if (!isNaN(display)) {
        const value = Number(display);
        if (numberOfDigits(display) > 10){
            display = value.toPrecision(9);
            if (value > 1000000000 || value < 0.0000000001 || numberOfDigits(display) > 10){
                display = value.toExponential(6);
            } 
        }
    } 
    divDisplay.textContent = display;
}
 
function isPrevKeyOp() {
    const opKeys = '+-*/=';
    return (opKeys.indexOf(prevKey) > -1);
}

function calcWithPrecedence(nextOp){
    if (precedence(op) < precedence(nextOp)) {
        oldA = a;
        oldOp = op;
        a = Number(display);
    } else {
        if (op != ''){
            b = Number(display);
            display = operate(a, b, op).toString();
        } 
        if (oldOp != '' && precedence(op) > precedence(nextOp)) {
            oldB = Number(display);
            display = operate(oldA, oldB, oldOp).toString();
            oldOp = '';
        }
        a = Number(display);
    }
}

//Handle when the white '.number' keys clicked
function handleNumberKeyPress(e){
    const key = e.target.textContent;
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

function doOpKeyPress(key){
    if (op != '' && !Number.isNaN(a) && !isPrevKeyOp()) {
        b = Number(display);
        calcWithPrecedence(key);
        updateDisplay();
    } else {
        a = Number(display);
    }
}

function handleOperatorKeyPress(e){
    const key = e.target.textContent;
    switch (key){
        case 'AC':
            initialize();
            display = '0';
            updateDisplay();
        break;
        case '=':
            doOpKeyPress(key);
            initialize();
        break;
        default:
            doOpKeyPress(key);
            op = key;
            prevKey = key;
        break;
    }
}

//Change the key when it's pushed down
function pushKey(e) {
    e.target.classList.add('down');
}

//Release the key when it's not pushed down
function releaseKey(e) {
    e.target.classList.remove('down');
}

//Adds the func event handler for the event to all the elements of the elements array 
function addEventHandler(event, func, elements){
    elements.forEach(function(element) {
        element.addEventListener(event, func);
    });
}



//main program
let display = '0';

//current operands and operator
let a = NaN;
let op = '';
let b = NaN;

//previous operands and operator
let oldA = NaN;
let oldOp ='';
let oldB = NaN;

let prevKey = ''; 

const numberKeys = document.querySelectorAll('.number');
const operatorKeys = document.querySelectorAll('.op');
const allKeys = document.querySelectorAll('.key');
addEventHandler('click', handleNumberKeyPress, numberKeys);
addEventHandler('click', handleOperatorKeyPress, operatorKeys);
addEventHandler('mousedown', pushKey, allKeys);
addEventHandler('mouseup', releaseKey, allKeys);
updateDisplay();