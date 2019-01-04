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
import { setImmediate } from 'setImmediate';

import { AuthenticationService } from '../authentication.service';
import { EventsService } from '../events.service';
import { Users } from '../Model/Users';
import { Events } from '../Model/Events';
import { HelperHandler } from '../Helpers/HelperHandler';
import { CalendarState } from '../calendar-state';

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
  @ViewChild('addEventId') addEditEventButton: ElementRef;
  @ViewChild('info') edit: ElementRef;

  modalContent: TemplateRef<any>;
  title: string = "Calendar";
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  currentEvent: Events = new Events();
  popUpMessage: string;
  AddEditEventTitle: string; 
  AddEditButton: string;
  calendarState:CalendarState;

  modalData: {
    action: string;
    event: CalendarEvent;
  }
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Deleted', event);
      }
    }
  ];
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true; 
  authUser: Users = null;
  isUserAuthenticated: boolean = !(localStorage[Constants.AUTHENTICATED_USER_KEY] === null);

  get ActiveDayIsOpen(): boolean {
    return this.activeDayIsOpen;
  }
  set ActiveDayIsOpen(value: boolean) {
    
    if ((this.activeDayIsOpen === true) && (value === false))
      this.setAddState();

    this.activeDayIsOpen = value;
  }

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
      this.currentEvent.UserId = this.authUser.UserId;
      this.currentEvent.Email = this.authUser.Email;

      /* Get user events */
      this.fillCalendarWithUserEvents(this.authUser.UserId);
    }
    this.initProperties();
  }

  initProperties() { 
    this.initialState();
  }

  initialState() {
    this.setAddState();
  }

  setAddState() {
    this.calendarState = CalendarState.AddState;
    this.AddEditEventTitle = "Add event:";
    this.AddEditButton = "Add";
    this.currentEvent.Title = ' ';
    this.currentEvent.StartsAt = null;
    this.currentEvent.EndsAt = null;
  }

  setEditState(event: CalendarEvent) {
    this.calendarState = CalendarState.EditState;
    this.AddEditEventTitle = "Edit event:";
    this.AddEditButton = "Save";
    this.moveToEdit();
    this.currentEvent.Title = event.title;
    this.currentEvent.EventId = Number(event.id);
    this.currentEvent.StartsAt = event.start;
    this.currentEvent.EndsAt = event.end;
    this.currentEvent.UserId = event.meta[0];
    this.currentEvent.Email = event.meta[1];
  }

  moveToEdit():void {
    var element = document.getElementById("edit");
    element.scrollIntoView();
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
        (isSameDay(this.viewDate, date) && this.ActiveDayIsOpen === true) ||
        events.length === 0
      ) {
        this.ActiveDayIsOpen = false;
      } else {
        this.ActiveDayIsOpen = true;
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
      this.eventsService
          .deleteEvent(Number(event.id))
          .subscribe((data: Events) => {
            var successMessage: string = 'Event \"' + data['title'] + '\" deleted. ';
            const dialogRef = this.dialog.open(SimplePopUpDialog, {
              width: '200px',
              data: { message: successMessage }
            });
            this.ActiveDayIsOpen = false;
            this.removeEventFromView(Number(event.id));
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
    else if (action === "Edited") {
      this.setEditState(event);
    }
  }

  //* Add or updates event depends on calendar state **/
  addEditEvent(): void {
    if (!HelperHandler.CorrectAddEventInput(this.currentEvent)) {
      this.popUpMessage = "You did not enter everything correctly.";
      const dialogRef = this.dialog.open(SimplePopUpDialog, {
        width: '200px',
        data: { message: this.popUpMessage }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (isPlatformBrowser(this.platformId)) {
          this.addEditEventButton.nativeElement.blur();
        }
      });
    } else if (this.calendarState == CalendarState.AddState) {
      //Add event!
      this.eventsService
          .createEvent(this.currentEvent)
          .subscribe(
            (data: Events) => {
                this.currentEvent = HelperHandler.MapDataToEvents(data);
                var successMessage: string = "Event successfuly added."
                
                const dialogRef = this.dialog.open(SimplePopUpDialog, {
                  width: '200px',
                  data: { message: successMessage }
                });
                dialogRef.afterClosed().subscribe(result => {
                  if (isPlatformBrowser(this.platformId)) {
                    this.addEditEventButton.nativeElement.blur();
                    this.addEventToView();
                    this.setAddState();
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
                  this.addEditEventButton.nativeElement.blur();
                  this.setAddState();
                }});
            },
            () => {}
          );
    } else if (this.calendarState == CalendarState.EditState) {
      //Edit event!
      this.eventsService
          .updateEvent(this.currentEvent)
          .subscribe(
            (data: Events) => {
              this.currentEvent = HelperHandler.MapDataToEvents(data);
              var successMessage: string = "Event successfuly edited.";

              const dialogRef = this.dialog.open(SimplePopUpDialog, {
                width: '200px',
                data: { message: successMessage }
              });
              
              dialogRef.afterClosed().subscribe(result => {
                if (isPlatformBrowser(this.platformId)) {
                  this.addEditEventButton.nativeElement.blur();
                  
                  // Remove old event details
                  this.removeEventFromView(this.currentEvent.EventId);
                  
                  // Add new event details
                  this.addEventToView();

                  // Close active day
                  this.ActiveDayIsOpen = false;

                }});
            },
            (err) => {
              var unsuccessMessage: string = "Event failed to be edited.";
              const dialogRef = this.dialog.open(SimplePopUpDialog, {
                width: '200px',
                data: { message: unsuccessMessage }
              });
              dialogRef.afterClosed().subscribe(result => {
                this.ActiveDayIsOpen = false;
              });
            },
            () => {}
          );
    }
  }

  addEventToView(): void {
    if (HelperHandler.CorrectAddEventInput(this.currentEvent)) {
      this.events.push ( {
        id: this.currentEvent.EventId,
        title: this.currentEvent.Title,
        start: this.currentEvent.StartsAt,
        end: this.currentEvent.EndsAt,
        meta: [this.authUser.UserId, this.authUser.Email],
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

  removeEventFromView(eventId: number): void {
    var index = 0;
    var foundElement: boolean = false;
    for (let element of this.events) {
      if (element.id === eventId) 
      {
        foundElement = true;
        break;
      }
      index++;
    }
    if (foundElement === true) this.events.splice(index, 1);
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
                meta: [element['userId'], element['email']],
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