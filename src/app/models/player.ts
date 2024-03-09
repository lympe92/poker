import { Card } from "./card";

 

export interface Player { 
  name: string;
  id: number;
  chips: number;
  isDealer: boolean;
  isBigBlind: boolean;
  isSmallBlind: boolean;
  isActivePlayer: boolean;
  temporaryBetting: number;
  toSpeak: boolean;
  inPortion: boolean;
  bestHand: Card[];
  cards: Card[];
}
