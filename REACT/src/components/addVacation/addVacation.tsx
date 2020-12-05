import React, { ChangeEvent } from "react";
import { Component } from "react";
import { store } from "../../redux/store";
import axios from 'axios';
import Modal from 'react-bootstrap/Modal'
import Button from "react-bootstrap/esm/Button";
import { Vacation } from "../model/Vacation";
import { ActionType } from "../../redux/action-type";
import './addVacation.css';
import { toast } from "react-toastify";

interface IState {
  newVacation: Vacation;
  lastVacationId: number;
  isModalAddVacation: boolean;
  preview: any; 
  socket: any;
}

export default class AddVacation extends Component<any, IState> {
  public serverURL = 'localhost:3001';
  public toastStyle = { position: toast.POSITION.TOP_LEFT, autoClose: 3000 };
  public socket: any;

  private fileInput: HTMLInputElement;
  constructor(props: any) {
    super(props);

    this.state = {
      lastVacationId: store.getState().lastVacationId,
      isModalAddVacation: store.getState().isModalAddVacation,
      socket: store.getState().socket,
      newVacation: new Vacation(),
      preview : "",
    }
  }

  public setText = (e: any) => {
    let { id, value, checked, type } = e.target;
    let val: any
    switch (type) {
      case 'checkbox':
        val = checked
        break;
      case 'text':
      case 'password':
      case 'select-one':
      case 'textarea':
      case 'number':
        val = value
        break;  

      default:
        console.error(`type not found: ${type}`);
        break;
    }

    this.setState(prevState => (
      {
        newVacation: {
          ...prevState.newVacation,
          [id]: val
        }
      }))
  }

  handleClose = () => {
    store.dispatch({ type: ActionType.HandleAddModal, payload: false });
  }

  attachHeaderToAxios = (token: string = localStorage.getItem('user_token')) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = "Bearer " + token;
    } 
  }

  saveNewVacation = async () => {
    try {
      this.attachHeaderToAxios();
      let newVacation = this.state.newVacation;
      newVacation.id = this.state.lastVacationId + 1;

      if (newVacation.description != null && newVacation.destination != null && newVacation.starting != null && newVacation.ending != null && newVacation.price != null){

        if (this.state.newVacation.image != null) {
          //handling vacation-image
          const vacationFormData = new FormData();
          vacationFormData.append("file", this.state.newVacation.image);
    
          let response = await axios.post(`http://${this.serverURL}/vacations/uploadImage`, vacationFormData, {});
          newVacation.image = response.data.filename;
        }
      
      // setting up the new vacation
      // sending to server

        await axios.post<Vacation[]>(`http://${this.serverURL}/vacations/addVacation`, newVacation);
        // close modal
        this.handleClose();

        // socket + dispatch
        store.dispatch({ type: ActionType.AddNewVacation, payload: newVacation });
        this.state.socket.emit("add_vacation", newVacation);
        // notify
        toast.success(`Vacation ID - ${newVacation.id} has been Added`, this.toastStyle);
      }
      else {
        // eslint-disable-next-line no-throw-literal
        throw 'not all details are valid';
      }

    }
    catch (error) {
      toast.error(`${error}`, this.toastStyle);
    }
  }

  defaultSrc = (event: ChangeEvent<HTMLImageElement>) => {
    event.target.src = 'https://www.nikolpoulin.com/asset/image/product/s_3.png';
  }

  private setImage = (args: ChangeEvent<HTMLInputElement>) => {
    const image = args.target.files[0];
    try {
      // setting up a file instead of string
      const vacation = { ...this.state.newVacation };
      vacation.image = image;
      this.setState({ newVacation: vacation });
      //reading the file and showing it on this.state.preview
      var reader = new FileReader();
      reader.onload = event => this.setState({ preview: event.target.result.toString() });
      reader.readAsDataURL(image);
    }
    catch (error) {
      toast(`file has not been selected`, this.toastStyle);
    }
  }

  public render() {
    return (
      <div className="addVacation">
        <Modal
          show={this.state.isModalAddVacation}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add vacation ID - {this.state.lastVacationId+1}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="cards-area">
              <div className="vacation-card">
                <img id="image" onError={this.defaultSrc} src={this.state.preview} alt="vacationImg" className="vacation-image"/>
                <label htmlFor="file-upload" className="custom-file-upload">
                  <i className="fa fa-cloud-upload"></i><img className="upload-img" src="https://www.georeferencer.com/static/img/presentation/homepage/1.png" alt="upload"/>
                </label>
                <input id="file-upload" type="file" onChange={this.setImage} accept="image/*" ref={fi => this.fileInput = fi} onClick={() => this.fileInput.click()}/>


                <p className="pInfo destination"><input id="destination" type="text" className="destination-span edit-Input" value={this.state.newVacation.destination} onChange={this.setText} /><img className="geo" src={require("../../../src/geo.png")} alt="geo"></img></p>
                <textarea id="description" rows={7} wrap="hard" className="pInfo description bold txt-area" value={this.state.newVacation.description} onChange={this.setText}></textarea>

                <div className="card-seperator">
                  <p className="pInfo half">Price :<br /><input id="price" className="edit-Input" type="number" value={this.state.newVacation.price} onChange={this.setText} /></p>
                  <div className="seperator"></div>
                  <div className="pInfo half">
                    <p className="starting-date">Start: <br/><input id="starting" type="text" className="edit-Input" value={this.state.newVacation.starting} onChange={this.setText} /></p>
                    <p className="ending-date">End: <br/><input id="ending" type="text" className="edit-Input" value={this.state.newVacation.ending} onChange={this.setText} /></p>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
          </Button>
            <Button variant="primary" onClick={this.saveNewVacation}>Save Vacation</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}