import React, { Component, ChangeEvent } from 'react'
import { Link } from 'react-router-dom';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import axios from 'axios';
import { SuccessfulLoginServerResponse } from '../model/SuccessfulLoginServerResponse';
import { UserDetails } from '../model/UserDetails';
import socketIOClient from "socket.io-client";

import "./login.css";
import "./util.css";
import { toast } from 'react-toastify';
// import { ServerResponse } from 'http';

interface ILoginState {
    username: string,
    password: string,
    rememberMe: boolean,
    userToken: string,
}

export default class Login extends Component<any, ILoginState>{
    public toastStyle = { position: toast.POSITION.TOP_LEFT, autoClose: 3000 };
    public toastStyleLeft = { position: toast.POSITION.BOTTOM_LEFT, autoClose: 3000 };
    public serverURL = 'localhost:3001';

    public constructor(props: any) {
        super(props);
        this.state = {
            username: "",
            password: "",
            rememberMe: false,
            userToken: "",
        };
    }

    attachHeaderToAxios = () => {
        const token = localStorage.getItem('user_token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = "Bearer " + token;
        }
    }


    private loginAttempt = async () => {
        let email = this.state.username;
        let password = this.state.password;
        let isEmailValid = false;

        if (email.trim().match(/^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            isEmailValid = false;
            toast.error(`Email is Invalid`, this.toastStyle);
            return;
        }
            isEmailValid = true;

        if (isEmailValid && password.trim() !== "") {
            // will actiavte login attempt through server
            try {
                let userLoginDetails = new UserDetails(email, password);
                const response = await axios.post<SuccessfulLoginServerResponse>(`http://${this.serverURL}/users/login`, userLoginDetails);
                    //setting socket
                    let socket = socketIOClient('http://localhost:3001/', { query: `userId=${response.data.token}` }).connect();
                    store.dispatch({ type: ActionType.SetSocket, payload: socket });

                    //set token in LocalStorage
                    localStorage.setItem('user_token', response.data.token);

                    //setting user-info in redux
                    store.dispatch({
                        type: ActionType.SetUserLogin, payload:
                            [response.data.userType, response.data.userFirstName, response.data.username]
                    });

                    //notify user
                    toast(`Welcome back ${response.data.userFirstName}`, this.toastStyleLeft);
            }
            catch (error) {
                try {
                    if (error.response.status === 401) {
                        toast.error(`username or password are not correct`, this.toastStyle);
                    }
                }
                catch(error) {
                    toast.error(`Network Error`, this.toastStyle);
                }
            }
        }
    }

    

    private setUserName = (args: ChangeEvent<HTMLInputElement>) => {
        const userName = args.target.value;
        this.setState({ username: userName });
    }

    private setPassword = (args: ChangeEvent<HTMLInputElement>) => {
        const password = args.target.value;
        this.setState({ password });
    }

    public render() {
        return (
            <div className="login">
                <div className="limiter">
                    <div className="container-login100">
                        <div className="wrap-login100">
                            <div className="login100-pic js-tilt" data-tilt>
                                <img src={require('../../../src/img-01.png')} alt="IMG" />
                            </div>

                            <div className="login100-div validate-div">
                                <span className="login100-div-title">
                                    User Login
					            </span>

                                <div className="wrap-input100 validate-input">
                                    <input className="input100" type="text" name="email" placeholder="Email" value={this.state.username} onChange={this.setUserName} />
                                    <span className="focus-input100"></span>
                                    <span className="symbol-input100">
                                        <i className="fa fa-envelope" aria-hidden="true"></i>
                                    </span>
                                </div>

                                <div className="wrap-input100 validate-input">
                                    <input className="input100" type="password" name="pass" placeholder="Password" value={this.state.password} onChange={this.setPassword} />
                                    <span className="focus-input100"></span>
                                    <span className="symbol-input100">
                                        <i className="fa fa-lock" aria-hidden="true"></i>
                                    </span>
                                </div>

                                <div className="container-login100-div-btn">
                                    <button className="login100-div-btn" onClick={this.loginAttempt}>
                                        Login
						            </button>
                                </div>

                                <div className="text-center p-t-136">
                                    <span className="dont-have-account-span">don't have an account?</span><br />
                                    {
                                        <Link to="/register" className="txt2">Create your Account</Link>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}