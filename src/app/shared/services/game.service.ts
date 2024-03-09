import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  delay,
  take,
  takeUntil,
} from 'rxjs';
import { Player } from 'src/app/models/player';
import { SessionStorageService } from './session-storage.service';
import { GameOptions } from 'src/app/models/game-options';
import { BlindPlayers } from 'src/app/models/blind-players';
import { CpuPlayerDecisionsService } from './cpu-player-decisions.service';
import { CardsService } from './cards.service';

@Injectable({
  providedIn: 'root',
})
export class GameService implements OnDestroy {
  destroy$ = new Subject<void>();

  players$ = new BehaviorSubject<Player[]>([]);
  pot$ = new BehaviorSubject<number>(0);
  chipsToCall$ = new BehaviorSubject<number>(0);
  playerToSpeak$ = new ReplaySubject<Player>();

  constructor(
    private _sessionService: SessionStorageService,
    private _cardsService: CardsService,
    private _cpuDecisionService: CpuPlayerDecisionsService
  ) {
    this.playerToSpeak();
  }

  getPlayers(): Observable<Player[]> {
    return this.players$.asObservable();
  }

  setPlayers(): void {
    this._sessionService
      .getGameOptionsFromSessionStorage()
      .pipe(take(1))
      .subscribe((gameOptions: GameOptions) =>
        this.generatePlayers(gameOptions.numberOfPlayers, gameOptions.chips)
      );
  }

  generatePlayers(numberOfPlayers: number, chips: number) {
    let players: Player[] = [
      {
        name: 'Me',
        id: 0,
        chips: chips,
        isDealer: false,
        isBigBlind: false,
        isSmallBlind: false,
        isActivePlayer: false,
        temporaryBetting: 0,
        toSpeak: true,
        inPortion: true,
        bestHand: [],
        cards: [],
      },
    ];

    for (let i = 1; i < numberOfPlayers; i++) {
      players.push({
        name: 'Cpu Player' + [i],
        id: i,
        chips: chips,
        isDealer: false,
        isBigBlind: false,
        isSmallBlind: false,
        isActivePlayer: false,
        temporaryBetting: 0,
        toSpeak: true,
        inPortion: true,
        bestHand: [],
        cards: [],
      });
    }

    this.players$.next(players);
  }

  startGame(): void {
    this.startFirstPortion();
  }

  startFirstPortion(): void {
    let players$ = this.getPlayers();
    players$.pipe(take(1)).subscribe((players: Player[]) => {
      this.setBlinds(players);
      this.startNewPortion(players);
    });
  }

  setBlinds(players: Player[]): void {
    let blindPlayers = this.getBlindPlayers(players);
    this.resetPlayersPositons(players);
    this.setBlindPlayers(blindPlayers);
  }

  startNewPortion(players: Player[]): void {
    this._cardsService.setPortionCards(players);
    this.setActivePlayerToSpeak();
  }

  setActivePlayerToSpeak(): void {
    let player =this.findActivePlayer()
    if (player) this.playerToSpeak$.next(player);
    // if(!player)this.checkIfGoToNextGameStatusOrNextPortion
  }

  findActivePlayer():Player|undefined{
   return this.players$.value.find((player: Player) => player.isActivePlayer && player.inPortion);
  }

  findNextActivePlayer(player:Player):Player|undefined{
    let playersInPortion=this.players$.value.filter((pl:Player)=>pl.inPortion)

    


    return this.players$.value.find((player: Player) => player.isActivePlayer && player.inPortion);
   }

  setNextActivePlayer(player: Player): void {
    let index = this.players$.value.findIndex(
      (pl: Player) => pl.id == player.id
    );
    let nextIndex = index + 1 === this.players$.value.length ? 0 : index + 1;
    player.isActivePlayer = false;
    this.players$.value[nextIndex].isActivePlayer = true;
    this.playerToSpeak$.next(this.players$.value[nextIndex]);
  }

  playerToSpeak(): void {
    this.playerToSpeak$
      .pipe(
        takeUntil(this.destroy$),
        delay(this._sessionService.decisionTime * Math.random() * 1000)
      )
      .subscribe((player: Player) => {
        let decision = this._cpuDecisionService.getDecision(
          player,
          this.chipsToCall$.value
        );

        this.updatePlayerBetAndChips(player, decision);
        this.setNextActivePlayer(player);
      });
  }

  updatePlayerBetAndChips(player: Player, decision: string): void {
    if (decision === 'fold') this.updateFoldedPlayer(player);

    if (decision === 'call/check') this.updateCheckedPlayer(player);

    if (decision === 'raise') this.updateRaisedPlayer(player);
  }

  updateFoldedPlayer(player: Player): void {
    player.inPortion = false;
    player.toSpeak = false;
    player.temporaryBetting = 0;
  }

  updateCheckedPlayer(player: Player): void {
    let chipsToBet = this.chipsToCall$.value - player.temporaryBetting;
    if (chipsToBet === 0) return;

    player.toSpeak = false;
    player.temporaryBetting = this.chipsToCall$.value;
    player.chips -= chipsToBet;
  }

  updateRaisedPlayer(player: Player): void {
    let chipsToBet = this.chipsToCall$.value + this._sessionService.bigBlind;

    player.toSpeak = false;
    player.temporaryBetting = chipsToBet;
    player.chips += this._sessionService.bigBlind;
  }

  getBlindPlayers(players: Player[]): BlindPlayers {
    let dealerPlayerIndex = this.findDealerIndex(players);
    let smallBlindPlayerIndex =
      players.length === dealerPlayerIndex + 1 ? 0 : dealerPlayerIndex + 1;
    let bigBlindPlayerIndex =
      players.length === smallBlindPlayerIndex + 1
        ? 0
        : smallBlindPlayerIndex + 1;
    let underTheGunPlayerIndex =
      players.length === bigBlindPlayerIndex + 1 ? 0 : bigBlindPlayerIndex + 1;

    let blindPlayers: BlindPlayers = {
      dealer: players[dealerPlayerIndex],
      smallBlind: players[smallBlindPlayerIndex],
      bigBlind: players[bigBlindPlayerIndex],
      underTheGun: players[underTheGunPlayerIndex],
    };

    return blindPlayers;
  }

  findDealerIndex(players: Player[]): number {
    let index = players.findIndex((player: Player) => player.isDealer);
    let randomDealerIndex = Math.floor(Math.random() * players.length);

    return index >= 0 ? index : randomDealerIndex;
  }

  setBlindPlayers(players: BlindPlayers): void {
    this.setDealer(players.dealer);
    this.setSmallBlindPlayer(players.smallBlind);
    this.setBigBlindPlayer(players.bigBlind);
    this.setActivePlayer(players.underTheGun);
  }

  setDealer(player: Player): void {
    player.isDealer = true;
  }

  setSmallBlindPlayer(player: Player): void {
    player.isSmallBlind = true;
  }

  setBigBlindPlayer(player: Player): void {
    player.isBigBlind = true;
  }

  setActivePlayer(player: Player): void {
    player.isActivePlayer = true;
  }

  resetPlayersPositons(players: Player[]): void {
    players.forEach((player: Player) => {
      player.isBigBlind = false;
      player.isSmallBlind = false;
      player.isDealer = false;
      player.isActivePlayer = false;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
