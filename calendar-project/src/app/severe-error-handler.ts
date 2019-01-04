import { Injectable, Injector, ErrorHandler, NgZone, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class SevereErrorHandler extends ErrorHandler {

  constructor (private injector: Injector, 
               private authenticationService: AuthenticationService) {
    super();
  }
  isInErrorState: boolean = false;

    handleError(error) {
    
    /** With router redirecting not working */
    /** Use: window.location.href */
    /** Used for redirecting unauthorized user from /calendar to /login */
    console.error(error);
    console.log(this.authenticationService.IsAuthenticated);
    window.location.href = '/login';


    if (!this.isInErrorState && this.authenticationService.IsAuthenticated) {
      this.isInErrorState = true;
       
      
      //this.zone.run(() => {
      //   console.log(this.router.url); 
      //   console.log("NAVIGATE"); 
      //   this.router.navigate['./login']; 
      //   console.log(this.router.url);
      // });
      
    }
  }

  public get router(): Router { //this creates router property on your service.
    return this.injector.get(Router);
  }
 
  public get zone(): NgZone {
    return this.injector.get(NgZone);
  }

}

@NgModule({
  imports: [
    AppRoutingModule],
  providers: [{provide: ErrorHandler, useClass: SevereErrorHandler}]
})

class MyModule{}