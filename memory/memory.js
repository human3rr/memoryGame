const canvasWidth = 600
const canvasHeight = 600
//Want even number of rows and columns 
const cardRows = 2
const cardCols = cardRows
const numberOfCards = cardRows * cardCols
const squareMaxWidth = canvasWidth / cardCols
const squareMaxHeight = canvasHeight / cardRows  

const cardFlippedOverTime = 1000
//Array for starting deck of cards
let cards = []


let gameState = {
  winner:false,
  tryCount: 0,
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

let cardImages = [];
let winnerGifs = [];

const main = document.getElementById("main");
var myRect = main.getBoundingClientRect();
console.log(myRect)

function preload(){
  for(let i = 0; i < numberOfCards/2; i++){
    console.log(`./memory/cats/cat-${i+1}.jpg`)
    cardImages[i] = loadImage(`./memory/cats/cat-${i+1}.jpg`)
  }
  shuffle(cardImages)
  //console.log(cardImages)

  winnerGifs[0] = createImg("./memory/winners/winner-1.gif");
  console.log(winnerGifs[0])
  //console.log(main)
  //winnerGifs[0].elt.id = "winnerGif"; 
  //const wG = document.getElementById("winnerGif");

  //main.appendChild(wG)

  winnerGifs[0].elt.style.display = "none"; 
  //console.log(winnerGifs[0])

}

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
      clickState.allowedToClick = false
      //if true, removes cards from the gameboard
      if(clickState.clickIds[0] == clickState.clickIds[1]){
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
  setupCards();
}

function winnerScreen(){
  fill(0)
  textSize(32);
  winnerPhrase = 'WINNER'
  textAlign(CENTER);
  text(winnerPhrase, canvasWidth/2, 30);  
  //console.log(rect.top, rect.right, rect.bottom, rect.left);  
  
  winnerGifs[0].position(myRect.left - winnerGifs[0].width/2, myRect.top - winnerGifs[0].height/2);
  //winnerGifs[0].size(winnerGifs[0].width*2, winnerGifs[0].height*2);

  winnerGifs[0].size(400, 400);
  //console.log(winnerGifs[0].width*2)
  //console.log(winnerGifs[0].height*2)
  winnerGifs[0].elt.style.display = ""; 
}
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
    winnerScreen()
  }
}