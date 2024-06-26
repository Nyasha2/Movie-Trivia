
/**
 * CS 132
 * Author: Nyasha Makaya
 * CP 2: Tic Tac Toe
 * Contains the game functionality functions allowing to play 
 * tic tac toe between two players
 */

(function(){
    /**
     * Varius global variables for the tic tac toe game
     */
    let currentPlayer = 'O';
    let grid = ['', '', '', '', '', '', '', '', ''];
    let boxes = document.querySelectorAll('.box');
    const winningStates = [
        [0, 1, 2], 
        [3, 4, 5], 
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    /**
     * This function adds event listeners to buttons and the grid
     * boxes of the tic tac toe game
     */
    function init() {
        let restartBtn = document.querySelectorAll('.restart');
        restartBtn.forEach(button => {
            button.addEventListener("click", restart);
        });

        for (let i=0; i < boxes.length; i++){
            let box = boxes[i];
            box.addEventListener("click", () => {
                play(box);
            });
            box.addEventListener("dblclick", () => {
                clear(box);
            })
        }
    }

    /**
     * This function clears all the stylings from a box on a tic tac
     * toe 
     * @param {box} the grid box element in the tic tac toe grid
     */
    function clear(box) {
        box.classList.add("styled");
    }

    /**
     * This function marks a box on the tic tac toe grid when it is clicked
     * It also calls the functions to check if the game is over
     * @param {box} A box that has been clicked on the grid. 
     */
    function play(box){
        const index = box.dataset.index;

        if (grid[index] === '') {
            box.innerText = currentPlayer;
            grid[index] = currentPlayer;
            box.removeEventListener("click", () => {
                play(box);
            });

            if (currentPlayer === 'X'){
                currentPlayer = 'O';
                console.log(currentPlayer);
            }
            else {
                currentPlayer = 'X';
                console.log(currentPlayer);
            }

            isGameOver()
        }
    }

    /**
     * Checks if one of the players have formed a straight line
     * or if the the game has drawn.
     * @returns nothing
     */
    function isGameOver(){
        let filledX = [];
        let filledO = [];
        let text = document.getElementById('winner');

        for (let i = 0; i < grid.length; i++){
            if (grid[i] === 'X'){
                filledX.push(i);
            }

            if (grid[i] === 'O'){
                filledO.push(i);
            }
        }
        
        for (let j = 0; j < winningStates.length; j++){
            let state = winningStates[j];

            if (checkState(state, filledX)){
                text.innerText = "Player X Won";
                toggleView();
                return;
            }

            if (checkState(state, filledO)){
                toggleView();
                text.innerText = "Player O Won";
                return;
            }

        }

        //Check for draw
        let draw = true;
        grid.forEach(value => {
            if (value === ''){
                draw = false;
                return;
            }
        });

        if (draw){
            toggleView();
            let wink = document.createElement("p");
            wink.textContent = "Wink Wink ;)";
            let parent = getElementById("game-over");
            parent.addChild(wink);
            text.innerText = "Issa Draaawwww";
        }
    }

    /**
     * This functions checks if a player has completed a straight 
     * line on the grid
     * @param {state} an array with indexes representing the 
     * winning state.
     * @param {filled} an array with indices of all the boxes on
     * the grid that has been filled yet
     * @returns true if the game state is a winning state, and 
     * false otherwise.
     */
    function checkState(state, filled){
        let count = 0
        for (let i = 0; i < state.length; i++){
            let val = state[i];
            filled.forEach(filled => {
                if (filled === val){
                    count = count + 1;
                }
            })
        }

        if (count === 3){
            return true;
        }

        return false;
    }

    /**
     * This function re-initialises the game resources and 
     * restarts the game state.
     */
    function restart(){
        currentPlayer = 'O';
        grid = ['', '', '', '', '', '', '', '', ''];
        boxes.forEach(box => {
            box.innerText = '';
            box.classList.remove("styled");
        });
        
        toggleView();
    }

    /**
     * This functions changes from menu view to game view when the start
     * button is clicked, and vice versa when the menu button is clicked.
     */
    function toggleView(){
        let mainView = document.getElementById("main-view");
        let gameOver = document.getElementById("game-over");
        
        if (mainView.className === "hidden"){
            mainView.classList.remove("hidden");
            gameOver.classList.add("hidden");
        }
        else{
            mainView.classList.add("hidden");
            gameOver.classList.remove("hidden"); 
        }
    }

    init();
})();


