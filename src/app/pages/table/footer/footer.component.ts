import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Player } from 'src/app/models/player';
import { GameService } from '../../../services/game.service';
import { PlayerService } from '../../../services/player.service';
import { SessionStorageService } from '../../../services/session-storage.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit, OnChanges, OnDestroy {
  destroy$ = new Subject<void>();
  @Input() player!: Player | null;
  raiseNum: number = 0;
  bigBlind!: number;
  smallBlind!: number;
  activePlayer$!: Observable<Player | null>;
  pot!: number;
  chipsToSeeNextCard!: number;

  constructor(
    private _gameService: GameService,
    private _playerService: PlayerService,
    private _sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.bigBlind = this._sessionService.bigBlind;
    this.activePlayer$ = this._playerService.getActivePlayer();
    this._gameService
      .getPotObs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: number) => (this.pot = value));

    this._gameService
      .getChipsToSeeNextCardObs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: number) => {
        this.chipsToSeeNextCard = value;
        this.updateRaiseNum();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['player']) this.updateRaiseNum();
  }

  private updateRaiseNum(): void {
    this.raiseNum =
      this.chipsToSeeNextCard + this.bigBlind - (this.player?.stageBet ?? 0);
  }

  onFold(): void {
    this._gameService.setDecisionSubject({
      type: 'fold',
      amount: 0,
    });
  }

  onCall(): void {
    if (!this.player) return;

    let decision: { type: 'call' | 'fold' | 'raise'; amount: number } = {
      type: 'call',
      amount:
        this._gameService.chipsToSeeNextCard$.value - this.player?.stageBet,
    };

    this._gameService.setDecisionSubject({
      type: decision.type,
      amount: decision.amount,
    });
  }

  onRaise(bet?: number): void {
    if (!this.player) return;

    this._gameService.setDecisionSubject({
      type: 'raise',
      amount: bet ?? this.raiseNum,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
