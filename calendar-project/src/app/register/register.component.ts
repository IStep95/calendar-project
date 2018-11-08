import { Component, OnInit } from '@angular/core';
import { User } from '../Model/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  title: string = 'Calendar';
  currentUser: User = new User();
  submitted: boolean = false;
  repeteadPassword: string;

  constructor() { }

  ngOnInit() {
    this.initProperties();
  }

  onRegister() {
    this.submitted = true;
    console.log("Registriraj me!");

  }

  private initProperties() {
    this.currentUser = new User();
    this.submitted = false;
    this.currentUser.first_name = '';
    this.currentUser.last_name = '';
    this.currentUser.email = '';
    this.currentUser.entered_password = '';
    this.repeteadPassword = '';
  }
}
