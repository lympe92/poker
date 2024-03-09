import { Injectable } from '@angular/core';
import { Player } from 'src/app/models/player';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CpuPlayerDecisionsService {
  constructor(private _sessionService: SessionStorageService) {}

  getDecision(player: Player, chipsToCall: number) {
    let options = ['fold', 'call/check', 'raise'];
    let decison = options[Math.round(Math.random() * 2)];
    let hasChipsForRaise =
      decison === 'raise' && this.getHasChipsForRaise(player, chipsToCall);

    if (!hasChipsForRaise) decison = 'call/check';

    return decison;
  }

  getHasChipsForRaise(player: Player, chipsToCall: number): boolean {
    return (
      player.chips >=
      chipsToCall - player.temporaryBetting + this._sessionService.bigBlind
    );
  }
}
