import { Injectable } from '@angular/core';
import { Player } from 'src/app/models/player';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CpuPlayerDecisionsService {
  constructor(private _sessionStorage: SessionStorageService) {}

  getCpuDecision(
    player: Player,
    chipsToSeeNextCard: number
  ): { type: 'fold' | 'call' | 'raise'; amount: number } {
    const options: ('fold' | 'call' | 'raise')[] = ['fold', 'call', 'raise'];
    let type = options[Math.round(Math.random() * 2)];
    let amount = 0;
    let minimumbet = chipsToSeeNextCard - player?.stageBet;

    if (type === 'raise' && player.chips < minimumbet) type = 'call';

    if (type === 'call') amount = minimumbet;
    if (type === 'raise') amount = minimumbet + this._sessionStorage.bigBlind;

    if (amount > player.chips) amount = player.chips;

    let decision = { type: type, amount: amount };
    return decision;
  }
}
