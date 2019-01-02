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
import { EventsService } from '../events.service';
import { Users } from '../Model/Users';
import { Events } from '../Model/Events';
import { HelperHandler } from '../Helpers/HelperHandler';
import { of } from 'rxjs';


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
import { StringHandler } from '../Helpers/StringHandler';
import { Constants } from '../Constants';
import { strictEqual } from 'assert';
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
        this.handleEvent('Deleted', event);
        this.activeDayIsOpen = false;
        //Add delete..
      }
    }
  ];
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  authUser: Users = null;
  
  isUserAuthenticated: boolean = !(localStorage[Constants.AUTHENTICATED_USER_KEY] === null);
  //#endregion


  constructor(private authenticationService: AuthenticationService,
              private router: Router, private modal: NgbModal, 
              public dialog: MatDialog,
              @Inject(PLATFORM_ID) private platformId: Object,
              private eventsService: EventsService) {
              
              /* Check user authentication */
              if (!this.isUserAuthenticated) {
                this.router.navigate(['/login']);
                console.log("User unauthorized.");
              } 
              /* Refresh authentication service. Happens on page refresh */
              if (this.isUserAuthenticated && !this.authenticationService.IsAuthenticated) {
                this.authUser = JSON.parse(localStorage[Constants.AUTHENTICATED_USER_KEY]);
                this.authenticationService.userAuthenticated(this.authUser);
              }
              
              console.log("authUser" + this.authUser);
              if (this.authUser != null) this.getAuthUserData();
              this.initProperties();
  }
  
  ngOnInit() {

    /* Check user authentication */
    if (!this.isUserAuthenticated) {
      this.router.navigate(['/login']);
      console.log("User unauthorized");
      return;
    }
    /* Refresh authentication service. Happens on page refresh */
    if (this.isUserAuthenticated && !this.authenticationService.IsAuthenticated) {
      this.authUser = JSON.parse(localStorage[Constants.AUTHENTICATED_USER_KEY]);
      this.authenticationService.userAuthenticated(this.authUser);
    }
    var retrievedObject = localStorage.getItem('Authenticated user');
    if (retrievedObject != null) {
      this.authUser = JSON.parse(retrievedObject);
      HelperHandler.PrintUser(this.authUser);
      this.newEvent.UserId = this.authUser.UserId;
      this.newEvent.Email = this.authUser.Email;

      //** Get user events **/
      this.fillCalendarWithUserEvents(this.authUser.UserId);
    }
    this.initProperties();
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
            
          }
        );
  }

  //#region Functions
  logOut() {
    this.authenticationService.userLogOut();
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
    if (action === "Deleted") {
      console.log(event.id);
      this.eventsService
          .deleteEvent(Number(event.id))
          .subscribe((data: Events) => {
            var successMessage: string = "Event '" + data['title'] + "' successfuly deleted. ";
            const dialogRef = this.dialog.open(SimplePopUpDialog, {
              width: '200px',
              data: { message: successMessage }
            });
            var index = 0;
            var foundElement: boolean = false;
            for (let element of this.events) {
              if (element.id == event.id) 
              {
                foundElement = true;
                break;
              }
              index++;
            }
            if (foundElement === true) this.events.splice(index, 1);
            dialogRef.afterClosed().subscribe(result => {
              if (isPlatformBrowser(this.platformId)) {
                this.refresh.next();
              }});
          },
          (err) => {
            const dialogRef = this.dialog.open(SimplePopUpDialog, {
              width: '200px',
              data: { message: err }
            });
            dialogRef.afterClosed();
          },
          () => {});
    }
  }

  addEvent(): void {
    if (!HelperHandler.CorrectAddEventInput(this.newEvent)) {
      this.popUpMessage = "You did not enter everything correctly.";
      const dialogRef = this.dialog.open(SimplePopUpDialog, {
        width: '200px',
        data: { message: this.popUpMessage }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (isPlatformBrowser(this.platformId)) {
          this.addEventButton.nativeElement.blur();
        }
      });
    } else {
      //Add event!
      this.eventsService
          .createEvent(this.newEvent)
          .subscribe(
            (data: Events) => {
                this.newEvent = HelperHandler.MapDataToEvents(data);

                var successMessage: string = "Event successfuly added."
                console.log(data);
                const dialogRef = this.dialog.open(SimplePopUpDialog, {
                  width: '200px',
                  data: { message: successMessage }
                });
                dialogRef.afterClosed().subscribe(result => {
                  if (isPlatformBrowser(this.platformId)) {
                    this.addEventButton.nativeElement.blur();
                    this.addEventToView();
                  }});
            },
            err => {
              var unsuccessMessage: string = "Event was not added. " + err;
              console.log("Event was not added. error: " + err);
              const dialogRef = this.dialog.open(SimplePopUpDialog, {
                width: '200px',
                data: { message: unsuccessMessage }
              });
              dialogRef.afterClosed().subscribe(result => {
                if (isPlatformBrowser(this.platformId)) {
                  this.addEventButton.nativeElement.blur();
                }});
            },
            () => {}
          );
    }
  }

  addEventToView():void {
    if (HelperHandler.CorrectAddEventInput(this.newEvent)) {
      console.log("Dodajemo id " + this.newEvent.EventId);
      HelperHandler.PrintEvent(this.newEvent);
      this.events.push ( {
        id: this.newEvent.EventId,
        title: this.newEvent.Title,
        start: this.newEvent.StartsAt,
        end: this.newEvent.EndsAt,
        color: colors.yellow,
        actions: this.actions,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      });
      this.refresh.next();
    } 
  }

  fillCalendarWithUserEvents(userId :number) {
    var eventsDTO: Events[];
    this.eventsService
        .getUserEvents(userId)
        .subscribe(
          (data : Events[]) => {

            for (let element of data)
            {
              var startsAtUTC = new Date(element['startsAt']);
              var endsAtUTC = new Date(element['endsAt']);

              var startsAt = HelperHandler.GetLocalDateTimeFromUTC(startsAtUTC);
              var endsAt = HelperHandler.GetLocalDateTimeFromUTC(endsAtUTC);

              this.events.push({
                id: element['eventId'],
                start: startsAt,
                end: endsAt,
                title: element['title'],
                meta: element['email'],
                color: colors.yellow,
                actions: this.actions,
                resizable: {
                  beforeStart: true,
                  afterEnd: true
                },
                draggable: true
              });
              this.eventTimesChanged
              this.refresh.next();
            }
          },
          (err) => {
            if (err.status === Constants.BAD_REQUEST) {
              console.error("Can not get user events");
            }
            else {
              console.error("Unsupported error." + err);
            }            
          },
          () => {
            console.log("Done. Loading user events.");
          }
        );
  }
  //#endregion
}

//#region  Dialog component
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
//#endregion
