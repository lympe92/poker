import { Injectable } from '@angular/core';
import { CardsService } from './cards.service';
import { player } from './generate-players';
import { playersService } from './players.service';
import { SufflingCardsService } from './suffling-cards.service';

@Injectable({
  providedIn: 'root'
})
export class GamePlayService {
 
  constructor(private suffling:SufflingCardsService, private cards:CardsService, private player:playersService) { 
  }

  isWinner(players:any){
    let winners:any[]=[];
    let playersSorted:any[]=[];
    players.forEach((x:any)=> {if(x.inPortion){playersSorted.push(x)}});
    if(playersSorted.length==1){
      winners.push(playersSorted[0]);
      return winners;
    }

    playersSorted.sort((a:any,b:any)=>a.bestHand[0]-b.bestHand[0] 
      || b.bestHand[2][0].cardId-a.bestHand[2][0].cardId 
      || b.bestHand[2][1].cardId-a.bestHand[2][1].cardId
      || b.bestHand[2][2].cardId-a.bestHand[2][2].cardId
      || b.bestHand[2][3].cardId-a.bestHand[2][3].cardId
      || b.bestHand[2][4].cardId-a.bestHand[2][4].cardId)

    playersSorted.forEach((x:any)=>{playersSorted.forEach((y:any)=>{ 
      if(!(x==y) &&
        x.bestHand[0] == y.bestHand[0] && 
        x.bestHand[2][0].cardId== y.bestHand[2][0].cardId && 
        x.bestHand[2][1].cardId== y.bestHand[2][1].cardId && 
        x.bestHand[2][2].cardId== y.bestHand[2][2].cardId && 
        x.bestHand[2][3].cardId== y.bestHand[2][3].cardId && 
        x.bestHand[2][4].cardId== y.bestHand[2][4].cardId){
          x.bestHand[1]="SPLIT"
        }  
    })})

    // in case of there is only one winner
    if(!(playersSorted[0].bestHand[0]==playersSorted[1].bestHand[0])){
      winners.push(playersSorted[0]);
    }
    // in case of same ranking but different 5cards
    if((playersSorted[0].bestHand[0]==playersSorted[1].bestHand[0]) && !(JSON.stringify(playersSorted[0].bestHand)==JSON.stringify(playersSorted[1].bestHand))){
      winners.push(playersSorted[0]);
    }
    // in case of split
    if(playersSorted[0].bestHand[1]=="SPLIT" ){
      playersSorted.forEach((x:any)=>{if(JSON.stringify(playersSorted[0].bestHand)==JSON.stringify(x.bestHand)){winners.push(x);}})
    }
    return winners;
  }

  checkings(tableCards:any,playerCards:any,numberOfPlayers:number,players:any){
    console.log("checkings");
    for(let i=0;i<numberOfPlayers;i++){
      let twoCardsOfPlayer:any[]=[];
      let sevenCards:any[]=[];
      twoCardsOfPlayer.push(playerCards[i]);
      twoCardsOfPlayer.push(playerCards[i+numberOfPlayers]);
      sevenCards= tableCards.concat(twoCardsOfPlayer)
      sevenCards.sort((a,b)=>b.cardId-a.cardId)
      let color= this.isFlush(sevenCards);
      let straight=this.isStraight(sevenCards);
      let pairs=this.isPair(sevenCards);
      let straightFlush=this.isStraightFlush(color,straight);
      let isBestHand=this.isBestHand(color,straight,pairs,straightFlush);
      let player=players.find((x:any)=>x.id==i);
      players[player.number].bestHand=isBestHand;
    }
  }
 
  isBestHand(color:any,straight:any,pairs:any,straightFlush:any){
    if(straightFlush[1]=="flushRoyal"){
      return straightFlush;
    }
    if(straightFlush[1]=="straightFlush"){
      return straightFlush;
    }
    if(pairs[1]=="fourOfAKind"){
      return pairs;
    }
    if(pairs[1]=="foulHouse"){
      return pairs;
    }
    if(color[1]=="flush"){
      return color;
    }
    if(straight[1]=="straight"){
      return straight;
    }
    if(pairs[1]=="threeOfAKind"){
      return pairs;
    }
    if(pairs[1]=="twoPairs"){
      return pairs;
    }
    if(pairs[1]=="pair"){
      return pairs;
    }
    if(pairs[1]=="highCard"){
      return pairs;
    }
  }

  isStraightFlush(color:any,straight:any){
    if(color[0]=="flush" && straight[0]=="straight" && color[1].every((p:any) => color[1][p] === straight[1][p])){
      if(color[1].cardId==1){  
        return[1,"flushRoyal", color[1]];
      }    
      return[2,"straightFlush", color[1]];
    }   
    return 0;
  }

  isPair(sevenCards:any){
    let pairs:any[]=[];
    sevenCards.map((x:any)=>{ 
      pairs.push( {cardId: x.cardId, times: sevenCards.filter((y:any)=>y.cardId==x.cardId).length}); 
    })
    pairs.sort((a,b)=>b.times-a.times )
    pairs.forEach((x:any)=>{
      if(pairs.filter((y:any)=>y.cardId==x.cardId).length>1){
        pairs.splice(pairs.indexOf(x),1)
      }
    })
    let fiveBestCards:any[]=[];
    if(pairs[0].times==4){
      sevenCards.forEach((x:any)=>{if(x.cardId==pairs[0].cardId){fiveBestCards.push(x)}})
      sevenCards.forEach((x:any)=>{if(!(x.cardId==pairs[0].cardId) && fiveBestCards.length<5){fiveBestCards.push(x)}})
      return [3,"fourOfAKind",fiveBestCards];
    }
    if(pairs[0].times==3 && pairs[1].times>=2){
      sevenCards.forEach((x:any)=>{if(x.cardId==pairs[0].cardId){fiveBestCards.push(x)}})
      sevenCards.forEach((x:any)=>{if(x.cardId==pairs[1].cardId && fiveBestCards.length<5){fiveBestCards.push(x)}})
      return [4,"foulHouse",fiveBestCards];;
    }
    if(pairs[0].times==3){
      sevenCards.forEach((x:any)=>{if(x.cardId==pairs[0].cardId){fiveBestCards.push(x)}})
      sevenCards.forEach((x:any)=>{if(x.cardId==pairs[1].cardId){fiveBestCards.push(x)}})
      sevenCards.forEach((x:any)=>{if(x.cardId==pairs[2].cardId){fiveBestCards.push(x)}})
    return [7,"threeOfAKind",fiveBestCards];;
    };
    if(pairs[0].times==2 && pairs[1].times==2){
      sevenCards.forEach((x:any)=>{if(x.cardId==pairs[0].cardId){fiveBestCards.push(x)}})
      sevenCards.forEach((x:any)=>{if(x.cardId==pairs[1].cardId){fiveBestCards.push(x)}})
      sevenCards.forEach((x:any)=>{if(!(x.cardId==pairs[0].cardId) && !(x.cardId==pairs[1].cardId) && fiveBestCards.length<5){fiveBestCards.push(x)}})   
      return [8,"twoPairs",fiveBestCards];;
    }
    if(pairs[0].times==2){
      sevenCards.forEach((x:any)=>{if(x.cardId==pairs[0].cardId){fiveBestCards.push(x);}})
      sevenCards.forEach((x:any)=>{if(x.cardId==pairs[1].cardId){fiveBestCards.push(x);}})
      sevenCards.forEach((x:any)=>{if(x.cardId==pairs[2].cardId){fiveBestCards.push(x);}})
      sevenCards.forEach((x:any)=>{if(x.cardId==pairs[3].cardId){fiveBestCards.push(x);}})
      return [9,"pair",fiveBestCards];;
    }
    sevenCards.length=5;
    return [10,"highCard",sevenCards];;
  }

  isFlush(sevenCards:any){
    let flushTypes=["clubs","spades","hearts","diamonds"];
    let color= flushTypes.find((y:any)=>sevenCards.filter((x:any)=> x.shape==y).length>4)
    let fiveBestCards= sevenCards.filter((x:any)=> x.shape==color);   
    fiveBestCards.find((x:any)=> {if(x.cardId==1){ 
              fiveBestCards.pop(); 
              fiveBestCards.splice(0,0,x); 
    }})
    fiveBestCards.length=5;
    if (color !== undefined) {
      return [5,"flush",fiveBestCards];
    }
    return 0;
  }

  isStraight(sevenCards:any){   
    let uniqueChars:any[]=[];
    sevenCards.forEach((x:any)=>{
      if(!uniqueChars.includes(x.cardId)){
        uniqueChars.push(x.cardId);
      }
    })
    if(uniqueChars.length<5){
      return 0;
    }
    let fiveBestCards:any[]=[];
    if(uniqueChars.length>4){
      for(let i=0;i<uniqueChars.length-4;i++){
        if(uniqueChars[uniqueChars.length-1]==1){
          if(uniqueChars[i]==5 && 
            uniqueChars[i+1]==4 && 
            uniqueChars[i+2]==3 && 
            uniqueChars[i+3]==2){
              sevenCards.forEach((x:any)=>{if(x.cardId==uniqueChars[i]){fiveBestCards.push(x);}})
              sevenCards.forEach((x:any)=>{if(x.cardId==uniqueChars[i+1]){fiveBestCards.push(x);}})
              sevenCards.forEach((x:any)=>{if(x.cardId==uniqueChars[i+2]){fiveBestCards.push(x);}})
              sevenCards.forEach((x:any)=>{if(x.cardId==uniqueChars[i+3]){fiveBestCards.push(x);}})
              sevenCards.forEach((x:any)=>{if(x.cardId==uniqueChars[uniqueChars.length-1]){fiveBestCards.push(x);}})
              fiveBestCards.forEach((x:any)=>{
                if(fiveBestCards.filter((y:any)=>y.cardId==x.cardId).length>1){
                  fiveBestCards.splice(fiveBestCards.indexOf(x),1)
                }
              })
              return [6,"straight",fiveBestCards];   
            }
        }
        if(uniqueChars[i]==uniqueChars[i+1]+1 && 
          uniqueChars[i+1]==uniqueChars[i+2]+1 && 
          uniqueChars[i+2]==uniqueChars[i+3]+1 && 
          uniqueChars[i+3]==uniqueChars[i+4]+1){
            sevenCards.forEach((x:any)=>{if(x.cardId==uniqueChars[i]){fiveBestCards.push(x);}})
            sevenCards.forEach((x:any)=>{if(x.cardId==uniqueChars[i+1]){fiveBestCards.push(x);}})
            sevenCards.forEach((x:any)=>{if(x.cardId==uniqueChars[i+2]){fiveBestCards.push(x);}})
            sevenCards.forEach((x:any)=>{if(x.cardId==uniqueChars[i+3]){fiveBestCards.push(x);}})
            sevenCards.forEach((x:any)=>{if(x.cardId==uniqueChars[i+4]){fiveBestCards.push(x);}})
            fiveBestCards.forEach((x:any)=>{
              if(fiveBestCards.filter((y:any)=>y.cardId==x.cardId).length>1){
                fiveBestCards.splice(fiveBestCards.indexOf(x),1)
              }
            })
            return [6,"straight",fiveBestCards];   
        }
      }   
    }
    return 0;
  }

  checkStatus(gameStatus:string){ 
    if(gameStatus=='preFlop'){return 'flop';}
    if(gameStatus=='flop'){return 'turn';}
    if(gameStatus=='turn'){return 'river';}
    return "checkings";
  }

  findSmallBlind(players:any){
    console.log("MPIKE FINDSMALLBLIND")
    // turns all players  to speak for the next portion
    players.forEach((x:player)=>{
      if(x.inPortion && x.chips>0){
      x.toSpeak=true;
      }
    })
    // finds smallblind or next active player
    let y:number=0;
    players.find((x:any)=>{
      if(x.isSmallBlind){
        y=x.number;
      }
    })
    for(let i=0;i<players.length;i++){
      if(players[y].inPortion && players[y].chips>0){
          players[y].isActivePlayer=true;
          return;
      }  
      y+=1;
      if(y==(players.length)){
          y=0;
      } 
    }
  }
}
