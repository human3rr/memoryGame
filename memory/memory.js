const canvasWidth = 400
const canvasHeight = 400
//Want even number of rows and columns 
const cardRows = 4
const cardCols = cardRows
const numberOfCards = cardRows * cardCols
const squareMaxWidth = canvasWidth / cardCols
const squareMaxHeight = canvasHeight / cardRows  

const cardFlippedOverTime = 1000
//Array for starting deck of cards
let cards = []
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


function setup() {
  createCanvas(canvasWidth, canvasHeight);

  let id = 1;
  for(let i = 1; i <= numberOfCards; i++){
    cards.push(new Card(id, null))
    if(i % 2 == 0){
      id++
    }
  }
  cards = shuffle(cards)

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
  console.log(cards)
}


function mousePressed(){
  if(clickState.allowedToClick != true){
    return
  }
  console.log({"mouseX": mouseX})
  console.log({"mouseY": mouseY})
  for (const card of cards) {
    if(card.clicked()){
      clickState.clickIds.push(card.id)
      if(clickState.clickIds.length >= 2){
        clickState.allowedToClick = false
        //if(Math.abs(clickState.clickIds[0] - clickState.clickIds[1]) == 1)
        if(clickState.clickIds[0] == clickState.clickIds[1]){
          clickState.foundMatch()
          clickState.allowedToClick = true;
        }else{
          //Give user some time to view the 2nd card flipped over
          setTimeout(() => {
            for (const card of cards) {
              card.cardColor = '#222222'
            }
            clickState.allowedToClick = true;
          }, cardFlippedOverTime)
        }

        console.log({"clickState.clickIds": clickState.clickIds})
        clickState.clickIds = []
        
      }
    }
  }
}

function draw() {
  background(220);
  for (const card of cards) {
    fill(card.cardColor);
    square(card.xCoordinate, card.yCoordinate, card.cardWidth);
  }
  //console.log({"mouseX": mouseX})
  //console.log({"mouseY": mouseY})
}