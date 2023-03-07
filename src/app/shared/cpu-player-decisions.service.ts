import { Injectable } from '@angular/core';
import { playersService } from './players.service';

@Injectable({
  providedIn: 'root'
})
export class CpuPlayerDecisionsService {
  action:number=0;
  constructor(private player:playersService) { }


fold(x:number){
  
  console.log("fold");
  this.player.players[x].toSpeak=false;
  this.player.players[x].chips-=this.player.players[x].bettingAmount;
}

call(x:number){
  console.log("call");
  this.player.players[x].toSpeak=false;
  this.player.players[x].temporaryBetting=this.player.chipsToCall; 
}

raise(x:number){
  console.log("raise");
  this.player.players[x].toSpeak=false;
  this.player.players[x].temporaryBetting+=this.player.chipsToCall>0 ?this.player.chipsToCall*3 :this.player.bigBlind;
  this.player.chipsToCall=this.player.players[x].temporaryBetting;
}


decision(x:number){ 
   console.log(this.player.players[x]);
    this.action=Math.floor(Math.random()*2);
    switch (this.action) {
      case 0:
          this.fold(x);     
        break;
        case 1:
          this.call(x);
        break;
        case 2:
          this.raise(x);      
        break;
    }
 

 
 
}

}