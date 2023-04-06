import { Injectable } from "@angular/core";
import { player } from "./generate-players";

@Injectable({
    providedIn: 'root'
  })

export class playersService {
  
  generatePlayers(numberOfPlayers:number,bigBlind:number,smallBlind:number,chips:number){
    let players:player[]=[{number:1,name:'Me',id:0,chips:chips,isDealer:false,isBigBlind:false,isSmallBlind:false,isActivePlayer:false,temporaryBetting:0,toSpeak:true,inPortion:true,bestHand:[]},
      {number:0,name:'Cpu Player 1',id:1,chips:chips,isDealer:false,isBigBlind:false,isSmallBlind:false,isActivePlayer:false,temporaryBetting:0,toSpeak:true,inPortion:true,bestHand:[]},
    ]; 
    // generating Players
    if(numberOfPlayers>2){
      for(let i=2;i<numberOfPlayers;i++){
        players.push(new player(i,'Cpu Player'+ [i],i,chips,false,false,false,false,0,true,true,[]))
      }
    }
    // desides the blind players for first time. These values appear at players id's. Id 0 is the dealer
    let j=Math.floor(Math.random()*players.length);
    let dealerPlayer=j;
    this.blindsDispenser(j,players,bigBlind,smallBlind);
    this.idDispenser(dealerPlayer,players);
    return players;
  }

  blindsDispenser(j:any,players:any,bigBlind:number,smallBlind:number){
    players[j].isDealer=true;
    j++;
    if(j>players.length-1){
      j=0;
    }
    players[j].isSmallBlind=true;
    players[j].temporaryBetting=+smallBlind;
    players[j].chips-=players[j].temporaryBetting;
    j++;
    if(j>players.length-1){
      j=0;
    }
    players[j].isBigBlind=true;
    players[j].temporaryBetting=+bigBlind;
    players[j].chips-=players[j].temporaryBetting;
    players[j].id=2;
    j++;
    if(j>players.length-1){
      j=0;
    }
    players[j].isActivePlayer=true;
  }

  idDispenser(dealerPlayer:number,players:any){
    // gives player id's according to dealer
    for(let i=0;i<players.length;i++){
      if(dealerPlayer+i>players.length-1){
        dealerPlayer=-i;
      }
      players[dealerPlayer + i].id=i;
    }
    for(let i=0;i<players.length;i++){
      players[i].number=i;
    }
  }

  nextPortBlinds(players:any,bigBlind:number,smallBlind:number){
    // Number of dealer player
    let NoOfDealer:number= players.find((x:player)=>x.isDealer==true).number;
    let dealerPlayer:number=NoOfDealer;
    // removes the goner players
    let zeroChipPlayers:player[]=[];
    players.forEach((x:player)=>{if(x.chips==0){zeroChipPlayers.push(x)}})
    players = players.filter((x:any) => !zeroChipPlayers.includes(x));

    // next dealer
    NoOfDealer++;
    if(NoOfDealer>players.length-1){
      NoOfDealer=0;
    }
   
    // restarts the players properties
    players.forEach((x:player)=> {x.inPortion=true; x.toSpeak=true; x.isActivePlayer=false;x.isDealer=false;x.isSmallBlind=false;x.isBigBlind=false;})
    this.blindsDispenser(NoOfDealer,players,bigBlind,smallBlind);
    this.idDispenser(dealerPlayer,players);
    return players;
  }
}