import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ActionComponent } from './action/action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from './table/table.component';
import { RouterModule, Routes } from '@angular/router';
import { StartingScreenComponent } from './starting-screen/starting-screen.component';

const appRoutes: Routes = [
  {path:'', component:StartingScreenComponent},
  {path:'table', component:TableComponent},
  {path:'action', component:ActionComponent},
  {path:'**', component:StartingScreenComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    ActionComponent,
    TableComponent,
    StartingScreenComponent
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
