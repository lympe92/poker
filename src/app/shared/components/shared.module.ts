import { NgModule } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { ChipsComponent } from './chips/chips.component';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommunityCardsComponent } from './community-cards/community-cards.component';
import { GameInfoTableComponent } from './game-info-table/game-info-table.component';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import { GameInfoDialog } from '../dialogs/game-info-dialog/game-info-dialog.component';

@NgModule({
  declarations: [
    PlayerComponent,
    ChipsComponent,
    FooterComponent,
    CommunityCardsComponent,
    GameInfoTableComponent,
    GameInfoDialog
  ],
  imports: [
    CommonModule,
    MatSliderModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    FormsModule,
    MatIconModule,
    MatDialogModule
  ],
  exports: [
    PlayerComponent,
    ChipsComponent,
    MatSliderModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    FooterComponent,
    CommunityCardsComponent,
    GameInfoTableComponent,
    MatIconModule,
    MatDialogModule,
    GameInfoDialog
  ],
  providers: [],
  bootstrap: [],
})
export class SharedModule {}
