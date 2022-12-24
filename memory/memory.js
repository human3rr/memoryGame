const canvasWidth = 600
const canvasHeight = 600
//Want even number of rows and columns 
let maxNumberOfCards = 36
let cardRows = 4
let cardCols = cardRows
let numberOfCards = cardRows * cardCols
let squareMaxWidth = canvasWidth / cardCols
let squareMaxHeight = canvasHeight / cardRows  

const cardFlippedOverTime = 1000
//Array for starting deck of cards
let cards = []

const main = document.getElementById("main");
var myRect = main.getBoundingClientRect();
console.log(myRect)

const tryCount = document.getElementById("tryCount");
const matches = document.getElementById("matches");
const difficulty = document.getElementById("difficulty");

difficulty.addEventListener('change', function() {
  console.log('You selected: ', this.value);
  switch(this.value) {
    case "easy":
      console.log("easy peasy")
      cardRows = 2
      break;
    case "medium":
      console.log("medium steak")
      cardRows = 4
      // code block
      break;
    default:
      console.log("hard lard")
      cardRows = 6
        // code block
    }
    setup()
});


let gameState = {
  winner:false,
  tryCount: 0,
  matches: 0,
}
let cardImages = [];
let winnerGif;
const clickState = {
  clickIds: [],
  allowedToClick: true,
  foundMatch: function(){
    //Remove cards if matches are found
    cards = cards.filter(card => card.id != this.clickIds[0])
    cards = cards.filter(card => card.id != this.clickIds[1])
    //probably increment a counter or some shit for the game state
  }
}
function initializeVariables(){
  clickState.clickIds = []
  clickState.allowedToClick = true
  gameState.winner = false
  gameState.matches = 0
  gameState.tryCount = 0
  winnerGif.elt.style.display = "none";
  tryCount.innerHTML = gameState.tryCount
  matches.innerHTML = gameState.matches

  cardCols = cardRows
  numberOfCards = cardRows * cardCols
  squareMaxWidth = canvasWidth / cardCols
  squareMaxHeight = canvasHeight / cardRows  
}
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", resetGame)

function resetGame(){
  setupCards()
  initializeVariables()
}

function incrementTryCount(){
  gameState.tryCount += 1;
  tryCount.innerHTML = gameState.tryCount
}
function incrementMatchs(){
  gameState.matches += 1;
  matches.innerHTML = gameState.matches
}

//constructor function
function Card(id, img, x = 0, y = 0, width = 0){
  this.isFlippedUp = false
  //Keep track of object ID for matches
  this.id = id
  //Img to display when flipped
  this.img = img
  //Determine if card was clicked and change state if card was clicked
  this.clicked = function cardClicked(){
    if(this.xCoordinate < mouseX && mouseX < (this.xCoordinate + this.cardWidth )){
      //console.log({"xStart":this.xCoordinate, "xEnd": this.xCoordinate + this.cardWidth, "mouseX" : mouseX})
      if(this.yCoordinate < mouseY && mouseY < (this.yCoordinate + this.cardWidth)){
        console.log({"clicked": this.id})
        this.isFlippedUp = true
        this.cardColor = '#FFFFFF'
        return true
      }
      //console.log({"yStart":this.yCoordinate, "yEnd": this.yCoordinate + this.cardWidth, "mouseY" : mouseY})
    }
    return false
  }
  this.xCoordinate =  x
  this.yCoordinate =  y
  this.cardWidth = width
  this.cardColor = '#222222'
  this.currentlyClicked = false
}



function preload(){
  for(let i = 0; i < maxNumberOfCards/2; i++){
    console.log(`./memory/cats/cat-${i+1}.jpg`)
    cardImages[i] = loadImage(`./memory/cats/cat-${i+1}.jpg`)
  }
  shuffle(cardImages)
  //console.log(cardImages)

  winnerGif = createImg("./memory/winners/winner-1.gif");
  console.log(winnerGif)
  //Dont display element on page
  winnerGif.elt.style.display = "none"; 

}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function initializeCardListWithIds(){
  let id = 1;
  for(let i = 1; i <= numberOfCards; i++){
    cards.push(new Card(id, cardImages[id-1]))
    if(i % 2 == 0){
      id++
    }
  }
}

function setupCardPlacementAndDimensions(){
  //Convoluted way to set the coordinate of each card
  /*
  Basic idea is this:

  row * numrows + col =>
  0 + offset (col)
  4 + offset
  8 + offset
  12 + offset
  */
  for(let i = 0; i < cardRows; i++){
    for(let j = 0; j < cardCols; j++){
      cards[j + i * cardRows].xCoordinate = squareMaxHeight * j
      cards[j + i * cardRows].yCoordinate = squareMaxWidth * i
      cards[j + i * cardRows].cardWidth = squareMaxWidth
      console.log({"i": i, "j": j, "j + i * cardRows":j + i * cardRows})
      console.log(cards[j + i * cardRows])
    }
  }
}
function setupCards(){
  cards = []
  initializeCardListWithIds()
  cards = shuffle(cards)
  setupCardPlacementAndDimensions()
  console.log(cards)
}


function cardClickedHandle(card){
  if(card.clicked() && card.currentlyClicked == false){
    card.currentlyClicked = true;
    //Want to keep track of the card pushed as well as id,
    //Otherwise you can click the same image twice to reveal match
    clickState.clickIds.push(card.id)
    if(clickState.clickIds.length >= 2){
      incrementTryCount()
      clickState.allowedToClick = false
      //if true, removes cards from the gameboard
      if(clickState.clickIds[0] == clickState.clickIds[1]){
        incrementMatchs()
        clickState.foundMatch()
        clickState.allowedToClick = true;
      }else{
        //Give user some time to view the 2nd card flipped over
        setTimeout(() => {
          //Reverts cards to showing back of card
          for (const card of cards) {
            card.cardColor = '#222222'
            card.isFlippedUp = false
            card.currentlyClicked = false
          }
          clickState.allowedToClick = true;
        }, cardFlippedOverTime)
      }

      console.log({"clickState.clickIds": clickState.clickIds})
      clickState.clickIds = []
      if(cards.length == 0){
        gameState.winner = true
      }
    }
  }
}

function mousePressed(){
  if(clickState.allowedToClick != true){
    return
  }
  console.log({"mouseX": mouseX, "mouseY": mouseY})
  for (const card of cards) {
    cardClickedHandle(card)
  }
}


function setup() {
  createCanvas(canvasWidth, canvasHeight);
  initializeVariables()
  setupCards();

}

function winnerScreen(textSz){
  fill(0)
  textSize(textSz);
  winnerPhrase = 'WINNER'
  textAlign(CENTER);
  text(winnerPhrase, canvasWidth/2, 50);  
  text(winnerPhrase, canvasWidth/2, canvasHeight - 50);  
  
  myRect = main.getBoundingClientRect();
  //console.log({"top": myRect.top,"right": myRect.right, "bottom":myRect.bottom, "left":myRect.left});  
  //console.log(myRect)
  //winnerGif.position(myRect.left - winnerGif.width/2, myRect.top - winnerGif.height/2);
  console.log(winnerGif.height)
  winnerGif.position(myRect.left + (myRect.right - myRect.left)/2 - winnerGif.width/2,
                    (myRect.bottom + myRect.top)/2  - winnerGif.height/2);
  //winnerGif.position(myRect.x, myRect.y);
  winnerGif.size(400, 400);
  winnerGif.elt.style.display = ""; 
}

let i = 0 
function draw() {
  background(220);
  for (const card of cards) {
    fill(card.cardColor);
    if(card.isFlippedUp){
      image(card.img, card.xCoordinate, card.yCoordinate, card.cardWidth, card.cardWidth);
    }else{
      square(card.xCoordinate, card.yCoordinate, card.cardWidth);
    }
  }
  if(gameState.winner == true){
    winnerScreen(i)
  }
  if(i > 40){
    i = 0
  }else{
    i++
  }

}