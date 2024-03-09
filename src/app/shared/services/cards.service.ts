import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Card } from 'src/app/models/card';
import { Player } from 'src/app/models/player';

@Injectable({
  providedIn: 'root',
})
export class CardsService {

  communityCards$ = new ReplaySubject<Card[]>();

  constructor() {}

  setPortionCards(players: Player[]):void{
    let cards = this.getSuffledCards();
    this.setCardsToPlayers(players, cards);
    this.setCommunityCards(cards, players.length);
  }

  setCardsToPlayers(players: Player[], cards: Card[]): void {
    players.forEach((player: Player, index: number) => {
      player.cards.push(cards[index]);
      player.cards.push(cards[index + players.length]);
    });
  }

  setCommunityCards(cards: Card[], numberOfPlayers: number) {
    let firstCommunityCardIndex = numberOfPlayers * 2;
    let communityCards: Card[] = cards.slice(
      firstCommunityCardIndex,
      firstCommunityCardIndex + 5
    );
    this.communityCards$.next(communityCards);
  }

  getCommunityCards(): Observable<Card[]> {
    return this.communityCards$.asObservable();
  }

  getSuffledCards(): Card[] {
    let cards = this.getCards();
    let len = cards.length,
      currentIndex;
    for (currentIndex = len - 1; currentIndex > 0; currentIndex--) {
      let randIndex = Math.floor(Math.random() * (currentIndex + 1));
      let temp = cards[currentIndex];
      cards[currentIndex] = cards[randIndex];
      cards[randIndex] = temp;
    }

    return cards;
  }

  getCards(): Card[] {
    return [
      {
        name: '2',
        cardId: 2,
        shape: 'clubs',
        available: true,
        img: 'assets/images/2-clubs.png',
      },
      {
        name: '2',
        cardId: 2,
        shape: 'diamonds',
        available: true,
        img: 'assets/images/2-diamonds.png',
      },
      {
        name: '2',
        cardId: 2,
        shape: 'hearts',
        available: true,
        img: 'assets/images/2-hearts.png',
      },
      {
        name: '2',
        cardId: 2,
        shape: 'spades',
        available: true,
        img: 'assets/images/2-spades.png',
      },
      {
        name: '3',
        cardId: 3,
        shape: 'clubs',
        available: true,
        img: 'assets/images/3-clubs.png',
      },
      {
        name: '3',
        cardId: 3,
        shape: 'diamonds',
        available: true,
        img: 'assets/images/3-diamonds.png',
      },
      {
        name: '3',
        cardId: 3,
        shape: 'hearts',
        available: true,
        img: 'assets/images/3-hearts.png',
      },
      {
        name: '3',
        cardId: 3,
        shape: 'spades',
        available: true,
        img: 'assets/images/3-spades.png',
      },
      {
        name: '4',
        cardId: 4,
        shape: 'clubs',
        available: true,
        img: 'assets/images/4-clubs.png',
      },
      {
        name: '4',
        cardId: 4,
        shape: 'diamonds',
        available: true,
        img: 'assets/images/4-diamonds.png',
      },
      {
        name: '4',
        cardId: 4,
        shape: 'hearts',
        available: true,
        img: 'assets/images/4-hearts.png',
      },
      {
        name: '4',
        cardId: 4,
        shape: 'spades',
        available: true,
        img: 'assets/images/4-spades.png',
      },
      {
        name: '5',
        cardId: 5,
        shape: 'clubs',
        available: true,
        img: 'assets/images/5-clubs.png',
      },
      {
        name: '5',
        cardId: 5,
        shape: 'diamonds',
        available: true,
        img: 'assets/images/5-diamonds.png',
      },
      {
        name: '5',
        cardId: 5,
        shape: 'hearts',
        available: true,
        img: 'assets/images/5-hearts.png',
      },
      {
        name: '5',
        cardId: 5,
        shape: 'spades',
        available: true,
        img: 'assets/images/5-spades.png',
      },
      {
        name: '6',
        cardId: 6,
        shape: 'clubs',
        available: true,
        img: 'assets/images/6-clubs.png',
      },
      {
        name: '6',
        cardId: 6,
        shape: 'diamonds',
        available: true,
        img: 'assets/images/6-diamonds.png',
      },
      {
        name: '6',
        cardId: 6,
        shape: 'hearts',
        available: true,
        img: 'assets/images/6-hearts.png',
      },
      {
        name: '6',
        cardId: 6,
        shape: 'spades',
        available: true,
        img: 'assets/images/6-spades.png',
      },
      {
        name: '7',
        cardId: 7,
        shape: 'clubs',
        available: true,
        img: 'assets/images/7-clubs.png',
      },
      {
        name: '7',
        cardId: 7,
        shape: 'diamonds',
        available: true,
        img: 'assets/images/7-diamonds.png',
      },
      {
        name: '7',
        cardId: 7,
        shape: 'hearts',
        available: true,
        img: 'assets/images/7-hearts.png',
      },
      {
        name: '7',
        cardId: 7,
        shape: 'spades',
        available: true,
        img: 'assets/images/7-spades.png',
      },
      {
        name: '8',
        cardId: 8,
        shape: 'clubs',
        available: true,
        img: 'assets/images/8-clubs.png',
      },
      {
        name: '8',
        cardId: 8,
        shape: 'diamonds',
        available: true,
        img: 'assets/images/8-diamonds.png',
      },
      {
        name: '8',
        cardId: 8,
        shape: 'hearts',
        available: true,
        img: 'assets/images/8-hearts.png',
      },
      {
        name: '8',
        cardId: 8,
        shape: 'spades',
        available: true,
        img: 'assets/images/8-spades.png',
      },
      {
        name: '9',
        cardId: 9,
        shape: 'clubs',
        available: true,
        img: 'assets/images/9-clubs.png',
      },
      {
        name: '9',
        cardId: 9,
        shape: 'diamonds',
        available: true,
        img: 'assets/images/9-diamonds.png',
      },
      {
        name: '9',
        cardId: 9,
        shape: 'hearts',
        available: true,
        img: 'assets/images/9-hearts.png',
      },
      {
        name: '9',
        cardId: 9,
        shape: 'spades',
        available: true,
        img: 'assets/images/9-spades.png',
      },
      {
        name: '10',
        cardId: 10,
        shape: 'clubs',
        available: true,
        img: 'assets/images/10-clubs.png',
      },
      {
        name: '10',
        cardId: 10,
        shape: 'diamonds',
        available: true,
        img: 'assets/images/10-diamonds.png',
      },
      {
        name: '10',
        cardId: 10,
        shape: 'hearts',
        available: true,
        img: 'assets/images/10-hearts.png',
      },
      {
        name: '10',
        cardId: 10,
        shape: 'spades',
        available: true,
        img: 'assets/images/10-spades.png',
      },
      {
        name: 'J',
        cardId: 11,
        shape: 'clubs',
        available: true,
        img: 'assets/images/j-clubs.png',
      },
      {
        name: 'J',
        cardId: 11,
        shape: 'diamonds',
        available: true,
        img: 'assets/images/j-diamonds.png',
      },
      {
        name: 'J',
        cardId: 11,
        shape: 'hearts',
        available: true,
        img: 'assets/images/j-hearts.png',
      },
      {
        name: 'J',
        cardId: 11,
        shape: 'spades',
        available: true,
        img: 'assets/images/j-spades.png',
      },
      {
        name: 'Q',
        cardId: 12,
        shape: 'clubs',
        available: true,
        img: 'assets/images/q-clubs.png',
      },
      {
        name: 'Q',
        cardId: 12,
        shape: 'diamonds',
        available: true,
        img: 'assets/images/q-diamonds.png',
      },
      {
        name: 'Q',
        cardId: 12,
        shape: 'hearts',
        available: true,
        img: 'assets/images/q-hearts.png',
      },
      {
        name: 'Q',
        cardId: 12,
        shape: 'spades',
        available: true,
        img: 'assets/images/q-spades.png',
      },
      {
        name: 'K',
        cardId: 13,
        shape: 'clubs',
        available: true,
        img: 'assets/images/k-clubs.png',
      },
      {
        name: 'K',
        cardId: 13,
        shape: 'diamonds',
        available: true,
        img: 'assets/images/k-diamonds.png',
      },
      {
        name: 'K',
        cardId: 13,
        shape: 'hearts',
        available: true,
        img: 'assets/images/k-hearts.png',
      },
      {
        name: 'K',
        cardId: 13,
        shape: 'spades',
        available: true,
        img: 'assets/images/k-spades.png',
      },
      {
        name: 'A',
        cardId: 14,
        shape: 'clubs',
        available: true,
        img: 'assets/images/a-clubs.png',
      },
      {
        name: 'A',
        cardId: 14,
        shape: 'diamonds',
        available: true,
        img: 'assets/images/a-diamonds.png',
      },
      {
        name: 'A',
        cardId: 14,
        shape: 'hearts',
        available: true,
        img: 'assets/images/a-hearts.png',
      },
      {
        name: 'A',
        cardId: 14,
        shape: 'spades',
        available: true,
        img: 'assets/images/a-spades.png',
      },
    ];
  }
}
