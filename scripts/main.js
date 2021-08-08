let currentWord = 0;
let inProgress = false;
const testTime = 60;
let words = [];
let timeElapsed = 0;
let currentTestTime = testTime;
let wordsRemaining = words.length;
let correctWords = 0;
let totalWords = 0;
let charAcc = 0;
let totalChars = 0;
let correctChars = 0;
let WPM = 0;

var passage_Container = document.getElementsByClassName('passage_Container')[0];
var passageInput = document.getElementsByClassName('passageInput')[0];

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(document).ready(function() {
    $('div.bodyCurtain').fadeOut(500);
    for (let n = 0; n < 180; n++) {
        words.push(wordBank[randomInteger(0, 499)]);
    }
    wordsRemaining = words.length;
    words.forEach(function insertWord(element) {
        let div = document.createElement("div")
        div.className = 'word';
        div.append(element);
        passage_Container.appendChild(div);
    });
})

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
    totalWords += 1;
    if(isCorrect)
    {
        correctWords += 1;
        correctChars += (words[0].length);
    } else {
        showError();
    }
    document.getElementById('stats_correctWords').innerText = correctWords + "/" + totalWords;
    passageInput.value = '';
    totalChars += (words[0].length);
    shiftWord();
    charAcc = (correctChars / totalChars) * 100;
    charAcc = parseFloat(charAcc).toFixed(1);
    document.getElementById('stats_charAcc').innerText = charAcc + "%";
}

function showError() {
    $('div.passageInput_miss').css('display', 'flex');
    $('div.passageInput_miss').hide();
    $('div.passageInput_miss').fadeIn(250).fadeOut(250);
}

function calcWPM() {
    //Count a word as 5 characters
    console.log("correctChars=>" + correctChars);
    let wordsEstimate = correctChars / 4;
    WPM = (wordsEstimate / timeElapsed)*60;
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
        endTest();
    }
}

function endTest() {
    $('div.passage_Container').slideUp(250);
    $('div.passageInput_Container').slideUp(250);
    $('div.endgame_Container').fadeIn(500);
    $('div.endgame_Container').css('display', 'flex');
}

function reload() {
    location.reload();
}

function updateWordsRemaining() {
    wordsRemaining = words.length;
    //document.getElementById('stats_wordsRemaining').innerText = wordsRemaining;
}

function begin() {
    $('div.passageInput_hint').remove();
    $('div.stats_Container').fadeIn(500);
    $('div.stats_Container').css('display', 'flex');
}

passageInput.addEventListener('input', () => {

    if(!inProgress)
    {
        begin();
        updateWordsRemaining();
        beginTest();
    }

    if(passageInput.value == words[0] || passageInput.value == words[0] + " ") {
        $("div.word:nth-child(1)").css('color', 'green');
    } else {
        $("div.word:nth-child(1)").css('color', 'white');
    }

    const lastChar = passageInput.value.charAt(passageInput.value.length - 1);

    if(lastChar == ' ')
    {
        correctChars += 1;
        submitWord(passageInput.value);
        updateWordsRemaining();
    }
    
    document.getElementById('stats_totalChars').innerText = correctChars;
});