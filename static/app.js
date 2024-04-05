'use strict';

const $submitWord = $('button');
const $userWord = $('input');
const $body = $('body');
const $score = $('#score');
const $timer = $('#timer');
let totalScore = 0
let timer = 60;

// receives input from form and checks if the word is valid
async function checkNewWord(evt) {
    evt.preventDefault();
    $('div').remove() // removes old word response if there was one
    let word = $userWord[0].value; // retrieves input from form
    let answer = document.createElement('div');

    if (timer === 60) {startTimer()} // starts 60 second timer

    if (timer === 0) { // stop user from guessing words when timer is up
        answer.innerText = 'Time is up!'
    } else { // if time is left, check for word

        const response = await axios({ // sends word to server
            url: `http://127.0.0.1:5000/input`, 
            method: 'POST',
            params: {'word': word}
        });
    
        if (response.data.result === 'ok') { // user entered a valid word on the board
            answer.innerText = `Good job, you found the word "${word}"!`;
            updateScore(word);
        } else if (response.data.result === 'not-word') { // user entered something that is not a word
            answer.innerText = `Please try again, "${word}" could not be found in our dictionary.`;
        } else if (response.data.result === 'not-on-board') { // user entered a word not found on the board
            answer.innerText = `Please try again, "${word}" could not be found on the Boggle board.`;
        } else {
            answer.innerText = 'You have already guessed that word.';
        }
    }   
    $body.append(answer); // display description
    $userWord[0].value = ''; // clears previous word for user
}

//update score display
function updateScore(word) {
    const points = word.length;
    totalScore += points;
    $score.text(`Your score: ${totalScore}`);
}

// start game timer when first word is submitted (60 second timer)
function startTimer() {
    let timerID = setInterval(countdown, 1000);
    function countdown() {
        timer--;
        $timer.text(`     Timer: ${timer}`)
        if (timer === 0) { // stop timer when it reaches 0 
            clearInterval(timerID)
            storeResults();
        }
    }
}

// store results in session and return current highscore
async function storeResults() {
    const response = await axios.post("/finished", { score: totalScore });

    let highscore = response.data.highestscore;
    let results = document.createElement('p');
    results.innerText = `Your current highscore: ${highscore}`;
    $body.append(results);
}

$submitWord.on('click', checkNewWord); // listen for word submission