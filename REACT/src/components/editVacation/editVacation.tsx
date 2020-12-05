import React, { ChangeEvent } from "react";
import { Component } from "react";
import { store } from "../../redux/store";
import axios from 'axios';
import Modal from 'react-bootstrap/Modal'
import Button from "react-bootstrap/esm/Button";
import { Vacation } from "../model/Vacation";
import { ActionType } from "../../redux/action-type";
import './editVacation.css';
import { toast } from "react-toastify";


interface IState {
  vacation: Vacation;
  editedVacation: Vacation;
  isModalEditVacation: boolean;
  socket: any;
  preview: any;
  isImageHasBeenChanged: boolean;
}

export default class EditVacation extends Component<any, IState>  {
  public serverURL = 'localhost:3001';
  public toastStyle = { position: toast.POSITION.TOP_LEFT, autoClose: 3000 };
  private fileInput: HTMLInputElement;

  constructor(props: any) {
    super(props);

    this.state = {
      vacation: store.getState().vacationToEdit,
      socket: store.getState().socket,
      isModalEditVacation: true,
      editedVacation: new Vacation(),
      preview: "",
      isImageHasBeenChanged: false,
    }
  }

  componentDidMount() {
    // matching information
    this.setState({ editedVacation: this.state.vacation });
    this.setState({ preview: this.state.vacation.image });
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
        val = value
        break;

      default:
        console.error(`type not found: ${type}`);
        break;
    }

    this.setState(prevState => (
      {
        editedVacation: {
          ...prevState.editedVacation,
          [id]: val
        }
      }))
  }

  attachHeaderToAxios = () => {
    const token = localStorage.getItem('user_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = "Bearer " + token;
    }
  }

  handleClose = () => {
    store.dispatch({ type: ActionType.HandleEditModal, payload: false });
  }

  saveEditedVacation = async () => {
    try {
      this.attachHeaderToAxios();
      let editedVacationObj =
      {
        editedVacation: this.state.editedVacation,
        imageToDelete: this.state.vacation.image,
        newImage: this.state.editedVacation.image,
      };

      // server request
      if (this.state.isImageHasBeenChanged) {
        const editedVacationFormData = new FormData();
        editedVacationFormData.append("file", editedVacationObj.newImage);
        let response = await axios.post(`http://${this.serverURL}/vacations/uploadImage`, editedVacationFormData, {});
        editedVacationObj.newImage = response.data.filename;
        this.state.editedVacation.image = response.data.filename;
      }
      else {
        editedVacationObj.imageToDelete = null;
      }

      await axios.post<Vacation[]>(`http://${this.serverURL}/vacations/updateVacation`, editedVacationObj);
      //redux-dispatch
      store.dispatch({ type: ActionType.SaveEditedVacation, payload: editedVacationObj.editedVacation });
      //close modal
      this.handleClose();
      //socket
      this.state.socket.emit("edit_vacation", editedVacationObj.editedVacation);
      //notify
      toast.success(`Vacation ID - ${editedVacationObj.editedVacation.id} has been updated`, this.toastStyle);
      //reset
      this.setState({ isImageHasBeenChanged: false });
    }
    catch (error) {
      toast.error(`${error}`, this.toastStyle);
    }
  }

  removeVacation = async () => {
    try {
      this.attachHeaderToAxios();

      let vacationIdObj = { vacationId: this.state.vacation.id, imageToDelete: this.state.vacation.image };
      //server request
      await axios.post<any>(`http://${this.serverURL}/vacations/removeVacation`, vacationIdObj);
      //redux-dispatch
      store.dispatch({ type: ActionType.RemoveVacation, payload: vacationIdObj.vacationId });
      //close modal
      this.handleClose();
      //socket
      this.state.socket.emit("delete_vacation", this.state.vacation.id);
      //notify
      toast.success(`Vacation ID - ${vacationIdObj.vacationId} has been Removed`, this.toastStyle);
    }
    catch (error) {
      toast.error(`${error}`, this.toastStyle);
    }
  }

  private setImage = (args: ChangeEvent<HTMLInputElement>) => {
    const image = args.target.files[0];
    try {
      // setting up a file instead of string
      const vacationChanged = { ...this.state.editedVacation };
      vacationChanged.image = image;
      this.setState({ editedVacation: vacationChanged });
      console.log(this.state.editedVacation);
      //reading the file and showing it on this.state.preview
      var reader = new FileReader();
      reader.onload = event => this.setState({ preview: event.target.result.toString() });
      reader.readAsDataURL(image);

      //setImageBeenChanged
      this.setState({ isImageHasBeenChanged: true });
    }
    catch (error) {
      toast(`file has not been selected`, this.toastStyle);
    }
  }

  defaultSrc = (event: ChangeEvent<HTMLImageElement>) => {
    event.target.src = 'https://www.nikolpoulin.com/asset/image/product/s_3.png';
  }

  public render() {
    return (
      <div className="editVacation">
        <Modal
          show={this.state.isModalEditVacation}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>editing vacation ID - {this.state.editedVacation.id}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="cards-area">
              <div className="vacation-card">
                <img id="image" onError={this.defaultSrc} src={this.state.preview} alt="vacationImg" className="vacation-image" />

                <label htmlFor="file-upload" className="custom-file-upload">
                  <i className="fa fa-cloud-upload"></i><img className="upload-img" src="https://www.georeferencer.com/static/img/presentation/homepage/1.png" alt="upload" />
                </label>
                <input id="file-upload" type="file" onChange={this.setImage} accept="image/*" ref={fi => this.fileInput = fi} onClick={() => this.fileInput.click()} />

                <p className="pInfo destination"><input id="destination" type="text" className="destination-span edit-Input" value={this.state.editedVacation.destination} onChange={this.setText} /><img className="geo" src={require("../../../src/geo.png")} alt="geo"></img></p>
                <textarea id="description" rows={7} wrap="hard" className="pInfo description bold txt-area" value={this.state.editedVacation.description} onChange={this.setText}></textarea>

                <div className="card-seperator">
                  <p className="pInfo half">Price :<br /><input id="price" className="edit-Input" type="text" value={this.state.editedVacation.price} onChange={this.setText} /></p>
                  <div className="seperator"></div>
                  <div className="pInfo half">
                    <p className="starting-date">Start: <br/><input id="starting" type="text" className="edit-Input" value={this.state.editedVacation.starting} onChange={this.setText} /></p>
                    <p className="ending-date">End: <br/><input id="ending" type="text" className="edit-Input" value={this.state.editedVacation.ending} onChange={this.setText} /></p>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer className="modal-footer">
            <Button className="remove-vacation-btn btn btn-danger" onClick={this.removeVacation}>Remove Vacation</Button>
            <Button className="btn btn-info" onClick={this.saveEditedVacation}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}