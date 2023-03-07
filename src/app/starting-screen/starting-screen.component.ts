import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CardsService } from '../shared/cards.service';
import { GamePlayService } from '../shared/game-play.service';
import { playersService } from '../shared/players.service';

@Component({
  selector: 'app-starting-screen',
  templateUrl: './starting-screen.component.html',
  styleUrls: ['./starting-screen.component.css']
})
export class StartingScreenComponent implements OnInit{
  title = 'poker-game';
  signupForm!: FormGroup;
  constructor(private gamePlay:GamePlayService,private router:Router,private cards:CardsService,private player:playersService){}
  

  ngOnInit (): void {
    this.signupForm= new FormGroup({
      'players': new FormControl(2),
      'stake': new FormControl(20),
      'chips': new FormControl(1000),
      'time': new FormControl(10)
    });
  }
  onSubmit(refplayers:any,refstake:any, refchips:any, reftime:any){
    this.cards.startCards(+refplayers);
    this.player.bigBlind= +refstake;
    this.player.players[1].chips=+refchips;
    this.player.players[0].chips=+refchips;
    this.player.decisionTime= +reftime;
    this.cards.players=+refplayers;
    this.player.numberOfPlayers= +refplayers;
    
    this.signupForm.reset();
    this.router.navigate(['/action']);
  }
}

