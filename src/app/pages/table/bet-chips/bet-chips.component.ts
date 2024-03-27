import { Component, Input, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Player } from 'src/app/models/player';
import { PlayerService } from '../../../services/player.service';

@Component({
  selector: 'app-bet-chips',
  templateUrl: './bet-chips.component.html',
  styleUrls: ['./bet-chips.component.css'],
})
export class BetChipsComponent implements OnInit {
  @Input() player!: Player;
  chipsPosition: { top: string; left: string } = { top: '0', left: '0' };
  chips = new ReplaySubject<{
    chip10: number;
    chip100: number;
    chip500: number;
  }>();

  constructor(private _playerService: PlayerService) {}

  ngOnInit(): void {
    this.calculateChipsPosition();
    this.chips.next(this.calculateChips(this.player.stageBet));
  }

  private calculateChipsPosition(): void {
    let playerIndex = this._playerService.findIndexOfPlayer(this.player);
    if (playerIndex < 3) {
      this.chipsPosition.left = '106';
      this.chipsPosition.top = '106';
    }

    if (playerIndex >= 3) {
      this.chipsPosition.left = '-10';
      this.chipsPosition.top = '-10';
    }
  }
  
  private calculateChips(chips: number): {
    chip10: number;
    chip100: number;
    chip500: number;
  } {
    let chip500;
    let chip100;
    let chip10: number;
    chip500 = Math.floor(chips / 500);
    chip100 = Math.floor((chips % 500) / 100);
    chip10 = Math.floor(((chips % 500) % 100) / 10);

    return { chip10: chip10, chip100: chip100, chip500: chip500 };
  }
}
