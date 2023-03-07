import { Injectable } from '@angular/core';
import { every, find, findIndex, pipe, timer } from 'rxjs';
import { CardsService } from './cards.service';
import { CpuPlayerDecisionsService } from './cpu-player-decisions.service';
import { player } from './generate-players';
import { playersService } from './players.service';
import { SufflingCardsService } from './suffling-cards.service';

@Injectable({
  providedIn: 'root'
})
export class GamePlayService {
 
  pot:number=0;
  noneIsActive=true;
  gameStatus='preFlop';

  constructor(private suffling:SufflingCardsService, private cards:CardsService, private player:playersService) { 
  }

  

  afterBettingSumChips(){
    this.pot+=this.player.players[0].temporaryBetting+this.player.players[1].temporaryBetting;
    this.player.players[0].bettingAmount+=this.player.players[0].temporaryBetting;
    this.player.players[1].bettingAmount+=this.player.players[1].temporaryBetting;
    this.player.players[0].temporaryBetting=0;
    this.player.players[1].temporaryBetting=0;
  }


  checkStatus(){ 
    
    this.noneIsActive=true;
    this.player.players.forEach((x)=>{
      if(x.toSpeak){
        this.noneIsActive=false;
      }
    });
    if(this.noneIsActive && this.gameStatus=='preFlop'){
      this.noneIsActive=!this.noneIsActive;
      this.suffling.sufflingFlop();
       this.gameStatus='flop';
    }
    if(this.noneIsActive && this.gameStatus=='flop'){
      this.noneIsActive=!this.noneIsActive;
      this.suffling.sufflingTurn();
       this.gameStatus='turn'; 
    }
    if(this.noneIsActive && this.gameStatus=='turn'){
      this.noneIsActive=!this.noneIsActive;
      this.suffling.sufflingRiver();
       this.gameStatus='river';
    }
    this.player.players.forEach((x)=>{
    x.toSpeak=true;
    })
  }

  

  changeActivePlayer(){
    let activePLayerNumber!:number;
    this.player.players.find((x:any)=>{
      if(x.isActivePlayer){
        console.log(x);
        x.isActivePlayer=false;
        activePLayerNumber=x.number;
        
      }
    });
    if(activePLayerNumber!==1){
     this.nextPlayer(activePLayerNumber);
    }
    if(activePLayerNumber==1){
      this.player.players[1].isActivePlayer=true;
    }
    this.checkStatus();
  }
 

  nextPlayer(x:number){
    if((x+1)==(this.player.players.length)){
      this.player.players[0].isActivePlayer=true;
    }
    if((x+1)!==(this.player.players.length)){
      this.player.players[(x+1)].isActivePlayer=true;
    }
    this.changeActivePlayer();
  }

  nextGame(){
    // this.player.players[0].bettingAmount=0;
    // this.player.players[1].temporaryBetting=0;
    // this.player.players[1].bettingAmount=0;
    // this.player.players[1].temporaryBetting=0;
    // this.pot=0;
    // this.cards.startgame();
    // this.gameStatus='preFlop';
    // this.suffling.sufflingCards();
  }
}
