import { Component, EventEmitter, input, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiBarsService } from "../../services/api-bars.service";
import { Periodicity } from "../../interfaces/periodicity";
import { IInstrument } from "../../interfaces/instrument";

@Component({
    selector: 'date-range',
    templateUrl: './date-range.component.html',
  })
  export class DateRangeComponent {
    @Input()
    provider: string = '';

    @Input()
    instrument: IInstrument | null = null;

    @Output() chartDataEvent = new EventEmitter<any>();

    public periodicityOptions = Object.values(Periodicity);

    public dateRangeForm: FormGroup;
    public dateRangeLastParams = {
        periodicity: '',
        interval: 0,
        dateRange: {
            startDate: new Date(Date.now()),
            endDate: new Date(Date.now()),
        },
    };

    constructor(
        private _fb: FormBuilder,
        private _apiBarsService: ApiBarsService,
    ) {
        this.dateRangeForm = this._fb.group({
            periodicity: ['minute'],
            interval: [1, [Validators.required, Validators.min(1), Validators.max(60)]],
            dateRange: this._fb.group({
                startDate: [new Date(Date.now())],
                endDate: [new Date(Date.now())],
            }),
        });
    }

    public onDateRangeSubmit(): void {
        this.dateRangeLastParams = this.dateRangeForm.getRawValue();
        const { dateRange, periodicity, interval } = this.dateRangeLastParams;
        const startDate = dateRange.startDate;
        const endDate = dateRange.startDate.getTime() === dateRange.endDate.getTime() ? null : dateRange.endDate;
        if (!endDate) {
            this.dateRangeForm.get('dateRange.endDate')?.setValue(new Date(Date.now()));
        }
        this._apiBarsService.getDateRange({
          instrumentId: this.instrument?.id ?? '',
          interval,
          periodicity,
          provider: this.provider,
          startDate: this._getFormattedDate(startDate),
          ...(endDate && { endDate: this._getFormattedDate(endDate) }),
        }).subscribe(
          response => {
            const dataPoints = response.data ?? [];
            const chartData = dataPoints.map((item: { t: string, c: number }) => {
              const { t, c } = item;
              return {
                x: new Date(t),
                y: c,
              };
            });
            this.chartDataEvent.emit(chartData);
          },
          error => {
            console.log('Failed to load date range data: ', error);
          });
    }

    public canSubmitDateRangeForm(): boolean {
        return this.dateRangeForm.valid && this._isDateRangeChanged() && !!this.instrument && !!this.provider;
    }

    private _isDateRangeChanged(): boolean {
        const curr = this.dateRangeForm.getRawValue();
        return curr.periodicity !== this.dateRangeLastParams.periodicity
            || curr.interval !== this.dateRangeLastParams.interval
            || curr.dateRange.startDate?.getTime() !== this.dateRangeLastParams.dateRange.startDate?.getTime()
            || curr.dateRange.endDate?.getTime() !== this.dateRangeLastParams.dateRange.endDate?.getTime();
    }

    private _getFormattedDate(date: Date): string {
        if (date) {
          const year = date.getFullYear();
          const month = ('0' + (date.getMonth() + 1)).slice(-2);
          const day = ('0' + date.getDate()).slice(-2);
          return `${year}-${month}-${day}`;
        }
        return '';
    }
  }