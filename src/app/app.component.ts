import { Component, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ApiInstrumentsService } from './services/api-instruments.service';
import { WebsocketService } from './services/websocket.service';
import { DiagramComponent } from './components/diagram/diagram.component';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { IInstrument } from './interfaces/instrument';
import { environment } from '../environments/environment';

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
    public providers = [];

    public instrument: IInstrument | null  = null;
    public instruments: IInstrument[] = [];

    public isSubscribed = false;
    
    public isHistoricalDataShown = new FormControl(false);
    public isHistoricalDataFormShown = false;

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
        this.diagramComponent.clearData();
        this.isHistoricalDataFormShown = !this.isHistoricalDataFormShown;
    }

    public onSubscribe(): void {
      this.isSubscribed = true;
      this.diagramComponent.clearData();
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

    public addHistoricalChartData(data: any): void {
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
