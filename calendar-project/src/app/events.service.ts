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
      returnEvent.StartsAt = new Date(data['startAt']);
      returnEvent.EndsAt = new Date(data['endsAt']);

      returnEvent.StartsAt = HelperHandler.GetLocalDateTimeFromUTC(returnEvent.StartsAt);
      returnEvent.EndsAt = HelperHandler.GetLocalDateTimeFromUTC(returnEvent.EndsAt);
      returnEvent.UserId = data['userId'];
    })


    return of(returnEvent);
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

      returnEvent.StartsAt = HelperHandler.GetLocalDateTimeFromUTC(returnEvent.StartsAt);
      returnEvent.EndsAt = HelperHandler.GetLocalDateTimeFromUTC(returnEvent.EndsAt);

      HelperHandler.PrintEvent(returnEvent);
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
    tmpObservable.subscribe((data: Events[]) => 
    {
      try {

        for (let element of data)
        {
          var startsAtUTC = new Date(element['startsAt']);
          var endsAtUTC = new Date(element['endsAt']);

          var startsAt = HelperHandler.GetLocalDateTimeFromUTC(startsAtUTC);
          var endsAt = HelperHandler.GetLocalDateTimeFromUTC(endsAtUTC);

          returnEvents.push ({
            EventId: element['eventId'],
            Title: element['title'],
            Email: element['email'],
            StartsAt: startsAt,
            EndsAt: endsAtUTC,
            UserId: element['userId']
          });
        }
      } catch(e) {
        console.log(e);
      }
    });

    console.log(returnEvents);
    return of(returnEvents);
  }
}
