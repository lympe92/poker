import { CardShapes } from './card-shapes';

export interface Card extends CardShapes {
  name: string;
  cardId: number;
  available: boolean;
  img: string;
}
