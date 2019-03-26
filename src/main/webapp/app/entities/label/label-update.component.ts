import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ILabel } from 'app/shared/model/label.model';
import { LabelService } from './label.service';
import { ITicket } from 'app/shared/model/ticket.model';
import { TicketService } from 'app/entities/ticket';

@Component({
    selector: 'jhi-label-update',
    templateUrl: './label-update.component.html'
})
export class LabelUpdateComponent implements OnInit {
    label: ILabel;
    isSaving: boolean;

    tickets: ITicket[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected labelService: LabelService,
        protected ticketService: TicketService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ label }) => {
            this.label = label;
        });
        this.ticketService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ITicket[]>) => mayBeOk.ok),
                map((response: HttpResponse<ITicket[]>) => response.body)
            )
            .subscribe((res: ITicket[]) => (this.tickets = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.label.id !== undefined) {
            this.subscribeToSaveResponse(this.labelService.update(this.label));
        } else {
            this.subscribeToSaveResponse(this.labelService.create(this.label));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ILabel>>) {
        result.subscribe((res: HttpResponse<ILabel>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackTicketById(index: number, item: ITicket) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}
