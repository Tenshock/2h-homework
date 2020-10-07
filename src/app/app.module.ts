import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";

import { AppComponent } from './app.component';
import { BackendService } from './backend.service';
import {AppRoutingModule} from "./app-routing.module";
import { TicketsComponent } from './components/tickets/tickets.component';
import { TicketUpdateComponent } from './components/ticket-update/ticket-update.component';

@NgModule({
    declarations: [AppComponent, TicketsComponent, TicketUpdateComponent],
    imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
    providers: [BackendService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
