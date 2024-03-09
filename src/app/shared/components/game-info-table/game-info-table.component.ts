import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-info-table',
  templateUrl: './game-info-table.component.html',
  styleUrls: ['./game-info-table.component.css']
})
export class GameInfoTableComponent {
  displayedColumns: string[] = ['names',  'values'];

  dataSource = [
    {names: 'Your Rank', values: 1.0079},
    {names: 'Biggest Stack', values: 1.0079},
    {names: 'Smallest Stack', values: 1.0079},
    {names: 'Hydrogen', values: 1.0079},
   
  ];

}
