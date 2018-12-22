import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';

import { CalendarModule, DateAdapter } from './angular-calendar/';
import { adapterFactory } from './angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CalendarComponent, SimplePopUpDialog } from './calendar/calendar.component';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material';
import { SevereErrorHandler } from './severe-error-handler'


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
    })
  ],
  providers: [{provide: ErrorHandler, useClass: SevereErrorHandler, useValue: this}],
  bootstrap: [AppComponent]
})
export class AppModule { }
