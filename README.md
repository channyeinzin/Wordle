# Wordle Clone - JavaScript Implementation

## Contents

- [Overview](#overview)
- [Game Process Description](#game-process-description)
- [Functions Review](#functions-review)

## Overview

Welcome to the JavaScript implementation of the Wordle Clone game! This version of the game is built entirely in JavaScript and provides a fun and interactive way to play the classic word guessing game. In this section, we'll provide an overview of how the game works and highlight its key features.

## Game Process Description

The Wordle game follows a simple yet engaging process:
1. The game initializes the game board and virtual keyboard, allowing players to input their guesses.
2. A random five-letter target word is retrieved through a public API.
3. Players input their guesses and submit them by pressing "Enter".
4. The game validates the guess using a dictionary API and provides feedback on correctness.
5. If the guess is correct, the player wins; otherwise, they continue guessing until they run out of attempts.

## Functions Review

Let's delve into the core functions responsible for driving the gameplay:

- **fetchTargetWord()**: Retrieves a random five-letter word from a public API. Returns the uppercase version of the word upon success.

- **initializeGameBoard()**: Sets up the game board UI elements, creating a 6x5 grid for displaying the target word and player guesses.

- **initializeKeyboard()**: Creates the virtual keyboard UI elements, allowing players to input guesses using an on-screen keyboard.

- **handleKeyPress(event)**: Listens for key presses on both physical and virtual keyboards. Handles player input and triggers corresponding actions based on the pressed key.

- **addLetterToBoard(letter)**: Adds a letter to the game board at the current position based on player input.

- **removeLetterFromBoard()**: Removes the last entered letter from the game board, allowing players to correct their guesses.

- **submitGuess()**: Submits the current guess for validation and provides feedback on correctness. Handles game over conditions and redirects players accordingly.

These functions work together seamlessly to provide an interactive and enjoyable gaming experience for players.

