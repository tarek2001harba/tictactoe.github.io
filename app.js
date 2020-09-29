//? VARIABLE
const body = document.querySelector('body');
const container = document.querySelector('.container');
const blocks = document.querySelectorAll('.block');
const modalContainer = document.querySelector('.modalContainer');
const modal = document.querySelector('.modal');
const title = document.querySelector('.title');
const titleHeader = document.querySelector('.title h1');
const options = document.querySelector('.options');
const optionTitle = document.querySelectorAll('.option h2');
const optionImg = document.querySelectorAll('.option img');
const scoreSpans = document.querySelectorAll('.score');
const resetButton = document.querySelector('#reset');
let svgs;
//! calm blue, bright gradient, cloudy pink, orange, green
const themeColors = ['background: #005C97;background: -webkit-linear-gradient(to right, #363795, #005C97);  background: linear-gradient(to right, #363795, #005C97);', 
                    'background: #5433FF; background: -webkit-linear-gradient(to right, #A5FECB, #20BDFF, #5433FF); background: linear-gradient(to right, #A5FECB, #20BDFF, #5433FF);', 
                    'background: #A770EF; background: -webkit-linear-gradient(to right, #FDB99B, #CF8BF3, #A770EF); background: linear-gradient(to right, #FDB99B, #CF8BF3, #A770EF);',
                    'background: #FF5F6D; background: -webkit-linear-gradient(to right, #FFC371, #FF5F6D); background: linear-gradient(to right, #FFC371, #FF5F6D);',
                    'background: #159957; background: -webkit-linear-gradient(to right, #155799, #159957); background: linear-gradient(to right, #155799, #159957);'];
const mainColors = ['background: #005C97;', 'background: #5433FF;', 'background:  #A770EF;', 'background: #FF5F6D;', 'background: #159957;'];
let board = [['', '', ''],
             ['', '', ''],
             ['', '', '']];
let scores;
let currentPlayerType;
let prevPlayerType
let playerType;
let ai;
let playMode;
let svgElem;
let addedList = [];
let indexOfBlock;
//? Setup
modalContainer.style.opacity = '0';
modal.style.translateY = '1000px';
randomTheme(Math.floor(Math.random() * themeColors.length));
changeContent('Pick a Type:', 'Single Player', 'Multiplayer', '1.5rem');
optionImg[0].src = './img/single-player.svg';
optionImg[1].src = './img/multiplayer.svg';
optionImg[1].style.width = '95px';
optionImg[1].style.margin = '1rem';
//? EVENT LISTENERS
container.addEventListener('click', play);
container.addEventListener('mouseover', hoverType);
container.addEventListener('mouseout', (e) => {
    if(prevPlayerType === 'x'){
        e.target.classList.remove('X_CLASS');
    }
    else{
        e.target.classList.remove('O_CLASS');
    }
});
options.addEventListener('click', pickOptions);
resetButton.addEventListener('click', reset);
window.addEventListener('load', modalAnim(0, 1, false, true, 500));
//? FUNCTIONS
//* to add the sign to the board and prepare for the next play
function play(e){
    if(e.target !== container && addedList.includes(e.target) !== true && e.target.nodeName === 'DIV'){
        svgElem = (currentPlayerType === 'o') ?
        '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><g><path class="oPath" d="m12.5,50c0,-20.71823 16.78177,-37.5 37.5,-37.5c20.71823,0 37.5,16.78177 37.5,37.5c0,20.71823 -16.78177,37.5 -37.5,37.5c-20.71823,0 -37.5,-16.78177 -37.5,-37.5z" stroke-opacity="null" stroke-linecap="null" stroke-linejoin="null" stroke-width="25" stroke="#fff" fill-opacity="null" fill="none"/></g></svg>' :
        '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><g><path id="xPathOne" stroke="#fff" id="svg_21" d="m10.5,10.5l79.99999,85" stroke-opacity="null" stroke-linecap="undefined" stroke-linejoin="undefined" stroke-width="25" fill-opacity="null" fill="none"/><path id="xPathTwo" stroke="#fff" transform="rotate(4.063658714294434 49.00000762939454,50.99999618530273) " d="m86.30073,7.64445l-74.60144,86.7111" stroke-opacity="null" stroke-linecap="undefined" stroke-linejoin="undefined" stroke-width="25" fill-opacity="null" fill="none"/></g></svg>';
        draw(e.target);
        svgs = document.querySelectorAll('svg');
        let avaliableMoves = isAvaliableMoves();
        if(playMode === 'single' && avaliableMoves && !checkWin()){
            currentPlayerType = ai;
            svgElem = (currentPlayerType === 'o') ?
            '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><g><path class="oPath" d="m12.5,50c0,-20.71823 16.78177,-37.5 37.5,-37.5c20.71823,0 37.5,16.78177 37.5,37.5c0,20.71823 -16.78177,37.5 -37.5,37.5c-20.71823,0 -37.5,-16.78177 -37.5,-37.5z" stroke-opacity="null" stroke-linecap="null" stroke-linejoin="null" stroke-width="25" stroke="#fff" fill-opacity="null" fill="none"/></g></svg>' :
            '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><g><path id="xPathOne" stroke="#fff" id="svg_21" d="m10.5,10.5l79.99999,85" stroke-opacity="null" stroke-linecap="undefined" stroke-linejoin="undefined" stroke-width="25" fill-opacity="null" fill="none"/><path id="xPathTwo" stroke="#fff" transform="rotate(4.063658714294434 49.00000762939454,50.99999618530273) " d="m86.30073,7.64445l-74.60144,86.7111" stroke-opacity="null" stroke-linecap="undefined" stroke-linejoin="undefined" stroke-width="25" fill-opacity="null" fill="none"/></g></svg>';
            let aiMove = findBestMove(board);
            draw(blocks, aiMove.row, aiMove.col);
        }
        if(checkWin()){
            container.style.cursor = 'not-allowed';
            changeContent('Player ' + currentPlayerType.toString().toUpperCase() + ' Won!!', '', '', '3rem', true);
            updateScore(currentPlayerType);
            winDrawAnim();
            setTimeout(() => container.style.cursor = 'pointer', 1500);
        }
        else if(checkWin() === false && avaliableMoves === false){
            changeContent('Draw.', '', '', '3rem', true);
            winDrawAnim();
        }
        if(playMode === 'multi'){
            currentPlayerType = (checkWin()) ? currentPlayerType : (currentPlayerType ==='o') ? 'x' : 'o';
        }
        else{
            currentPlayerType = playerType;
        }
    }
}
//* adds a shadowed current playe type on the hovered block
function hoverType(e){
    prevPlayerType = currentPlayerType;
    if(addedList.includes(e.target) === false){
        if(currentPlayerType === 'x'){
            e.target.classList.add('X_CLASS');
        }
        else{
            e.target.classList.add('O_CLASS');
        }
    }
}
//* a function that will check the current status of the game either win, draw, or nothing
function checkWin(){
    //* checking for win
    //? rows
    if(evalute() === 10 || evalute() === -10){
        return true;
    }
    return false;
}
function evalute(){
    //? rows
    for(let i = 0; i < 3; i++){
        if((board[i][0] === board[i][1] && board[i][0] === board[i][2]) && board[i][0] !== ''){
            if(board[i][0] === ai){
                return +10;
            }
            else{
                return -10;
            }
        }
    }
    //? columns
    for(let j = 0; j < 3; j++){
        if((board[0][j] === board[1][j] && board[1][j] === board[2][j]) && board[0][j] !== ''){
            if(board[j][0] === ai){
                return +10;
            }
            else{
                return -10;
            }
        }
    }
    //? digonals
    if(board[0][0] === board[1][1] && board[0][0] === board[2][2] && board[0][0] !== ''){
        if(board[0][0] === ai){
            return +10;
        }
        else{
            return -10;
        }
    }
    else if(board[0][2] === board[1][1] && board[0][2] === board[2][0] && board[0][2]!== ''){
        if(board[0][2] === ai){
            return +10;
        }
        else{
            return -10;
        }
    }
    return 0;
}
//? Game bot / AI
function minimaxBot(board, depth, isMaximizing){
    let score = evalute();
    //* return the maximizer's score if there was a win
    if(score === 10){
        return score;
    }
    //* return the minimizer's score if there was a win
    if (score == -10){
        return score; 
    }
    if(isAvaliableMoves() === false){
        return 0;
    }
    if(isMaximizing){
        let best = -1000;
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                //? Check if cell is empty 
                if (board[i][j] === '') 
                { 
                    //? Make the move 
                    board[i][j] = ai; 
                    //? Call minimax recursively and choose 
                    //? the maximum value 
                    best = Math.max(best, minimaxBot(board, depth+1, false)); 
                    //? Undo the move 
                    board[i][j] = ''; 
                } 
            }
        }
        return best;
    }
    //* if it's the minimizer's move
    else{
        let best = 1000;
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                //? Check if cell is empty 
                if (board[i][j] === '') 
                { 
                    //? Make the move 
                    board[i][j] = playerType; 
                    //? Call minimax recursively and choose 
                    //? the maximum value 
                    best = Math.min(best, minimaxBot(board, depth+1, true)); 
                    //? Undo the move 
                    board[i][j] = ''; 
                } 
            }
        }
        return best;
    }
}
//? This will return the best possible move for the player 
function findBestMove(board) 
{ 
    let bestVal = -1000; 
    let bestMove = {
        row : null,
        col : null
    }; 
    bestMove.row = -1; 
    bestMove.col = -1; 
  
    //? Traverse all cells, evaluate minimax function for 
    //? all empty cells. And return the cell with optimal 
    //? value. 
    for (let i = 0; i < 3; i++) 
    { 
        for (let j = 0; j < 3; j++) 
        { 
            //? Check if cell is empty 
            if (board[i][j]=='') 
            { 
                //? Make the move 
                board[i][j] = ai; 
  
                //? compute evaluation function for this move. 
                let moveVal = minimaxBot(board, 0, false); 
  
                //? Undo the move 
                board[i][j] = ''; 
  
                //? If the value of the current move is 
                //? more than the best value, then update 
                //? best/ 
                if (moveVal > bestVal) 
                { 
                    bestMove.row = i; 
                    bestMove.col = j; 
                    bestVal = moveVal; 
                } 
            } 
        } 
    }
    return bestMove; 
} 
//* a function that returns a list of indecies for the empty places on the board
function avaliableMoves(){
    let emptyIndecies = [];
    board.filter((elem, ind) => {
        for(let j = 0; j < 3; j++){
            if(elem[j] === ''){
                emptyIndecies.push([ind, j]);
            }
        }
    });
    return emptyIndecies;
}
function numAvaliableMoves(){
    return avaliableMoves().length;
}
function isAvaliableMoves(){
    return numAvaliableMoves() > 0;
}
//? counts how many times an element is repeated
function getOccurrence(array, value) {
    return array.filter((v) => (v === value)).length;
}
//? a function that updates the scores on the right of the board
function updateScore(winner){
    if(winner === 'x'){
        animeScore(scoreSpans[0]);
    }
    else{
        animeScore(scoreSpans[1]);
    }
}
//? handels the reset button which will delete all the Xs and Os in the blocks as well as reseting the scores to 0
function reset(){
    animeScore(scoreSpans);
    setTimeout(() => {
        scoreSpans[0].textContent = '0';
        scoreSpans[1].textContent = '0';
    }, 300);
    clearTimeout();
    boardClear();
}
//? clears the board
function boardClear(){
    const tl = anime.timeline({duration: 100});
    for(let l = 0; l < svgs.length; l++){
        tl.add({
            targets: svgs[l],
            opacity: 0,
            direction: 'forwards',
            easing: 'easeInOutSine'
        }, '+=20');
    }
    setTimeout(function() {
        for(let k = 0; k < blocks.length; k++){
            while (blocks[k].firstChild) {
                blocks[k].removeChild(blocks[k].lastChild);
            }
            addedList.pop();
            blocks[k].style.cursor = 'pointer';
        }
    }, svgs.length*170);
    for(let k = 0; k < 3; k++){
        board[k][0] = '';
        board[k][1] = '';
        board[k][2] = '';
    }
}
//? controls the pop-up modal
function pickOptions(e){
    if(e.target.name === 'single' || e.target.textContent === 'Single Player'){
        playMode = 'single';
        changeContent('Pick a Side:', 'X', 'O', '8rem');
        optionImg[0].style.display = 'none';
        optionImg[1].style.display = 'none'
    }
    else if(e.target.name === 'multi' || e.target.textContent === 'Multiplayer'){
        playMode = 'multi';
        changeContent('Pick a Side:', 'X', 'O', '8rem');
        optionImg[0].style.display = 'none'
        optionImg[1].style.display = 'none';
    }
    else if(e.target.textContent === 'X'){
        playerType = 'x';
        ai = 'o';
        currentPlayerType = playerType;
        modalAnim(1000, 0, true);
    }
    else if(e.target.textContent === 'O'){
        playerType = 'o';
        ai = 'x';
        currentPlayerType = playerType;
        modalAnim(1000, 0, true);
    }
}
//? changes the modal content dynamically
function changeContent(titleText, optionOneText = '', optionTwoText = '', optFontSize = '1rem', win = false){
    titleHeader.textContent = titleText;
    optionTitle[0].textContent = optionOneText;
    optionTitle[0].style.fontSize = optFontSize;
    optionTitle[1].textContent = optionTwoText;
    optionTitle[1].style.fontSize = optFontSize;
    if(win){
        optionTitle[0].classList.add('disappear');
        optionTitle[1].classList.add('disappear');
        options.classList.add('disappear');
        titleHeader.style.fontSize = '3rem';
    }
    else{
        optionTitle[0].classList.remove('disappear');
        optionTitle[1].classList.remove('disappear');
    }
}
function animeScore(element){
    anime.timeline({duration : 300}).add({
        targets: element,
        opacity: 0,
        direction: 'forwards',
        easing: 'easeInOutSine'
    }).add({
        targets: element,
        opacity: 1,
        direction: 'forwards',
        easing: 'easeInOutSine'
    });
    (element !== scoreSpans) ? setTimeout(() => {
        element.textContent = (Number(element.textContent)+1).toString();
    }, 300) : -1;
}
function randomTheme(index){
    body.style.cssText = themeColors[index];
    resetButton.style.cssText = mainColors[index];
    title.style.cssText = themeColors[index] + 'background-clip: text;-webkit-background-clip: text;color: transparent;';
    options.style.cssText = themeColors[index];
}
function modalAnim(yAxis, opacity, disNone = false, reverse = false, time = 500){
    if(reverse){
        anime.timeline({duration : time}).add({
            targets: modalContainer,
            opacity: opacity,
            direction: 'forwards',
            easing: 'easeInOutSine'
        }).add({
            targets: modal,
            translateY: yAxis,
            direction: 'forwards',
            easing: 'easeInOutSine'
        });
    }
    else{
        anime.timeline({duration : time}).add({
            targets: modal,
            translateY: yAxis,
            direction: 'forwards',
            easing: 'easeInOutSine'
        }).add({
            targets: modalContainer,
            opacity: opacity,
            direction: 'forwards',
            easing: 'easeInOutSine'
        });
    }
    if(disNone){
        setTimeout(() => modalContainer.classList.add('disappear'), time);
    }
    else{
        setTimeout(() => modalContainer.classList.remove('disappear'), time);
    }
    clearTimeout();
}
function draw(element, row = 0, col = 0){
    if(playMode === 'single' && currentPlayerType === ai){
        element = (row === 0) ? element[col]:
        (row === 1) ? element[col+3]:
        element[col+6];
    }
    element.insertAdjacentHTML('afterbegin', svgElem);
    element.style.cursor = 'not-allowed';
    addedList.push(element);
    indexOfBlock = Array.prototype.indexOf.call(container.children, element);
    (indexOfBlock >= 0 && indexOfBlock < 3) ? board[0][indexOfBlock] = currentPlayerType :
    (indexOfBlock > 2 && indexOfBlock < 6) ? board[1][indexOfBlock-3] = currentPlayerType :
    board[2][indexOfBlock-6] = currentPlayerType;
}
function winDrawAnim(){
    setTimeout(() => {
        boardClear();
    }, 1500);
    modalAnim(0, 1, false, true);
    setTimeout(() => {
        modalAnim(1000, 0, true);
    }, 3000);
}