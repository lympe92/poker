import { Component, OnInit } from '@angular/core';
import { CardsService } from '../shared/cards.service';
import { GamePlayService } from '../shared/game-play.service';
import { playersService } from '../shared/players.service';
import { SufflingCardsService } from '../shared/suffling-cards.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit {
  constructor(public sufflingCards:SufflingCardsService,public cardsService:CardsService,public gamePlay:GamePlayService,public player:playersService){ 
  }
  ngOnInit(): void {
  }
}
