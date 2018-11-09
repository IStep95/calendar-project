import { Component, OnInit } from '@angular/core';

import { RegistrationService } from '../registration.service';
import { User } from '../Model/User';
import { StringHandler } from '../Helpers/StringHandler';
import { HelperHandler } from '../Helpers/HelperHandler';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  title: string = 'Calendar';
  currentUser: User = new User();
  submitted: boolean = false;
  registratitonFailed: boolean = false;
  RegistrationFailedMessage: string;

  constructor(private registrationService:RegistrationService) { }

  ngOnInit() {
    this.initProperties();
  }

  onRegister() {
      /* Correct get example */
      /*
        var x = this.registrationService.getUserById(1).subscribe(
        data => { currentUser = data},
        err => console.error(err),
        () => 
        { 
            console.log('done loading user');
            console.log(currentUser.email);
        }
        );*/
    this.submitted = true;

    if (!this.correctInputForm()) return;
    this.registrationService
        .registerUser(this.currentUser)
        .subscribe(
          data => { this.currentUser = data},
          err => 
          { this.registratitonFailed = true;
            this.RegistrationFailedMessage = err.error;
          },
          () => 
          { 
              console.log('done creating user');
              HelperHandler.PrintUser(this.currentUser);
          }
        )

    //console.log("Add loader..");
    console.log("Registriram");
  }

  private initProperties() {
    this.currentUser = new User();
    this.submitted = false;
    this.currentUser.FirstName = '';
    this.currentUser.LastName = '';
    this.currentUser.Email = '';
    this.currentUser.EnteredPassword = '';
    this.currentUser.RepeteadPassword = '';
    this.registratitonFailed = false;
  }

  private correctInputForm(): boolean {
    
    if (!StringHandler.ValidateEmail(this.currentUser.Email)){
      this.registratitonFailed = true;
      this.RegistrationFailedMessage = "Enter a valid email.";
      return false;
    }
    
    if (this.currentUser.EnteredPassword.length <= 8) {
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
