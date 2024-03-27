import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  signupForm!: FormGroup;
  playersOptions = {
    min: 2,
    max: 6,
    step: 1,
    discrete: true,
    showTickMarks: true,
  };
  stakeOptions = {
    min: 20,
    max: 200,
    step: 20,
    discrete: true,
    showTickMarks: true,
  };
  chipsOptions = {
    min: 1000,
    max: 10000,
    step: 1000,
    discrete: true,
    showTickMarks: true,
  };
  timeOptioms = {
    min: 5,
    max: 60,
    step: 5,
    discrete: true,
    showTickMarks: true,
  };

  constructor(
    private router: Router,
    private _sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.getSignUpForm();
  }

  private getSignUpForm(): FormGroup {
    return new FormGroup({
      numberOfPlayers: new FormControl(2),
      stake: new FormControl(20),
      chips: new FormControl(1000),
      time: new FormControl(10),
    });
  }

  onStartGame(): void {
    this._sessionService.setGameOptionsToSessionStorage(this.signupForm.value);

    this.goToCashGame();
  }

  private goToCashGame(): void {
    this.router.navigate(['/table']);
  }
}
