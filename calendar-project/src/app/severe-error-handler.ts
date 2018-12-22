import { Injectable, Injector, ErrorHandler, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class SevereErrorHandler extends ErrorHandler {

  constructor (private injector: Injector) {
    super();
  }
  isInErrorState: boolean = false;

  handleError(error) {

    if (!this.isInErrorState) {
      this.isInErrorState = true;
      
      this.zone.run(() => {
        console.log(this.router.url);
        console.log("NAVIGATE");
        this.router.navigate['./login'];
        console.log(this.router.url);
      });
    }
  }

  public get router(): Router { //this creates router property on your service.
    return this.injector.get(Router);
  }
 
  public get zone(): NgZone {
    return this.injector.get(NgZone);
  }
}