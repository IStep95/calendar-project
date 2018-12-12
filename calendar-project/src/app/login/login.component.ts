import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Users } from "../Model/Users";
import { StringHandler } from '../Helpers/StringHandler';
import { LoginService } from '../login.service';
import { HelperHandler } from '../Helpers/HelperHandler';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title: string = 'Calendar';
  currentUser: Users = new Users();
  submitted: boolean = false;
  emailOrPasswordIncorrect: boolean = false;
  LoginFailedMessage: string;

  constructor(private loginService: LoginService,
              private router: Router) { }

  ngOnInit() {
    this.initProperties();
  }

  onLogin(): void {
    this.submitted = true;
    var notValidEmail: boolean = false;

    /* Email validation */
    if (!StringHandler.ValidateEmail(this.currentUser.Email)) 
    {
      notValidEmail = true;
      this.emailOrPasswordIncorrect = true;
      this.LoginFailedMessage = "Entered email is not valid.";
      return;
    }

    this.loginService.loginUser(this.currentUser)
                     .subscribe(
                      (data: Users) => {
                        this.currentUser.UserId = data['userId'];
                        this.currentUser.FirstName = data['firstName'];
                        this.currentUser.LastName = data['lastName'];
                        this.currentUser.SessionId = data['sessionId'];
                      },
                      err => {
                        this.emailOrPasswordIncorrect = true;
                        if (err.status == 400) {
                          this.LoginFailedMessage = "User with entered email does not exist.";
                        } else if(err.status == 401) {
                          this.LoginFailedMessage = "Entered password is incorrect.";
                        } else {
                          this.LoginFailedMessage = "Oooops something went wrong, try later.";
                        }
                      },
                      () => {
                          HelperHandler.PrintUser(this.currentUser);
                          this.loginService.userAuthenticated(this.currentUser);
                          this.router.navigate(['/calendar']);
                      }
     );
    
    // Add progress bar...
    console.log("Loging in...");

  }

  onLoginFocusOut(): void {
    console.log("Login unfocused")
  }

  private initProperties() {
    this.currentUser = new Users();
    this.submitted = false;
    this.emailOrPasswordIncorrect = false;
    this.currentUser.Email = '';
    this.currentUser.EnteredPassword = '';
  }
  
}
