import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Users } from "../Model/Users";
import { StringHandler } from '../Helpers/StringHandler';
import { LoginService } from '../login.service';
import { HelperHandler } from '../Helpers/HelperHandler';
import { Constants } from '../Constants';


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
  isLoaderIconVisible: boolean = false;

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
                        if (err.status == Constants.BAD_REQUEST) {
                          this.LoginFailedMessage = "User with entered email does not exist.";
                        } else if(err.status == Constants.UNAUTHORIZED) {
                          this.LoginFailedMessage = "Entered password is incorrect.";
                        } else {
                          this.LoginFailedMessage = "Oooops something went wrong, try later.";
                          
                          // Wait one second for better UX
                          this.sleep(Constants._1000MSEC).then(e => {
                            this.isLoaderIconVisible = false;
                          });
                        }
                      },
                      () => {
                          HelperHandler.PrintUser(this.currentUser);
                          this.loginService.userAuthenticated(this.currentUser);
                          
                          // Wait one second for better UX
                          this.sleep(Constants._1000MSEC).then(e => {
                            this.router.navigate(['/calendar']);
                          });
                      }
                      
     );
    
    // Add progress bar...
    console.log("Loging in...");
    this.isLoaderIconVisible = true;

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
    this.isLoaderIconVisible = false;
  }

  private async sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
  }
  
}
