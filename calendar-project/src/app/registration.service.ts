import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './Model/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from './Constants';

const httpOptions = {
  headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class RegistrationService {

  vuser:User;
  
  constructor(
      private http: HttpClient   
  ) { }

  getUserById(id: number) :Observable<User> {
    var url = Constants.API_ENDPOINT + "/Get/" + id;
    var currUser: Observable<User> = new Observable<User>();
    //return this.http.get<User>(url).subscribe((data: User) => currUser = of(data));
    
    return this.http.get<User>(url);
  } 
 
  registerUser(regUser: User): Observable<User> {
    
    var url = Constants.API_ENDPOINT + "/Create";
    return this.http.post<User>(url, regUser, httpOptions);
  }
}
