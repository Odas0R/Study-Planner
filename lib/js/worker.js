let currentTimeLeftInSession;
let currentTimeLeftInSessionBackwards;

self.addEventListener("message", (e) => {
    if (e.data.task === 'run the timer') {
        currentTimeLeftInSession = e.data.timeLeft;
        currentTimeLeftInSessionBackwards = e.data.timeLeftBackwards;
        setInterval(() => {
            currentTimeLeftInSession--;
            currentTimeLeftInSessionBackwards++;
            let display = getTimeLeft(currentTimeLeftInSession);
            let data = {
                'display': display,
                'timeLeft': currentTimeLeftInSession,
                'timeLeftBackwards': currentTimeLeftInSessionBackwards
            }
            self.postMessage(data);
        }, 1000);
    } 
})

function getTimeLeft(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainderSeconds = Math.floor(seconds % 60);
    let timeLeft = `${minutes}:${remainderSeconds}`;

    if (remainderSeconds < 10) {
        timeLeft = `${minutes}:0${remainderSeconds}`;
        if (minutes < 10) {
            timeLeft = `0${minutes}:0${remainderSeconds}`;
        }
    }
    return timeLeft;
}