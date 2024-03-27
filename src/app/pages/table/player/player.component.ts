import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player';
import { Observable, map } from 'rxjs';
import { PlayerService } from '../../../services/player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  @Input() player!: Player;
  activePlayer$!: Observable<Player | null>;
  dealer$!: Observable<Player>;
  secretCard = '/assets/images/secret-card.png';
  constructor(private _playerService: PlayerService) {}

  ngOnInit(): void {
    this.activePlayer$ = this._playerService.getActivePlayer();
    this.dealer$ = this._playerService
      .getPlayersTablePositions()
      .pipe(map((positions) => positions.dealer));
  }
}
