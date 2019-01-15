import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatDialogModule } from '@angular/material';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { ServiceWorkerModule } from  '@angular/service-worker';
import { environment } from '../environments/environment';

import { adapterFactory } from './angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CalendarModule, DateAdapter } from './angular-calendar/';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CalendarComponent, SimplePopUpDialog } from './calendar/calendar.component';
import { SevereErrorHandler } from './severe-error-handler'

import { MessagingService } from './messaging.service';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CalendarComponent,
    SimplePopUpDialog
  ],
  entryComponents: [
    SimplePopUpDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    MatDialogModule,
    BrowserAnimationsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled:  environment.production }),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [{provide: ErrorHandler, useClass: SevereErrorHandler, useValue: this}, MessagingService, AsyncPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
