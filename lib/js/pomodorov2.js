const pomodoroTimer = (task, audios) => {
    // Display the Timer
    $("#pomodoroModal").modal("toggle");

    // Resets the modal body from bootstrap
    resetModalBody();

    // Set the task title
    setTitle(task);

    // Buttons to add Event Listeners
    const startButton = document.getElementById('pomodoro-start');
    const resetButton = document.getElementById('pomodoro-reset');
    const pomodoroActions = document.getElementById('pomodoro-clock-actions');
    const modalButtonClose = document.getElementById('close-modal');

    // Inputs
    const workDurationInput = document.getElementById('input-work-duration');
    const breakDurationInput = document.getElementById('input-break-duration');
    const selectAlarmInput = document.getElementById('input-select-alarm');

    // Alerts
    const workAlert = document.getElementById('pomodoro-work-alert');
    const breakAlert = document.getElementById('pomodoro-break-alert');

    // Timer loop
    let countdown;

    // Alerts Time Out
    let workTimeOut;
    let breakTimeOut;

    // Default Work&Break Time
    let defaultWorkTime = 1500; // 1500s -> 25min
    let defaultBreakTime = 300; // 300s -> 5min

    // Default current time left
    let currentTimeLeftInSession = 1500;

    // This is for the progress bar
    let currentTimeLeftInSessionBackwards = 0;

    // Checks if the clock is decreasing
    let isClockRunning = false;

    // Default Type
    let type = 'Work';
    let audioNumber;

    // Default Values
    workDurationInput.value = '25';
    breakDurationInput.value = '5';

    // Progress bar initialization
    let progressBar;
    initProgressBar();

    // Worker variable
    let worker;


    /*  
        ******************* 
        **** LISTENERS ****
        *******************
    */

    startButton.addEventListener('click', () => {
        let data = {
            'task': 'run the timer',
            'timeLeft': currentTimeLeftInSession,
            'timeLeftBackwards': currentTimeLeftInSessionBackwards
        };

        if (isClockRunning) {
            // Pause
            isClockRunning = false;
            worker.terminate();
            showPlayPauseButtons();

        } else {
            isClockRunning = true;
            if (currentTimeLeftInSessionBackwards === 0) {
                // Only plays this at the beginning
                playAudio(audioNumber);
                alertType();
            }
            worker = new Worker('./lib/js/worker.js');
            addWorkerListener(worker);
            // Start timer
            worker.postMessage(data);
            showPlayPauseButtons();
            pomodoroActions.classList.add('hidden');

        }


    });

    // RESET Listener
    resetButton.addEventListener('click', () => {
        if (confirm('Do you want to reset the settings?')) {
            worker.terminate();
            isClockRunning = false;
            currentTimeLeftInSession = defaultWorkTime;
            // Reset and Update timer
            showPlayPauseButtons(true);
            displayTimeLeft(defaultWorkTime);
            // Set to Work Type (Default)
            type = 'Work';
            // Reset progress bar
            progressBar.set(0.0001);
            updateProgressBarColor()
            currentTimeLeftInSessionBackwards = 0;
            // Reset alarm
            selectAlarmInput.value = selectAlarmInput.querySelector('option[selected]').value;
            // Show inputs
            pomodoroActions.classList.remove('hidden');
            // Remove Alerts
            workAlert.classList.add('hidden');
            breakAlert.classList.add('hidden');
        }
    });

    modalButtonClose.addEventListener('click', () => {
        if (worker) {
            worker.terminate();
        }
    })

    // Work Input Listener
    workDurationInput.addEventListener('input', () => {
        defaultWorkTime = minuteToSeconds(workDurationInput.value);
        currentTimeLeftInSession = defaultWorkTime;
        displayTimeLeft(defaultWorkTime);
    });

    // Break Input Listener
    breakDurationInput.addEventListener('input', () => {
        defaultBreakTime = minuteToSeconds(breakDurationInput.value);
    });

    // Alarm Input Listener
    selectAlarmInput.addEventListener('input', () => {
        audioNumber = selectAlarmInput.value;
    });

    // Clear Modal body when closing
    $('#pomodoroModal').on('hidden.bs.modal', function () {
        $('.modal-body').html('');
        if (worker) {
            worker.terminate();
        }
    });


    /*  
        ******************* 
        **** FUNCTIONS ****
        *******************
    */

    function initProgressBar() {
        // Initialize progress bar
        progressBar = new ProgressBar.Circle("#pomodoro-timer", {
            strokeWidth: 7,
            text: {
                value: "25:00"
            },
            trailColor: "white",
            color: "#FF7F7F"
        });
        progressBar.set(0.0001);
    }

    function alertType() {

        if (type === 'Work') {
            clearTimeout(workTimeOut);
            workAlert.classList.remove('hidden');
            workTimeOut = setTimeout(() => {
                workAlert.classList.add('hidden');
            }, 5000);
        } else {
            clearTimeout(breakTimeOut);
            breakAlert.classList.remove('hidden');
            breakTimeOut = setTimeout(() => {
                breakAlert.classList.add('hidden');
            }, 5000);
        }

    }

    function calculateSessionProgress() {
        let sessionDuration = type === 'Work' ? defaultWorkTime : defaultBreakTime;
        return (currentTimeLeftInSessionBackwards / sessionDuration);
    }

    function setUpdatedTimers() {
        if (type === 'Work') {
            currentTimeLeftInSession = defaultBreakTime;
            type = 'Break';
            displayTimeLeft(currentTimeLeftInSession);
            showPlayPauseButtons(true);
        } else {
            currentTimeLeftInSession = defaultWorkTime;
            type = 'Work';
            displayTimeLeft(currentTimeLeftInSession);
            showPlayPauseButtons(true);
        }

    }

    function displayTimeLeft(seconds) {
        let minutes = Math.floor(seconds / 60);
        let remainderSeconds = Math.floor(seconds % 60);
        let timeLeft = `${minutes}:${remainderSeconds}`;

        if (remainderSeconds < 10) {
            timeLeft = `${minutes}:0${remainderSeconds}`;
            if (minutes < 10) {
                timeLeft = `0${minutes}:0${remainderSeconds}`;
            }
        }
        progressBar.text.innerText = timeLeft;
    }

    function showPlayPauseButtons(reset) {
        const pauseIcon = document.getElementById('pause-icon');
        const startIcon = document.getElementById('play-icon');
        if (reset) {
            pauseIcon.classList.add('hidden');
            startIcon.classList.remove('hidden');
        } else {
            if (isClockRunning) {
                pauseIcon.classList.remove('hidden');
                startIcon.classList.toggle('hidden');
            } else {
                pauseIcon.classList.toggle('hidden');
                startIcon.classList.remove('hidden');
            }
        }

    }

    function playAudio(number) {
        switch (number) {
            case '1':
                audios[number - 1].play();
                break;
            case '2':
                audios[number - 1].play();
                break;
            case '3':
                audios[number - 1].play();
                break;
            default:
                audios[0].play();
        }
    }

    function setTitle(task) {
        document.getElementById('pomodoro-title').innerText = task;
    }

    function minuteToSeconds(minutes) {
        return 60 * minutes;
    }

    function addWorkerListener(worker) {
        worker.addEventListener('message', (e) => {
            // Update all timers/variables with the worker
            progressBar.text.innerText = e.data.display;
            currentTimeLeftInSession = e.data.timeLeft;
            currentTimeLeftInSessionBackwards = e.data.timeLeftBackwards;
            console.log(e.data.display)
            // Finished session
            if (e.data.timeLeft < 0) {
                worker.terminate();
                isClockRunning = false;
                setUpdatedTimers();
                progressBar.set(0.0001);
                updateProgressBarColor();
                playAudio(audioNumber);
                // Remove Alerts
                workAlert.classList.add('hidden');
                breakAlert.classList.add('hidden');
                alertType();
                currentTimeLeftInSessionBackwards = 0;
                return;
            }

            // Progress bar progress calculation
            progressBar.set(calculateSessionProgress());
            updateProgressBarColor();
        });
    }

    function updateProgressBarColor() {
        if (type == 'Work') {
            document.getElementsByTagName("path")[3].setAttribute("stroke", "#FF7F7F")
        } else {
            document.getElementsByTagName("path")[3].setAttribute("stroke", "#00ff00")
        }
    }

    function resetModalBody() {
        let modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
        <div id="pomodoro-container">
                                <div id="pomodoro-clock">
                                    <div id="pomodoro-work-alert" class="alert alert-danger hidden" role="alert">
                                        Work Session
                                    </div>
                                    <div id="pomodoro-break-alert" class="alert alert-success hidden" role="alert">
                                        Break Session
                                    </div>
                                    <div id="pomodoro-timer"></div>

                                    <div id="pomodoro-buttons-actions" class="text-center m-3">
                                        <button id="pomodoro-start">
                                            <i class="fas fa-play" id="play-icon"></i>
                                            <i class="fas fa-pause hidden" id="pause-icon"></i>
                                        </button>
                                        <button id="pomodoro-reset" class="">
                                            <i class="fas fa-redo"></i>
                                        </button>
                                    </div>
                                </div>

                                <div id="pomodoro-clock-actions" class="container">
                                    <div class="pomodoro-input">
                                        <label>Work Duration</label>
                                        <input name="input-work-duration" id="input-work-duration" type="number" />
                                    </div>
                                    <div class="pomodoro-input">
                                        <label>Break Duration</label>
                                        <input name="input-break-duration" id="input-break-duration" type="number" />
                                    </div>
                                    <div class="pomodoro-input">
                                        <Label>Alarm Display</Label>
                                        <select id="input-select-alarm" class="custom-select">
                                            <option selected>Choose Alarm...</option>
                                            <option value="1">Alarm Beep 1</option>
                                            <option value="2">Alarm Beep 2</option>
                                            <option value="3">Alarm Beep 3</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
        `
    }
};

export { pomodoroTimer };