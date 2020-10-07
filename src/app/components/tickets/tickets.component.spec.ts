import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";
import {of} from "rxjs";
import {By} from "@angular/platform-browser";

import {TicketsComponent} from './tickets.component';
import {BackendService} from "../../backend.service";
import {BackendServiceStub} from "../../backend.service.stub";

describe('TicketsComponent', () => {
    let component: TicketsComponent;
    let fixture: ComponentFixture<TicketsComponent>;
    let backendService: BackendService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TicketsComponent],
            imports: [RouterTestingModule],
            providers: [
                {
                    provide: BackendService,
                    useClass: BackendServiceStub
                }]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TicketsComponent);
        component = fixture.componentInstance;
        backendService = TestBed.inject(BackendService)
    });

    describe('on init', () => {
        it('should exists', () => {
            // WHEN
            fixture.detectChanges();

            // THEN
            expect(component).toBeTruthy();
        });

        xit('should call backend', (done) => {
            // GIVEN
            const spy1 = spyOn(backendService, 'users');
            const spy2 = spyOn(backendService, 'tickets');
            const spy3 = spyOn(component, 'loadAll');

            // WHEN
            fixture.detectChanges();

            // THEN
            expect(spy1).toHaveBeenCalledTimes(1);
            expect(spy2).toHaveBeenCalledTimes(1);
            expect(spy3).toHaveBeenCalledTimes(1);
            done()
        })
    })

    xit('should display two lines', () => {
        // GIVEN
        component.tickets = [
            {
                id: 0,
                completed: false,
                assigneeId: 111,
                description: 'Install a monitor arm'
            },
            {
                id: 1,
                completed: true,
                assigneeId: 111,
                description: 'check todo-list'
            }]

        // WHEN
        fixture.detectChanges();

        // THEN
        const tableLinesCount = fixture.debugElement.query(By.css('tbody')).children.length
        expect(tableLinesCount).toEqual(2);
    })


    it('should call backend complete method', () => {
        // GIVEN
        spyOn(backendService, 'complete').and.returnValue(of({}));

        // WHEN
        component.updateTicketStatus(1, true)

        // THEN
        expect(backendService.complete).toHaveBeenCalledWith(1, true)
    });

    it('should return correct array', () => {
        // WHEN
        const result1 = component.Array(0);
        const result2 = component.Array(1);
        const result3 = component.Array(2);
        const result4 = component.Array(3);
        const result5 = component.Array(-1);

        // THEN
        expect(result1.length).toEqual(0);
        expect(result2.length).toEqual(1);
        expect(result3.length).toEqual(2);
        expect(result4.length).toEqual(3);
        expect(result5.length).toEqual(0);
    })
});
