import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.css']
})
export class ChipsComponent {
  @Input() players!: any;
  @Input() num!: number;

  calculateChips(activePLayerNumber:number){
    let chip500;
    let chip100;
    let chip10:number;
    chip500= Math.floor(this.players[activePLayerNumber].temporaryBetting/500);
    chip100= Math.floor((this.players[activePLayerNumber].temporaryBetting%500)/100);
    chip10= Math.floor((this.players[activePLayerNumber].temporaryBetting%500)%100/10);
    return {chip10,chip100,chip500};
  }
}
