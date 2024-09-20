import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntryFormComponent } from './entry-form/entry-form.component';
import { EntryListComponent } from './entry-list/entry-list.component';

const routes: Routes = [
  { path: 'entry-form', component: EntryFormComponent },
  { path: 'entry-list', component: EntryListComponent },
  { path: '', redirectTo: '/entry-form', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
