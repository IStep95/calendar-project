import { Component, OnInit } from '@angular/core';
import { User } from '../Model/User';
import { StringHandler } from '../Helpers/StringHandler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title: string = 'Calendar';
  currentUser: User = new User();
  submitted: boolean = false;
  emailOrPasswordIncorrect: boolean = false;


  constructor() { }

  ngOnInit() {
    this.initProperties();
  }

  onLogin(): void {
    this.submitted = true;
    var notValidEmail: boolean = false;

    /* TODO check email and password combination */
    /* Email validation */
    if (!StringHandler.ValidateEmail(this.currentUser.Email)) notValidEmail = true;
    



    console.log("Login");

  }

  onLoginFocusOut(): void {
    console.log("Login unfocused")
  }

  private initProperties() {
    this.currentUser = new User();
    this.submitted = false;
    this.emailOrPasswordIncorrect = false;
    this.currentUser.Email = '';
    this.currentUser.EnteredPassword = '';
  }
  
}
