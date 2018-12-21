export class Constants {

    public static API_ENDPOINT_USER:string = "https://localhost:5001/api/users";

    public static API_ENDPOINT_EVENT:string = "https://localhost:5001/api/events";

    public static MIN_PASSWORD_LENGTH:number = 8;

    public static LOADER_ICON_IMAGE_PATH:string = "../assets/images/loader.svg";

    public static _1000MSEC:number = 1000;

    public static BAD_REQUEST:number = 400;
    
    public static UNAUTHORIZED:number = 401;

    
    /*
    var x = this.registrationService.getUserById(1).subscribe(
    data => { currentUser = data},
    err => console.error(err),
    () => 
    { 
        console.log('done loading user');
        console.log(currentUser.email);
    }
    );
    */

} 