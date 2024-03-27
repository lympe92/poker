import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { Player } from 'src/app/models/player';
import { PlayerService } from 'src/app/services/player.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { GameInfoDialog } from './dialogs/game-info-dialog/game-info-dialog.component';
import { GameOptions } from 'src/app/models/game-options';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  players$!: Observable<Player[]>;
  userPlayer$!: Observable<Player>;
  constructor(
    public dialog: MatDialog,
    private _playerService: PlayerService,
    private _gameService: GameService,
    private _router: Router,
    private _sessionStorage: SessionStorageService
  ) {
    this._sessionStorage
      .getGameOptionsFromSessionStorage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((x: GameOptions) => {
        if (!x) this.onNavigateToHomePage();
      });
  }

  ngOnInit(): void {
    this.players$ = this._playerService.getPlayers();

    this.userPlayer$ = this._playerService
      .getPlayers()
      .pipe(map((player) => player.filter((x) => x.name === 'Me')[0]));

    this.startGame();
  }

  private startGame(): void {
    this._gameService.startGame();
  }

  onOpenGameInfoDialog(): void {
    const dialogRef = this.dialog.open(GameInfoDialog, {
      panelClass: 'game-info-dialog',
      minWidth: '270px',
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  onNavigateToHomePage(): void {
    this._sessionStorage.clearSessionStorage();
    this._router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
