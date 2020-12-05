import React, { ChangeEvent, Component } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserDetails } from '../model/UserDetails';
import "./register.css";
import "./util.css"
import { toast } from 'react-toastify';

interface IRegisterState {
    email: string;
    password: string;
    firstName: string;
    lastName: string
}

export default class Register extends Component<any, IRegisterState>{
    public serverURL = 'localhost:3001';
    public toastStyle = { position: toast.POSITION.TOP_LEFT, autoClose: 10000 };

    public constructor(props: any) {
        super(props);
        this.state = {
            email: "",
            firstName: "",
            lastName: "",
            password: "",
        };
    }

    private RegisterUser = async () => {
        let email = this.state.email;
        let password = this.state.password;
        let firstName = this.state.firstName;
        let lastName = this.state.lastName;

        let isEmailValid = false;
        let isPasswordValid = false;
        let isFirstNameValid = false;
        let isLastNameValid = false;

        if (email.trim().match(/^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            isEmailValid = false;
            toast.error(`Email is Invalid`, this.toastStyle);
            if (email.trim().length > 25) {
                toast.warn(`Tip: Email Cannot be over 25 chars`, this.toastStyle);
            }
            return;
        }
        isEmailValid = true;

        if (password.trim().length > 45 && password.trim() !== "") {
            isPasswordValid = false;
            toast.error(`password is too long, can't be over 45 chars`, this.toastStyle);
            return;
        }
        isPasswordValid = true;

        if (firstName.trim().length > 12 && firstName.trim() !== "") {
            isFirstNameValid = false;
            toast.error(`First-Name is too long, can't be over 12 chars`, this.toastStyle);
            return;
        }
        isFirstNameValid = true;

        if (lastName.trim().length > 20 && lastName.trim() !== "") {
            isLastNameValid = false;
            toast.error(`Last-Name too long, can't be over 20 chars`, this.toastStyle);
            return;
        }
        isLastNameValid = true;

        if (isEmailValid && isPasswordValid && isFirstNameValid && isLastNameValid) {
            // will actiavte register attempt through server
            try {
                let userRegisterDetails = new UserDetails(email.toLowerCase(), password, firstName, lastName);
                const response = await axios.post<any>(`http://${this.serverURL}/users/register`, userRegisterDetails);

                if (response.status === 200) {
                    toast.success(`Welcome ${firstName}!, Your user has been registered`, this.toastStyle);
                    toast.success(`now log-in and you are golden! 🏆`, this.toastStyle);
                    this.props.history.push("/login/");
                }
            }
            catch (error) {
                try {
                    if (error.response.status === 601) {
                        toast.error(`this EMAIL is already registered`, this.toastStyle);
                    }
                    if (error.response.status === 600) {
                        toast.error(`database is offline for maintance, please check again later`, this.toastStyle);
                    }
                }
                catch(error) {
                    toast.error(`Network Error`, this.toastStyle);
                }
            }
        }
    }

    private setEmail = (args: ChangeEvent<HTMLInputElement>) => {
        const email = args.target.value;
        this.setState({ email });
    }

    private setFirstName = (args: ChangeEvent<HTMLInputElement>) => {
        const firstName = args.target.value;
        this.setState({ firstName });
    }

    private setLastName = (args: ChangeEvent<HTMLInputElement>) => {
        const lastName = args.target.value;
        this.setState({ lastName });
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
                                    Register New Account
					            </span>

                                <div className="wrap-input100 validate-input">
                                    <input className="input100" type="text" id="username" name="username" placeholder="Email / Username" value={this.state.email} onChange={this.setEmail} />
                                    <span className="focus-input100"></span>
                                    <span className="symbol-input100">
                                        <i className="fa fa-envelope" aria-hidden="true"></i>
                                    </span>
                                </div>

                                <div className="wrap-input100 validate-input">
                                    <input className="input100" type="text" id="firstName" name="Last-Name" placeholder="First-Name" value={this.state.firstName} onChange={this.setFirstName} />
                                    <span className="focus-input100"></span>
                                    <span className="symbol-input100">
                                        <i className="fa fa-envelope" aria-hidden="true"></i>
                                    </span>
                                </div>

                                <div className="wrap-input100 validate-input">
                                    <input className="input100" type="text" id="lastName" name="email" placeholder="Last-name" value={this.state.lastName} onChange={this.setLastName} />
                                    <span className="focus-input100"></span>
                                    <span className="symbol-input100">
                                        <i className="fa fa-envelope" aria-hidden="true"></i>
                                    </span>
                                </div>

                                <div className="wrap-input100 validate-input">
                                    <input className="input100" type="password" id="password" name="pass" placeholder="Password" value={this.state.password} onChange={this.setPassword} />
                                    <span className="focus-input100"></span>
                                    <span className="symbol-input100">
                                        <i className="fa fa-lock" aria-hidden="true"></i>
                                    </span>
                                </div>

                                <div className="container-login100-div-btn">
                                    <button className="login100-div-btn" onClick={this.RegisterUser}>
                                        Register
						            </button>
                                </div>

                                <div className="text-center p-t-136">
                                    <span className="dont-have-account-span">Already have an account?</span><br />
                                    {
                                        <Link to="/login/" className="txt2">Login Now</Link>
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