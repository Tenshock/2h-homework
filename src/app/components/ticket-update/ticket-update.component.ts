import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {forkJoin, Observable, of, Subject} from "rxjs";
import {mergeMap, takeUntil} from "rxjs/operators";

import {Ticket} from "../../../interfaces/ticket.interface";
import {BackendService} from "../../backend.service";
import {User} from "../../../interfaces/user.interface";

@Component({
    selector: 'app-ticket-update',
    templateUrl: './ticket-update.component.html'
})
export class TicketUpdateComponent implements OnInit, OnDestroy {
    public ticket?: Ticket;
    public users: Array<User>;
    public isNewEntity = false;
    public isLoadingFromApi = false;
    public isSaving = false;
    public isError = false;

    editForm = this.fb.group({
        id: [],
        description: [],
        assigneeId: [],
        completed: []
    });
    private _destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private readonly backendService: BackendService
    ) {
    }

    ngOnInit(): void {
        this.isLoadingFromApi = true;
        this.isNewEntity = this.router.url.includes('/tickets/new');
        const ticketId = this.route.snapshot.params['id'];

        this.backendService.users()
            .pipe(
                takeUntil(this._destroy$)
            )
            .subscribe(value => {
                this.users = value;

                if(!ticketId) {
                    this.isLoadingFromApi = false;
                }
            });

        if (ticketId) {
            const _ticket$: Observable<Ticket> = this.backendService.ticket(ticketId);
            _ticket$
                .pipe(
                    takeUntil(this._destroy$)
                )
                .subscribe(value => {
                    this.ticket = value;

                    this.updateForm(this.ticket);
                    this.isLoadingFromApi = false;
                });
        }
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.unsubscribe();
    }

    save(): void {
        this.isSaving = true;
        const ticket = this.createFromForm();

        const observableToExecute = this.isNewEntity ?
            this.getObservablesTicketAdd(ticket)
            : this.getObservablesTicketUpdate(ticket)

        observableToExecute
            .pipe(
                takeUntil(this._destroy$)
            )
            .subscribe(() => {
                    this.isSaving = false;
                    void this.router.navigate(['/tickets'])
                },
                () => {
                    this.isSaving = false;
                    this.isError = true;
                    setTimeout(() => this.isError = false, 5000)
                })
    }

    previousState(): void {
        window.history.back();
    }

    private getObservablesTicketAdd(ticket: Ticket): Observable<any> {
        let {description, completed, assigneeId} = ticket;

        const newTicket$ = this.backendService.newTicket({description});
        const ticketCompleteUpdate$ = (ticketId) => {
            return completed ? this.backendService.complete(ticketId, completed) : of([]);
        }
        const ticketUserUpdate$ = (ticketId) => {
            return assigneeId ? this.backendService.assign(ticketId, assigneeId) : of([]);
        }

        return newTicket$.pipe(
            mergeMap(ticket => forkJoin([ticketCompleteUpdate$(ticket.id), ticketUserUpdate$(ticket.id)])),
        )
    }

    private getObservablesTicketUpdate(ticket: Ticket): Observable<any> {
        let {id, completed, assigneeId} = ticket;
        console.log(completed)

        const ticketCompleteUpdate$ = this.backendService.complete(id, completed);
        const ticketUserUpdate$ = this.backendService.assign(id, assigneeId);

        return forkJoin([ticketCompleteUpdate$, ticketUserUpdate$])
    }

    private updateForm(ticket: Ticket): void {
        this.editForm.patchValue({
            id: ticket.id,
            description: ticket.description,
            assigneeId: ticket.assigneeId,
            completed: ticket.completed
        });
    }

    private createFromForm(): Ticket {
        return {
            id: this.editForm.get(['id'])!.value,
            description: this.editForm.get(['description'])!.value,
            assigneeId: this.editForm.get(['assigneeId'])!.value,
            completed: this.editForm.get(['completed'])!.value
        };
    }
}
