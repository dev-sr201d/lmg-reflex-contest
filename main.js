window.addEventListener("DOMContentLoaded", init);

function init() {
    createBalls();
    initializeLevel();
    const button = document.querySelector("button");
    button.addEventListener("click", startLevel);
    window.addEventListener("keydown", checkKeyEvent);
}

function createBalls() {
    const greenBall = document.createElement("div");
    greenBall.classList.add("rc-ball");
    greenBall.classList.add("rc-ball-green");
    greenBall.classList.add("rc-d-none");
    document.body.appendChild(greenBall);

    const redBall = document.createElement("div");
    redBall.classList.add("rc-ball");
    redBall.classList.add("rc-ball-red");
    redBall.classList.add("rc-d-none");
    document.body.appendChild(redBall);
}

const ballDeck = [];
let waitTimeBase = 500;
let waitTimeRange = 500;
let activeTimeBase = 500;
let activeTimeRange = 500;

let waitTimeout = null;
let activeTimeout = null;

let level = 1;
let points = 0;
let currentBallType = 0;
let controlsActive = false;

function initializeLevel() {
    let sourceDeck = [];
    for (let i = 0; i < 5; i++) {
        sourceDeck.push(0);
    }

    for (let i = 0; i < 5; i++) {
        sourceDeck.push(1);
    }

    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * sourceDeck.length);
        ballDeck.push(sourceDeck[randomIndex]);
        sourceDeck.slice(randomIndex, 1);
    }
}

function startLevel() {
    const button = document.querySelector("button");
    button.classList.add("rc-d-none");
    setTimeout(showBall, 2000);
}

function endLevel() {
    const button = document.querySelector("button");

    if (points > 5) {
        alert("Geschafft! Deine Punkte: " + points);
        level++;
        waitTimeBase -= 10;
        waitTimeRange -= 10;
        activeTimeBase -= 20;
        activeTimeRange -= 20;
        button.textContent = "Start Level " + level;
    } else {
        alert("Das war's noch nicht. Deine Punkte: " + points);
    }
    initializeLevel();
    points = 0;
    button.classList.remove("rc-d-none");
}

function showBall() {
    currentBallType = ballDeck.pop();
    const randomX = 50 + Math.floor(Math.random() * 1600);
    const randomY = 50 + Math.floor(Math.random() * 600);
    const ball = currentBallType === 0 ? document.querySelector(".rc-ball-red") : document.querySelector(".rc-ball-green");
    ball.style.top = randomY + "px";
    ball.style.left = randomX + "px";
    ball.classList.remove("rc-d-none");
    controlsActive = true;
    
    const timeout = activeTimeBase + Math.floor(Math.random() * activeTimeRange);
    activeTimeout = setTimeout(hideBall, timeout);
}

function hideBall() {
    const ball = currentBallType === 0 ? document.querySelector(".rc-ball-red") : document.querySelector(".rc-ball-green");
    ball.classList.add("rc-d-none");
    controlsActive = false;
    if (ballDeck.length < 1) {
        endLevel();
        return;
    }

    const timeout = waitTimeBase + Math.floor(Math.random() * waitTimeRange);
    waitTimeout = setTimeout(showBall, timeout);
}

function checkKeyEvent(e) {
    if (!controlsActive) {
        if (e.code === "Enter") {
            const button = document.querySelector("button");
            if (button.classList.contains("rc-d-none")) {
                return;
            }
            startLevel();
        }
        return;
    }

    let keyType = null; 
    switch (e.code) {
        case "ControlLeft":
            keyType = 0;
            break;
        case "ControlRight":
            keyType = 1;
            break;
        default:
            return;
    }

    controlsActive = false;

    if (currentBallType === keyType) {
        points++;
    } else {
        points--;
    }

    window.clearTimeout(activeTimeout);
    hideBall();
}
