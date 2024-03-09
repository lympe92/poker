import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router'; 
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';

@Component({
  selector: 'app-starting-screen',
  templateUrl: './starting-screen.component.html',
  styleUrls: ['./starting-screen.component.css'],
})
export class StartingScreenComponent implements OnInit {
  title = 'poker-game';
  signupForm!: FormGroup;
  disabled = false;
  max = 6;
  min = 2;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  constructor(private router: Router, private _sessionService:SessionStorageService) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      numberOfPlayers: new FormControl(2),
      stake: new FormControl(20),
      chips: new FormControl(1000),
      time: new FormControl(10),
    });
  }

  onStartGame(): void {
    // this.cards.setValues(this.signupForm.value);
    this._sessionService.setGameOptionsToSessionStorage(this.signupForm.value)
     
    this.goToCashGame();
  }

  goToCashGame(): void {
    this.router.navigate(['/action']);
  }
}
