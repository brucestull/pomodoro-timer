document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-button');
    const pauseBtn = document.getElementById('pause-button');
    const cancelBtn = document.getElementById('cancel-button');
    const display = document.getElementById('timer-display');
    const warningSound = document.getElementById('warning-sound');
    const alarmSound = document.getElementById('alarm-sound');

    const duration = 25 * 60;  // 25 minutes
    let elapsed = 0;
    let intervalId = null;

    function updateDisplay() {
        const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        display.textContent = `${m}:${s}`;
    }

    function tick() {
        elapsed++;
        updateDisplay();

        if (elapsed === duration - 300) {
            warningSound.play();        // 5-min warning
        }
        if (elapsed >= duration) {
            clearInterval(intervalId);
            intervalId = null;
            alarmSound.play();          // final alarm
            cancelBtn.style.display = 'inline-block';
            startBtn.disabled = true;
            pauseBtn.disabled = true;
        }
    }

    startBtn.addEventListener('click', () => {
        if (!intervalId) {
            intervalId = setInterval(tick, 1000);
            startBtn.disabled = true;
            pauseBtn.disabled = false;
        }
    });

    pauseBtn.addEventListener('click', () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
    });

    cancelBtn.addEventListener('click', () => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        cancelBtn.style.display = 'none';
        elapsed = 0;
        updateDisplay();
        startBtn.disabled = false;
    });

    updateDisplay();
});
