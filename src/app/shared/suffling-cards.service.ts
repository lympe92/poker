import { Injectable } from '@angular/core';
import { CardsService } from './cards.service';

@Injectable({
  providedIn: 'root'
})
export class SufflingCardsService {

  constructor(private cardsService:CardsService,) { }

  arrayLength:number=52;

  sufflingCards(): void{
    this.cardsService.playerCards.forEach(x => {
      let j=Math.floor(Math.random() * this.arrayLength);
      x.name=this.cardsService.cards[j].name;
      x.cardId=this.cardsService.cards[j].cardId;
      x.shape=this.cardsService.cards[j].shape;
      x.available=this.cardsService.cards[j].available;
      x.img=this.cardsService.cards[j].img;
      this.cardsService.cards.splice(j,1);
      this.arrayLength=this.cardsService.cards.length;
    });
    
  }

  sufflingFlop(){
    for (let i = 0; i < 3; i++) {
      let j=Math.floor(Math.random() * this.arrayLength);
      this.cardsService.tableCards[i].name=this.cardsService.cards[j].name;
      this.cardsService.tableCards[i].cardId=this.cardsService.cards[j].cardId;
      this.cardsService.tableCards[i].shape=this.cardsService.cards[j].shape;
      this.cardsService.tableCards[i].available=this.cardsService.cards[j].available;
      this.cardsService.tableCards[i].img=this.cardsService.cards[j].img;     
      this.cardsService.cards.splice(j,1);
      this.arrayLength=this.cardsService.cards.length;
    }
  }

  sufflingTurn(){
      let j=Math.floor(Math.random() * this.arrayLength);
      this.cardsService.tableCards[3].name=this.cardsService.cards[j].name;
      this.cardsService.tableCards[3].cardId=this.cardsService.cards[j].cardId;
      this.cardsService.tableCards[3].shape=this.cardsService.cards[j].shape;
      this.cardsService.tableCards[3].available=this.cardsService.cards[j].available;
      this.cardsService.tableCards[3].img=this.cardsService.cards[j].img;     
      this.cardsService.cards.splice(j,1);
      this.arrayLength=this.cardsService.cards.length;
  }
  sufflingRiver(){
    let j=Math.floor(Math.random() * this.arrayLength);
    this.cardsService.tableCards[4].name=this.cardsService.cards[j].name;
    this.cardsService.tableCards[4].cardId=this.cardsService.cards[j].cardId;
    this.cardsService.tableCards[4].shape=this.cardsService.cards[j].shape;
    this.cardsService.tableCards[4].available=this.cardsService.cards[j].available;
    this.cardsService.tableCards[4].img=this.cardsService.cards[j].img;     
    this.cardsService.cards.splice(j,1);
    this.arrayLength=this.cardsService.cards.length;
  }

}
