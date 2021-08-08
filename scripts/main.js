$(document).ready(function() {
    $('div.bodyCurtain').fadeOut(500);
})

let words = [
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
]

let currentWord = 0;
let inProgress = false;
const testTime = 10;
let timeElapsed = 0;
let currentTestTime = testTime;
let wordsRemaining = words.length;
let correctWords = 0;
let charAcc = 0;
let totalChars = 0;
let correctChars = 0;
let WPM = 0;

var passage_Container = document.getElementsByClassName('passage_Container')[0];
var passageInput = document.getElementsByClassName('passageInput')[0];

function shiftWord() {
    var word = document.getElementsByClassName('word')[0];
    $("div.word:nth-child(1)").animate({
        marginLeft: '-100px',
    }, 50, function() {
        word.remove();
    });
    updateCurrentWord();
    words.shift();
}

function submitWord(word) {
    const isCorrect = Boolean(passageInput.value == (words[0] + ' '));
    console.log(isCorrect);
    if(isCorrect)
    {
        correctWords += 1;
        document.getElementById('stats_correctWords').innerText = correctWords;
        correctChars += (words[0].length);
    }
    passageInput.value = '';
    totalChars += (words[0].length);
    shiftWord();
    charAcc = (correctChars / totalChars) * 100;
    charAcc = parseFloat(charAcc).toFixed(1);
    document.getElementById('stats_charAcc').innerText = charAcc + "%";
}

function calcWPM() {
    console.log("Correct Words: " + correctWords);
    console.log("Time Elapsed: " + timeElapsed);
    WPM = ((correctWords / timeElapsed)*100);
    WPM = parseFloat(WPM).toFixed(0);
    document.getElementById('stats_wordsPerMinute').innerText = WPM;
}

function updateCurrentWord() {
    currentWord += 1;
}

function beginTest() {
    inProgress = true;
    let timer = document.getElementById('stats_timeRemaining');
    timer.innerText = parseInt(currentTestTime) + "s";

    if(currentTestTime)
    {
        setTimeout(function() {
            currentTestTime -= 1;
            timeElapsed += 1;
            calcWPM();
            beginTest();
        }, 1000);
    } else {
        inProgress = false;
    }

}

function updateWordsRemaining() {
    wordsRemaining = words.length;
    document.getElementById('stats_wordsRemaining').innerText = wordsRemaining;
}

function begin() {
    //lol
}

words.forEach(function insertWord(element) {
    let div = document.createElement("div")
    div.className = 'word';
    div.append(element);
    passage_Container.appendChild(div);
    //totalChars += element.length;
});

passageInput.addEventListener('input', () => {

    if(!inProgress)
    {
        updateWordsRemaining();
        beginTest();
    }

    const lastChar = passageInput.value.charAt(passageInput.value.length - 1);
    if(lastChar == ' ')
    {
        submitWord(passageInput.value);
        updateWordsRemaining();
    }
});