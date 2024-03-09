import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Observable } from 'rxjs';
import { Card } from 'src/app/models/card';
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'app-community-cards',
  templateUrl: './community-cards.component.html',
  styleUrls: ['./community-cards.component.css']
})
export class CommunityCardsComponent implements OnInit {
  communityCards$!:Observable<Card[]>;
  constructor(private _cardsService:CardsService){}

ngOnInit(): void {
 this.communityCards$= this._cardsService.getCommunityCards()
}

}
