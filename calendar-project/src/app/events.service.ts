import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Events } from './Model/Events';
import { Constants } from './Constants';
import { HelperHandler } from './Helpers/HelperHandler';

const httpOptions = {
  headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class EventsService {

  constructor(private http: HttpClient) { }


  /** Creates new event */
  /** Plus returns new event with local datetime */
  /** Datetime in database is stored in UTC datetime */
  createEvent(newEvent: Events): Observable<Events>{
    var url = Constants.API_ENDPOINT_EVENT + "/Create";

    var tmpObservable: Observable<Events>;
    var returnEvent: Events = new Events();
    tmpObservable = this.http.post<Events>(url, newEvent, httpOptions);
    tmpObservable.subscribe((data: Events) =>
    {
      returnEvent.EventId = data['eventId'];
      returnEvent.Title = data['title'];
      returnEvent.Email = data['email'];
      returnEvent.StartsAt = new Date(data['startsAt']);
      returnEvent.EndsAt = new Date(data['endsAt']);

      //returnEvent.StartsAt = HelperHandler.GetLocalDateTimeFromUTC(returnEvent.StartsAt.toUTCString());
      //returnEvent.EndsAt = HelperHandler.GetLocalDateTimeFromUTC(returnEvent.EndsAt.toUTCString());
      returnEvent.UserId = data['userId'];
      //HelperHandler.PrintEvent(returnEvent);
    })
    return tmpObservable;
  }

  /** Get event by id  */
  /** Plus converts date from database(UTC datetime) to local datetime */
  getEvent(id: number): Observable<Events> {
    var url = Constants.API_ENDPOINT_EVENT + "/Get/" + id;

    var tmpObservable: Observable<Events>;
    var returnEvent: Events = new Events();
    tmpObservable = this.http.get<Events>(url);
    tmpObservable.subscribe((data: Events) =>
    { 
      returnEvent.EventId = data['eventId'];
      returnEvent.Title = data['title'];
      returnEvent.Email = data['email'];
      returnEvent.StartsAt = new Date(data['startsAt']);
      returnEvent.EndsAt = new Date(data['endsAt']);
      returnEvent.UserId = data['userId'];

      //returnEvent.StartsAt = HelperHandler.GetLocalDateTimeFromUTC(returnEvent.StartsAt.toUTCString());
      //returnEvent.EndsAt = HelperHandler.GetLocalDateTimeFromUTC(returnEvent.EndsAt.toUTCString());

      //HelperHandler.PrintEvent(returnEvent);
    });

    return of(returnEvent);
  }

  /** Get user events by user id */
  /** Plus converts dates from database(UTC datetime) to local datetime */
  getUserEvents(userId: number): Observable<Events[]> {
    var url = Constants.API_ENDPOINT_EVENT + "/GetUserEvents/" + userId;

    var tmpObservable: Observable<Events[]>;
    var returnEvents: Events[];
    tmpObservable = this.http.get<Events[]>(url);
    tmpObservable.subscribe((data: Events[]) =>  {});

    return tmpObservable;
  }

  /** Delete user event */
  deleteEvent(id: number): Observable<Events> {
    var url = Constants.API_ENDPOINT_EVENT + "/Delete";
    var tmpObservable: Observable<Events>;
    tmpObservable = this.http.post<Events>(url, id, httpOptions);

    return tmpObservable;
  }
}
