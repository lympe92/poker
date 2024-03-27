import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../models/player';

@Pipe({
  name: 'averageChips',
})
export class AverageChipsPipe implements PipeTransform {
  transform(players: Player[] | null, pot: number): number {
    const sum =
      players?.reduce((total, player) => total + player.chips, 0) ?? 0;
    const count = players?.length ?? 0;

    return count > 0 ? (sum + pot) / count : 0;
  }
}
