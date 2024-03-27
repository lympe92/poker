import { Routes } from '@angular/router';
import { TableComponent } from './pages/table/table.component';
import { HomeComponent } from './pages/home/home.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'table', component: TableComponent },
  { path: '**', redirectTo: '' },
];

export class AppModule {}
