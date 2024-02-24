$(document).ready(function() {
    // Fetch and display the target word upon window load
    fetchTargetWord()
        .then(word => {
            gameState.targetWord = word;
            console.log(`Psst! ... The target word is: ${gameState.targetWord}`);
            initializeGameBoard();
            initializeKeyboard();
        })
        .catch(error => {
            console.error("Failed to load the word:", error);
        });

    // Listen for physical keyboard presses
    $(document).on('keyup', handleKeyPress);
});

// Global game settings and state variables
const gameSettings = {
    height: 6, // Number of attempts allowed
    width: 5, // Length of the target word
};
let gameState = {
    currentAttempt: { row: 0, col: 0 },
    gameOver: false,
    targetWord: "",
};

// Fetch a random word from an API using jQuery AJAX
function fetchTargetWord() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://random-word-api.herokuapp.com/word?length=5",
            type: 'GET',
            success: function(data) {
                resolve(data[0].toUpperCase());
            },
            error: function(xhr, status, error) {
                reject(error);
            }
        });
    });
}

// Initialize the game board
function initializeGameBoard() {
    for (let row = 0; row < gameSettings.height; row++) {
        for (let col = 0; col < gameSettings.width; col++) {
            const tile = $('<span>').attr('id', `${row}-${col}`).addClass("tile");
            $('#board').append(tile);
        }
    }
}

// Initialize the keyboard
function initializeKeyboard() {
    const layout = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
    ];

    layout.forEach((row, index) => {
        const rowElement = $('<div>').addClass(index === 1 ? "keyboard-row-middle" : "keyboard-row-topbottom");
        row.forEach(key => {
            createKeyElement(key, rowElement);
        });
        $('#keyboard').append(rowElement);
    });
}

// Create a single key element
function createKeyElement(key, parentElement) {
    const keyElement = $('<div>').text(key).attr('id', key === "Enter" || key === "⌫" ? key : `Key${key}`).addClass(key === "Enter" ? "enter-key-tile" : "key-tile");
    keyElement.on('click', function() {
        handleKeyPress({ code: keyElement.attr('id') });
    });
    parentElement.append(keyElement);
}

// Handle key press actions
function handleKeyPress(event) {
    if (gameState.gameOver) return;

    const action = getKeyAction(event.code);

    if (action === 'addLetter' && gameState.currentAttempt.col < gameSettings.width) {
        addLetterToBoard(event.code[3]);
    } else if (action === 'removeLetter') {
        removeLetterFromBoard();
    } else if (action === 'submitGuess') {
        submitGuess();
    }
}

// Determine the action based on the key code
function getKeyAction(keyCode) {
    if (keyCode.startsWith("Key")) return 'addLetter';
    if (keyCode === "Backspace") return 'removeLetter';
    if (keyCode === "Enter") return 'submitGuess';
    return null;
}

// Add a letter to the board
function addLetterToBoard(letter) {
    const tile = $(`#${gameState.currentAttempt.row}-${gameState.currentAttempt.col}`);
    tile.text(letter);
    gameState.currentAttempt.col += 1;
}

// Remove a letter from the board
function removeLetterFromBoard() {
    if (gameState.currentAttempt.col > 0) {
        gameState.currentAttempt.col -= 1;
        const tile = $(`#${gameState.currentAttempt.row}-${gameState.currentAttempt.col}`);
        tile.text('');
    }
}

// Submit the current guess
function submitGuess() {
    let guess = '';
    for (let col = 0; col < gameSettings.width; col++) {
        guess += $(`#${gameState.currentAttempt.row}-${col}`).text();
    }

    if (guess.length < gameSettings.width) return; // Ensure the guess is complete

    // Check if the guess matches the target word
    if (guess === gameState.targetWord) {
        alert("Congratulations! You've guessed the word!");
        gameState.gameOver = true;
        applyColorToTiles(guess); // Apply color for the correct guess
    } else {
        checkWordValidity(guess)
            .then(isValidWord => {
                if (!isValidWord) {
                    alert("Not a valid word.");
                    return;
                }
                applyColorToTiles(guess); // Apply colors based on letter accuracy
                proceedToNextAttempt();
            });
    }
}


// After submitting a guess and checking its validity
function applyColorToTiles(guess) {
    for (let i = 0; i < guess.length; i++) {
        const guessedLetter = guess[i];
        const tile = $(`#${gameState.currentAttempt.row}-${i}`);
        // Check if the letter is in the correct position
        if (guessedLetter === gameState.targetWord[i]) {
            tile.addClass('correct');
        } 
        // Check if the letter is present in the word but in the wrong position
        else if (gameState.targetWord.includes(guessedLetter)) {
            tile.addClass('present');
        } 
        // If the letter is not in the word
        else {
            tile.addClass('absent');
        }
    }
}


function checkWordValidity(word) {
    return new Promise((resolve) => {
        $.ajax({
            url: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
            type: 'GET',
            success: function(data) {
                // If the data is an array with at least one entry, the word is valid
                resolve(Array.isArray(data) && data.length > 0);
            },
            error: function() {
                // If the API call fails (e.g., word not found), resolve false
                resolve(false);
            }
        });
    });
}

// Proceed to the next attempt
function proceedToNextAttempt() {
    if (gameState.currentAttempt.row < gameSettings.height - 1) {
        gameState.currentAttempt.row += 1;
        gameState.currentAttempt.col = 0;
    } else {
        alert(`Game Over! The word was ${gameState.targetWord}.`);
        gameState.gameOver = true;
    }
}
