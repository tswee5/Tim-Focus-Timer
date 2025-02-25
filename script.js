const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let timeLeft = WORK_TIME;
let timerId = null;
let isWorkTime = true;
let isRunning = false;
let focusText = '';

// Get DOM elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startPauseButton = document.getElementById('startPauseButton');
const addTimeButton = document.getElementById('addTimeButton');
const resetButton = document.getElementById('resetButton');
const modeText = document.getElementById('mode-text');
const workModeButton = document.getElementById('work-mode');
const restModeButton = document.getElementById('rest-mode');

// Initialize display
updateDisplay();

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function toggleButtons(running) {
    if (running) {
        startPauseButton.textContent = 'Pause';
        startPauseButton.classList.remove('bg-blue-500');
        startPauseButton.classList.add('bg-yellow-500');
        addTimeButton.disabled = false;
        resetButton.disabled = false;
        addTimeButton.classList.remove('disabled');
        resetButton.classList.remove('disabled');
    } else {
        startPauseButton.textContent = 'Start';
        startPauseButton.classList.remove('bg-yellow-500');
        startPauseButton.classList.add('bg-blue-500');
        addTimeButton.disabled = true;
        const currentMode = isWorkTime ? WORK_TIME : BREAK_TIME;
        if (timeLeft === currentMode) {
            resetButton.disabled = true;
            resetButton.classList.add('disabled');
        } else {
            resetButton.disabled = false;
            resetButton.classList.remove('disabled');
        }
        addTimeButton.classList.add('disabled');
    }
}

async function startPauseTimer() {
    if (!isRunning) {
        if (isWorkTime) {
            const focus = await showFocusPrompt();
            focusText = focus;
            updateFocusDisplay();
        }
        isRunning = true;
        timerId = setInterval(updateTimer, 1000);
        toggleButtons(true);
    } else {
        isRunning = false;
        clearInterval(timerId);
        timerId = null;
        toggleButtons(false);
    }
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
        document.title = `${minutesDisplay.textContent}:${secondsDisplay.textContent} - Tim's Focus Timer`;
    } else {
        clearInterval(timerId);
        timerId = null;
        isRunning = false;
        toggleButtons(false);
        const nextMode = isWorkTime ? 'Rest' : 'Work';
        document.title = `Tim's Focus Timer - Time to ${nextMode}`;
    }
}

function addFiveMinutes() {
    timeLeft += 300;
    updateDisplay();
}

function resetTimer() {
    isRunning = false;
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    focusText = '';
    updateFocusDisplay();
    updateDisplay();
    toggleButtons(false);
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    startPauseButton.addEventListener('click', startPauseTimer);
    addTimeButton.addEventListener('click', addFiveMinutes);
    resetButton.addEventListener('click', resetTimer);
    workModeButton.addEventListener('click', () => switchMode('work'));
    restModeButton.addEventListener('click', () => switchMode('rest'));
});

function switchMode(mode) {
    isWorkTime = mode === 'work';
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    workModeButton.classList.toggle('active', isWorkTime);
    restModeButton.classList.toggle('active', !isWorkTime);
    resetTimer();
}

function showFocusPrompt() {
    return new Promise((resolve) => {
        const promptHTML = `
            <div id="focusPrompt" class="focus-prompt">
                <div class="focus-prompt-content">
                    <button class="close-button" onclick="document.getElementById('focusPrompt').remove(); resolve('');">✕</button>
                    <h2>What are you focusing on?</h2>
                    <input type="text" id="focusInput" placeholder="Enter your focus...">
                    <button class="control-button bg-blue-500" onclick="saveFocus()">Start Session</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', promptHTML);
        
        const input = document.getElementById('focusInput');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveFocus();
            }
        });

        window.saveFocus = () => {
            const input = document.getElementById('focusInput');
            const focus = input.value.trim();
            document.getElementById('focusPrompt').remove();
            resolve(focus);
        };
    });
}

function updateFocusDisplay() {
    let focusDisplay = document.getElementById('focusDisplay');
    if (!focusDisplay) {
        focusDisplay = document.createElement('div');
        focusDisplay.id = 'focusDisplay';
        document.querySelector('.timer').insertAdjacentElement('beforebegin', focusDisplay);
    }
    focusDisplay.textContent = focusText ? `You're focusing on: ${focusText}` : '';
    focusDisplay.style.margin = focusText ? '1rem 0' : '0';
} 