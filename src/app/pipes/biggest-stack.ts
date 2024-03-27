import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../models/player';

@Pipe({
  name: 'biggestStack',
})
export class BiggestStackPipe implements PipeTransform {
  transform(players: Player[] | null): Player | null {
    return players
      ? players?.reduce((prevPlayer, currentPlayer) =>
          prevPlayer.chips > currentPlayer.chips ? prevPlayer : currentPlayer
        )
      : null;
  }
}
