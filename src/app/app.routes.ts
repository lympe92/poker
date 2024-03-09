
import { Routes } from '@angular/router';
import { ActionComponent } from './pages/action/action.component';
import { StartingScreenComponent } from './pages/starting-screen/starting-screen.component';

export const appRoutes: Routes = [
  {path:'', component:StartingScreenComponent},
  {path:'action', component:ActionComponent},
  {path:'**', component:StartingScreenComponent}
]


export class AppModule { }
