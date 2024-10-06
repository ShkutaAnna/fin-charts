import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from './services/auth.service';
import { ApiInstrumentsService } from './services/api-instruments.service';
import { WebsocketService } from './services/websocket.service';
import { DiagramComponent } from './components/diagram/diagram.component';
import { IInstrument } from './interfaces/api.interface';
import { environment } from '../environments/environment';
import { IDiagramPoint } from './interfaces/diagram';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    @ViewChild('diagram')
    diagramComponent!: DiagramComponent;
    
    public title = 'fin-charts';

    public symbol = 'N/A';
    public price = 'N/A';
    public time = 'N/A';

    public provider = '';
    public providers: string[] = [];

    public instrument: IInstrument | null  = null;
    public instruments: IInstrument[] = [];

    public isSubscribed = false;
    
    public isHistoricalDataShown = new FormControl(false);
    public isHistoricalDataFormShown = false;

    public resetDataRangeLastParams: Subject<void> = new Subject<void>();
    public resetTimeBackLastParams: Subject<void> = new Subject<void>();

    private _destroy$ = new Subject<void>();

    constructor(
      private _authService: AuthService,
      private _apiInstrumentsService: ApiInstrumentsService,
      private _websocketService: WebsocketService,
    ) {}

    ngOnInit() {
      this._getProviders();
      this.isHistoricalDataShown.valueChanges.pipe(takeUntil(this._destroy$)).subscribe((show) => {
          this.diagramComponent.clearData();
          this.isHistoricalDataFormShown = !!show;
          if (!show) {
            this.resetDataRangeLastParams.next();
            this.resetTimeBackLastParams.next();
          }
      });
    }

    ngOnDestroy() {
      this._destroy$.next();
      this._destroy$.complete();
      this._websocketService.close();
    }

    public onProviderChange(): void {
      this._apiInstrumentsService.getInstruments({ provider: this.provider, kind: 'forex'}).subscribe((response) => {
          this.instruments = response.data;
      });
      this.onUnsubscribe();
      this.diagramComponent.clearData();
    }

    public onInstrumentChange(instrument: IInstrument): void {
        this.symbol = instrument.symbol ?? '';
        this.onUnsubscribe();
        this.diagramComponent.clearData();
    }

    public onHistoricalDataFormVisibilityChange(): void {
        this.isHistoricalDataFormShown = !this.isHistoricalDataFormShown;
    }

    public onSubscribe(): void {
      this.isSubscribed = true;
      if (!this.isHistoricalDataShown.getRawValue()) {
        this.diagramComponent.clearData();
      }
      const websocketUrl = `${environment.wwsUrl}/api/streaming/ws/v1/realtime`;
      this._websocketService.connect(websocketUrl, this._authService.getToken(), {
        type: 'l1-subscription',
        id: '1',
        instrumentId: this.instrument?.id,
        provider: this.provider,
        subscribe: true,
        kinds: ['ask', 'bid', 'last'],
      });

      this._websocketService.messages$.subscribe((message) => {
        if (message.type == 'l1-update' && message.last) {
          const { price, timestamp } = message.last;
          const dateTime = new Date(timestamp);
          this.price = price;
          this.time = this._formatDate(dateTime);

          if (!this.isHistoricalDataShown.getRawValue()) {
            this.diagramComponent.addData([{ x: dateTime, y: price }]);
          }
        }
      });
    }

    public onUnsubscribe(): void {
      this.isSubscribed = false;
      this._websocketService.close();
    }

    public addDateRangeChartData(data: IDiagramPoint[]): void {
      this.resetTimeBackLastParams.next();
      this._addHistoricalChartData(data);
    }

    public addTimeBackChartData(data: IDiagramPoint[]): void {
      this.resetDataRangeLastParams.next();
      this._addHistoricalChartData(data);
    }

    private _addHistoricalChartData(data: IDiagramPoint[]): void {
      this.isHistoricalDataShown.setValue(true);
      this.diagramComponent.clearData();
      this.diagramComponent.addData(data);
    }

    private _getProviders(): void {
      this._apiInstrumentsService.getProviders().subscribe(
        (response) => {
          this.providers = response.data;
        },
        (error) => {
          console.log('Failed to get providers: ', error);
        }
      );
    }

    private _formatDate(date: Date): string {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    }
}
