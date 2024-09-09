// Minimise use of global scope variables!

const playGame = function() {

const popupOverlay = document.getElementById('popupOverlay');

function displayPopUp() {
    popupOverlay.style.display = 'block';   
}

displayPopUp();
// Factory function to create a user 

const createPlayer = function () {
    let playerA = document.getElementById("popupP1-name");
    let playerB = document.getElementById("popupP2-name");

    const playerAInput = document.getElementById("player-one-display");
    const playerBInput = document.getElementById("player-two-display");

    playerA.addEventListener("keyup", showNameOne);
    playerB.addEventListener("keyup", showNameTwo);

    function showNameOne() {
        playerAInput.innerHTML = `OO_${playerA.value}_OO`;
    } 
    function showNameTwo() {
        playerBInput.innerHTML = `OO_${playerB.value}_OO`;
    }
}
createPlayer();

// Pop up form 

const submitBtn = document.querySelector('.btn-submit-popup');

function validatePopUp() {
    let x = document.getElementById("popupP1-name").value;
    let y = document.getElementById("popupP2-name").value;
    if (x == "" || y == "") { // conditional statement that only validates form if two player names are specified
        alert("Please enter your names in the fields provided!")
        console.log("Not validated");
    } else {
    popupOverlay.style.display = 'none';
    }
}

submitBtn.onclick = function(e) {
    e.preventDefault();
    validatePopUp();
}


// Store the gameboard as an array inside of a Gameboard object

let board; // create a grid variable
let gameOver = false;
let counterCols = [5,5,5,5,5,5,5]; // assign a new array to mark height of each of our columns => rows[0-5] each col

const startRound = function () {
    board = [];
    let rows = 6;
    let columns = 7;
    for (r = 0; r < rows; r++) {
        let row = []; // create a variable as an array to append new elements and push into new array
        for (c = 0; c < columns; c++) {
            row.push(" ");
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = r.toString() + "-" + c.toString(); // each id contains coordinates i.e "0-0" => so we can check index directions and matching sequence
            // Functions that allow players to add marks to a specific spot on the board 
            cell.addEventListener("click", placeMarker);
            document.getElementById("board").append(cell);
        }
    board.push(row); // append row array to the board array
    }
}

startRound(); // CALL THE OBJECT


// Functions that allow players to add marks to a specific spot on the board 
// by interacting with the appropriate DOM elements (e.g. letting players click on a board square to place their marker)
// Stop players from playing in spots that are already taken


let playerOne = "Red"; // must set value otherwise will be undefined
let playerTwo = "Yellow";
let turns = 0;
let currentPlayer = playerOne;
let foundWinner;


function placeMarker() {
    // if game has ended, function does not operate further than breakpoint
    if(gameOver) {
        return;
    }
    let coordinates = this.id.split("-"); // coords "0-0" become ["0", "0"] -> [0] => rows, [0] => columns
    let r = parseInt(coordinates[0]); 
    let c = parseInt(coordinates[1]); // convert r and c back to integers

    r = counterCols[c]; // gets the row of the column's current height
    if (r < 0) {
        return;     // r < 0 means column is filled so do not return anything
    }
    board[r][c] = currentPlayer; // coordinates set to current player
    let cell = document.getElementById(r.toString() + "-" + c.toString()); // referring to specific coords of clicked cell - has to be stringified back
    if (currentPlayer == playerOne) {
        cell.classList.add("red-counter"); // assigning {background-color: red;} in css
        cell.classList.add("drop"); // adding drop animation to counter
        turns++;
        currentPlayer = playerTwo; // alternates each go between red and yellow player
    } else {
        cell.classList.add("yellow-counter");
        cell.classList.add("drop");
        turns++;
        currentPlayer = playerOne; // alternate turns
    }
    r -= 1; // each time we place a marker, we are moving up height of row on the column = > [5,5] to [4,5] etc.
    counterCols[c] = r; // updating array of the counter column to new the row height

    checkWinner();
}


// CHECK WINNER

/* My grid
[
    [x, 0, 0, 0, 0, 0, 0],
[r] [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [x, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [x, 0, 0, 0, 0, 0, 0]

    [c]
]
board[row=0-5][col=0-6] with board[0][0] - the 1st coordinate being in the top left */

// check 4 in a row
// horizontally, vertically and diagonally in all directions


const checkWinner = function() {
    
    //horizontally
    for(let r = 0; r < 6; r++){
        for(let c = 0; c < 4; c++) {
            if(board[r][c] != ' ') { // v.important => otherwise checkwinner declared as soon as 1st marker placed
                if(board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2] == board[r][c+3]) {
                    winningPlayer(r,c);
                    foundWinner = true;
                    return;
                } 
            } 
        }
    }
    // vertically 
    for(let r = 0; r < 3; r++){
        for(let c = 0; c < 7; c++) {
            if(board[r][c] != ' ') { 
                if(board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]) {
                    winningPlayer(r,c);
                    foundWinner = true;
                    return;
                } 
            } 
        }
    }
    // diagonal (across and up)
    for(let r = 0; r < 3; r++){
        for(let c = 0; c < 4; c++) {
            if(board[r][c] != ' ') { 
                if(board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3][c+3]) {
                    winningPlayer(r,c);
                    foundWinner = true;
                    return;
                } 
            } 
        }
    }
    // diagonal (up and across)
    for(let r = 3; r < 6; r++){
        for(let c = 0; c < 4; c++) {
            if(board[r][c] != ' ') { 
                if(board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]) {
                    winningPlayer(r,c);
                    foundWinner = true;
                    return;
                } 
            } 
        }
    }
    checkDraw();
} 

function winningPlayer(r,c) {

    let resultMessage = document.getElementById("result-message");
    let matchesWonP1 = document.getElementById("wins-message-P1");
    let matchesWonP2 = document.getElementById("wins-message-P2");


    if(board[r][c] == playerOne) {
        resultMessage.innerHTML = 'Player One Wins!!!';
        matchesWonP1.innerHTML = `Winner: ${playerOne}`;
        matchesWonP1.style.color = 'red';
        return;
    } else if(board[r][c] == playerTwo) {
        resultMessage.innerHTML = 'Player Two Wins!!!';
        matchesWonP2.innerHTML = `Winner: ${playerTwo}`;
        matchesWonP2.style.color = 'yellow';
        return;
    } 
    gameOver = true; // breaks placeMarker() function which prevents constant looping through logic
}

// check draw

function checkDraw() {
    // 42 places on grid, 42 turns
    if(turns > 41 && !foundWinner == true) {
        document.getElementById("result-message").innerHTML = 'It\'s a Draw!!!';
        gameOver = true;
        return;
    } 
}

// Restart Button resets the elements' content, and loops through playGame() when clicked

const restartBtn = document.getElementById("restartBtn");

restartBtn.addEventListener("click", function() {
    document.getElementById("board").innerHTML = '';
    document.getElementById("popupP1-name").value = '';
    document.getElementById("popupP2-name").value = '';
    document.getElementById("player-one-display").innerHTML = '';
    document.getElementById("player-two-display").innerHTML = '';
    document.getElementById("wins-message-P1").innerHTML = 'Winner: ';
    document.getElementById("wins-message-P1").style.color = 'white';
    document.getElementById("wins-message-P2").innerHTML = 'Winner: ';
    document.getElementById("wins-message-P2").style.color = 'white';
    document.getElementById("result-message").innerHTML = '';
    playGame();
})

}


// All logic stored in one variable and can be called effortlessly from any point in the code

playGame();

