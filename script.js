let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startPauseButton = document.getElementById('start-pause');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const workModeButton = document.getElementById('work-mode');
const restModeButton = document.getElementById('rest-mode');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function switchMode(mode) {
    isWorkTime = mode === 'work';
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    
    // Update toggle button states
    workModeButton.classList.toggle('active', isWorkTime);
    restModeButton.classList.toggle('active', !isWorkTime);
    
    // Stop the current timer if it's running
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
    
    updateDisplay();
}

function toggleTimer() {
    if (timerId === null) {
        // Start the timer
        if (timeLeft === undefined) {
            timeLeft = WORK_TIME;
        }
        startTimer();
        startPauseButton.textContent = 'Pause';
        startPauseButton.classList.add('running');
    } else {
        // Pause the timer
        pauseTimer();
        startPauseButton.textContent = 'Start';
        startPauseButton.classList.remove('running');
    }
}

function startTimer() {
    if (timerId === null) {
        timerId = setInterval(() => {
            timeLeft--;
            updateTimer();
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    // Update display
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update page title with current time
    document.title = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - Tim's Focus Timer`;

    if (timeLeft === 0) {
        clearInterval(timerId);
        timerId = null;
        startPauseButton.textContent = 'Start';
        startPauseButton.classList.remove('running');
        
        // Update title based on which mode just finished
        const isWorkMode = modeText.textContent.includes('Work');
        document.title = `Tim's Focus Timer - Time to ${isWorkMode ? 'Rest' : 'Work'}`;
        
        // Optional: Play a sound or show a notification here
    }
    
    if (timeLeft > 0) {
        timeLeft--;
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    modeText.textContent = 'Work Time';
    startPauseButton.textContent = 'Start';
    startPauseButton.classList.remove('running');
    document.title = "Tim's Focus Timer"; // Reset title on timer reset
    
    workModeButton.classList.add('active');
    restModeButton.classList.remove('active');
    
    updateDisplay();
}

// Update event listeners
startPauseButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', resetTimer);
workModeButton.addEventListener('click', () => switchMode('work'));
restModeButton.addEventListener('click', () => switchMode('rest'));

// Initialize the display
resetTimer(); 