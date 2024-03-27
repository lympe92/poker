import { Injectable } from '@angular/core';
import { Player } from 'src/app/models/player';
import { CardsService } from './cards.service';
import { CommunityCards } from 'src/app/models/community-cards';
import { Card } from 'src/app/models/card';
import { HandDetails } from 'src/app/models/hand-details';
import { Subject, takeUntil } from 'rxjs';

enum CardsRank {
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  ten,
  jack,
  queen,
  king,
  ace,
}

enum HandsRank {
  flushRoyal,
  straightFlush,
  fourOfAKind,
  foulHouse,
  flush,
  straight,
  threeOfAKind,
  twoPairs,
  pair,
  highCard,
}

@Injectable({
  providedIn: 'root',
})
export class FindWinnerService {
  destroy$ = new Subject<void>();
  communityCards!: CommunityCards;
  constructor(private _cardsService: CardsService) {
    this._cardsService.communityCards$
      .pipe(takeUntil(this.destroy$))
      .subscribe((x: CommunityCards) => (this.communityCards = x));
  }

  findWinners(players: Player[]) {
    players.forEach((player: Player) => {
      let sevenCards = this.getSevenCardsSorted(player);
      let bestHandDetails = this.findBestHandDetails(sevenCards);
      player.handDetails = bestHandDetails;
    });

    return this.getRankedPlayerHands(players);
  }

  private getRankedPlayerHands(players: Player[]): Player[] {
    players.sort((a, b) => {
      const rankHandA =
        HandsRank[a.handDetails?.hand as keyof typeof HandsRank];
      const rankHandB =
        HandsRank[b.handDetails?.hand as keyof typeof HandsRank];

      if (rankHandA !== rankHandB) {
        return rankHandA - rankHandB;
      } else {
        // if rankHand is same, compare the 5 best cards
        for (let i = 0; i < 5; i++) {
          const cardNameA = a.handDetails?.bestCards[i].name;
          const cardNameB = b.handDetails?.bestCards[i].name;
          const cardRankA = CardsRank[cardNameA as keyof typeof CardsRank];
          const cardRankB = CardsRank[cardNameB as keyof typeof CardsRank];

          if (cardRankA !== cardRankB) {
            return cardRankB - cardRankA;
          } else {
            //if all are the same the player with less chips will be the first, but an "isSplit" flag will be true
            a.chips - b.chips;
          }
        }

        b.handDetails!.isSplit = true;
        return 0;
      }
    });
    return players;
  }

  private findBestHandDetails(sevenCards: Card[]): HandDetails {
    let pairsHandDetails = this.hasPairs(sevenCards);
    let flushHandDetails = this.hasFlush(sevenCards);
    let straightHandDetails = this.hasStraight(sevenCards);
    let straightFlushHandDetails = this.hasStraightFlush(sevenCards);
    let totalHandDetails: HandDetails[] = [];

    [
      pairsHandDetails,
      flushHandDetails,
      straightHandDetails,
      straightFlushHandDetails,
    ].forEach((handDetails: HandDetails | null) => {
      if (handDetails) totalHandDetails.push(handDetails);
    });

    return this.compareHands(totalHandDetails);
  }

  private compareHands(results: HandDetails[]): HandDetails {
    let bestHand = results[0]; // Assume that first is the initial best hand

    for (let i = 1; i < results.length; i++) {
      const currentHand = results[i];
      if (
        HandsRank[currentHand.hand as keyof typeof HandsRank] <
        HandsRank[bestHand.hand as keyof typeof HandsRank]
      ) {
        bestHand = currentHand;
      }
    }

    return bestHand;
  }

  private getSevenCardsSorted(player: Player): Card[] {
    let sevenCards = [
      ...player.cards,
      ...this.communityCards.flop,
      this.communityCards.river,
      this.communityCards.turn,
    ];
    sevenCards.sort(
      (a, b) =>
        CardsRank[b.name as keyof typeof CardsRank] -
        CardsRank[a.name as keyof typeof CardsRank]
    );

    return sevenCards;
  }

  private hasPairs(cards: Card[]): HandDetails | null {
    const nameCountMap = new Map<string, number>();

    //create set of cards with value their count
    for (const card of cards) {
      if (!nameCountMap.has(card.name)) {
        nameCountMap.set(card.name, 0);
      }
      nameCountMap.set(card.name, nameCountMap.get(card.name)! + 1);
    }

    const bestCards: Card[] = [];
    let hasPair = false;
    let hasTwoPairs = false;
    let hasThreeOfAKind = false;

    let hasFourOfAKind = false;
    let numberOfPairs = 0;

    // according to count of each set item find the pairs
    for (const [name, count] of nameCountMap.entries()) {
      if (count >= 2) {
        if (count === 4) hasFourOfAKind = true;
        if (count === 3) hasThreeOfAKind = true;
        if (count === 2) {
          numberOfPairs += 1;
          hasPair = true;
        }
        cards.forEach((card: Card) => {
          if (card.name === name) bestCards.push(card);
        });
      }
    }

    let hasFoulHouse = hasThreeOfAKind && hasPair ? true : false;
    hasTwoPairs = numberOfPairs > 1 ? true : false;

    //Sometimes it's possible to have 3 pairs. Next line keeps only the best two
    if (hasTwoPairs && !hasThreeOfAKind) bestCards.length = 4;

    if (bestCards.length < 5)
      cards.forEach((card: Card) => {
        if (bestCards.length < 5 && !bestCards.includes(card))
          bestCards.push(card);
      });
    if (hasFourOfAKind) return { hand: 'fourOfAKind', bestCards: bestCards };
    if (hasFoulHouse) return { hand: 'foulHouse', bestCards: bestCards };
    if (hasThreeOfAKind) return { hand: 'threeOfAKind', bestCards: bestCards };
    if (hasTwoPairs) return { hand: 'twoPairs', bestCards: bestCards };
    if (hasPair) return { hand: 'pair', bestCards: bestCards };

    return { hand: 'highCard', bestCards: cards.slice(0, 5) };
  }

  private hasFlush(cards: Card[]): HandDetails | null {
    const nameCountMap = new Map<string, number>();

    for (const card of cards) {
      if (!nameCountMap.has(card.shape)) {
        nameCountMap.set(card.shape, 0);
      }
      nameCountMap.set(card.shape, nameCountMap.get(card.shape)! + 1);
    }

    const bestCards: Card[] = [];
    let hasFlush = false;
    for (const [shape, count] of nameCountMap.entries()) {
      if (count >= 5) {
        hasFlush = true;
        cards.forEach((card: Card) => {
          if (card.shape === shape) {
            bestCards.push(card);
          }
        });
      }
    }

    return hasFlush ? { hand: 'flush', bestCards: bestCards } : null;
  }

  private hasStraight(cards: Card[]): HandDetails | null {
    let bestCards: Card[] = [];
    let isStraight = false;

    let counter = 0;
    for (let i = 0; i < cards.length - 1; i++) {
      const currentRank = CardsRank[cards[i].name as keyof typeof CardsRank];

      let nextRank = CardsRank[cards[i + 1].name as keyof typeof CardsRank];
      if (currentRank - nextRank > 1) {
        counter = 0;
        continue;
      }

      if (currentRank - nextRank === 1) {
        counter++;
        bestCards.push(cards[i]);
      }
      if (counter === 4) {
        bestCards.push(cards[i + 1]);
        isStraight = true;
        break;
      }
    }

    //if there is straight return guard
    if (isStraight) return { hand: 'straight', bestCards: bestCards };

    //check for the straight of ace as lowest card
    [isStraight, bestCards] = this.checkIfAceLowStraight(cards);
    return isStraight ? { hand: 'straight', bestCards: bestCards } : null;
  }

  checkIfAceLowStraight(cards: Card[]): [boolean, Card[]] {
    let bestCards: Card[] = [];
    let counter = 0;
    let lowStraight = ['Ace', 'Two', 'Three', 'Four', 'Five'];
    let count = 0;
    let isStraight: boolean = false;

    cards.forEach((card: Card) => {
      if (lowStraight.includes(card.name)) {
        count++;
        bestCards.push(card);
      }

      //if there is low ace straight set Ace as last card(highest card is the card 5)
      if (counter === 5) {
        isStraight = true;
        let ace = bestCards.shift();
        if (ace) bestCards.push(ace);
      }
    });
    return [isStraight, bestCards];
  }

  private hasStraightFlush(cards: Card[]): HandDetails | null {
    let straightHandDetails: HandDetails | null = null;
    let straightFlushHandDetails: HandDetails | null = null;

    this.hasStraight(cards);

    let flushHandDetails = this.hasFlush(cards);
    if (flushHandDetails)
      straightHandDetails = this.hasStraight(flushHandDetails.bestCards);

    if (straightHandDetails) {
      straightFlushHandDetails = {
        hand: 'straightFlush',
        bestCards: straightHandDetails.bestCards,
      };
    }
    return straightFlushHandDetails;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
