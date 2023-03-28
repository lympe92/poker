import { AfterViewChecked, ChangeDetectorRef, Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { delay, interval, of, Subscription, tap } from 'rxjs';
import { CardsService } from '../shared/cards.service';
import { CpuPlayerDecisionsService } from '../shared/cpu-player-decisions.service';
import { GamePlayService } from '../shared/game-play.service';
import { playersService } from '../shared/players.service';
import { SufflingCardsService } from '../shared/suffling-cards.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit{

  constructor(public gamePlay:GamePlayService,private cpu:CpuPlayerDecisionsService, public player:playersService,public sufflingCards:SufflingCardsService,public cardsService:CardsService,private cd: ChangeDetectorRef){
    
  }
  onRaiseNum=0;
  players:any=[];
  noneIsActive=true;
  gameStatus='preFlop';
  activedashboard():boolean {return this.player.players[1].isActivePlayer; }
  
  onClick(){
    this.nextPlayer();
  }
  ngOnInit(): void {
    
    this.players=this.player.getPlayers();
    this.player.generatePlayers();
    this.cardsService.startgame();
    this.sufflingCards.sufflingCards();
    this.nextPlayer();  
  }

 

  onFold(){
    console.log("fold");
    this.players[1].toSpeak=false;
    this.players[1].chips-=this.players[1].bettingAmount;
    this.nextPlayer();
  }

  onCall(){
    console.log("call");
    this.players[1].toSpeak=false;
    this.players[1].temporaryBetting=this.player.chipsToCall;
    this.nextPlayer();
  }

  onRaise(ref:any){
    console.log("raise");
    this.players[1].toSpeak=false;
    this.players[1].temporaryBetting+=parseInt(ref);
    this.nextPlayer();
  }


  nextPlayer(){
  
    let activePLayerNumber!:number;
    this.players.find((x:any)=>{
      if(x.isActivePlayer){
        x.isActivePlayer=false;
        activePLayerNumber=x.number;  
      }
    });
    this.changeActivePlayer(activePLayerNumber);
  }
  changeActivePlayer(activePLayerNumber:number){
      
    if(activePLayerNumber!==0){
      setTimeout(()=>{
        this.cpPlayer(activePLayerNumber);
      },Math.floor(Math.random()*500*this.player.decisionTime));
    }
    
    if(activePLayerNumber==0){
      this.players[1].isActivePlayer=true;
    }        
}


cpPlayer(activePLayerNumber:number){
 
  if((activePLayerNumber+1)==(this.players.length)){
    this.players[0].isActivePlayer=true;
    this.players[0].toSpeak=false;
    this.cpu.decision(0);
  }
  if((activePLayerNumber+1)!==(this.players.length) &&(activePLayerNumber+1)!==1){
    this.players[(activePLayerNumber+1)].isActivePlayer=true;
    this.players[(activePLayerNumber+1)].toSpeak=false;
     
    this.cpu.decision(activePLayerNumber+1);
  }
  // this.checkStatus();
  this.nextPlayer();

}

  // checkStatus(){ 
  //   this.noneIsActive=true;
  //   this.players.forEach((x:any)=>{
  //     if(x.toSpeak){
  //       this.noneIsActive=false;
  //       console.log("x");
  //       console.log(x);
  //     }
  //   });
  //   console.log(this.noneIsActive);
  //   console.log(this.gameStatus);
  //   if(this.noneIsActive && this.gameStatus=='preFlop'){
  //     this.noneIsActive=!this.noneIsActive;
  //     this.sufflingCards.sufflingFlop();
  //      this.gameStatus='flop';
  //   }
  //   if(this.noneIsActive && this.gameStatus=='flop'){
  //     this.noneIsActive=!this.noneIsActive;
  //     this.sufflingCards.sufflingTurn();
  //      this.gameStatus='turn'; 
  //   }
  //   if(this.noneIsActive && this.gameStatus=='turn'){
  //     this.noneIsActive=!this.noneIsActive;
  //     this.sufflingCards.sufflingRiver();
  //      this.gameStatus='river';
  //   }
  //   this.players.forEach((x:any)=>{
  //     x.toSpeak=true;
  //     })
    
  // }
  
}
