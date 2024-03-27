import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { Player } from 'src/app/models/player';
import { PlayerDecision } from 'src/app/models/player-decision';
import { CpuPlayerDecisionsService } from './cpu-player-decisions.service';
import { PlayersTablePositions } from 'src/app/models/players-table-positions';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  players$ = new BehaviorSubject<Player[]>([]);
  activePlayer$ = new BehaviorSubject<Player | null>(null);
  playersTablePositions$ = new ReplaySubject<PlayersTablePositions>();
  constructor(private _cpuDecisionService: CpuPlayerDecisionsService) {}

  generatePlayers(numberOfPlayers: number, chips: number): Player[] {
    let players: Player[] = [
      {
        name: 'Me',
        id: 0,
        chips: +chips,
        bet: 0,
        stageBet: 0,
        cards: [],
        handDetails: null,
        toSpeak: true,
      },
    ];

    for (let i = 1; i < numberOfPlayers; i++) {
      players.push({
        name: 'Cpu Player' + [i],
        id: i,
        chips: +chips,
        bet: 0,
        stageBet: 0,
        cards: [],
        handDetails: null,
        toSpeak: true,
      });
    }
    return players;
  }

  setPlayersTablePositions(value: PlayersTablePositions): void {
    this.playersTablePositions$.next(value);
  }

  getPlayers(): Observable<Player[]> {
    return this.players$.asObservable();
  }

  getPlayersTablePositions(): Observable<PlayersTablePositions> {
    return this.playersTablePositions$.asObservable();
  }

  getActivePlayer(): Observable<Player | null> {
    return this.activePlayer$.asObservable();
  }

  getModifiedPlayersArray(modifiedPlayers: Player[]): Player[] {
    let players = this.getPlayersFromSubject();

    modifiedPlayers.forEach((player: Player) => {
      let playerIndex = this.findIndexOfPlayer(player);
      players.splice(playerIndex, 1, player);
    });

    return players;
  }

  findNextPlayerWithCardsById(playerId: number): Player {
    let player = this.getPlayersWithCardsFromSubject().find(
      (pl: Player) => pl.id > playerId
    );
    return player ? player : this.getPlayerWithCardsFromSubject(0);
  }

  findNextPlayerById(playerId: number): Player {
    let player = this.getPlayersFromSubject().find(
      (pl: Player) => pl.id > playerId
    );
    return player ? player : this.getPlayerFromSubject(0);
  }

  getPlayerFromSubject(playerIndex: number): Player {
    return this.getPlayersFromSubject()[playerIndex];
  }

  getPlayersFromSubject(): Player[] {
    return JSON.parse(JSON.stringify(this.players$.getValue()));
  }

  getPlayerWithCardsFromSubject(playerIndex: number): Player {
    return this.getPlayersWithCardsFromSubject()[playerIndex];
  }

  getPlayersWithCardsFromSubject(): Player[] {
    return this.getPlayersFromSubject().filter(
      (player: Player) => player.cards.length > 0
    );
  }

  findIndexOfPlayer(player: Player): number {
    let players = this.getPlayersFromSubject();

    return players.findIndex((pl: Player) => pl.id === player.id);
  }

  getRandomPlayer(): Player {
    let players = this.getPlayersFromSubject();
    const randomIndex = Math.floor(Math.random() * players.length);
    return players[randomIndex];
  }

  isAnyPlayerToSpeak(): boolean {
    let players = this.getPlayersWithCardsFromSubject();
    return players.some((player: Player) => player.toSpeak);
  }

  setPlayersWithCardToSpeak(): Player[] {
    let players = this.getPlayersFromSubject();
    players.forEach((player: Player) => {
      if (player.cards.length > 0) {
        player.toSpeak = true;
      }
    });
    return players;
  }

  findIndexOfPlayerOrNextPlayer(player: Player): number {
    let playersWithCards = this.getPlayersWithCardsFromSubject();

    let index = playersWithCards.findIndex((pl: Player) => pl.id >= player.id);
    if (index === -1) index = 0;
    return index;
  }

  clearPlayersBets(players: Player[]): Player[] {
    players.forEach((player: Player) => (player.stageBet = 0));
    return players;
  }

  updateFoldedPlayer(player: Player): void {
    player.cards = [];
    player.toSpeak = false;
    player.stageBet = 0;
  }

  updateCallPlayer(player: Player, amount: number): void {
    player.toSpeak = false;
    player.chips = player.chips - amount;
    player.bet += amount;
    player.stageBet += amount;
  }

  updateRaisePlayer(player: Player, amount: number): void {
    let players = this.setPlayersWithCardToSpeak();
    this.players$.next(players);
    player.toSpeak = false;
    player.chips = player.chips - amount;
    player.bet += amount;
    player.stageBet += amount;
  }

  getRightUpdatePlayerFunction(cpuDecision: any, player: Player) {
    if (cpuDecision.type === 'fold')
      return () => this.updateFoldedPlayer(player);

    if (cpuDecision.type === 'call')
      return () => this.updateCallPlayer(player, cpuDecision.amount);

    return () => this.updateRaisePlayer(player, cpuDecision.amount);
  }

  decideCpuPlayerDecision(player: any, chipsToCall: number): PlayerDecision {
    let cpuDecision = this._cpuDecisionService.getCpuDecision(
      player,
      chipsToCall
    );

    let updatePlayer = this.getRightUpdatePlayerFunction(cpuDecision, player);

    const decision: PlayerDecision = {
      type: cpuDecision.type,
      amount: cpuDecision.amount,
      updatePlayer: updatePlayer,
    };

    return decision;
  }
}
