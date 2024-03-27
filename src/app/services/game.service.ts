import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  take,
  takeUntil,
} from 'rxjs';
import { Player } from 'src/app/models/player';
import { SessionStorageService } from './session-storage.service';
import { GameOptions } from 'src/app/models/game-options';
import { CardsService } from './cards.service';
import { PlayerService } from './player.service';
import { PlayersTablePositions } from 'src/app/models/players-table-positions';
import { PlayerDecision } from 'src/app/models/player-decision';
import { FindWinnerService } from './find-winner.service';
enum portionPhase {
  PreFlop = 'preFlop',
  Flop = 'flop',
  Turn = 'turn',
  River = 'river',
  End = 'end',
}

@Injectable({
  providedIn: 'root',
})
export class GameService implements OnDestroy {
  gamePhases: portionPhase[] = [
    portionPhase.PreFlop,
    portionPhase.Flop,
    portionPhase.Turn,
    portionPhase.River,
    portionPhase.End,
  ];
  currentPhaseIndex: number = 0;
  public portionPhase$ = new BehaviorSubject<portionPhase>(
    this.gamePhases[this.currentPhaseIndex]
  );
  private destroy$ = new Subject<void>();
  public pot$ = new BehaviorSubject<number>(0);
  public userDecision$ = new Subject<any>();
  public chipsToSeeNextCard$ = new BehaviorSubject<number>(
    this._sessionService.bigBlind
  );
  playersTablePositions$!: Subscription;
  playersTablePositions!: PlayersTablePositions;

  constructor(
    private _sessionService: SessionStorageService,
    private _cardsService: CardsService,
    private _playerService: PlayerService,
    private _findWinnerService: FindWinnerService
  ) {
    this.getTablePositionPlayers();
    this.setPlayers();
  }

  getUserDecisionObs(): Observable<any> {
    return this.userDecision$.asObservable();
  }

  getChipsToSeeNextCardObs(): Observable<number> {
    return this.chipsToSeeNextCard$.asObservable();
  }

  getPotObs(): Observable<number> {
    return this.pot$.asObservable();
  }

  getPortionPhaseObs(): Observable<portionPhase> {
    return this.portionPhase$.asObservable();
  }

  getTablePositionPlayers(): void {
    this.playersTablePositions$ = this._playerService
      .getPlayersTablePositions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (positions: PlayersTablePositions) =>
          (this.playersTablePositions = positions)
      );
  }

  setPlayers(): void {
    this._sessionService
      .getGameOptionsFromSessionStorage()
      .pipe(take(1))
      .subscribe((gameOptions: GameOptions) => {
        let players = this._playerService.generatePlayers(
          gameOptions.numberOfPlayers,
          gameOptions.chips
        );
        this._playerService.players$.next(players);
      });
  }

  startGame(): void {
    this.startFirstPortion();
  }

  private startFirstPortion(): void {
    //this obs controls the protion phases
    this.getPortionPhaseObs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((portionPhase: portionPhase) => {

        let players = this._playerService.setPlayersWithCardToSpeak();
        players = this._playerService.clearPlayersBets(players);
        this._playerService.players$.next(players);

        if (portionPhase === 'preFlop') {
          this.dealCards();
          this.setPlayersTablePositions();
          this.startPortionLoop();
        }
        if (['flop', 'turn', 'river'].includes(portionPhase))
          this.startLoopWithSmallBlindOrNext();
        if (portionPhase === 'end') this.findWinners();
      });
  }

  private dealCards(): void {
    const players = this._playerService
      .getPlayersFromSubject()
      .filter((pl: Player) => pl.chips > 0);

    const modifiedPlayers = this._cardsService.setPortionCards(players);
    this._playerService.players$.next(modifiedPlayers);
  }

  private setPlayersTablePositions(): void {
    //if there is dealer set as dealer the next player, if not get a random
    const dealer = this.playersTablePositions?.dealer
      ? this._playerService.findNextPlayerById(
          this.playersTablePositions?.dealer.id
        )
      : this._playerService.getRandomPlayer();

    const smallBlind = this._playerService.findNextPlayerById(dealer.id);
    const bigBlind = this._playerService.findNextPlayerById(smallBlind.id);
    const underTheGun = this._playerService.findNextPlayerById(bigBlind.id);

    let playersTablePositions: PlayersTablePositions = {
      dealer: dealer,
      smallBlind: smallBlind,
      bigBlind: bigBlind,
      underTheGun: underTheGun,
    };

    this._playerService.setPlayersTablePositions(playersTablePositions);
  }

  private startPortionLoop() {
    this.chipsToSeeNextCard$.next(this._sessionService.bigBlind);
    this.setBlinds();
    this.startLoopWithUnderTheGun();
  }

  private setBlinds() {
    this.playersTablePositions.smallBlind.stageBet =
      this._sessionService.smallBlind;
    this.playersTablePositions.smallBlind.bet = this._sessionService.smallBlind;
    this.playersTablePositions.smallBlind.chips -=
      this.playersTablePositions.smallBlind.stageBet;

    this.playersTablePositions.bigBlind.stageBet =
      this._sessionService.bigBlind;
    this.playersTablePositions.bigBlind.bet = this._sessionService.bigBlind;
    this.playersTablePositions.bigBlind.chips -=
      this.playersTablePositions.bigBlind.stageBet;

    let modifiedPlayers = this._playerService.getModifiedPlayersArray([
      this.playersTablePositions.smallBlind,
      this.playersTablePositions.bigBlind,
    ]);
    this.pot$.next(
      this._sessionService.smallBlind + this._sessionService.bigBlind
    );
    this._playerService.players$.next(modifiedPlayers);
  }

  private startLoopWithUnderTheGun() {
    let index = this._playerService.findIndexOfPlayerOrNextPlayer(
      this.playersTablePositions.underTheGun
    );

    this.calcPlayerDecision(
      this._playerService.getPlayerWithCardsFromSubject(index)
    );
  }

  private startLoopWithSmallBlindOrNext() {
    this.chipsToSeeNextCard$.next(0);
    let index = this._playerService.findIndexOfPlayerOrNextPlayer(
      this.playersTablePositions.smallBlind
    );

    this.calcPlayerDecision(
      this._playerService.getPlayerWithCardsFromSubject(index)
    );
  }

  private async calcPlayerDecision(player: Player) {
    this._playerService.activePlayer$.next(player);
    let isUserPlayer = player.name == 'Me' ? true : false;

    if (!isUserPlayer) {
      let decision =
        player.chips > 0
          ? await this.getCpuPlayerDecision(player)
          : this.getAutoCallPlayerDecision(player);

      this.executeDecision(decision, player);

      this.continueToNextPlayer(player);
    } else {
      this.getUserDecisionObs()
        .pipe(take(1))
        .subscribe((decision: any) => {
          decision.updatePlayer =
            this._playerService.getRightUpdatePlayerFunction(decision, player);
          this.executeDecision(decision, player);

          this.continueToNextPlayer(player);
        });

      //guard to auto-call if has no chips
      if (
        player.chips === 0 ||
        this._playerService
          .getPlayersWithCardsFromSubject()
          .filter((player: Player) => player.name != 'Me' && player.chips == 0)
          .length > 0
      )
        this.userDecision$.next({ type: 'call', amount: 0 });
    }
  }

  private executeDecision(decision: PlayerDecision, player: Player): void {
    decision.updatePlayer();
    this.pot$.next(this.pot$.value + decision.amount);

    if (decision.type != 'fold') {
      let chipsToSeeNextCard =
        this.chipsToSeeNextCard$.value > player.stageBet
          ? this.chipsToSeeNextCard$.value
          : player.stageBet;
      this.chipsToSeeNextCard$.next(chipsToSeeNextCard);
    }
  }

  private getCpuPlayerDecision(player: Player): Promise<any> {
    const delay = Math.random() * (this._sessionService.decisionTime*1000) + 1000; // Από 1000 έως 5000 ms (1 έως 5 δευτερόλεπτα)
    let decision = this._playerService.decideCpuPlayerDecision(
      player,
      this.chipsToSeeNextCard$.value
    );

    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(decision);
      }, delay)
    );
  }

  private getAutoCallPlayerDecision(player: Player): PlayerDecision {
    return {
      type: 'call',
      amount: 0,
      updatePlayer: () => this._playerService.updateCallPlayer(player, 0),
    };
  }

  setDecisionSubject(value: any): void {
    this.userDecision$.next(value);
  }

  private continueToNextPlayer(player: Player): void {
    this._playerService.activePlayer$.next(null);

    this._playerService.players$.next(
      this._playerService.getModifiedPlayersArray([player])
    );

    if (this._playerService.getPlayersWithCardsFromSubject().length < 2) {
      this.findWinners();
      return;
    }

   // if there isn't player to speak go to next Portion guard
    if (!this._playerService.isAnyPlayerToSpeak()) {
      this.moveToNextPortionPhase();
      return;
    }

    let nextPlayer = this._playerService.findNextPlayerWithCardsById(player.id);
    this.calcPlayerDecision(nextPlayer);
  }

  private findWinners(): void {
    let rankedPlayers = this._findWinnerService.findWinners(
      this._playerService.getPlayersWithCardsFromSubject()
    );
    this.setPlayersAwardsAndClearPot(rankedPlayers);

    this.nextPortion();
  }

  private nextPortion():void {
    this.currentPhaseIndex = 0;

    let players = this._playerService.getPlayersFromSubject();
    players.forEach((player: Player) => {
      player.cards = [];
      player.toSpeak = true;
      player.handDetails = null;
      player.stageBet = 0;
      player.bet = 0;
    });
    this._playerService.players$.next(players);
    this.chipsToSeeNextCard$.next(0);

    setTimeout(() => {
      this.portionPhase$.next(portionPhase.PreFlop);
    }, 2000);
  }

  private setPlayersAwardsAndClearPot(rankedPlayers: Player[]) {
    let players = this._playerService.getPlayersFromSubject();

    let playersAwards: { playerId: number; award: number }[] = [];

    for (const player of rankedPlayers) {
      let playerAward = 0;
      players.forEach((pl: Player) => {
        if (player.bet >= pl.bet) {
          playerAward += pl.bet;
          pl.bet = 0;
        } else {
          playerAward += player.bet;
          pl.bet -= player.bet;
        }
      });

      this.pot$.next(this.pot$.value - playerAward);

      if (player.handDetails?.isSplit) {
        let splittedPlayers = rankedPlayers.filter(
          (pl: Player, index: number) =>
            rankedPlayers.indexOf(player) < index &&
            rankedPlayers[index - 1].handDetails?.isSplit
        );
        splittedPlayers.push(player);
        splittedPlayers.forEach((player: Player) => {
          playersAwards.push({
            playerId: player.id,
            award: playerAward / splittedPlayers.length,
          });

        });
      } else {
        playersAwards.push({ playerId: player.id, award: playerAward });
      }

      if (this.pot$.value === 0) break;
    }
    
    playersAwards.forEach(
      (value: any) => (players[value.playerId].chips += value.award)
    );

    this._playerService.players$.next(players);
  }

  private moveToNextPortionPhase(): void {
    if (this.currentPhaseIndex < this.gamePhases.length - 1) {
      this.currentPhaseIndex++;

      setTimeout(() => {
        this.portionPhase$.next(this.gamePhases[this.currentPhaseIndex]);
      }, 2000);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
