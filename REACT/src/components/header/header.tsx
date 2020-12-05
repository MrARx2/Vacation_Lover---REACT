import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Unsubscribe } from 'redux';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import './header.css';

interface IState {
    username: string,
    userFirstName: string,
    showUserInfo: boolean,
    socket: any,
    isConnected: boolean,
}
export default class Header extends Component<any, IState> {
    private unsubscribeStore: Unsubscribe;
    public constructor(props: any) {
        super(props);

        this.state = {
            username: store.getState().username,
            userFirstName: store.getState().userFirstName,
            showUserInfo: false,
            socket: "",
            isConnected: false,
        }

        this.unsubscribeStore = store.subscribe(
            () => this.setState(
                {
                    username: store.getState().username,
                    userFirstName: store.getState().userFirstName,
                    socket: store.getState().socket,
                    isConnected: store.getState().isConnected,
                })
        );
    }

    public logoutUser = () => {
        store.dispatch({ type: ActionType.setlogout });
        localStorage.removeItem('user_token');
    }

    componentWillUnmount = () => {
        if (this.state.isConnected){
            this.state.socket.disconnect();
        }
        this.unsubscribeStore();
    }

    onShowUserInfo = () => {
        return this.setState({ showUserInfo: !this.state.showUserInfo });
    }

    public render() {
        return (
            <div>
                <div className="header" onClick={() => this.onShowUserInfo()}>
                    <span>{this.state.userFirstName}</span>
                    <img src={require('../../userIcon.jpg')} alt="user-icon" />
                </div>
                <div className={this.state.showUserInfo ? "user-info fade-in" : "displayNone"}>
                    <div className="user-info-body">
                        <span>Welcome </span>
                        <span className="user-first-name">{this.state.userFirstName}</span>
                        <p className="username">logged as: <br />{this.state.username}</p>
                        <Link to='/login/' className="log-out btn btn-outline-danger my-2 my-sm-0" onClick={this.logoutUser}>logout</Link>
                    </div>
                </div>
            </div>
        );
    }
}