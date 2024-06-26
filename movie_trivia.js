
/**
 * CS 132
 * Author: Nyasha Makaya
 * CP3: The movie trivia
 * Contains the javascript and API functionality of the
 * Movie trivia app
 */


(function(){
    "use strict";

    /**
     * Global variables for the program
     */
    let timerId = null;
    let secondsRemaining;
    let score = 0;
    let TOTAL_QUESTIONS = 0;
    const API_KEY = "68690d8f";
    const BASE_URL = "http://www.omdbapi.com/"
    const MOVIES = ['Inception', 'The Dark Knight', 
    'Interstellar', 'Fight Club', 'The Matrix', 
    "The Shawshank Redemption",
    "The Godfather",
    "The Dark Knight",
    "Pulp Fiction",
    "Forrest Gump",
    "Inception",
    "Fight Club",
    "The Matrix",
    "The Lord of the Rings: The Return of the King",
    "Star Wars: Episode IV - A New Hope",
    "The Silence of the Lambs",
    "Jurassic Park",
    "Titanic",];
    const DIRECTORS = ['Steven Spielberg', 'Martin Scorsese', 
    'Quentin Tarantino', 'Christopher Nolan', 'James Cameron'];
    let ANSWER ='';


    /**
     * This function adds event listeners to both the start button
     * and the menu button so that toggleView functio is called
     * when either of them is clicked. It does not have any parameters.
     */
    function init() {
        let startButton = document.getElementById("start-btn");
        startButton.addEventListener("click", toggleView);
        startButton.addEventListener("click", initHeadBoard);
        startButton.addEventListener("click", generateQuestion);

        let backButton = document.getElementById("back-btn");
        backButton.addEventListener("click", toggleView);
        //may need to be changed
        backButton.addEventListener("click", restart);

        let nextBtn = qs("#next");
        nextBtn.addEventListener("click", checkAnswer);
        
    }

    /**
     * gets a random movie title from the API
     * @returns a movie title
     */

    function getMovieTitle(){
        return MOVIES[Math.floor(Math.random() * MOVIES.length)];
    }

    /**
     * Generates a question using the movie title
     */
    function generateQuestion(){
        let title = getMovieTitle();
        let url = BASE_URL + `?t=${title}` + `&apikey=${API_KEY}`;
        fetch(url)
        .then(checkStatus)
        .then(function(response){
            return response.json();
        })
        .then(loadQuestion)
        .catch(error => console.log('Error:', error));
    }

    /**
     * given data about a movie generates a question and loads
     * it to the website
     * @param {object} data the data about the movie
     */

    function loadQuestion(data){
        let director = data.Director;
        let quiz = qs("#question")
        ANSWER = director;
        let answers = wrongAnswers("directors", director);
        answers = shuffleAnswers(answers);
        answers.push(director);

        quiz.innerHTML = `
        <p>Who was the director of ${data.Title}?<p>
        <div id="answers">
            ${answers.map(answer => `
                <label>
                <input type="radio" name="answer" value="${answer}">
                ${answer}
                </label><br>
            `).join('')}   
        </div>
        `;

        TOTAL_QUESTIONS += 1;
    }

    /**
     * generates a list of wrong answers for a question
     * @param {category} category 
     * @param {*answer} answer 
     * @returns a list of wroing answers
     */
    function wrongAnswers(category, answer){
        if (category === "directors"){
            let list = DIRECTORS;
            return list.filter(director => director !== answer).slice(0, 3);
        }
    }

    /**
     * Shuffle an array of answers
     * @param {*array} array of answers
     * @returns a shuffled array
     */
    function shuffleAnswers(array){
        let idx = Math.floor(Math.random() * array.length);
        let otherAnswer = array[idx];
        array[idx] = array[0];
        array[0] = otherAnswer;
        return array;
    }

    /**
     * This functions initializes the assembly display, the ordeList
     * and the timer so that a new game can start
     */
    function restart(){
        clearInterval(timerId);
        qs("#question").innerHTML = '';
        score = 0;
        qs("#score").textContent = score;
        toggleView();
    }

    /**
     * Ends the game when the play is over
     */
    function endGame(){
        let gameOver = qs("#game-over");
        gameOver.innerHTML = `
        <h2>GAME OVER</h2>
        <div>
            <p>SCORE: ${score} / ${TOTAL_QUESTIONS}
        `
        gameOver.classList.remove("hidden");
        qs("#game-play").classList.add("hidden");
        setTimeout(() =>{
            qs("#game-play").classList.remove("hidden");
            gameOver.classList.add("hidden");
            restart();
            toggleView();
        }, 1000);

    }

    /**
     * This function initializes the header in the gameview section
     * by initializing the score, the timer
     */
    function initHeadBoard(){
        timerId = setInterval(advanceTimer, 1000);
        // let timerOption = document.getElementsByTagName("select");
        let selectTime = document.getElementById("timer");
        secondsRemaining = selectTime.options[selectTime.selectedIndex].value;
        displayTime(secondsRemaining);
    }

    /**
     * This function display the time in 00:00 format
     * @param {time} this is the total time remaining in seconds
     */
    function displayTime(time){
        let minutes = String(Math.floor(time / 60)).padStart(2, '0');
        let seconds = String(time % 60).padStart(2, '0');
        qs("#timer-display").innerText = minutes + ":" + seconds;
    }

    /**
     * This function carries out the countdown of the timer for the game
     * and destroys the timer if the time is up
     */
    function advanceTimer(){
        if (secondsRemaining === 0){
            clearInterval(timerId);
            endGame()
        }
        else{
            secondsRemaining -= 1;
            displayTime(secondsRemaining);
        }
    }


    /**
     * This function clears the order list, and creates another order list
     * for the next order. it also updates the score and clears the assembly,
     * including enabling the ingredients list so that users can use it again
     */
    function setupNextQuestion(inc){
        qs("#question").innerHTML = '';
        generateQuestion();
        score += inc;
        qs("#score").textContent = score;
    }

    /**
     * This function checks if the ingredients on the assembly match the order list
     * @returns {isMatching} true or false depending on whether it is matching or not
     */
    function checkAnswer(){
        let selected = qs('input[name="answer"]:checked');
        if (selected.value === ANSWER){
            setupNextQuestion(1);
        }
        else{
            setupNextQuestion(0);
        }
    }

    /**
     * This functions changes from menu view to game view when the start
     * button is clicked, and vice versa when the menu button is clicked.
     */
    function toggleView(){
        let homePage = document.getElementById("home-page");
        let gamePlay = document.getElementById("game-play");
        
        if (homePage.className === "hidden"){
            homePage.classList.remove("hidden");
            gamePlay.classList.add("hidden");
        }
        else{
            homePage.classList.add("hidden");
            gamePlay.classList.remove("hidden"); 
        }
    }

    /**
     * returns the first elemeent matching the passed CSS selector
     * @param {string} selector 
     * @returns {object} first such element
     */
    function qs(selector) {
        return document.querySelector(selector);
    }

    /**
     * returns an array of elements matching the passed css selector
     * @param {string} selector - the passed css selector
     * @returns {object[]} the array of such elements
     */
    function qsa(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Helper function to return the Response data if successful, otherwise
     * returns an Error that needs to be caught.
     * @param {object} response - response with status to check for success/error.
     * @returns {object} - The Response object if successful, otherwise an Error that
     * needs to be caught.
     */
    function checkStatus(response) {
        if (!response.ok) { // response.status >= 200 && response.status < 300
            throw Error(`Error in request: ${response.statusText}`);
        } // else, we got a response back with a good status code (e.g. 200)
        return response; // A resolved Response object.
    }

    init();
})();


