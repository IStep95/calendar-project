export class Constants {

    //public static API_ENDPOINT_USER: string = "https://calendarpwaapi.azurewebsites.net/api/users";
 
    //public static API_ENDPOINT_EVENT: string = "https://calendarpwaapi.azurewebsites.net/api/events";

    public static API_ENDPOINT_USER: string = "https://localhost:5001/api/users";

    public static API_ENDPOINT_EVENT: string = "https://localhost:5001/api/events"

    public static MIN_PASSWORD_LENGTH: number = 8;

    public static LOADER_ICON_IMAGE_PATH: string = "../assets/images/loader.svg";

    public static CALENDAR_ICON_IMAGE_PATH: string = "../assets/images/calendar_clock_icon.svg";

    public static _1000MSEC: number = 1000;

    public static _5000MSEC: number = 5000;

    public static BAD_REQUEST: number = 400;
    
    public static UNAUTHORIZED: number = 401;

    public static AUTHENTICATED_USER_KEY: string = "Authenticated user";

    public static PUSH_NOTIFICATIONS_ALLOWED_KEY: string = "Push notifications allowed"

    public static MOVE_TO_BOTTOM_PAGE_KEY: string = "Move to bottom";

    public static FIRE_BASE_SERVER_KEY: string = "AAAAPb5jg30:APA91bFD1Y3f4MPHRVCpQkTb1SYsGjnG42i_YYfSyBn0XMpBVJY3j30uSSfv5XVfR6ULCnU9Ijglk7t1sILJvdiVW3VlLFU1nrNtRZPrIheUGVQ4yBxTSyOwyvDvuCv0gzqSlJXunyTo";

    public static FIRE_BASE_TOKEN_KEY: string = "Firebase token key";

} 