import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

import {Ticket} from "../../../interfaces/ticket.interface";
import {BackendService} from "../../backend.service";
import {User} from "../../../interfaces/user.interface";

@Component({
    selector: 'app-tickets',
    templateUrl: './tickets.component.html'
})
export class TicketsComponent implements OnInit, OnDestroy {
    public isLoadingFromApi = false;
    public users: Map<number, string>;
    public isUpdating = false;
    public isError = false;
    public tickets: Array<Ticket> = [];
    private _tickets$: Observable<Array<Ticket>> = this.backendService.tickets();
    private _users$: Observable<Array<User>> = this.backendService.users();
    private _destroy$ = new Subject<void>();

    constructor(private readonly backendService: BackendService) {
    }

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.isLoadingFromApi = true;

        forkJoin([this._tickets$, this._users$])
            .pipe(
                takeUntil(this._destroy$)
            )
            .subscribe(value => {
                this.tickets = value[0];
                this.users = new Map(value[1].map(user => [user.id, user.name]));
                this.isLoadingFromApi = false;
            });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.unsubscribe();
    }

    Array(length: number): Array<number> {
        return new Array<number>(length >= 0 ? length:  0);
    }

    updateTicketStatus(ticketId: number, status: boolean): void {
        this.isUpdating = true;
        this.backendService.complete(ticketId, status)
            .pipe(
                takeUntil(this._destroy$)
            )
            .subscribe((updatedTicket: Ticket) => {
                    const ticketToUpdate = this.tickets.find(ticket => ticket.id === updatedTicket.id)
                    if (ticketToUpdate) {
                        ticketToUpdate.completed = updatedTicket.completed;
                    }
                    this.isUpdating = false;
                },
                () => {
                    this.isUpdating = false;
                    this.isError = true;
                    setTimeout(() => this.isError = false, 5000)
                }
            )
    }

}
