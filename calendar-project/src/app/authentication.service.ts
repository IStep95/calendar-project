import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Users } from "./Model/Users";
import { Constants } from './Constants';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isAuthenticated: boolean = false;
  private authenticatedUser: Users = null;

  constructor(private http: HttpClient) { }

  public IsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  public userAuthenticated(authUser: Users): void {
    this.isAuthenticated = true;
    this.authenticatedUser = authUser;
  }

  public getUser(): Users {
    return this.authenticatedUser;
  }

  public getUserById(id: number): Observable<Users> {
    var url = Constants.API_ENDPOINT + "/Get/" + id;
    return this.http.get<Users>(url);
  }
}
