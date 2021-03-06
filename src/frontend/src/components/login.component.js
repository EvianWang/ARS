import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import authService from "../store/auth.service";

import history from "../context/history";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required.
            </div>
        );
    }
};

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            email: "",
            password: "",
            loading: false,
            message: ""
        };
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        })
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    handleLogin(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            authService.login(this.state.email, this.state.password).then(
                () => {
                    // this.props.history.push("/profile");
                    const user = authService.getCurrentUser();
                    if(user.role.includes("ROLE_STUDENT")){
                        history.push('/student');
                        window.location.reload();
                    }
                    if(user.role.includes("ROLE_TEACHER")){
                        history.push('/teacher');
                        window.location.reload();
                    }
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                }
            );
        } else {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        const currentUser = authService.getCurrentUser();
        return (
            <div>
            {
                currentUser ?
                <h3>You have logged in.</h3>   :
                    <div className="col-md-12">
                        <div className="card card-container">
                            <img
                                src="https://user-images.githubusercontent.com/46638376/141991982-8201ed1a-55f8-435d-bd2e-8c76f313d9c7.png"
                                alt="profile-img"
                                className="profile-img-card"
                            />
                            <Form
                                onSubmit={this.handleLogin}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.onChangeEmail}
                                        validations={[required]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <Input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChangePassword}
                                        validations={[required]}
                                    />
                                </div>

                                <div className="form-group">
                                    <button
                                        className="btn btn-primary btn-block btn-auth"
                                        disabled={this.state.loading}
                                    >
                                        {this.state.loading && (
                                            <span className="spinner-boarder spinner-border-sm"></span>
                                        )}
                                        <span>Login</span>
                                    </button>
                                </div>

                                {this.state.message && (
                                    <div className="form-group">
                                        <div className="alert alert-danger" role="alert">
                                            {this.state.message}
                                        </div>
                                    </div>
                                )}
                                <CheckButton
                                    style={{ display: "none" }}
                                    ref={c => {
                                        this.checkBtn = c;
                                    }}
                                />
                            </Form>
                        </div>
                    </div>
            }
            </div>

        );
    }
}