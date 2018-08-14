/*
 * Create a list that holds all of your cards
 */

// Globals
const deck = document.querySelector('.deck');
let flipCards = [];
let moves = 0;
let timerOff = true;
let time = 0;
let timerId;
let matched = 0;

//shuffle deck
function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards) {
        deck.appendChild(card);
    }
}
shuffleDeck();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//listening for card clicks and flipping them over with toggle 
deck.addEventListener('click', event => {
    const clickedCard = event.target;
    if (isValid(clickedCard)) {
        if (timerOff) {
            startTimer();
            timerOff = false;
        }
        toggleCard(clickedCard);
        addToggleCard(clickedCard);
        if (flipCards.length === 2) {
            compareMatches();
            addMove();
            moveTotal();
        }
    }
});

function isValid(clickedCard) {
    return (
        clickedCard.classList.contains('card') && !clickedCard.classList.contains('match') 
        && flipCards.length < 2 && !flipCards.includes(clickedCard)
    );
}

//creating a clock with an interval to count like seconds
function startTimer() {
    timerId = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
}

//displays this time we created by adding innerHTML to DOM
function displayTime() {
    const timer = document.querySelector('.timer');
    const min = Math.floor(time / 60);
    const sec = time % 60;

    if (sec < 10) {
        timer.innerHTML = `${min}:0${sec}`;
    } else {
        timer.innerHTML = `${min}:${sec}`;
    }
}

//Seperated toggle from original event(for flipping cards)
function toggleCard(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}

//Pushing the clickedCard into toggle
function addToggleCard(clickedCard) {
    flipCards.push(clickedCard);
}

//check and compare cards to see if they are pairing up
function compareMatches() {
    const Total_Matches = 8;

    if (
        flipCards[0].firstElementChild.className === flipCards[1].firstElementChild.className) {
        flipCards[0].classList.toggle('match');
        flipCards[1].classList.toggle('match');
        flipCards = [];
        matched++;
        if (matched === Total_Matches) {
            endGame();
        }

     //set time delay before turning back over
    } else {
        setTimeout(() => {
            toggleCard(flipCards[0]);
            toggleCard(flipCards[1]);
            flipCards = [];
        }, 1000);
    }
}

function endGame() {
    stopTimer();
    togglePopup();
    ResultsinWindow();
}

//stopping the timer
function stopTimer() {
    clearInterval(timerId);
}

/* Creating the Pop Up Window */
function togglePopup() {
    const popup = document.querySelector('.popup-background');
    popup.classList.toggle('hide');
}

//Prints the results in the window
function ResultsinWindow() {
    const timeStat = document.querySelector('.popup-time');
    const timerTime = document.querySelector('.timer').innerHTML;
    const movesStat = document.querySelector('.popup-moves');
    const starsStat = document.querySelector('.popup-stars');
    const stars = getStars();

    timeStat.innerHTML = `Time = ${timerTime}`;
    movesStat.innerHTML = `Moves = ${moves}`;
    starsStat.innerHTML = `Stars = ${stars}`;
}

function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    }
    return starCount;
}

//adding a moves
function addMove() {
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

function moveTotal() {
    if (moves === 16 || moves === 32) {
        hideStar();
    }
}

// hides a star when scores goes down
function hideStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}

//Popup Button - Cancel
document.querySelector('.popup-cancel').addEventListener('click', () => {
    togglePopup();
});

//Popup Button - Replay
document.querySelector('.popup-replay').addEventListener('click', replayGame);

// X-close button
document.querySelector('.popup-close').addEventListener('click', togglePopup);

function replayGame() {
    resetGame();
    togglePopup();
}

document.querySelector('.restart').addEventListener('click', resetGame);

//reset the whole game
function resetGame() {
    resetTimer();
    resetMoves();
    resetStars();
    shuffleDeck();
    resetCards();
}

function resetTimer() {
    stopTimer();
    timerOff = true;
    time = 0;
    displayTime();
}

//resets moves back to 0
function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

 //resets stars to 3
function resetStars() {
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}

// resets cards and turns it back over
function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}
