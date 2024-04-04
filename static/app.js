'use strict';

const $submitWord = $('button');
const $userWord = $('input');
const $body = $('body');
const $score = $('#score');
const $timer = $('#timer');
let totalScore = 0
let timer = 5;

// receives input from form and checks if the word is valid
async function checkNewWord(evt) {
    evt.preventDefault();
    $('div').remove() // removes old word response if there was one
    let word = $userWord[0].value; // retrieves input from form
    let answer = document.createElement('div');

    if (timer === 5) {startTimer()} // starts 60 second timer

    if (timer === 0) { // stop user from guessing words when timer is up
        answer.innerText = 'Time is up!'
    } else { // if time is left, check for word
        console.log(word);
        const response = await axios({ // sends word to server
            url: `http://127.0.0.1:5000/input`, 
            method: 'POST',
            params: {'word': word}
        });
        console.log('made it past the axios')
        console.log(response.data.result)
    
        if (response.data.result === 'ok') { // user entered a word on the board
            answer.innerText = 'Good job, you found a word!';
            updateScore(word);
        } else if (response.data.result === 'not-word') { // user entered something that is not a word
            answer.innerText = `Please try again, "${word}" could not be found in our dictionary.`;
        } else { // user entered a word not found on the board
            answer.innerText = `Please try again, "${word}" could not be found on the Boggle board.`;
        }
    }   
    $body.append(answer);
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
            console.log('times up')
            clearInterval(timerID)
            storeResults();
        }
    }
}

async function storeResults() {
    console.log('storing results now')

    // const response = await axios({ // sends word to server
    //     url: `http://127.0.0.1:5000/finished`, 
    //     method: 'POST',
    //     JSON: {'score': totalScore}
    // });

    const response = await axios.post("/finished", { score: totalScore });

    console.log('made it past the axios...again')
    console.log('highestscore', response.data.highestscore)
    let highscore = response.data.highestscore;
    let results = document.createElement('div');
    results.innerText = `Your current highscore: ${highscore}`;
    $body.append(results);
}

$submitWord.on('click', checkNewWord); // listen for word submission