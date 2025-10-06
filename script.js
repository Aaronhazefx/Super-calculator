// Display elements
const mainDisplay = document.getElementById('mainDisplay');
const expressionDisplay = document.getElementById('expression');
const degIndicator = document.getElementById('degIndicator');
const sciIndicator = document.getElementById('sciIndicator');
const memoryIndicator = document.getElementById('memoryIndicator');
const calculator = document.getElementById('calculator');
const angleModeBtn = document.getElementById('angleMode');

// Global variables
let currentExpression = '';
let isScientificNotation = false;
let isDegreeMode = true;
let memory = 0;
let calculationHistory = [];
let cameraStream = null;
let recognition = null;

// Basic operations
function appendToDisplay(value) {
    if (mainDisplay.textContent === 'Error' || mainDisplay.textContent === 'Infinity') {
        clearDisplay();
    }
    
    if ('+-*/'.includes(value)) {
        if ('+-*/'.includes(currentExpression.slice(-1))) {
            currentExpression = currentExpression.slice(0, -1) + value;
        } else {
            currentExpression += mainDisplay.textContent + value;
            mainDisplay.textContent = '0';
        }
    } else {
        if (mainDisplay.textContent === '0' || mainDisplay.textContent === 'Error') {
            mainDisplay.textContent = value;
        } else {
            mainDisplay.textContent += value;
        }
    }
    
    updateExpressionDisplay();
    animateDisplay();
}

function clearDisplay() {
    mainDisplay.textContent = '0';
    currentExpression = '';
    updateExpressionDisplay();
    animateDisplay();
}

function backspace() {
    if (mainDisplay.textContent.length > 1) {
        mainDisplay.textContent = mainDisplay.textContent.slice(0, -1);
    } else {
        mainDisplay.textContent = '0';
    }
    animateDisplay();
}

function calculate() {
    try {
        let fullExpression = currentExpression + mainDisplay.textContent;
        let expression = fullExpression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/π/g, Math.PI)
            .replace(/e/g, Math.E);
        
        let result = eval(expression);
        
        let displayResult;
        if (Math.abs(result) > 1e12 || (Math.abs(result) < 1e-6 && result !== 0)) {
            displayResult = result.toExponential(8);
            isScientificNotation = true;
            sciIndicator.style.display = 'inline-block';
        } else {
            displayResult = parseFloat(result.toPrecision(12));
            isScientificNotation = false;
            sciIndicator.style.display = 'none';
        }
        
        mainDisplay.textContent = displayResult;
        addToHistory(fullExpression, displayResult);
        currentExpression = '';
        updateExpressionDisplay();
        animateDisplay();
    } catch (error) {
        mainDisplay.textContent = 'Error';
        animateDisplay();
    }
}

function updateExpressionDisplay() {
    expressionDisplay.textContent = currentExpression;
}

function animateDisplay() {
    mainDisplay.classList.add('display-update');
    setTimeout(() => {
        mainDisplay.classList.remove('display-update');
    }, 300);
}

// Memory Functions
function memoryClear() {
    memory = 0;
    memoryIndicator.style.display = 'none';
}

function memoryRecall() {
    mainDisplay.textContent = memory;
    animateDisplay();
}

function memoryAdd() {
    try {
        memory += parseFloat(eval(currentExpression + mainDisplay.textContent));
        memoryIndicator.style.display = 'block';
    } catch (error) {
        mainDisplay.textContent = 'Error';
        animateDisplay();
    }
}

function memorySubtract() {
    try {
        memory -= parseFloat(eval(currentExpression + mainDisplay.textContent));
        memoryIndicator.style.display = 'block';
    } catch (error) {
        mainDisplay.textContent = 'Error';
        animateDisplay();
    }
}

// Scientific Functions
function sin() {
    const value = parseFloat(mainDisplay.textContent);
    if (!isNaN(value)) {
        const radians = isDegreeMode ? value * Math.PI / 180 : value;
        currentExpression = `sin(${value})`;
        mainDisplay.textContent = Math.sin(radians);
        updateExpressionDisplay();
        animateDisplay();
    }
}

function cos() {
    const value = parseFloat(mainDisplay.textContent);
    if (!isNaN(value)) {
        const radians = isDegreeMode ? value * Math.PI / 180 : value;
        currentExpression = `cos(${value})`;
        mainDisplay.textContent = Math.cos(radians);
        updateExpressionDisplay();
        animateDisplay();
    }
}

function tan() {
    const value = parseFloat(mainDisplay.textContent);
    if (!isNaN(value)) {
        const radians = isDegreeMode ? value * Math.PI / 180 : value;
        currentExpression = `tan(${value})`;
        mainDisplay.textContent = Math.tan(radians);
        updateExpressionDisplay();
        animateDisplay();
    }
}

function sinh() {
    const value = parseFloat(mainDisplay.textContent);
    if (!isNaN(value)) {
        currentExpression = `sinh(${value})`;
        mainDisplay.textContent = Math.sinh(value);
        updateExpressionDisplay();
        animateDisplay();
    }
}

function cosh() {
    const value = parseFloat(mainDisplay.textContent);
    if (!isNaN(value)) {
        currentExpression = `cosh(${value})`;
        mainDisplay.textContent = Math.cosh(value);
        updateExpressionDisplay();
        animateDisplay();
    }
}

function tanh() {
    const value = parseFloat(mainDisplay.textContent);
    if (!isNaN(value)) {
        currentExpression = `tanh(${value})`;
        mainDisplay.textContent = Math.tanh(value);
        updateExpressionDisplay();
        animateDisplay();
    }
}

function log() {
    const value = parseFloat(mainDisplay.textContent);
    if (!isNaN(value) && value > 0) {
        currentExpression = `log(${value})`;
        mainDisplay.textContent = Math.log10(value);
        updateExpressionDisplay();
        animateDisplay();
    } else {
        mainDisplay.textContent = 'Error';
        animateDisplay();
    }
}

function ln() {
    const value = parseFloat(mainDisplay.textContent);
    if (!isNaN(value) && value > 0) {
        currentExpression = `ln(${value})`;
        mainDisplay.textContent = Math.log(value);
        updateExpressionDisplay();
        animateDisplay();
    } else {
        mainDisplay.textContent = 'Error';
        animateDisplay();
    }
}

function factorial() {
    const value = parseInt(mainDisplay.textContent);
    if (!isNaN(value) && value >= 0) {
        let result = 1;
        for (let i = 2; i <= value; i++) {
            result *= i;
        }
        currentExpression = `${value}!`;
        mainDisplay.textContent = result;
        updateExpressionDisplay();
        animateDisplay();
    } else {
        mainDisplay.textContent = 'Error';
        animateDisplay();
    }
}

function power(exponent = null) {
    if (exponent) {
        const value = parseFloat(mainDisplay.textContent);
        if (!isNaN(value)) {
            currentExpression = `${value}^${exponent}`;
            mainDisplay.textContent = Math.pow(value, exponent);
            updateExpressionDisplay();
            animateDisplay();
        }
    } else {
        appendToDisplay('**');
    }
}

function squareRoot() {
    const value = parseFloat(mainDisplay.textContent);
    if (!isNaN(value) && value >= 0) {
        currentExpression = `√(${value})`;
        mainDisplay.textContent = Math.sqrt(value);
        updateExpressionDisplay();
        animateDisplay();
    } else {
        mainDisplay.textContent = 'Error';
        animateDisplay();
    }
}

function inverse() {
    const value = parseFloat(mainDisplay.textContent);
    if (!isNaN(value) && value !== 0) {
        currentExpression = `1/(${value})`;
        mainDisplay.textContent = 1 / value;
        updateExpressionDisplay();
        animateDisplay();
    } else {
        mainDisplay.textContent = 'Error';
        animateDisplay();
    }
}

function absolute() {
    const value = parseFloat(mainDisplay.textContent);
    if (!isNaN(value)) {
        currentExpression = `|${value}|`;
        mainDisplay.textContent = Math.abs(value);
        updateExpressionDisplay();
        animateDisplay();
    }
}

function toggleSign() {
    const value = parseFloat(mainDisplay.textContent);
    if (!isNaN(value)) {
        mainDisplay.textContent = value * -1;
        animateDisplay();
    }
}

function pi() {
    mainDisplay.textContent = Math.PI;
    animateDisplay();
}

function e() {
    mainDisplay.textContent = Math.E;
    animateDisplay();
}

// Mode Functions
function toggleAngleMode() {
    isDegreeMode = !isDegreeMode;
    angleModeBtn.textContent = isDegreeMode ? 'DEG' : 'RAD';
    degIndicator.textContent = isDegreeMode ? 'DEG' : 'RAD';
    degIndicator.style.display = 'inline-block';
}

function toggleDisplayMode() {
    const value = parseFloat(mainDisplay.textContent);
    if (!isNaN(value)) {
        if (mainDisplay.textContent.includes('e')) {
            mainDisplay.textContent = parseFloat(value).toString();
            isScientificNotation = false;
            sciIndicator.style.display = 'none';
        } else {
            mainDisplay.textContent = value.toExponential(6);
            isScientificNotation = true;
            sciIndicator.style.display = 'inline-block';
        }
        animateDisplay();
    }
}

// History functionality
function toggleHistory() {
    const historyPanel = document.getElementById('historyPanel');
    historyPanel.style.display = historyPanel.style.display === 'none' ? 'block' : 'none';
    if (historyPanel.style.display === 'block') {
        renderHistory();
    }
}

function addToHistory(expression, result) {
    calculationHistory.unshift({
        expression,
        result,
        timestamp: new Date().toLocaleTimeString()
    });
    
    if (calculationHistory.length > 20) {
        calculationHistory.pop();
    }
    
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    calculationHistory.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.onclick = () => useHistoryItem(item);
        historyItem.innerHTML = `
            <div class="history-expression">${item.expression}</div>
            <div class="history-result">= ${item.result}</div>
            <div style="font-size: 9px; opacity: 0.6;">${item.timestamp}</div>
        `;
        historyList.appendChild(historyItem);
    });
}

function useHistoryItem(item) {
    currentExpression = item.expression;
    mainDisplay.textContent = item.result;
    updateExpressionDisplay();
    animateDisplay();
}

function clearHistory() {
    calculationHistory = [];
    renderHistory();
}

// Unit Converter functionality
const unitConversions = {
    length: {
        meters: 1,
        kilometers: 1000,
        centimeters: 0.01,
        millimeters: 0.001,
        miles: 1609.34,
        feet: 0.3048,
        inches: 0.0254,
        yards: 0.9144
    },
    weight: {
        kilograms: 1,
        grams: 0.001,
        pounds: 0.453592,
        ounces: 0.0283495,
        tons: 1000
    },
    temperature: {
        celsius: 'celsius',
        fahrenheit: 'fahrenheit',
        kelvin: 'kelvin'
    },
    area: {
        'square meters': 1,
        'square kilometers': 1000000,
        'square miles': 2589990,
        acres: 4046.86,
        hectares: 10000
    },
    volume: {
        liters: 1,
        milliliters: 0.001,
        'cubic meters': 1000,
        gallons: 3.78541,
        pints: 0.473176
    }
};

function toggleConverter() {
    const converterPanel = document.getElementById('converterPanel');
    converterPanel.style.display = converterPanel.style.display === 'none' ? 'block' : 'none';
    if (converterPanel.style.display === 'block') {
        updateConverterUnits();
    }
}

function updateConverterUnits() {
    const type = document.getElementById('converterType').value;
    const fromSelect = document.getElementById('converterFrom');
    const toSelect = document.getElementById('converterTo');
    
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    
    Object.keys(unitConversions[type]).forEach(unit => {
        fromSelect.add(new Option(unit, unit));
        toSelect.add(new Option(unit, unit));
    });
    
    if (type === 'length') {
        fromSelect.value = 'meters';
        toSelect.value = 'feet';
    } else if (type === 'weight') {
        fromSelect.value = 'kilograms';
        toSelect.value = 'pounds';
    } else if (type === 'temperature') {
        fromSelect.value = 'celsius';
        toSelect.value = 'fahrenheit';
    }
    
    convertUnits();
}

function convertUnits() {
    const type = document.getElementById('converterType').value;
    const input = parseFloat(document.getElementById('converterInput').value) || 0;
    const fromUnit = document.getElementById('converterFrom').value;
    const toUnit = document.getElementById('converterTo').value;
    const resultElement = document.getElementById('converterResult');
    
    let result;
    
    if (type === 'temperature') {
        result = convertTemperature(input, fromUnit, toUnit);
    } else {
        const baseValue = input * unitConversions[type][fromUnit];
        result = baseValue / unitConversions[type][toUnit];
    }
    
    resultElement.textContent = `${input} ${fromUnit} = ${result.toPrecision(8)} ${toUnit}`;
}

function convertTemperature(value, from, to) {
    if (from === to) return value;
    
    let celsius;
    if (from === 'celsius') celsius = value;
    else if (from === 'fahrenheit') celsius = (value - 32) * 5/9;
    else if (from === 'kelvin') celsius = value - 273.15;
    
    if (to === 'celsius') return celsius;
    else if (to === 'fahrenheit') return (celsius * 9/5) + 32;
    else if (to === 'kelvin') return celsius + 273.15;
}

function useConverterResult() {
    const resultText = document.getElementById('converterResult').textContent;
    const resultValue = resultText.split(' = ')[1].split(' ')[0];
    mainDisplay.textContent = resultValue;
    animateDisplay();
}

// Camera functionality
async function toggleCamera() {
    const cameraContainer = document.getElementById('cameraContainer');
    const cameraVideo = document.getElementById('cameraVideo');
    const cameraResult = document.getElementById('cameraResult');
    
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        cameraContainer.style.display = 'none';
        cameraResult.innerHTML = '';
    } else {
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            cameraVideo.srcObject = cameraStream;
            cameraContainer.style.display = 'block';
        } catch (error) {
            cameraResult.innerHTML = 'Camera access denied. Please allow camera permissions.';
            cameraContainer.style.display = 'block';
        }
    }
}

async function captureMathProblem() {
    const cameraVideo = document.getElementById('cameraVideo');
    const cameraCanvas = document.getElementById('cameraCanvas');
    const cameraResult = document.getElementById('cameraResult');
    
    const context = cameraCanvas.getContext('2d');
    cameraCanvas.width = cameraVideo.videoWidth;
    cameraCanvas.height = cameraVideo.videoHeight;
    context.drawImage(cameraVideo, 0, 0);
    
    cameraResult.innerHTML = '🔄 Analyzing math problem...';
    
    try {
        const { createWorker } = Tesseract;
        const worker = await createWorker('eng');
        
        await worker.setParameters({
            tessedit_char_whitelist: '0123456789+-×÷=()[]{}√πθαβγ∞≈≠≤≥<>!^/*.sincostanlogln'
        });
        
        const { data: { text } } = await worker.recognize(cameraCanvas);
        await worker.terminate();
        
        processOCRText(text);
    } catch (error) {
        cameraResult.innerHTML = '❌ OCR failed. Please try again.';
    }
}

function processOCRText(text) {
    const cameraResult = document.getElementById('cameraResult');
    
    let cleanedText = text.trim();
    
    cleanedText = cleanedText
        .replace(/[Il1]/g, '1')
        .replace(/[Oo]/g, '0')
        .replace(/[Ss]/g, '5')
        .replace(/[Tt]/g, '7')
        .replace(/[B]/g, '8')
        .replace(/[×x]/g, '*')
        .replace(/[÷]/g, '/')
        .replace(/\s+/g, '')
        .replace(/\*\*/g, '^')
        .replace(/\^2/g, '²');
    
    try {
        cleanedText = cleanedText.replace(/[^0-9+\-*/().^²√πe]/g, '');
        
        let result;
        if (cleanedText.includes('=')) {
            const [left, right] = cleanedText.split('=');
            result = evalMathExpression(left.trim());
        } else {
            result = evalMathExpression(cleanedText);
        }
        
        cameraResult.innerHTML = `
            <div style="text-align: left;">
                <strong>Detected:</strong><br>
                ${cleanedText}<br><br>
                <strong>Solution:</strong><br>
                ${cleanedText} = ${result}
            </div>
        `;
        
        currentExpression = cleanedText;
        mainDisplay.textContent = result;
        updateExpressionDisplay();
        animateDisplay();
        
    } catch (error) {
        cameraResult.innerHTML = `
            <div style="text-align: left;">
                <strong>Detected Text:</strong><br>
                ${text}<br><br>
                <strong>Cleaned:</strong><br>
                ${cleanedText}<br><br>
                ❌ Could not parse as math expression
            </div>
        `;
    }
}

function evalMathExpression(expr) {
    expr = expr
        .replace(/²/g, '**2')
        .replace(/√(\d+)/g, 'Math.sqrt($1)')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(');
    
    return eval(expr);
}

// Voice recognition
function startVoiceCommands() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Voice commands not supported in your browser');
        return;
    }
    
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = function() {
        mainDisplay.textContent = '🎤 Listening...';
        animateDisplay();
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        processVoiceCommand(transcript);
    };
    
    recognition.onerror = function(event) {
        mainDisplay.textContent = '❌ Voice error';
        animateDisplay();
    };
    
    recognition.onend = function() {
        setTimeout(() => {
            if (mainDisplay.textContent === '🎤 Listening...') {
                mainDisplay.textContent = '0';
                animateDisplay();
            }
        }, 2000);
    };
    
    recognition.start();
}

function processVoiceCommand(command) {
    console.log('Voice command:', command);
    
    if (command.includes('plus') || command.includes('add')) {
        appendToDisplay('+');
    } else if (command.includes('minus') || command.includes('subtract')) {
        appendToDisplay('-');
    } else if (command.includes('times') || command.includes('multiply')) {
        appendToDisplay('*');
    } else if (command.includes('divide') || command.includes('over')) {
        appendToDisplay('/');
    } else if (command.includes('equals') || command.includes('calculate')) {
        calculate();
    } else if (command.includes('clear')) {
        clearDisplay();
    } else if (command.includes('square root')) {
        squareRoot();
    } else if (command.includes('sine')) {
        sin();
    } else if (command.includes('cosine')) {
        cos();
    } else if (command.includes('tangent')) {
        tan();
    } else {
        const numbers = command.match(/\d+/g);
        if (numbers) {
            numbers.forEach(num => appendToDisplay(num));
        }
    }
}

// Theme switching
function changeTheme(theme) {
    calculator.className = 'calculator ' + theme;
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'm' || key === 'M') {
        memoryAdd();
    }
});

// Initialize
clearDisplay();
updateConverterUnits();
sciIndicator.style.display = 'none';
degIndicator.style.display = 'inline-block';