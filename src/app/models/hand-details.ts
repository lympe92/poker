import { Card } from './card';

export interface HandDetails {
  hand:
    | 'flushRoyal'
    | 'straightFlush'
    | 'fourOfAKind'
    | 'foulHouse'
    | 'flush'
    | 'straight'
    | 'threeOfAKind'
    | 'twoPairs'
    | 'pair'
    | 'highCard';
  bestCards: Card[];
  isSplit?: boolean;
}
