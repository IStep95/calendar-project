export class StringHandler {

    public static IsNullOrEmpty(str: string): boolean{
        return (!str || 0 === str.length);
    }
}