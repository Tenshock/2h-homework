import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Ticket} from '../interfaces/ticket.interface';
import {User} from '../interfaces/user.interface';

@Injectable()
export class BackendServiceStub {
    public tickets(): Observable<Ticket[]> {
        return of([{
            id: 0,
            completed: false,
            assigneeId: 111,
            description: 'Install a monitor arm'
        }]);
    }

    public ticket(): Observable<Ticket> {
        return of({
            id: 0,
            completed: false,
            assigneeId: 111,
            description: 'Install a monitor arm'
        });
    }

    public users(): Observable<User[]> {
        return of([{
            id: 0,
            name: 'Bob',
        }]);
    }

    public user(id: number): Observable<User> {
        return of({
            id: 0,
            name: 'Bob',
        });
    }

    public newTicket(payload: { description: string }): Observable<Ticket> {
        return of({
            id: 0,
            completed: false,
            assigneeId: 111,
            description: 'Install a monitor arm'
        });
    }

    public assign(ticketId: number, userId: number): Observable<Ticket> {
        return of({
            id: 0,
            completed: false,
            assigneeId: 111,
            description: 'Install a monitor arm'
        });
    }

    public complete(ticketId: number, completed: boolean): Observable<Ticket> {
        return of({
            id: 0,
            completed: false,
            assigneeId: 111,
            description: 'Install a monitor arm'
        });
    }
}
