import axios from 'axios';
import React, { ChangeEvent, Component } from 'react';
import { Vacation } from '../model/Vacation';
import { v4 as uuidv4 } from 'uuid';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import { Unsubscribe } from 'redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditVacation from '../editVacation/editVacation';
import AddVacation from '../addVacation/addVacation';
import VacationsGraph from '../vacationsGraph/vacationsGraph'
import { SuccessfulLoginServerResponse } from '../model/SuccessfulLoginServerResponse';
import socketIOClient from "socket.io-client";
import { withRouter } from "react-router-dom";

interface IState {
  userType: string;
  userFirstName: string;
  vacations: Vacation[];
  favoriteVacations: Vacation[];
  isShowingEditModal: boolean;
  isShowingAddModal: boolean;
  socket: any;
  isConnected: boolean;
  filter: string,
  isShowingVacation: boolean,
  isModalVacationsGraph: boolean,
}

toast.configure();

class AllVacations extends Component<any, IState> {
  private unsubscribeStore: Unsubscribe;
  public serverURL = 'localhost:3001';
  public toastStyle = { position: toast.POSITION.TOP_LEFT, autoClose: 3000 };
  public heart: React.RefObject<HTMLButtonElement>;

  constructor(props: any) {
    super(props);
    this.heart = React.createRef();

    this.state = {
      userFirstName: "",
      userType: "",
      vacations: [],
      favoriteVacations: [],
      isConnected: false,
      isShowingEditModal: false,
      isShowingAddModal: false,
      isModalVacationsGraph: false,
      socket: store.getState().socket,

      filter: "",
      isShowingVacation: true,
    }

    this.unsubscribeStore = store.subscribe(
      () => this.setState(
        {
          vacations: store.getState().vacations,
          userFirstName: store.getState().userFirstName,
          isShowingEditModal: store.getState().isModalEditVacation,
          isShowingAddModal: store.getState().isModalAddVacation,
          isModalVacationsGraph: store.getState().isModalVacationsGraph,
          favoriteVacations: store.getState().favoriteVacations,
          userType: store.getState().userType,
          socket: store.getState().socket,
        })
    );
  }

  componentDidMount = async () => {
    let isConnected = await this.autoLoginByToken(localStorage.getItem("user_token"));

    if (isConnected) {
      this.showAllVacations();

      this.state.socket.on('delete_vacation', (vacationId: number) => {
        store.dispatch({ type: ActionType.RemoveVacation, payload: vacationId });
      })

      this.state.socket.on('add_vacation', (newVacation: Vacation) => {
        store.dispatch({ type: ActionType.AddNewVacation, payload: newVacation });
      })

      this.state.socket.on('edit_vacation', (editedVacation: Vacation) => {
        store.dispatch({ type: ActionType.SaveEditedVacation, payload: editedVacation });
      })

      this.state.socket.on('vacation_has_been_followed', (followedVacation: Vacation) => {
        store.dispatch({ type: ActionType.FollowHasBeenSubmitted, payload: followedVacation });
      })

      this.state.socket.on('vacation_has_been_unfollowed', (unFollowedVacation: Vacation) => {
        store.dispatch({ type: ActionType.UnFollowHasBeenSubmitted, payload: unFollowedVacation });
      })
      return;
    }
    toast.error(`connection was lost`, this.toastStyle);
    store.dispatch({ type: ActionType.HandleBrokenToken});
    this.props.history.push('/login/');
  }

  componentWillUnmount() {
    this.unsubscribeStore();
  }

  attachHeaderToAxios = () => {
    const token = localStorage.getItem('user_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = "Bearer " + token;
    }
  }

  autoLoginByToken = async (token: string) => {
    if (token == null) {
      return false;
    }

    this.attachHeaderToAxios();
    try {
      const response = await axios.post<SuccessfulLoginServerResponse>(`http://${this.serverURL}/users/ValidateUserByToken`);
      //setting socket
      let socket = socketIOClient('http://localhost:3001/', { query: `userId=${token}` }).connect();
      store.dispatch({ type: ActionType.SetSocket, payload: socket });

      //setting user-info in redux
      store.dispatch({
        type: ActionType.SetUserLogin, payload:
          [response.data.userType, response.data.userFirstName, response.data.username, token]
      });
      return true;
    }
    catch (error) {
      toast.error(`${error}`, this.toastStyle);
      return false;
    }
  }

  showAllVacations = async () => {
    try {
      this.attachHeaderToAxios();
      const response = await axios.post<Vacation[]>(`http://${this.serverURL}/vacations/getAll`);

      // this.setState({ vacations: response.data });
      store.dispatch({ type: ActionType.SetAllVacations, payload: response.data });

      if (this.state.favoriteVacations.length === 0) {
        for (let item of response.data) {
          // eslint-disable-next-line eqeqeq
          if (item.isFavorite == true) {
            store.dispatch({ type: ActionType.AddFavoriteVacation, payload: item });
          }
        }
      }
    }
    catch (error) {
      toast.error(`${error}`, this.toastStyle);
      this.props.history.push("/login/");
    }
  }

  onHeartPress = async (vacation: Vacation) => {
    if (!vacation.isFavorite) {
      try {
        this.attachHeaderToAxios();
        //follow vacation
        let vacationDetails = { vacationId: vacation.id }
        this.heart.current.disabled = true;
        await axios.post<any>(`http://${this.serverURL}/vacations/addFavorite/`, vacationDetails);
        this.heart.current.disabled = false;
        //set vacation isFavorite
        vacation.isFavorite = true
        //redux
        store.dispatch({ type: ActionType.AddFavoriteVacation, payload: vacation });
        store.dispatch({ type: ActionType.FollowHasBeenSubmitted, payload: vacation });
        //socket
        this.state.socket.emit("vacation_has_been_followed", vacation);
        //notify
        toast(`Following ${vacation.destination}`, this.toastStyle);
      }
      catch (error) {
        toast.error(`${error}`, this.toastStyle);
      }
    }

    else {
      //unfollow vacation
      try {
        this.attachHeaderToAxios();
        let vacationDetails = { vacationId: vacation.id }
        this.heart.current.disabled = true;
        const response = await axios.post<any>(`http://${this.serverURL}/vacations/removeFavorite/`, vacationDetails);
        this.heart.current.disabled = false;
        
        if (response.status === 200) {
          vacation.isFavorite = false;
          //redux
          store.dispatch({ type: ActionType.UnFollowHasBeenSubmitted, payload: vacation });
          let index = this.state.favoriteVacations.findIndex(obj => obj.id === vacation.id);
          store.dispatch({ type: ActionType.RemoveFavoriteIndex, payload: [vacation, index] });

          //socket
          this.state.socket.emit("vacation_has_been_unfollowed", vacation);
          //notify
          toast(`Unfollowing ${vacation.destination}`, this.toastStyle);
        }
      }

      catch (error) {
        toast.error(`${error}`, this.toastStyle);
      }
    }
  }

  filter = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    this.setState({ filter: text.toUpperCase() });
  }

  showFavorites = () => {
    store.dispatch({ type: ActionType.ChangeShowPage, payload: false });
  }

  addVacation = () => {
    store.dispatch({ type: ActionType.HandleAddModal, payload: true });
  }

  editVacation = (vacation: Vacation) => {
    store.dispatch({ type: ActionType.HandleEditModal, payload: [vacation, true] });
  }

  VacationsGraph = () => {
    store.dispatch({ type: ActionType.HandleVacationsGraph, payload: true });
  }

  defaultSrc = (event: ChangeEvent<HTMLImageElement>) => {
    event.target.src = 'https://www.nikolpoulin.com/asset/image/product/s_3.png'
  }

  public render() {
    return (
      <div className="all-vacations">
        <div className="cards-area-nav">
          <div className="form-inline">
            <i className="component-title">All Vacations</i>
            <input className="form-control mr-1 col-12 col-sm-12 col-md-3 col-lg-3" type="search" placeholder="Search" aria-label="Search" onChange={this.filter} defaultValue="" />

            {this.state.userType === 'Admin' &&
              <label className="btn btn-outline-success my-2 my-sm-0 graph-btn" onClick={() => this.VacationsGraph()}>Vacations Graph</label>
            }
            {this.state.userType === 'User' &&
              <label className="btn btn-outline-warning my-2 my-sm-0 favorites-btn" onClick={() => this.showFavorites()}>Go To Favorites ♥</label>
            }

          </div>
        </div>

        <div className="cards-area col-sm-12">
          {this.state.vacations.length !== 0 && this.state.vacations.filter(filteredVacation => {
            if (this.state.filter === "") {
              return true;
            }
            return filteredVacation.destination?.includes(this.state.filter);
          }).map(vacation =>
            <div className="vacation-card" key={uuidv4()}>
              <img onError={this.defaultSrc} src={vacation.image} alt="vacation-img" className="vacation-image" />
              <p className="pInfo destination"><span className="destination-span">{vacation.destination}</span><img className="geo" src={require("../../../src/geo.png")} alt="geo"></img></p>
              <p className="pInfo description bold">{vacation.description}</p>
              <div className="card-seperator">
                <p className="pInfo half">Price :<br /><span>{vacation.price}$</span></p>
                <div className="seperator"></div>
                <div className="pInfo half">
                  <p className="starting-date">Start: <span>{vacation.starting}</span></p>
                  <p className="ending-date">End: <span>{vacation.ending}</span></p>
                </div>
              </div>

              {this.state.userType === "User" &&
                <div className="icon-area">
                  <button  ref={this.heart} className={vacation.isFavorite ? `heartActive` : `heart`} onClick={() => this.onHeartPress(vacation)}></button>
                  <div className="spacer"></div>
                  <p className="follower-count">{vacation.amountOfFollowers}</p>
                </div>
              }

              {this.state.userType === "Admin" &&
                <img className="edit-button" src={require('../../edit-button.png')} alt="edit-button" onClick={() => this.editVacation(vacation)} />
              }
            </div>
          )}

          {this.state.userType === "Admin" &&
            <div className="vacation-card add-vacation">
              <p className="add-vacation-header">Add new vacation</p>
              <img className="add-vacation-img" src={require('../../add-vacation.png')} alt="add-vacation-img" onClick={this.addVacation} />
            </div>
          }
          {this.state.isShowingAddModal === true && <AddVacation />}
          {this.state.isShowingEditModal === true && <EditVacation />}
          {this.state.isModalVacationsGraph === true && <VacationsGraph />}

        </div>
      </div>
    );
  }
}

export default withRouter(AllVacations);