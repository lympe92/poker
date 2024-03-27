import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { GameOptions } from 'src/app/models/game-options';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService implements OnDestroy {
  destroy$ = new Subject<void>();

  public smallBlind!: number;
  public bigBlind!: number;
  public decisionTime!: number;
  gameOptions$ = new BehaviorSubject<any>(null);

  constructor() {
    this.gameOptions$.next(
      JSON.parse(sessionStorage.getItem('gameOptions') as string)
    );
    this.setGameOptions();
  }

  setGameOptions(): void {
    this.getGameOptionsFromSessionStorage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((gameOptions: GameOptions) => {
        this.smallBlind = gameOptions?.stake / 2;
        this.bigBlind = gameOptions?.stake;
        this.decisionTime = gameOptions?.time;
      });
  }

  setGameOptionsToSessionStorage(gameOptions: GameOptions): void {
    sessionStorage.setItem('gameOptions', JSON.stringify(gameOptions));
    this.gameOptions$.next(gameOptions);
  }

  getGameOptionsFromSessionStorage(): Observable<GameOptions> {
    return this.gameOptions$.asObservable();
  }

  clearSessionStorage(): void {
    sessionStorage.clear();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
