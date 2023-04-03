import { ChangeDetectorRef, Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, map, merge, Observable, of, Subject } from 'rxjs';
import { card } from '../shared/card';
import { CardsService } from '../shared/cards.service';
import { CpuPlayerDecisionsService } from '../shared/cpu-player-decisions.service';
import { GamePlayService } from '../shared/game-play.service';
import { player } from '../shared/generate-players';
import { playersService } from '../shared/players.service';
import { SufflingCardsService } from '../shared/suffling-cards.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit{

  constructor(public gamePlay:GamePlayService,private cpu:CpuPlayerDecisionsService, public player:playersService,public sufflingCards:SufflingCardsService,public cardsService:CardsService,private router:Router){ 
  }
  onRaiseNum:number=0;
  players!:player[];
  winners!:player[];
  cards:any[]=[];
  playerCards:card[]=[];
  tableCards:card[]=[];
  pot:number=0;
  gameStatus:string='preFlop';
  playersPortionBetting!:number;
  bigBlind!:number;
  smallBlind!:number;
  decisionTime!:number;
  numberOfPlayers!:number;
  chips!:number;

  ngOnInit(): void {
    this.playersPortionBetting=+this.cardsService.sendValues(1);
    this.bigBlind=+this.cardsService.sendValues(1);
    this.smallBlind=+(this.cardsService.sendValues(1)/2);
    this.decisionTime=+this.cardsService.sendValues(3);
    this.numberOfPlayers=+this.cardsService.sendValues(0);
    this.chips=+this.cardsService.sendValues(2);
    this.cards=this.cardsService.cardsFunction();
    this.playerCards=this.cardsService.playerCardsFunction();
    this.players=this.player.generatePlayers(this.numberOfPlayers,this.bigBlind,this.smallBlind,this.chips);
    this.sufflingCards.sufflingCards(this.playerCards,this.cards,this.players.length);
    this.toCallDesicions();
    // in case that user refresh the browser page
    if(!(this.chips==this.cardsService.sendValues(2))){
      this.router.navigate(['/'])
    }
  }


 onOverallChips(){
  let i:number=0;
  this.players.forEach((x:player)=>{
    i+=x.chips+x.temporaryBetting;
  })
return i;
}

  onFold(){
    console.log("onFold");
    this.players[0].inPortion=false;
    this.changePlayer(0);
  }

  onCall(){
   console.log("onCall");
   let chipsToCall=this.playersPortionBetting-this.players[0].temporaryBetting;
   this.players[0].temporaryBetting=this.playersPortionBetting;
   this.players[0].chips-=chipsToCall;
   this.changePlayer(0);
  }

  onRaise(ref:any){
    console.log("onRaise");
    this.players.forEach((x:any)=>{if(x.inPortion && x.chips>0){x.toSpeak=true}}); 
    this.playersPortionBetting=parseInt(ref);
    let chipsToCall=this.playersPortionBetting-this.players[0].temporaryBetting;
    this.players[0].temporaryBetting=this.playersPortionBetting;
    this.players[0].chips-=chipsToCall;
    this.changePlayer(0); 
  }

  onHasChips(){
    if(this.players[0].chips>this.playersPortionBetting-this.players[0].temporaryBetting){
      return true;
    }
    return false;
  }

  playersToSpeak(){
    let i:number=0;
    this.players.find((x:any)=>{
      if(x.toSpeak && x.inPortion){
        i+=1;
      }
    });
    return i;
  }

  playersInPortion(){
    let i:number=0;
    this.players.forEach((x:any)=>{
      if(x.inPortion){
        i+=1;
      }
    })
    return i;
  }

  playersWithChipsInPortion(){
    let i:number=0;
    this.players.forEach((x:any)=>{
      if(x.inPortion && x.chips>0){
        i+=1;
      }
    })
    return i;
  }

  whoIsActive(){
    let i!:number;
    this.players.find((x:any)=>{
      if(x.isActivePlayer && x.inPortion){
        i=x.number;
      }
    });
    return i;
  }

  setDelay(){
    return Math.floor(Math.random()*this.decisionTime*20);
  }
  
  decisions(){
    console.log("START NEX");
    // finds who is the active player
    let activePLayer:number= this.whoIsActive();
    console.log("ACTIVE PLAYER",activePLayer)
    if(activePLayer!==0){
      let status=this.cpu.decision(this.players[activePLayer].chips,this.playersPortionBetting,this.bigBlind);
      this.playersPortionBetting= +this.cpu.calcBetting(status,this.playersPortionBetting,this.bigBlind);
      this.players=this.cpu.calcPlayer(this.players,activePLayer,status,this.playersPortionBetting);
      this.changePlayer(activePLayer);
    }
  }

  toCallDesicions(){
    setTimeout(()=> this.decisions(),this.setDelay());
  }

  changePlayer(activePLayerNumber:number){
    // deactivates current player and activates the next
    this.deactivatePlayer(activePLayerNumber);
    this.activatePlayer(this.nextPlayer(activePLayerNumber),this.playersToSpeak()); 
    if(this.whoIsActive()!==0){
    this.toCheckStatus(); }
  }
  
  toCheckStatus(){
    console.log("toCheckStatus")
    let noneToSpeak:Boolean=true;
    this.players.forEach((x:player)=>{
      if(x.toSpeak && x.inPortion){
        noneToSpeak= false; 
      }  
    });
    // in case that only one player is in portion
    if(this.playersInPortion()==1){
      this.sumUpPot();
      this.findWinners();
      return;
    }
    if(this.playersWithChipsInPortion()<=1 && noneToSpeak){
      this.sumUpPot();  
      console.log("KASKADER")
      do{
        this.gameStatus=this.gamePlay.checkStatus(this.gameStatus);
        if(this.gameStatus=="flop"){
          this.sufflingCards.sufflingFlop(this.tableCards,this.cards);
        }
        this.gameStatus=this.gamePlay.checkStatus(this.gameStatus);
        if(this.gameStatus=="turn"){
          this.sufflingCards.sufflingTurn(this.tableCards,this.cards);
        }
        this.gameStatus=this.gamePlay.checkStatus(this.gameStatus);
        console.log(this.gameStatus)
        if(this.gameStatus=="river"){
          this.sufflingCards.sufflingRiver(this.tableCards,this.cards);
        }
        this.gameStatus=this.gamePlay.checkStatus(this.gameStatus);
        if(this.gameStatus=="checkings"){
          console.log("checkings APO MPOURDELO")
          this.gamePlay.checkings(this.tableCards,this.playerCards,this.players.length,this.players);
          this.winners=this.gamePlay.isWinner(this.players);
          console.log(this.winners)
          this.players.forEach((x:player)=>{this.winners.forEach((y:any)=>{if(x==y){x.chips+=(this.pot/this.winners.length)}})})
          console.log("perase")
          this.nextGame();
          return;
        }
      }while(this.gameStatus=="checkings");
    }
    // if someone want's to speak, calls the desicions again
    if(!noneToSpeak){
      this.toCallDesicions();
      return;
    }
    // if no player want's to speak it procceds to sumUp and next Card
    if(noneToSpeak){
      this.sumUpPot();
      this.gameStatus=this.gamePlay.checkStatus(this.gameStatus);
      if(this.gameStatus=="flop"){
        this.sufflingCards.sufflingFlop(this.tableCards,this.cards);
      }
      if(this.gameStatus=="turn"){
        this.sufflingCards.sufflingTurn(this.tableCards,this.cards);
      }
      if(this.gameStatus=="river"){
        this.sufflingCards.sufflingRiver(this.tableCards,this.cards);
      }
      if(this.gameStatus=="checkings"){
        this.gamePlay.checkings(this.tableCards,this.playerCards,this.players.length,this.players);
        this.findWinners();
        return;
      }
      // to find the smallBlind and activate it for starting next round
      this.gamePlay.findSmallBlind(this.players);
      this.toCallDesicions();
    }
  }

  findWinners(){
    this.winners=this.gamePlay.isWinner(this.players);
    this.players.forEach((x:player)=>{this.winners.forEach((y:any)=>{if(x==y){x.chips+=(this.pot/this.winners.length)}})})
    setTimeout(()=> this.nextGame(),3000);
  }

  OnIsWinner(number:number){
    return this.winners.some((x:any)=>x==this.players[number])
  }

  deactivatePlayer(index:number){
    this.players[index].isActivePlayer=false;
    this.players[index].toSpeak=false;
  }

  nextPlayer(activePLayerNumber:number){
    activePLayerNumber++;
    if(activePLayerNumber>=this.players.length){
      activePLayerNumber=0;
    }  
    return activePLayerNumber;
  }

  activatePlayer(index:number,playersToSpeak:number){
    if(playersToSpeak==0){
      return ;
    }
    if(this.players[index].inPortion==false||this.players[index].chips==0){
      this.activatePlayer(this.nextPlayer(index),this.playersToSpeak());
      return;
    }
    if(playersToSpeak>=1){
      this.players[index].isActivePlayer=true;
    }
  }
    
  calculateChips(activePLayerNumber:number){
    let chip500;
    let chip100;
    let chip10:number;
    chip500= Math.floor(this.players[activePLayerNumber].temporaryBetting/500);
    chip100= Math.floor((this.players[activePLayerNumber].temporaryBetting%500)/100);
    chip10= Math.floor((this.players[activePLayerNumber].temporaryBetting%500)%100/10);
    return {chip10,chip100,chip500};
  }

  sumUpPot(){
    this.players.forEach((x:player)=>{
      this.pot+=x.temporaryBetting;
      x.temporaryBetting=0;
    })
    this.playersPortionBetting=0;
  }

  nextGame(){
    this.pot=0;
    this.playerCards.length=0;
    this.tableCards.length=0;
    this.winners.length=0;
    this.gameStatus='preFlop';
    this.onRaiseNum=0;
    this.playersPortionBetting=+this.cardsService.sendValues(1);
    this.players=this.player.nextPortBlinds(this.players,this.bigBlind,this.smallBlind);
    this.cards=this.cardsService.cardsFunction();
    this.playerCards=this.cardsService.playerCardsFunction();
    this.sufflingCards.sufflingCards(this.playerCards,this.cards,this.players.length);
    this.toCallDesicions();
  }
}