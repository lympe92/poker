import { Component, Input } from '@angular/core';
import { player } from 'src/app/shared/generate-players';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  @Input() players!: any;
  @Input() num!: number;
  @Input() playerCards!: any;



}
