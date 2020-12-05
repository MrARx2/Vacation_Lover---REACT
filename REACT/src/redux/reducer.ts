import { AppState } from "./app-state";
import { ActionType } from "./action-type";
import { Action } from "./action";

// This function is NOT called direcrtly by you
export function reduce(oldAppState: AppState, action: Action): AppState {
    // Cloning the oldState (creating a copy)
    const newAppState = { ...oldAppState };

    switch (action.type) {
        case ActionType.SetUserLogin:
            newAppState.userType = action.payload[0];
            newAppState.userFirstName = action.payload[1];
            newAppState.username = action.payload[2];
            newAppState.isConnected = true;
            break;

        case ActionType.setlogout:
            newAppState.userType = "";
            newAppState.userFirstName = "";
            newAppState.username = "";
            newAppState.socket = "";
            newAppState.lastVacationId = 0;
            newAppState.favoriteVacations = [];
            newAppState.vacations = [];
            newAppState.showPage = true;
            newAppState.isModalEditVacation = false;
            newAppState.isModalAddVacation = false;
            newAppState.isModalVacationsGraph = false;
            newAppState.isConnected = false;
            break;

        case ActionType.HandleBrokenToken:
            newAppState.isConnected = false;
            break;

        case ActionType.SetAllVacations:
            newAppState.vacations = action.payload;
            break;

        case ActionType.AddFavoriteVacation:
            //updating vacation in all-vacations
            const vacationToUpdateId = newAppState.vacations?.findIndex(vacation => vacation.id === action.payload.id);
            newAppState.vacations[vacationToUpdateId] = action.payload;
            //pushing object to favorites
            newAppState.favoriteVacations.push(newAppState.vacations[vacationToUpdateId]);
            break;

        case ActionType.RemoveFavoriteIndex:
            //updating vacation in all-vacations
            const vacationToUpdate = newAppState.vacations?.findIndex(vacation => vacation.id === action.payload[0].id);
            newAppState.vacations[vacationToUpdate] = action.payload[0];

            //removing object from favorites
            newAppState.favoriteVacations.splice(action.payload[1], 1);
            break;

        case ActionType.FollowHasBeenSubmitted:
            const vacationSelected1 = newAppState.vacations?.findIndex(vacation => vacation.id === action.payload.id);
            const vacationToUpAFollow1 = newAppState.vacations[vacationSelected1];
            vacationToUpAFollow1.amountOfFollowers = vacationToUpAFollow1.amountOfFollowers + 1;
            break;

        case ActionType.UnFollowHasBeenSubmitted:
            const vacationSelected0 = newAppState.vacations?.findIndex(vacation => vacation.id === action.payload.id);
            const vacationToDownAFollow = newAppState.vacations[vacationSelected0];
            vacationToDownAFollow.amountOfFollowers = vacationToDownAFollow.amountOfFollowers - 1;
            break;

        case ActionType.RemoveVacation:
            const vacationIdToRemove = action.payload - 1;
            newAppState.vacations.splice(vacationIdToRemove, 1);
            break;

        case ActionType.ChangeShowPage:
            newAppState.showPage = action.payload;
            break;

        case ActionType.HandleEditModal:
            newAppState.vacationToEdit = action.payload[0];
            newAppState.isModalEditVacation = action.payload[1];
            break;

        case ActionType.HandleAddModal:
            const last = newAppState.vacations.length;
            newAppState.lastVacationId = last;
            newAppState.isModalAddVacation = action.payload;
            break;

        case ActionType.HandleVacationsGraph:
            newAppState.isModalVacationsGraph = action.payload;
            break;

        case ActionType.SaveEditedVacation:
            const vacationId = newAppState.vacations?.findIndex(vacation => vacation.id === action.payload.id);
            newAppState.vacations[vacationId] = action.payload;
            break;

        case ActionType.AddNewVacation:
            newAppState.vacations.push(action.payload);
            break;

        case ActionType.SetSocket:
            newAppState.socket = action.payload;
            break;
    }
    // After returning the new state, it's being published to all subscribers
    // Each component will render itself based on the new state
    return newAppState;
}