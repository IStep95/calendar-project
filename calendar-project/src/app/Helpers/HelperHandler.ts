import { Users } from "../Model/Users";
import { Events } from "../Model/Events";

export class HelperHandler {
    public static PrintUser(user: Users): void
    {
        console.log("user id: " + user.UserId);
        console.log("email: " + user.Email);
        console.log("entered password: " + user.EnteredPassword);
        console.log("first name: " + user.FirstName);
        console.log("last name: " + user.LastName);
        console.log("date of birth: " + user.DateOfBirth);
        console.log("session id: " + user.SessionId);
    }

    public static GetLocalDateTimeFromUTC(value: Date): Date {
        
        //Get ms for date
        let time = value.getTime();

        //Check if timezoneOffset is positive or negative
        if (value.getTimezoneOffset() <= 0) {
            //Convert timezoneOffset to hours and add to Date value in milliseconds                              
            let final = time + (Math.abs(value.getTimezoneOffset() * 60000));
            //Convert from milliseconds to date                         
            value = new Date(final);
        } else {
            let final = time + (-Math.abs(value.getTimezoneOffset() * 60000));
            value = new Date(final);
        }

        return value;
    }

    public static PrintEvent(event: Events): void 
    {
        console.log("event id: " + event.EventId);
        console.log("title: " + event.Title);
        console.log("starts at: " + event.StartsAt);
        console.log("ends at: " + event.EndsAt);
        console.log("email: " + event.Email);
    }

}