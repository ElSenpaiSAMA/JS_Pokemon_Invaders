const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");
const reproducir = document.getElementById("inmusica");
const siguiente = document.getElementById("sigmus");
const start = document.getElementById("iniciar");
let currentShooterIndex = 202;
const width = 15;
let alienInvaders = [];
let aliensRemoved = [];
let invadersId;
let isGoingRight = true;
let direction = 1;
let resul = 0;
let disparando = false;
const veloDisparo = 300;
let dispara = true;
let movimiento = 600;

let imusic = 0;
let sonando = false;

const musica = [
    'otros/1.mp3',
    'otros/2.mp3',
    'otros/3.mp3'
];

const mus = new Audio(musica[imusic]);
const laser = new Audio('otros/laser.mp3');

function showScore() {
    resultDisplay.textContent = `Puntuacion: ${results}`;
}

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add("invader");
        }
    }
}

for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

const initialAlienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
];

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove("invader")
    }
}

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter")
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
            break
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break
    }
    squares[currentShooterIndex].classList.add("shooter")
}

document.addEventListener("keydown", moveShooter)

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    remove();

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1;
            direction = -1;
            isGoingRight = false;
        }
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1;
            direction = 1;
            isGoingRight = true;
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }

    draw();

    if (squares[currentShooterIndex].classList.contains("invader")) {
        showScore();
        clearInterval(invadersId);
    }

    if (aliensRemoved.length === alienInvaders.length) {
        clearInterval(invadersId);
        genEnemigos();
        clearInterval(invadersId);
        movimiento -= 50;
        invadersId = setInterval(moveInvaders, movimiento);
    }
}

function genEnemigos() {
    alienInvaders = [];
    aliensRemoved = [];
    for (let i = 0; i < initialAlienInvaders.length; i++) {
        alienInvaders.push(initialAlienInvaders[i]);
    }
    draw();
}

function shoot(e) {
    if (dispara && e.key === "ArrowUp" && !disparando) {
        disparando = true;
        let laserId;
        let currentLaserIndex = currentShooterIndex;

        function moveLaser() {
            squares[currentLaserIndex].classList.remove("laser")
            currentLaserIndex -= width
            squares[currentLaserIndex].classList.add("laser")

            if (squares[currentLaserIndex].classList.contains("invader")) {
                squares[currentLaserIndex].classList.remove("laser")
                squares[currentLaserIndex].classList.remove("invader")
                squares[currentLaserIndex].classList.add("boom")

                setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300)
                clearInterval(laserId)

                const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
                aliensRemoved.push(alienRemoved)
                resul++
                resultDisplay.innerHTML = resul
            }
            if (currentLaserIndex < 0) {
                clearInterval(laserId);
                disparando = false;
            }
        }

        laserId = setInterval(moveLaser, 100)
        dispara = false;
        laser.currentTime = 0;
        laser.play();
        setTimeout(() => {
            dispara = true;
            disparando = false;
        }, veloDisparo);
    }
}

document.addEventListener('keydown', shoot)

function iniciargame() {
    alienInvaders = [...initialAlienInvaders];
    aliensRemoved = [];
    resul = 0;
    resultDisplay.innerHTML = resul;
    squares.forEach(square => {
        square.classList.remove("invader");
        square.classList.remove("shooter");
        square.classList.remove("laser");
        square.classList.remove("boom");
    });
    currentShooterIndex = 202;
    squares[currentShooterIndex].classList.add("shooter");
    draw();
    invadersId = setInterval(moveInvaders, 600);
}

function repro() {
    if (sonando) {
        mus.pause();
        reproducir.style.backgroundImage = "url('otros/mut.png')";
    } 
    else {
        mus.play();
        reproducir.style.backgroundImage = "url('otros/vol.png')";
    }
    sonando= !sonando;
}
reproducir.addEventListener("click", repro);

function sigMusic() {
    mus.pause();
    imusic = (imusic + 1) % musica.length;
    mus.src = musica[imusic];
    if (sonando) {
        mus.play();
    }
}
siguiente.addEventListener("click", sigMusic);

start.addEventListener("click", () => {
    clearInterval(invadersId);
    iniciargame();
});