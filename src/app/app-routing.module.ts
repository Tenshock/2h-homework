import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {TicketsComponent} from "./components/tickets/tickets.component";
import {TicketUpdateComponent} from "./components/ticket-update/ticket-update.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tickets',
    pathMatch: 'full',
  },
  {
    component: TicketsComponent,
    path: 'tickets',
  },
  {
    component: TicketUpdateComponent,
    path: 'tickets/new',
  },
  {
    component: TicketUpdateComponent,
    path: 'tickets/:id',
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
