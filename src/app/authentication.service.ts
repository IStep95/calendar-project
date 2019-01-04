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

  public get IsAuthenticated(): boolean {
    if (this.authenticatedUser === null) return false;
    return true;
  }

  public userAuthenticated(authUser: Users): void {
      this.isAuthenticated = true;
      this.authenticatedUser = authUser;
  }

  public userLogOut(): void {
    this.isAuthenticated = false;
    localStorage.removeItem("Authenticated user");
  }

  public getUser(): Users {
    return this.authenticatedUser;
  }

  public getUserById(id: number): Observable<Users> {
    var url = Constants.API_ENDPOINT_USER + "/Get/" + id;
    return this.http.get<Users>(url);
  }

}
