/* eslint-disable react/jsx-no-undef */
import React, { Component } from 'react';
import './main.css'
import { store } from '../../redux/store';
import { Unsubscribe } from 'redux';
import Header from '../header/header';
import Favorites from '../favorites/favorites';
import AllVacations from '../allVacations/allVacations';

interface IState {
    userFirstName: string;
    showPage: boolean;
}

export default class Main extends Component<any, IState> {
    private unsubscribeStore: Unsubscribe;
    public serverURL = 'localhost:3001';

    constructor(props: any) {
        super(props);

        this.state = {
            userFirstName: "",
            showPage: true,
        }

        this.unsubscribeStore = store.subscribe(
            () => this.setState(
                {
                    userFirstName: store.getState().userFirstName,
                    showPage: store.getState().showPage,
                })
        );
    }

    componentWillUnmount = () => {
        this.unsubscribeStore();
    }

    public render() {
        return (
            <div className="main">
                <Header />
                <div className="main-header">
                    <p className="quote">Find your next <br /> <span>vacation</span></p>
                </div>

                {this.state.showPage ? <AllVacations/> : <Favorites/>}
            </div>
        );
    }
}