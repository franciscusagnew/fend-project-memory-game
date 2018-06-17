/*
 * Game Play Components
 *
 * Create a list that holds all of your cards
 */
let card = document.querySelectorAll('.card');
let cards = [...card];

// Game Deck
let deck = document.querySelector('.deck');

// List of Open Cards
let openedCards = [];

// Counter For Number of Moves
let moveCounter = document.querySelector('.moves');

// Counter For NUmber of Matched Cards
let matchCount = 0;

// Star Rating display component
let stars = document.querySelector('.stars').children;

// Player's Star Rating
let starRating = 0;

// Game Count
let game = 0;

/*
 * Game Timer Components
 */
let time = '00:00';
let timer = document.querySelector('.timer');
let seconds = 0;
let minutes = 0;
let interval;

// Game Status Components
let startGame = false;
let restart = document.querySelector('.restart');
restart.addEventListener('click', newGame);
let gameOver = document.querySelector('.game-over');
let gameOverExit = document.querySelector('.fa-times');
let playAgain = document.querySelector('.play-again');
let moveResults = document.querySelector('.move-results');
let ratingResults = document.querySelector('.rating-results');
let timingResults = document.querySelector('.timing-results');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// newCards function re-shuffles the deck of cards
function newCards() {
    let shuffleCards = shuffle(cards);

    // Remove classes from card before adding to deck
    for (let i = 0; i < shuffleCards.length; i++) {
        shuffleCards[i].classList.remove('show', 'open', 'match');
        deck.appendChild(shuffleCards[i]);
    }

    // set up the event listener for a card. If a card is clicked:
    for (let shuffleCard of shuffleCards) {
        shuffleCard.addEventListener('click', selectedCards);
    }
}

/*
 * Display the card's symbol (put this functionality in another
 * function that you call from this one)
 */
function selectedCards() {
    displayCard();
    addOpenCards();
    if (startGame === false) {
        startTimer();
    }
    
    if (openedCards.length === 2) {
        addMoves();
        if (openedCards[0].innerHTML === openedCards[1].innerHTML) {
            matchCount++;
            endGame();
            match();
        } else {
            noMatch();
        }
    }
}

// add the card to a *list* of "open" cards
function addOpenCards() {
    openedCards.push(event.target);
}

// display the card's symbol
function displayCard() {
    const selectedCard = event.target;
    if (selectedCard.className === 'card') {
        if (openedCards.length < 2) {
            event.target.classList.add('open', 'show');
        }
    }
}

/*
 * If the list already has another card, check to see if the two cards match.
 * If the cards do match, lock the cards in the open position
 */
function match() {
    openedCards[0].classList.add('match');
    openedCards[1].classList.add('match');
    openedCards[0].classList.remove('show', 'open');
    openedCards[1].classList.remove('show', 'open');
    openedCards = [];
}

/* 
 * If the cards do not match, remove the cards from the list and hide
 * the card's symbol
 */
function noMatch() {
    openedCards[0].classList.add('nomatch');
    openedCards[1].classList.add('nomatch');
    setTimeout(function() {
        openedCards[0].classList.remove('open', 'show', 'nomatch');
        openedCards[1].classList.remove('open', 'show', 'nomatch');
        openedCards = [];
    }, 1000);
}

/*
 * Increment the move counter and display it on the page
 * if all cards have matched, display a message with the final score
 */
function addMoves() {
    moves++;
    moveCounter.textContent = moves;
    rating();
}

// Reset player's number of moves
function resetMovesCount() {
    moves = 0;
    moveCounter.textContent = moves;
}

// Calculate the player's star rating
function rating() {
    if (moves < 15) {
        starRating = 3;
    }
    if (moves > 15) {
        starRating = 2;
        stars[0].style.visibility = 'hidden';
        
    }
    if (moves > 25) {
        starRating = 1;
        stars[1].style.visibility = 'hidden';
    }
}

// Reset the star rating
function resetStarRating() {
    stars[1].style.visibility = 'visible';
    stars[0].style.visibility = 'visible';
}

// Start timer function
function startTimer() {
    startGame = true;
    clearInterval(interval);
    timer.textContent = time;

    interval = setInterval(function() {
        seconds++;

        if (seconds === 60) {
            minutes++;
            seconds = 0;

            if (minutes === 60) {
                minutes = 0;
                seconds = 0;
            }
        }

        timer.textContent = (minutes < 10 ? '0' + minutes.toString(): minutes) + ':' + 
                            (seconds < 10 ? '0' + seconds.toString(): seconds);
    }, 1000);
}

// Reset game timer
function resetTimer() {
    clearInterval(interval);
    minutes = 0;
    seconds = 0;
    startGame = false;
    timer.textContent = time;
}

// Setup a new game
function newGame() {
    resetMovesCount();
    resetStarRating();
    matchCount = 0;
    startGame = false;
    resetTimer();
    openedCards = [];
    newCards();
}

// Game ending procedures
function endGame() {
    if (matchCount === 8) {
        clearInterval(interval);
        gameOver.style.display = 'block';

        game++;
        moveResults.textContent = moves;
        ratingResults.textContent = starRating;
        timingResults.textContent = timer.textContent;

        gameOverExit.onclick = function() {
            gameOver.style.display = 'none';
            saveScore();
            newGame();
        }

        playAgain.onclick = function() {
            gameOver.style.display = 'none';
            saveScore();
            newGame();
        };
    }
}

// Save player scores
function saveScore() {
    localStorage.setItem('game', game);
    localStorage.setItem('moves', moves);
    localStorage.setItem('star-rating', starRating);
    localStorage.setItem('timer', timer.textContent);

    let leaders = document.querySelector('.leaders');
    let addScores = '<li><strong>Game ' + game + ':&emsp;Time:</strong> ' + timer.textContent + '&emsp;<strong>Moves:</strong> ' + moves + '&emsp;<strong>Star Rating:</strong> ' + starRating + '</li>';
    leaders.insertAdjacentHTML('beforeend', addScores);
}

// Start a new game when browser loads
window.onload = function() {
    newGame();
};