const canvasWidth = 400
const canvasHeight = 400
//Want even number of rows and columns 
const cardRows = 2
const cardCols = cardRows
const numberOfCards = cardRows * cardCols
const squareMaxWidth = canvasWidth / cardCols
const squareMaxHeight = canvasHeight / cardRows  
//Array for starting deck of cards
let cards = []
let ids = []
let randomizedIds = []
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
        //this.cardColor = '#FFFFFF'
      }
      //console.log({"yStart":this.yCoordinate, "yEnd": this.yCoordinate + this.cardWidth, "mouseY" : mouseY})

    }
  }
  this.xCoordinate =  x
  this.yCoordinate =  y
  this.cardWidth = width
  this.cardColor = '#222222'
}

function getRndmFromSet(set)
{
    var rndm = Math.floor(Math.random() * set.length);
    let rndmSetVal = set[rndm]
    set.splice(rndm,1)
    return rndmSetVal;
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);

  //Setup array of random id's to assign to each card
  for(let i = 0; i < numberOfCards; i++){
    ids.push(i)
  }
  console.log(ids)
  //Setup ids for cards
  for(let i = 0; i < numberOfCards; i++){
    randomizedIds.push(getRndmFromSet(ids))
  }

  console.log(randomizedIds)
  for(let i = 0; i < numberOfCards; i++){
    cards.push(new Card(randomizedIds[i], null))
  }

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
  console.log({"mouseX": mouseX})
  console.log({"mouseY": mouseY})
  for (const card of cards) {
    card.clicked()
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