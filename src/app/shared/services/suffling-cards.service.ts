import { Injectable } from '@angular/core'; 

@Injectable({
  providedIn: 'root'
})
export class SufflingCardsService {

  constructor() {   
  }
  arrayLength:number=52;
  
  sufflingCards(playerCards:any,cards:any,playersNum:number){
    for(let i=0;i<playersNum*2;i++){
      let j=Math.floor(Math.random() * this.arrayLength);
      playerCards.push(cards[j]);
      cards.splice(j,1);
      this.arrayLength=cards.length; 
    }
  }

  sufflingFlop(tableCards:any,cards:any){
    for (let i = 0; i < 3; i++) {
      let j=Math.floor(Math.random() * this.arrayLength);
      tableCards.push(cards[j]);  
      cards.splice(j,1);
      this.arrayLength=cards.length;
    }
  }

  sufflingTurn(tableCards:any,cards:any){
    let j=Math.floor(Math.random() * this.arrayLength);
    tableCards.push(cards[j]);  
    cards.splice(j,1);
    this.arrayLength=cards.length;
  }

  sufflingRiver(tableCards:any,cards:any){
    let j=Math.floor(Math.random() * this.arrayLength);
    tableCards.push(cards[j]);  
    cards.splice(j,1);
    this.arrayLength=cards.length;
  }
}
