import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CardsService } from '../../../services/cards.service';
import { CommunityCards } from 'src/app/models/community-cards';
import { GameService } from '../../../services/game.service';
enum portionPhase {
  PreFlop = 'preFlop',
  Flop = 'flop',
  Turn = 'turn',
  River = 'river',
  End = 'end',
}

@Component({
  selector: 'app-community-cards',
  templateUrl: './community-cards.component.html',
  styleUrls: ['./community-cards.component.css'],
})
export class CommunityCardsComponent implements OnInit {
  communityCards$!: Observable<CommunityCards>;
  portionPhase$!: Observable<portionPhase>;
  secretCard = '/assets/images/secret-card.png';
  constructor(
    private _cardsService: CardsService,
    private _gameService: GameService
  ) {}

  ngOnInit(): void {
    this.communityCards$ = this._cardsService.getCommunityCards();
    this.portionPhase$ = this._gameService.getPortionPhaseObs();
  }
}
