import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../models/player';

@Pipe({
  name: 'smallestStack',
})
export class SmallestStackPipe implements PipeTransform {
  transform(players: Player[] | null): Player | null {
    return players
      ? players?.reduce((prevPlayer, currentPlayer) =>
          prevPlayer.chips < currentPlayer.chips ? prevPlayer : currentPlayer
        )
      : null;
  }
}
