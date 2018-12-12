import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../authentication.service';
import { Users } from '../Model/Users';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  title: string = "Calendar";
  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
        if (!this.authenticationService.IsAuthenticated) {
            this.router.navigate(['/login']);
        }
        var authUser = this.authenticationService.getUser();
        if (authUser != null) {
          this.authenticationService
              .getUserById(authUser.UserId)
              .subscribe(
                (data: Users) => {
                    if (!(authUser.SessionId === data['sessionId'])){
                      console.log("Incorrect session id.");
                      this.router.navigate(['/login']);
                    }
                },
                err => {
                  console.log(err.error);
                  this.router.navigate(['/login']);
                },
                () => {
                  console.log("Done: " + authUser.SessionId);
                }
              );
        }
      }
  
  ngOnInit() {
  }
}
