import {BackendService} from "./backend.service";
import {Ticket} from "../interfaces/ticket.interface";
import {Observable} from "rxjs";

describe('backend service', () => {
    let backendService: BackendService = new BackendService();
    backendService.randomDelay = () => 0;

    it('should return all tickets', (done) => {
        // GIVEN
        backendService.storedTickets = [{
            id: 1,
            completed: false,
            assigneeId: 111,
            description: 'hey'
        }]

        // WHEN
        backendService.tickets().subscribe(result => {
            // THEN
            expect(result).toEqual([{
                id: 1,
                completed: false,
                assigneeId: 111,
                description: 'hey'
            }]);
            done();
        });
    });

    it('should return all users', (done) => {
        // GIVEN
        backendService.storedUsers = [
            {id: 111, name: 'Victor'}];

        // WHEN
        backendService.users().subscribe(result => {
            // THEN
            expect(result).toEqual([
                {id: 111, name: 'Victor'}
            ]);
            done();
        });
    })

    describe('get specific ticket', () => {
        beforeEach(() => {
            // GIVEN
            backendService.storedTickets = [{
                id: 1,
                completed: false,
                assigneeId: 111,
                description: 'hey'
            }]
        })

        it('should return good ticket', (done) => {
            // WHEN
            backendService.ticket(1).subscribe(result => {
                // THEN
                expect(result).toEqual({
                    id: 1,
                    completed: false,
                    assigneeId: 111,
                    description: 'hey'
                });
                done();
            });
        })

        it('should throw error on unknown ticket', (done) => {
            // WHEN
            backendService.ticket(-1).subscribe({
                error: (error) => {
                    expect(error.message).toEqual('ticket not found')
                    done()
                }
            })
        })
    })

    describe('get specific user', () => {
        beforeEach(() => {
            // GIVEN
            backendService.storedUsers = [
                {id: 111, name: 'Victor'}];

        })

        it('should return specific user', (done) => {
            // WHEN
            backendService.user(111).subscribe(result => {
                // THEN
                expect(result).toEqual({id: 111, name: 'Victor'});
                done();
            });
        })

        it('should throw error on unknown user', (done) => {
            // WHEN
            backendService.user(-1).subscribe({
                error: (error) => {
                    expect(error.message).toEqual('user not found')
                    done()
                }
            })
        })
    })

    describe('add new ticket', () => {
        const description = 'new ticket';
        let result: Observable<Ticket>;

        beforeEach(() => {
            // GIVEN
            backendService.storedTickets = [];

            // WHEN
            result = backendService.newTicket({description});
        })

        it('should return new ticket', (done) => {
            // THEN
            result.subscribe((ticket: Ticket) => {
                expect(ticket).toEqual(jasmine.objectContaining({description, completed: false}));
                done();
            });
        })
    })

    describe('assign user to ticket', () => {

        beforeEach(() => {
            // GIVEN
            backendService.storedTickets = [{
                id: 1,
                completed: false,
                assigneeId: 111,
                description: 'hey'
            }]
            backendService.storedUsers = [
                {id: 111, name: 'Victor'},
                {id: 222, name: 'Marine'}];

        })

        it('should return updated ticket', (done) => {
            // WHEN
            const result = backendService.assign(1, 222);

            // THEN
            result.subscribe((ticket: Ticket) => {
                expect(ticket).toEqual({
                    id: 1,
                    completed: false,
                    assigneeId: 222,
                    description: 'hey'
                })
                done()
            })
        })

        it('should throw error on unknown ticket', (done) => {
            // WHEN
            const result = backendService.assign(-1, 222);

            // THEN
            result.subscribe({
                error: (error) => {
                    expect(error.message).toEqual('ticket or user not found')
                    done()
                }
            })
        })

        it('should throw error on unknown user', (done) => {
            // WHEN
            const result = backendService.assign(1, -1);

            // THEN
            result.subscribe({
                error: (error) => {
                    expect(error.message).toEqual('ticket or user not found')
                    done()
                }
            })
        })
    })

    describe('set ticket complete status', () => {

        beforeEach(() => {
            // GIVEN
            backendService.storedTickets = [
                {
                    id: 1,
                    completed: false,
                    assigneeId: 111,
                    description: 'hey'
                },
                {
                    id: 2,
                    completed: true,
                    assigneeId: 111,
                    description: 'ho'
                }
            ]
        })

        it('should update ticket to true', (done) => {
            // WHEN
            const result = backendService.complete(1, true);

            // THEN
            result.subscribe(value => {
                expect(value).toEqual({
                    id: 1,
                    completed: true,
                    assigneeId: 111,
                    description: 'hey'
                })
                done();
            })
        })

        it('should update ticket to false', (done) => {
            // WHEN
            const result = backendService.complete(2, false);

            // THEN
            result.subscribe(value => {
                expect(value).toEqual({
                    id: 2,
                    completed: false,
                    assigneeId: 111,
                    description: 'ho'
                })
                done();
            })
        })

        it('should throw error on unknown ticket', (done) => {
            // WHEN
            const result = backendService.complete(-1, false);

            // THEN
            result.subscribe({
                error: (error) => {
                    expect(error.message).toEqual('ticket not found')
                    done()
                }
            })
        })
    })
})
