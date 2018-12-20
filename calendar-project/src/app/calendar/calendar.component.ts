//#region Imports
import { Component, 
         OnInit, 
         ChangeDetectionStrategy,
         ViewChild,
         TemplateRef,
         Inject,
         ElementRef,
         PLATFORM_ID
        } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';


import { AuthenticationService } from '../authentication.service';
import { Users } from '../Model/Users';
import { Events } from '../Model/Events';
import { HelperHandler } from '../Helpers/HelperHandler';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';

import { Subject } from 'rxjs';
import { CalendarEvent,
         CalendarEventAction,
         CalendarEventTimesChangedEvent,
         CalendarView } from '../angular-calendar/modules/common/calendar-common.module';
import { CalendarEventActionsComponent } from '../angular-calendar/modules/common/calendar-event-actions.component';
import { forEach } from '@angular/router/src/utils/collection';
//#endregion

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
  //#region Component members
  @ViewChild('modalContent')
  @ViewChild('addEventId') addEventButton: ElementRef;


  modalContent: TemplateRef<any>;
  title: string = "Calendar";
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  newEvent: Events = new Events();
  popUpMessage: string;


  modalData: {
    action: string;
    event: CalendarEvent;
  }
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
        //Add edit...
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
        //Add delete...
      }
    }
  ];
  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  authUser: Users = null;

  //#endregion

  constructor(private authenticationService: AuthenticationService,
              private router: Router, private modal: NgbModal, 
              public dialog: MatDialog,
              @Inject(PLATFORM_ID) private platformId: Object) {
        if (!this.authenticationService.IsAuthenticated) {
            this.router.navigate(['/login']);
        }

        this.authUser = this.authenticationService.getUser();
        if (this.authUser != null) 
          this.getAuthUserData();
      }
  
  ngOnInit() {
    this.initProperties();
    var retrievedObject = localStorage.getItem('Authenticated user');
    if (retrievedObject != null) {
      this.authUser = JSON.parse(retrievedObject);
      HelperHandler.PrintUser(this.authUser);
    }
  }

  initProperties() {
    this.newEvent.Title = '';
    this.newEvent.StartsAt = null;
    this.newEvent.EndsAt = null;
  }

  getAuthUserData() {
    this.authenticationService
              .getUserById(this.authUser.UserId)
              .subscribe(
                (data: Users) => {
                    if (!(this.authUser.SessionId === data['sessionId'])){
                      this.router.navigate(['/login']);
                    }
                },
                err => {
                  console.log(err.error);
                  this.router.navigate(['/login']);
                },
                () => {
                  console.log("Done: " + this.authUser.SessionId);
                  // Show callendar
                  // Fill user events
                  localStorage.setItem("Authenticated user", JSON.stringify(this.authUser));
                  //this.fillUserEvents(this.authUser.EventsDTO)
                  
                }
              );
  }

  //#region Functions
  logOut() {
    this.authUser = null;
    localStorage.removeItem("Authenticated user");
    this.router.navigate(['/login']);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    console.log("Ajmo dodat");
    if (this.newEvent.Title == "Proba") {
      this.popUpMessage = "You did not enter everything for new event.";
      const dialogRef = this.dialog.open(SimplePopUpDialog, {
        width: '200px',
        data: { message: this.popUpMessage }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (isPlatformBrowser(this.platformId)) {
          console.log("Uso u if");
          this.addEventButton.nativeElement.blur();
        }
      });
    }
    /*this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();*/
  }
  /* TODO */
  fillUserEvents(eventsDTO: Events[]) {
    //if (eventsDTO == null) return;
    //eventsDTO.forEach(function (element) {

      /*
      {
        start: subDays(startOfDay(new Date()), 1),
        end: addDays(new Date(), 1),
        title: 'A 3 day event',
        color: colors.yellow,
        actions: this.actions,
        allDay: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        draggable: true
      },
        */
    //}); 
  }
  //#endregion
}

export interface DialogData {
  name: string;
  message: string;
  result: string;
}

@Component({
  selector: 'app-simple-pop-up-dialog',
  templateUrl: './simple-pop-up-dialog.html',
})
export class SimplePopUpDialog {

  constructor(
    public dialogRef: MatDialogRef<SimplePopUpDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}
