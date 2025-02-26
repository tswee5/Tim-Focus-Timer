const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let timeLeft = WORK_TIME;
let isRunning = false;
let timerId = null;
let isWorkMode = true;
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

function updateButtonStates() {
    const startPauseButton = document.getElementById('startPauseButton');
    const addTimeButton = document.getElementById('addTimeButton');
    const resetButton = document.getElementById('resetButton');

    // Enable +5 minutes button always
    addTimeButton.disabled = false;
    addTimeButton.classList.remove('disabled');

    // Update start/pause button text based on timer state
    if (isRunning) {
        startPauseButton.textContent = 'Pause';
    } else if (timeLeft === (isWorkMode ? WORK_TIME : BREAK_TIME)) {
        startPauseButton.textContent = 'Start';
    } else {
        startPauseButton.textContent = 'Resume';
    }

    // Enable reset button when timer is not at initial state
    resetButton.disabled = timeLeft === (isWorkMode ? WORK_TIME : BREAK_TIME);
    if (resetButton.disabled) {
        resetButton.classList.add('disabled');
    } else {
        resetButton.classList.remove('disabled');
    }
}

async function startPauseTimer() {
    if (!isRunning && timeLeft === (isWorkMode ? WORK_TIME : BREAK_TIME)) {
        focusText = await showFocusPrompt();
        updateFocusDisplay();
    }
    
    if (isRunning) {
        // Pause timer
        clearInterval(timerId);
        isRunning = false;
    } else {
        // Start or resume timer
        isRunning = true;
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerId);
                isRunning = false;
                // Handle timer completion
            }
            updateButtonStates();
        }, 1000);
    }
    updateButtonStates();
}

function addFiveMinutes() {
    timeLeft += 5 * 60;
    updateDisplay();
    updateButtonStates();
}

function resetTimer() {
    clearInterval(timerId);
    isRunning = false;
    timeLeft = isWorkMode ? WORK_TIME : BREAK_TIME;
    focusText = '';
    updateFocusDisplay();
    updateDisplay();
    updateButtonStates();
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
    isWorkMode = mode === 'work';
    timeLeft = isWorkMode ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkMode ? 'Work Time' : 'Break Time';
    workModeButton.classList.toggle('active', isWorkMode);
    restModeButton.classList.toggle('active', !isWorkMode);
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