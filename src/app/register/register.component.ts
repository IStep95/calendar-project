import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { RegistrationService } from '../registration.service';
import { Users } from "../Model/Users";
import { StringHandler } from '../Helpers/StringHandler';
import { HelperHandler } from '../Helpers/HelperHandler';
import { Constants } from '../Constants';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  title: string = 'Calendar';
  currentUser: Users = new Users();
  submitted: boolean = false;
  registratitonFailed: boolean = false;
  RegistrationFailedMessage: string;

  constructor(private registrationService: RegistrationService, private router: Router) { 
  }

  ngOnInit() {
    this.initProperties();
  }

  onRegister() {
      /* Correct get example */
    
    this.submitted = true;


    if (!this.correctInputForm()) return;
    

    this.currentUser.TimeOffset = new Date().getTimezoneOffset();
    this.registrationService
        .registerUser(this.currentUser)
        .subscribe(
          (data: Users) => {
            this.currentUser.UserId = data['userId'];
            this.currentUser.FirstName = data['firstName'];
            this.currentUser.LastName = data['lastName'];
            this.currentUser.DateOfBirth = data['dateOfBirth'];
            this.currentUser.Email = data['email'];
            this.currentUser.SessionId = data['sessionId'];
            
            localStorage.setItem(Constants.AUTHENTICATED_USER_KEY, JSON.stringify(this.currentUser));
          },
          err => 
          { this.registratitonFailed = true;
            if (err.status != 400) {
              this.RegistrationFailedMessage = err.error;
            } else {
              this.RegistrationFailedMessage = "Invalid input."
            }
          },
          () => 
          {
              HelperHandler.PrintUser(this.currentUser);
              this.registrationService.userAuthenticated(this.currentUser);    
              this.router.navigate(['/calendar']);
          }
        );

    //console.log("Add progress bar..");
    console.log("Registering...");
  }

  private initProperties() {
    this.initUser();
    HelperHandler.EnableScrolling();
  }

  private initUser() {
    this.currentUser = new Users();
    this.submitted = false;
    this.currentUser.FirstName = '';
    this.currentUser.LastName = '';
    this.currentUser.Email = '';
    this.currentUser.EnteredPassword = '';
    this.currentUser.RepeteadPassword = '';
    this.registratitonFailed = false;
    localStorage.clear();
  }

  private correctInputForm(): boolean {
    
    if (!StringHandler.ValidateEmail(this.currentUser.Email)){
      this.registratitonFailed = true;
      this.RegistrationFailedMessage = "Enter a valid email.";
      return false;
    }
    
    if (this.currentUser.EnteredPassword.length < Constants.MIN_PASSWORD_LENGTH) {
      this.registratitonFailed = true;
      this.RegistrationFailedMessage = "Password must be at least 8 characters long.";
      return false;
    }

    if (this.currentUser.RepeteadPassword.valueOf() != this.currentUser.EnteredPassword.valueOf()) {
      this.registratitonFailed = true;
      this.RegistrationFailedMessage = "Password and repetead password are not the same.";
      return false;
    }

    return true;
  }
}
