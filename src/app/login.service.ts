import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Users } from "./Model/Users";
import { Constants } from './Constants';

const httpOptions = {
  headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ){}

  userAuthenticated(authUser: Users): void {
    this.authenticationService.userAuthenticated(authUser);
  }

  loginUser(logUser: Users): Observable<Users>{
    var url = Constants.API_ENDPOINT_USER + "/Authenticate";
    return this.http.post<Users>(url, logUser, httpOptions);
  }
}
