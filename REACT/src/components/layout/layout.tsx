import React, { Component } from 'react';
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import { Unsubscribe } from 'redux';
import { store } from '../../redux/store';
import Login from '../login/login';
import Main from '../main/main';
import PageNotFound from '../PageNotFound/PageNotFound';
import Register from '../register/register';
import './layout.css'

interface ILayoutState {
    isConnected: boolean;
}

export default class Layout extends Component<any, ILayoutState> {
    public serverURL = 'localhost:3001';
    private unsubscribeStore: Unsubscribe;
    public constructor(props: any) {
        super(props);

        this.state = {
            isConnected: false,
        }

        this.unsubscribeStore = store.subscribe(
            () => this.setState(
                {
                    isConnected: store.getState().isConnected,
                })
        );
    }

    componentWillUnmount = () => {
        this.unsubscribeStore();
    }

    public render() {
        return (
            <BrowserRouter>
                <div className="layout">
                    <main>
                        {this.state.isConnected ?
                            <Switch>
                                <Route path="/vacations/" component={Main} exact />
                                <Redirect from="/login/" to="/vacations/" exact />
                                <Redirect from="/" to="/vacations/" exact />
                                <Redirect from="/register/" to="/vacations/" exact />

                                <Route path="*" component={PageNotFound} />
                            </Switch> :

                            <Switch>
                                <Route path="/vacations/" component={Main} exact />
                                <Route path="/login/" component={Login} exact />
                                <Route path="/register/" component={Register} exact />
                                <Redirect from="/" to="/login/" exact />
                                <Redirect from="/vacations/" to="/login/" exact />

                                <Route path="*" component={PageNotFound} />
                            </Switch>}
                    </main>
                </div>
            </BrowserRouter>
        );
    }
}