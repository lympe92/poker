import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TableComponent } from './pages/table/table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { appRoutes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BetChipsComponent } from './pages/table/bet-chips/bet-chips.component';
import { CommunityCardsComponent } from './pages/table/community-cards/community-cards.component';
import { GameInfoDialog } from './pages/table/dialogs/game-info-dialog/game-info-dialog.component';
import { FooterComponent } from './pages/table/footer/footer.component';
import { GameInfoTableComponent } from './pages/table/game-info-table/game-info-table.component';
import { PlayerComponent } from './pages/table/player/player.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PotComponent } from './pages/table/pot/pot.component';
import { AverageChipsPipe } from './pipes/average-chips';
import { CommonModule } from '@angular/common';
import { SmallestStackPipe } from './pipes/smallest-stack';
import { BiggestStackPipe } from './pipes/biggest-stack';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    HomeComponent,
    BetChipsComponent,
    CommunityCardsComponent,
    GameInfoDialog,
    FooterComponent,
    GameInfoTableComponent,
    PlayerComponent,
    PotComponent,
    AverageChipsPipe,
    SmallestStackPipe,
    BiggestStackPipe,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatSliderModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
