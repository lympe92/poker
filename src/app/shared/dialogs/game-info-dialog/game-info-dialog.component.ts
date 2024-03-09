import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-game-info-dialog',
  templateUrl: './game-info-dialog.component.html',
  styleUrls: ['./game-info-dialog.component.css'],
})
export class GameInfoDialog  {
 
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  

}
