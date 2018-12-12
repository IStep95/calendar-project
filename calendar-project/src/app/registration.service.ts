import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Users } from "./Model/Users";
import { Constants } from './Constants';
import { AuthenticationService } from './authentication.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class RegistrationService {

  constructor(
      private http: HttpClient,
      private authenticationService: AuthenticationService   
  ) { }

  getUserById(id: number): Observable<Users> {
    var url = Constants.API_ENDPOINT + "/Get/" + id;
    var currUser: Observable<Users> = new Observable<Users>();
    return this.http.get<Users>(url);
  } 
 
  registerUser(regUser: Users): Observable<Users>{
    var url = Constants.API_ENDPOINT + "/Create";
    return this.http.post<Users>(url, regUser, httpOptions);
  }

  userAuthenticated(authUser: Users): void {
    this.authenticationService.userAuthenticated(authUser);
  } 
}
