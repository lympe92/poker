import { Card } from './card';

export interface CommunityCards {
  flop: [Card, Card, Card];
  turn: Card;
  river: Card;
}
