import { Vacation } from "../components/model/Vacation";

export class AppState {
    public isConnected : boolean = false;
    public vacations: Vacation[] = [];
    public showPage: boolean = true;
    public userType: string = "";
    public userFirstName: string = "";
    public username: string = "";
    public favoriteVacations: Vacation[] = [];

    public isModalEditVacation: boolean = false;
    public vacationToEdit: Vacation;

    public isModalAddVacation: boolean = false;
    public lastVacationId: number = 0;
    
    public isModalVacationsGraph: boolean = false;

    public socket: any = "";
}