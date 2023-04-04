import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ActionComponent } from './action/action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { StartingScreenComponent } from './starting-screen/starting-screen.component';
import { PlayerComponent } from './action/player/player.component';
import { ChipsComponent } from './action/chips/chips.component';

const appRoutes: Routes = [
  {path:'', component:StartingScreenComponent},
  {path:'action', component:ActionComponent},
  {path:'**', component:StartingScreenComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    ActionComponent,
    StartingScreenComponent,
    PlayerComponent,
    ChipsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
