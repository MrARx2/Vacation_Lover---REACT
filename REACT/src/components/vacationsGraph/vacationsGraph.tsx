import React, { Component } from 'react';
import { store } from "../../redux/store";
import { Button, Modal } from 'react-bootstrap';
import { Vacation } from "../model/Vacation";
import { ActionType } from "../../redux/action-type";
import './vacationsGraph.css';
import { toast } from "react-toastify";
import BarChart from './barChart';

interface IState {
  vacations: Vacation[];
  isModalVacationsGraph: boolean;
}

export default class VacationsGraph extends Component<any, IState>  {
  public serverURL = 'localhost:3001';
  public toastStyle = { position: toast.POSITION.TOP_LEFT, autoClose: 3000 };

  constructor(props: any) {
    super(props);

    this.state = {
      vacations: store.getState().vacations,
      isModalVacationsGraph: store.getState().isModalVacationsGraph,
    }
  }

  handleClose = () => {
    store.dispatch({ type: ActionType.HandleVacationsGraph, payload: false });
  }

  public render() {
    return (
      <div className="VacationsGraph">
        <Modal
          show={this.state.isModalVacationsGraph}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Vacations Graph</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="bar-chart">
              <BarChart/>
            </div>
          </Modal.Body>

          <Modal.Footer className="modal-footer">
            <Button className="remove-vacation-btn btn btn-info" onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}