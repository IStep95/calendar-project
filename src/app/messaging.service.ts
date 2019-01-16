import { Injectable, NgZone } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from './Constants';
import { StringHandler } from './Helpers/StringHandler';
import { DeviceDetectorService } from 'ngx-device-detector';


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
    private deviceService: DeviceDetectorService) { 

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
        
        //var tokenKey = "Browser: " + this.deviceService.browser + " Mobile: " + this.deviceService.isMobile();
        //const tokenDBRow = {[tokenKey]: token };

        const tokenDBRow = token;
        // Get all tokens for specific user //
        let data = this.angularFireDB.list('/fcmTokens/' + userId).valueChanges();
        var tokenExist :boolean = false;
        var index = 0;
        var tokensLength = 0;
        data.subscribe((tokens)=>{
          
          // Check if token is already assigned
          tokens.forEach(element => {
            var tokenString = JSON.stringify(Object.assign(element)).replace(/"/g,"");

            if (tokenString === token) {
              tokenExist = true;
              //you can not break out of foreach in javascript
              //and should not in this case because of index
            }
            index++;
            tokensLength = tokens.length;
          });

        });

        if (!tokenExist) {

          let tokenDBRow;
          if (tokensLength == 0) {
            tokenDBRow = {[0]: token }
          } else {
            tokenDBRow = {[index + 1]: token }
          }

          this.angularFireDB.object('/fcmTokens/' + userId).update(tokenDBRow);
        }
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
