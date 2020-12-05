export class SuccessfulLoginServerResponse{
    public constructor(
        public token?:string,       
        public userType?:string,
        public userFirstName?:string,
        public username?:string,
    ){}
}