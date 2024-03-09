import { Component, Input } from '@angular/core'; 
import { Player } from 'src/app/models/player';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
 @Input() player!:Player |null;
  raiseNum:number=0;
  playersPortionBetting!:number;
  bigBlind!:number;
  smallBlind!:number;

  
  onFold(){
    console.log("onFold");
   
  }

  onCall(){
 
  }

  onRaise(ref:any){
 
  }

  onHasChips(){
 
  }

  onRaiseNum(){

  }

  onCalcTempPot(){

  }

  onCalcPot(){

  }
}
