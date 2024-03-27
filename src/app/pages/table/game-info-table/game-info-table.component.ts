import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerService } from '../../../services/player.service';
import { Observable, Subject, Subscription, scan, takeUntil } from 'rxjs';
import { Player } from 'src/app/models/player';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-game-info-table',
  templateUrl: './game-info-table.component.html',
  styleUrls: ['./game-info-table.component.css'],
})
export class GameInfoTableComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  biggestStack$!: Observable<Player>;
  smallestStack$!: Observable<Player>;
  averageChips$!: Observable<number>;
  playerRank$!: Observable<{ rank: number; total: number }>;
  pot$!: Subscription;
  pot!: number;
  players$!: Observable<Player[]>;
  constructor(
    private _playerService: PlayerService,
    private _gameService: GameService
  ) {}

  ngOnInit(): void {
    this.pot$ = this.getPot();
    this.players$ = this.getPlayersObs();
    this.playerRank$ = this.getPlayerRankObs();
  }

  getPlayersObs(): Observable<Player[]> {
    return this._playerService.getPlayers().pipe(takeUntil(this.destroy$));
  }

  getPlayerRankObs(): Observable<{ rank: number; total: number }> {
    return this._playerService.getPlayers().pipe(
      takeUntil(this.destroy$),
      scan(
        (acc, players) => {
          const playersCopy = players.map((player) => ({ ...player }));
          const rank =
            playersCopy
              .sort((a, b) => b.chips - a.chips)
              .findIndex((player) => player.name === 'Me') + 1;
          const total = players.length;
          return { rank, total };
        },
        { rank: 0, total: 0 }
      )
    );
  }

  getPot(): Subscription {
    return this._gameService
      .getPotObs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: number) => (this.pot = value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
