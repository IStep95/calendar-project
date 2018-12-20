import { Events } from './Events';

export class Users {
    UserId: number;
    Email: string;
    EnteredPassword: string;
    RepeteadPassword: string;
    FirstName: string;
    LastName: string;
    DateOfBirth: Date;
    SessionId: string;
    EventsDTO: Events[];
}