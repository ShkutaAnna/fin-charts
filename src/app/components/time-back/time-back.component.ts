import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, takeUntil } from "rxjs";
import { ApiBarsService } from "../../services/api-bars.service";
import { Periodicity } from "../../interfaces/periodicity";
import { IInstrument } from "../../interfaces/api.interface";
import { IDiagramPoint } from "../../interfaces/diagram";

@Component({
    selector: 'time-back',
    templateUrl: './time-back.component.html',
  })
  export class TimeBackComponent {
    @Input()
    provider: string = '';

    @Input()
    instrument: IInstrument | null = null;

    @Input() resetLastParamsEvents: Observable<void> | undefined;

    @Output() chartDataEvent = new EventEmitter<IDiagramPoint[]>();

    public periodicityOptions = Object.values(Periodicity);

    public timeBackForm: FormGroup;
    public timeBackLastParams = {
        periodicity: '',
        interval: 0,
        barsCount: 0,
    };

    private _destroy$ = new Subject<void>();

    constructor(
        private _fb: FormBuilder,
        private _apiBarsService: ApiBarsService,
    ) {
        this.timeBackForm = this._fb.group({
            periodicity: ['minute', [Validators.required]],
            interval: [1, [Validators.required, Validators.min(1), Validators.max(60)]],
            barsCount: [10, [Validators.required, Validators.min(1), Validators.max(5000)]],
          });
    }

    ngOnInit() {
        this.resetLastParamsEvents?.pipe(takeUntil(this._destroy$)).subscribe(() => {
            this.timeBackLastParams = {
                periodicity: '',
                interval: 0,
                barsCount: 0,
            };
        });
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }

    public onTimeBackSubmit(): void {
        this.timeBackLastParams = this.timeBackForm.getRawValue();
        const { barsCount, periodicity, interval } = this.timeBackLastParams;
        this._apiBarsService.getCountBack({
            barsCount,
            instrumentId: this.instrument?.id ?? '',
            interval,
            periodicity,
            provider: this.provider,
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
                console.log('Failed to load time back data: ', error);
            });
    }

    public canSubmitTimeBackForm(): boolean {
        return this.timeBackForm.valid && this._isTimeBackChanged() && !!this.instrument && !!this.provider;
    }

    private _isTimeBackChanged(): boolean {
        const curr = this.timeBackForm.getRawValue();
        return curr.periodicity !== this.timeBackLastParams.periodicity
            || curr.interval !== this.timeBackLastParams.interval
            || curr.barsCount !== this.timeBackLastParams.barsCount;
    }
}