import { Injectable } from '@angular/core';
import { GamePlayService } from './game-play.service';
import { player } from './generate-players';
import { playersService } from './players.service';

@Injectable({
  providedIn: 'root'
})
export class CpuPlayerDecisionsService {
  action:number=0;
  constructor(private player:playersService,private gamePlay:GamePlayService) { }

  calcBetting(status:string,playersPortionBetting:number,bigBlind:number){
    if(status=="raise"){
      playersPortionBetting+=bigBlind;
    }
    return playersPortionBetting;
  }

  calcPlayer(players:any,x:number,status:string,playersPortionBetting:number){
    if(status=="fold"){
      console.log("fold");
      players[x].inPortion=false;
      players[x].toSpeak=false;
    }
    if(status=="call"){
      console.log("call");
      let chipsToCall=+Math.min(Math.max(playersPortionBetting-players[x].temporaryBetting, 0), players[x].chips);
      players[x].temporaryBetting=+Math.min(Math.max(playersPortionBetting, 0), players[x].chips);
      players[x].chips-=chipsToCall;
    }
    if(status=="raise"){
      console.log("raise");
      let chipsToCall=+Math.min(Math.max(playersPortionBetting-players[x].temporaryBetting, 0), players[x].chips);
      players[x].temporaryBetting=+Math.min(Math.max(playersPortionBetting, 0), players[x].chips);
      players[x].chips-=chipsToCall;
      players.forEach((x:any)=>{if(x.inPortion && x.chips>0){x.toSpeak=true}}); 
    }
    return players;
  }

  decision(chips:number,playersPortionBetting:number,bigBlind:number){ 
    this.action=Math.round(Math.random()*2);
    if(this.action==2 && !(chips>=playersPortionBetting+bigBlind)){
      this.action=1;
    }
    switch (this.action) {
      case 0:
          return "fold";     
        case 1:
          return "call";
        case 2:
           return "raise";             
        default:
          return '';
    }
  }

}