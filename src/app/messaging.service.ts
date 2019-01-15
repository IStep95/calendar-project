import { Injectable, NgZone } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from './Constants';
import { StringHandler } from './Helpers/StringHandler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


var server_key = Constants.FIRE_BASE_SERVER_KEY;
const httpOptions = {
  headers: new HttpHeaders({ 'Authorization': 'key='+server_key+'', 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  currentMessage = new BehaviorSubject(null);
  saved_token: string = "";

  constructor(
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging,
    private http: HttpClient,
    private ngZone: NgZone) { 

    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }

  /**
   * update token in firebase database
   * 
   * @param userId userId as a key 
   * @param token token as a value
   */
  updateToken(userId, token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(
      () => {

        if (token === null) {
          token = localStorage.getItem(Constants.FIRE_BASE_TOKEN_KEY);
        }
        const data = { [userId]: token };
        this.angularFireDB.object('fcmTokens/').update(data);
      });
  }

  /**
   * request permission for notification from firebase cloud messaging
   * 
   * @param userId userId
   */
  requestPermission(userId) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        localStorage.setItem(Constants.FIRE_BASE_TOKEN_KEY, token);
        this.updateToken(userId, token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("new message received. ", payload);
        this.currentMessage.next(payload);
      });
  }


  sendMessage() {

    if (StringHandler.IsNullOrEmpty(this.saved_token)) {
      this.saved_token = localStorage.getItem(Constants.FIRE_BASE_TOKEN_KEY);
      if (StringHandler.IsNullOrEmpty(this.saved_token)) {
        console.log("Can not send notifications, token undefined.");
        return;
      }
    }

    var url = "https://fcm.googleapis.com/fcm/send";
    var data: any = { 
      "notification": {
       "title": "Hello World", 
       "body": "This Message is from Admin Ivo",
       "icon": "https://calendarpwa.azurewebsites.net/assets/icons/icon-512x512.png"
      },
      "to": this.saved_token
     };
     
     this.http.post(url, JSON.stringify(data), httpOptions ).subscribe();
     console.log(httpOptions.headers);

  }
}
