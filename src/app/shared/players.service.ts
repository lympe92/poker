import { Injectable } from "@angular/core";
import { player } from "./generate-players";

@Injectable({
    providedIn: 'root'
  })

export class playersService {
  
  smallBlindPlayer!:number;
  bigBlindPlayer!:number;
  


  
  generatePlayers(numberOfPlayers:number,bigBlind:number,smallBlind:number,chips:number){
    console.log("generatePlayers");
   let players:player[]=[{number:0,name:'Cpu Player 1',id:0,chips:chips,isDealer:false,isBigBlind:false,isSmallBlind:false,isActivePlayer:false,bettingAmount:0,temporaryBetting:0,toSpeak:true,inPortion:true,bestHand:[]},
    {number:1,name:'Me',id:1,chips:chips,isDealer:false,isBigBlind:false,isSmallBlind:false,isActivePlayer:false,bettingAmount:0,temporaryBetting:0,toSpeak:true,inPortion:true,bestHand:[]},
  ]; 
      // generating Players
      if(numberOfPlayers>2){
        for(let i=2;i<numberOfPlayers;i++){
          players.push(new player(i,'Cpu Player'+ [i],i,chips,false,false,false,false,0,0,true,true,[]))
        }
      }

      // desides who is the first dealer,small and big blind. These values appear at players id's. Id 0 is the dealer
    let j=Math.floor(Math.random()*players.length);
    players[j].isDealer=true;
    let dealerPlayer=j;
    j++;
    if(j>players.length-1){
      j=0;
    }
    players[j].isSmallBlind=true;
    players[j].temporaryBetting=+smallBlind;
    players[j].chips-=players[j].temporaryBetting;
    this.smallBlindPlayer=j;
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

    this.idDispenser(dealerPlayer,players);
    return players;
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

    nextPortBlinds(players:any,bigBlind:number,smallBlind:number,){
  
      let NoOfDealer:number= players.find((x:player)=>x.isDealer==true).number;

      players.forEach((x:any)=>{if(x.chips==0){players.splice(x.number,1)}})

      players.forEach((x:player)=> {x.inPortion=true; x.toSpeak=true; x.isActivePlayer=false;x.isDealer=false;x.isSmallBlind=false;x.isBigBlind=false;})
      
      if(NoOfDealer>players.length-1){
        NoOfDealer=0;
      }
      NoOfDealer++;
      console.log(NoOfDealer)
      if(NoOfDealer>players.length-1){
        NoOfDealer=0;
      }
      players[NoOfDealer].isDealer=true;
      let dealerPlayer:number=NoOfDealer;
      NoOfDealer++;
      console.log(NoOfDealer)
      if(NoOfDealer>players.length-1){
        NoOfDealer=0;
      }
      players[NoOfDealer].isSmallBlind=true;
      players[NoOfDealer].temporaryBetting=+smallBlind;
      NoOfDealer++;
      console.log(NoOfDealer)
      if(NoOfDealer>players.length-1){
        NoOfDealer=0;
      }
      players[NoOfDealer].isBigBlind=true;
      players[NoOfDealer].temporaryBetting=+bigBlind;
      NoOfDealer++;
      console.log(NoOfDealer)
      if(NoOfDealer>players.length-1){
        NoOfDealer=0;
      }
      players[NoOfDealer].isActivePlayer=true;
      this.idDispenser(dealerPlayer,players);
      console.log(players);
     
      return players;
     
    }
  }