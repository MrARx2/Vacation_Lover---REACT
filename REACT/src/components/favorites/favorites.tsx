import React, { ChangeEvent, Component } from 'react';
import { Vacation } from '../model/Vacation';
import { v4 as uuidv4 } from 'uuid';
import './favorites.css'
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';
import { toast } from 'react-toastify';
import axios from 'axios';

interface IState {
    favoriteVacations: Vacation[];
    filter: string,
    isShowingVacation: boolean,
}

export default class Favorites extends Component<any, IState> {
    public serverURL = 'localhost:3001';
    public toastStyle = { position: toast.POSITION.TOP_LEFT, autoClose: 3000 };
    constructor(props: any) {
        super(props);

        this.state = {
            favoriteVacations: store.getState().favoriteVacations,
            filter: "",
            isShowingVacation: true,
        }
    }

    attachHeaderToAxios = () => {
        const token = localStorage.getItem('user_token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = "Bearer " + token;
        }
    }

    public onCancellingFavorite = async (vacation: Vacation) => {
        try {
            this.attachHeaderToAxios();
            let vacationDetails = { vacationId: vacation.id }
            const response = await axios.post<any>(`http://${this.serverURL}/vacations/removeFavorite/`, vacationDetails);

            if (response.status === 200) {
                vacation.isFavorite = false;
                vacation.amountOfFollowers = vacation.amountOfFollowers - 1;
                let index = this.state.favoriteVacations.findIndex(obj => obj.id === vacation.id);

                store.dispatch({ type: ActionType.RemoveFavoriteIndex, payload: [vacation, index] });
                toast(`Unfollowing ${vacation.destination}`, this.toastStyle);
            }
        }

        catch (error) {
            toast.error(`${error}`, this.toastStyle);
        }
    }

    showAllVacationsPage = () => {
        store.dispatch({ type: ActionType.ChangeShowPage, payload: true });
    }

    filter = (event: ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value;
        this.setState({ filter: text.toUpperCase() });
    }

    defaultSrc = (event: ChangeEvent<HTMLImageElement>) => {
        event.target.src = 'https://www.nikolpoulin.com/asset/image/product/s_3.png'
    }

    public render() {
        return (
            <div id="favorites">
                <div className="cards-area-nav">
                    <div className="form-inline">
                        <i>Favorites</i>
                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onChange={this.filter} defaultValue="" />
                        <label className="btn btn-outline-warning my-2 my-sm-0 favorites-btn" onClick={() => this.showAllVacationsPage()}>Show All Vacations</label>
                    </div>
                </div>

                <div className="cards-area">
                    {this.state.favoriteVacations.length === 0 &&
                        <div className="no-data-found-area">
                            <p>no favorites found <br /> seems like your cupid skills are slacking, you missing all the hearts!</p>
                            <img src={require("../../heartbreak.png")} alt="heartbroken" />
                        </div>
                    }

                    {this.state.favoriteVacations.length !== 0 && this.state.favoriteVacations.filter(filteredFavorite => {
                        if (this.state.filter === "") {
                            return true;
                        }
                        return filteredFavorite.destination?.includes(this.state.filter);
                    }).map(favoriteVacation =>

                        <div className="vacation-card" key={uuidv4()}>
                            <img onError={this.defaultSrc} src={favoriteVacation.image} alt="vacationImg" className="vacation-image" />
                            <p className="pInfo destination"><span className="destination-span">{favoriteVacation.destination}</span><img className="geo" src={require("../../../src/geo.png")} alt="geo"></img></p>
                            <div className="card-seperator">
                                <p className="pInfo half">Price :<br /><span>{favoriteVacation.price}$</span></p>
                                <div className="seperator"></div>
                                <div className="pInfo half">
                                    <p className="starting-date"><span>{favoriteVacation.starting}</span></p>
                                    <p className="ending-date"><span>{favoriteVacation.ending}</span></p>
                                </div>
                            </div>

                            <div className="icon-area">
                                <div className={favoriteVacation.isFavorite ? 'heartActive' : 'heart'} onClick={() => this.onCancellingFavorite(favoriteVacation)}></div>
                                <div className="spacer"></div>
                                <p className="follower-count">{favoriteVacation.amountOfFollowers}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div >
        );
    }
}