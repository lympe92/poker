import { Player } from './player';

export interface PlayersTablePositions {
  dealer: Player;
  smallBlind: Player;
  bigBlind: Player;
  underTheGun: Player;
}
