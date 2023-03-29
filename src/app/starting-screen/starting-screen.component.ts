import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
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
    let refs:any[]=[refplayers,refstake,refchips,reftime];
    this.cards.getValues(refs)
    this.signupForm.reset();
    this.router.navigate(['/action']);
  }
}

