import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterOutlet } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { TokenInterceptorService } from './services/token-interceptor.service';

import { AppComponent } from './app.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { DiagramComponent } from './components/diagram/diagram.component';
import { DateRangeComponent } from './components/date-range/date-range.component';
import { TimeBackComponent } from './components/time-back/time-back.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginModalComponent,
        DiagramComponent,
        DateRangeComponent,
        TimeBackComponent,
    ],
    imports: [
        BrowserModule,
        MatDialogModule,
        FormsModule,
        RouterOutlet,
        BrowserAnimationsModule,
        MatSelectModule,
        MatTabsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSlideToggle,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,
        CanvasJSAngularChartsModule,
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
