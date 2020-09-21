/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let playing = false; // game currently started: true or false
let board = []; // array of rows, each row is array of cells  (board[y][x])
const topButton = document.getElementById("top-button");
const results = document.getElementById("results");

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let i = 0; i < HEIGHT; i++) {
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");

  // create top row, which listens for clicks
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // add cells to top row
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // make and add lower 6 rows
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] === undefined) return y;
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  let newPiece = document.createElement("div");
  newPiece.classList.add("piece");
  newPiece.classList.add(`color${currPlayer}`);
  newPiece.classList.add("drop");

  let targetTd = document.getElementById(`${y}-${x}`);
  targetTd.appendChild(newPiece);
}

/** endGame: announce game end */

function endGame(msg) {
  results.classList.toggle("hidden");
  playing = false;
  results.innerText = msg + " Reset?";

  topButton.classList.remove("start");
  topButton.classList.remove("p1-turn");
  topButton.classList.remove("p2-turn");
  topButton.classList.add("game-complete");
  topButton.innerText = "Game Complete";
}

//** reset: clear in-memory board, redraw HTML table, set current player to 1, hide results button, reset top button */

function reset() {
  document.getElementById("board").innerHTML = "";
  makeHtmlBoard();
  board = [];
  makeBoard();
  currPlayer = 1;
  results.classList.toggle("hidden");

  topButton.classList.remove("p1-turn");
  topButton.classList.remove("p2-turn");
  topButton.classList.remove("game-complete");
  topButton.classList.add("start");
  topButton.innerText = "Start Game";
}

//** start: set playing = true, set top-button to read "Player 1's Turn" */
function start() {
  playing = true;
  topButton.classList.remove("start");
  topButton.classList.remove("p2-turn");
  topButton.classList.add("p1-turn");
  topButton.innerText = "Player 1's Turn";
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // if game not started, ignore click
  if (playing === false) return;

  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`${currPlayer === 1 ? "Red player" : "Yellow player"} won!`);
  }

  // check for tie
  if (checkForTie()) endGame(`It's a tie!`);

  // switch players
  if (currPlayer === 1) {
    currPlayer = 2;
    topButton.classList.remove("p1-turn");
    topButton.classList.add("p2-turn");
    topButton.innerText = "Player 2's Turn";
  } else {
    currPlayer = 1;
    topButton.classList.remove("p2-turn");
    topButton.classList.add("p1-turn");
    topButton.innerText = "Player 1's Turn";
  }
}

/** handleTopButtonClick: if button says Start Game, start(); otherwise, do nothing */

function handleTopButtonClick() {
  if (topButton.classList.contains("start")) {
    start();
  }
}

/** checkForTie: check board cell-by-cell for empty cells; if any found, return false, else return true */

function checkForTie() {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (board[y][x] === undefined) return false;
    }
  }
  return true;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Iterate first through all rows...
  for (let y = 0; y < HEIGHT; y++) {
    // ...then through all columns...
    for (let x = 0; x < WIDTH; x++) {
      // check 4 spaces horizontally from cell, inclusive
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      // check 4 spaces vertically from cell, inclusive
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      // check 4 spaces diagonally down right from cell, inclusive
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      // check 4 spaces diagonally down left from cell, inclusive
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      // if any of those is a win, return true
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();

results.addEventListener("click", reset);
topButton.addEventListener("click", handleTopButtonClick);
