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
  userEmailRequired: boolean = false;
  userPasswordRequired: boolean = false;

  constructor() { }

  ngOnInit() {
    this.initProperties();
  }

  onLogin(): void {
    this.submitted = true;

    if (StringHandler.IsNullOrEmpty(this.currentUser.email)) {
      this.userEmailRequired = true;
    
    }

    if (StringHandler.IsNullOrEmpty(this.currentUser.entered_password)) {
      this.userPasswordRequired = true;
    }
    
    console.log("Login");

  }

  onLoginFocusOut(): void {
    console.log("Login unfocused")
  }

  private initProperties() {
    this.currentUser = new User();
    this.submitted = false;
    this.currentUser.email = '';
    this.currentUser.entered_password = '';
  }

  private stringIsNullOrEmpty(str: string): boolean{
    return (!str || 0 === str.length);
  }
}
