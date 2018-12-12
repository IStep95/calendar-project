import { Users } from "../Model/Users";

export class HelperHandler {
    public static PrintUser(user: Users): void
    {
        console.log(user.UserId);
        console.log(user.Email);
        console.log(user.EnteredPassword);
        console.log(user.FirstName);
        console.log(user.LastName);
        console.log(user.DateOfBirth);
        console.log(user.SessionId);
    }
}