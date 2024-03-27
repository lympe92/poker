import { Card } from './card';
import { HandDetails } from './hand-details';

export interface Player {
  name: string;
  id: number;
  chips: number;
  bet: number;
  stageBet: number;
  cards: Card[];
  handDetails: HandDetails | null;
  toSpeak: boolean;
}
