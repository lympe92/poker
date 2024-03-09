import { Component, OnDestroy, OnInit } from '@angular/core';
import { FindWinnerService } from '../../shared/services/find-winner.service';
import { GameService } from '../../shared/services/game.service';
import { SufflingCardsService } from '../../shared/services/suffling-cards.service';
import { MatDialog } from '@angular/material/dialog';
import { GameInfoDialog } from 'src/app/shared/dialogs/game-info-dialog/game-info-dialog.component';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { Observable, Subject, filter, map, takeUntil } from 'rxjs';
import { GameOptions } from 'src/app/models/game-options';
import { Player } from 'src/app/models/player';
import { Card } from 'src/app/models/card';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css'],
})
export class ActionComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();

  raiseNum: number = 0;
  winners!: Player[];
  cards: any[] = [];
  tableCards: Card[] = [];
  pot: number = 0;
  gameStatus: string = 'preFlop';

  players$!: Observable<Player[]>;
  userPlayer$!: Observable<Player>;
  constructor(
    public dialog: MatDialog,
    public _findWinnerService: FindWinnerService,
    public _gameService: GameService,
    public sufflingCards: SufflingCardsService,
  ) {}

  ngOnInit(): void { 
    this._gameService.setPlayers();
    this.players$ = this._gameService.getPlayers();

    this.userPlayer$ = this._gameService
      .getPlayers()
      .pipe(map((player) => player.filter((x) => x.name === 'Me')[0]));
    
    

    this.startGame();
  }

  startGame(): void {
    this._gameService.startGame();
  }

  

  onOpenGameInfoDialog(): void {
    const dialogRef = this.dialog.open(GameInfoDialog, {
      data: {
        animal: 'panda',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }



  playersToSpeak() {
    let i: number = 0;
    // this.players.find((x: any) => {
    //   if (x.toSpeak && x.inPortion) {
    //     i += 1;
    //   }
    // });
    return i;
  }

  playersInPortion() {
    let i: number = 0;
    // this.players.forEach((x: any) => {
    //   if (x.inPortion) {
    //     i += 1;
    //   }
    // });
    return i;
  }

  playersWithChipsInPortion() {
    let i: number = 0;
    // this.players.forEach((x: any) => {
    //   if (x.inPortion && x.chips > 0) {
    //     i += 1;
    //   }
    // });
    return i;
  }

  whoIsActive() {
    let i!: number;
    // this.players.find((x: any) => {
    //   if (x.isActivePlayer && x.inPortion) {
    //     i = x.number;
    //   }
    // });
    return i;
  }

  setDelay() {
    // return Math.floor(Math.random() * this.decisionTime * 100);
  }

  decisions() {
    let activePLayer: number = this.whoIsActive();

    if (activePLayer !== 0) {
      // let status = this.cpu.decision(
      //   this.players[activePLayer].chips,
      //   this.playersPortionBetting,
      //   this.bigBlind
      // );
      // this.playersPortionBetting = +this.cpu.calcBetting(
      //   status,
      //   this.playersPortionBetting,
      //   this.bigBlind
      // );
      // this.players = this.cpu.calcPlayer(
      //   this.players,
      //   activePLayer,
      //   status,
      //   this.playersPortionBetting
      // );
      this.changePlayer(activePLayer);
    }
  }

  toCallDesicions() {
    // setTimeout(() => this.decisions(), this.setDelay());
  }

  changePlayer(activePLayerNumber: number) {
    // deactivates current player and activates the next
    this.deactivatePlayer(activePLayerNumber);
    this.activatePlayer(
      this.nextPlayer(activePLayerNumber),
      this.playersToSpeak()
    );
    // if(this.whoIsActive()!==0){
    this.toCheckStatus();
    // }
  }

  toCheckStatus() {
    // console.log('toCheckStatus');
    // let noneToSpeak: Boolean = true;
    // this.players.forEach((x: Player) => {
    //   if (x.toSpeak && x.inPortion) {
    //     noneToSpeak = false;
    //   }
    // });
    // // in case that only one player is in portion
    // console.log('playersInPortion', this.playersInPortion());
    // console.log(this.playersInPortion() == 1);
    // if (this.playersInPortion() == 1) {
    //   console.log('mpike');
    //   this.sumUpPot();
    //   this.findWinners();
    //   return;
    // }
    // if (this.playersWithChipsInPortion() <= 1 && noneToSpeak) {
    //   this.sumUpPot();
    //   console.log('KASKADER');
    //   do {
    //     this.gameStatus = this.gamePlay.checkStatus(this.gameStatus);
    //     if (this.gameStatus == 'flop') {
    //       this.sufflingCards.sufflingFlop(this.tableCards, this.cards);
    //     }
    //     this.gameStatus = this.gamePlay.checkStatus(this.gameStatus);
    //     if (this.gameStatus == 'turn') {
    //       this.sufflingCards.sufflingTurn(this.tableCards, this.cards);
    //     }
    //     this.gameStatus = this.gamePlay.checkStatus(this.gameStatus);
    //     if (this.gameStatus == 'river') {
    //       this.sufflingCards.sufflingRiver(this.tableCards, this.cards);
    //     }
    //     this.gameStatus = this.gamePlay.checkStatus(this.gameStatus);
    //     // if (this.gameStatus == 'checkings') {
    //     //   this.gamePlay.checkings(
    //     //     this.tableCards,
    //     //     this.playerCards,
    //     //     this.players.length,
    //     //     this.players
    //     //   );
    //     //   this.winners = this.gamePlay.isWinner(this.players);
    //     //   this.players.forEach((x: player) => {
    //     //     this.winners.forEach((y: any) => {
    //     //       if (x == y) {
    //     //         x.chips += this.pot / this.winners.length;
    //     //       }
    //     //     });
    //     //   });
    //     //   setTimeout(() => this.nextGame(), 3000);
    //     //   return;
    //     // }
    //   } while (this.gameStatus == 'checkings');
    // }
    // // if someone want's to speak, calls the desicions again
    // if (!noneToSpeak) {
    //   this.toCallDesicions();
    //   return;
    // }
    // // if no player want's to speak it procceds to sumUp and next Card
    // if (noneToSpeak) {
    //   this.sumUpPot();
    //   this.gameStatus = this.gamePlay.checkStatus(this.gameStatus);
    //   if (this.gameStatus == 'flop') {
    //     this.sufflingCards.sufflingFlop(this.tableCards, this.cards);
    //   }
    //   if (this.gameStatus == 'turn') {
    //     this.sufflingCards.sufflingTurn(this.tableCards, this.cards);
    //   }
    //   if (this.gameStatus == 'river') {
    //     this.sufflingCards.sufflingRiver(this.tableCards, this.cards);
    //   }
    //   if (this.gameStatus == 'checkings') {
    //     // this.gamePlay.checkings(
    //     //   this.tableCards,
    //     //   this.playerCards,
    //     //   this.players.length,
    //     //   this.players
    //     // );
    //     this.findWinners();
    //   }
    //   // to find the smallBlind and activate it for starting next round
    //   if (!(this.gameStatus == 'checkings')) {
    //     this.gamePlay.findSmallBlind(this.players);
    //     this.toCallDesicions();
    //   }
    // }
  }

  findWinners() {
    // this.winners = this.gamePlay.isWinner(this.players);
    // this.players.forEach((x: Player) => {
    //   this.winners.forEach((y: any) => {
    //     if (x == y) {
    //       x.chips += this.pot / this.winners.length;
    //     }
    //   });
    // });
    // setTimeout(() => this.nextGame(), 3000);
  }

  OnIsWinner(number: number) {
    // return this.winners.some((x: any) => x == this.players[number]);
  }

  deactivatePlayer(index: number) {
    // this.players[index].isActivePlayer = false;
    // this.players[index].toSpeak = false;
  }

  nextPlayer(activePLayerNumber: number) {
    activePLayerNumber++;
    // if (activePLayerNumber >= this.players.length) {
    //   activePLayerNumber = 0;
    // }
    return activePLayerNumber;
  }

  activatePlayer(index: number, playersToSpeak: number) {
    // if (playersToSpeak == 0) {
    //   return;
    // }
    // if (
    //   this.players[index].inPortion == false ||
    //   this.players[index].chips == 0
    // ) {
    //   this.players[index].toSpeak = false;
    //   this.activatePlayer(this.nextPlayer(index), this.playersToSpeak());
    //   return;
    // }
    // if (playersToSpeak >= 1) {
    //   this.players[index].isActivePlayer = true;
    // }
  }

  calculateChips(activePLayerNumber: number) {
    let chip500 = 0;
    let chip100 = 0;
    let chip10: number = 0;
    // chip500 = Math.floor(
    //   this.players[activePLayerNumber].temporaryBetting / 500
    // );
    // chip100 = Math.floor(
    //   (this.players[activePLayerNumber].temporaryBetting % 500) / 100
    // );
    // chip10 = Math.floor(
    //   ((this.players[activePLayerNumber].temporaryBetting % 500) % 100) / 10
    // );
    return { chip10, chip100, chip500 };
  }

  sumUpPot() {
    // this.players.forEach((x: Player) => {
    //   this.pot += x.temporaryBetting;
    //   x.temporaryBetting = 0;
    // });
    // this.playersPortionBetting = 0;
  }

  nextGame() {
    // this.pot = 0;
    // // this.playerCards.length = 0;
    // this.tableCards.length = 0;
    // this.winners.length = 0;
    // this.gameStatus = 'preFlop';
    // this.raiseNum = 0;
    // // this.playersPortionBetting = +this._initialService.sendValues(1);
    // this.players = this._playersService.nextPortBlinds(
    //   this.players,
    //   this.bigBlind,
    //   this.smallBlind
    // );
    // // in case that userPlayer is out of game
    // if (!(this.players[0].name === 'Me')) {
    //   this.router.navigate(['/']);
    // }
    // this.cards = this._initialService.getCards();
    // // this.playerCards = this._initialService.playerCardsFunction();
    // // this.sufflingCards.sufflingCards(
    // //   this.playerCards,
    // //   this.cards,
    // //   this.players.length
    // // );
    // this.toCallDesicions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
