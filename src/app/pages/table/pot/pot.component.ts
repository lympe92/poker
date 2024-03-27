import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-pot',
  templateUrl: './pot.component.html',
  styleUrls: ['./pot.component.css'],
})
export class PotComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  chips$ = new ReplaySubject<{
    chip10: number;
    chip100: number;
    chip500: number;
  }>();
  pot: number = 0;

  constructor(private _gameService: GameService) {}

  ngOnInit(): void {
    this._gameService
      .getPotObs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pot: number) => {
        this.pot = pot;
        this.calculateChips(pot);
      });
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
