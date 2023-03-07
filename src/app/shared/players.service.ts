import { Injectable } from "@angular/core";
import { player } from "./generate-players";

@Injectable({
    providedIn: 'root'
  })

export class playersService {
  bigBlind:number=10;
  smallBlind:number=this.bigBlind/2;
  decisionTime:number=0;
  numberOfPlayers:number=0;
  dealerPlayer!:number;
  smallBlindPlayer!:number;
  bigBlindPlayer!:number;
  chipsToCall:number=0;

  get temporaryRaise() {return this.bigBlind + this.players[0].temporaryBetting};
  get isActivedashboard():boolean {return this.players[1].isActivePlayer};

players=[{number:0,name:'Cpu Player 1',id:0,chips:0,isDealer:false,isBigBlind:false,isSmallBlind:false,isActivePlayer:false,bettingAmount:0,temporaryBetting:0,toSpeak:true},
  {number:1,name:'Me',id:1,chips:0,isDealer:false,isBigBlind:false,isSmallBlind:false,isActivePlayer:false,bettingAmount:0,temporaryBetting:0,toSpeak:true},
]; 
  
getPlayers(){
  return this.players;
}


generatePlayers(){
    // generating Players
     if(this.numberOfPlayers>2){
      for(let i=2;i<this.numberOfPlayers;i++){
        this.players.push(new player(i,'Cpu Player'+ [i],i,this.players[0].chips,false,false,false,false,0,0,true))
}
    }
    // desides who is the first dealer,small and big blind. These values appear at players id's. Id 0 is the dealer
   let j=Math.floor(Math.random()*this.players.length);
   this.players[j].isDealer=true;
   this.dealerPlayer=j;
   j++;
   if(j>this.players.length-1){
     j=0;
   }
   this.players[j].isSmallBlind=true;
   this.smallBlindPlayer=j;
   j++;
   if(j>this.players.length-1){
     j=0;
   }
   this.players[j].isBigBlind=true;
   this.players[j].id=2;
   j++;
   if(j>this.players.length-1){
     j=0;
   }
   this.players[j].isActivePlayer=true;
   console.log(this.players[j].isActivePlayer);
   console.log(this.players);
   // gives player id's according to dealer
   let k=this.dealerPlayer;
   for(let i=0;i<this.players.length;i++){
     if(k+i>this.players.length-1){
       k=-i;
     }
     this.players[k + i].id=i;
   }
   console.log(this.players);


  }
}