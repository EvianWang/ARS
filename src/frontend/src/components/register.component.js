import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

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

const role = value => {
    if (value === '') {
        return (
            <div className="alert alert-danger" role="alert">
                Please select your role.
            </div>
        );
    }
};

const email = value => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This email is not valid.
            </div>
        );
    }
};

const vname = value => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The name must be between 3 to 20 characters.
            </div>
        );
    }
};

const vpassword = value => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                The password must be between 6 to 40 characters.
            </div>
        );
    }
};

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeRole = this.onChangeRole.bind(this);

        this.state = {
            name: "",
            email: "",
            password: "",
            role: '',
            successful: false,
            message: ""
        };
    }

    onChangeName(e) {
        this.setState({ name: e.target.value });
    }

    onChangeEmail(e) {
        this.setState({ email: e.target.value });
    }

    onChangePassword(e) {
        this.setState({ password: e.target.value });
    }

    onChangeRole(e) {
        this.setState({ role: parseInt(e.target.value) });
    }

    handleRegister(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false,
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            authService.register(
                this.state.email,
                this.state.name,
                this.state.password,
                this.state.role
            ).then(
                response => {
                    this.setState({
                        message: response.data.message,
                        successful: true
                    });
                    // this.props.history.push("/login");
                    history.push("/login");
                    window.location.reload();
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        successful: false,
                        message: resMessage
                    });
                }
            );
        }
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <img
                        src="https://user-images.githubusercontent.com/46638376/141991982-8201ed1a-55f8-435d-bd2e-8c76f313d9c7.png"
                        alt="profile-img"
                        className="profile-img-card"
                    />

                    <Form
                        onSubmit={this.handleRegister}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        {!this.state.successful && (
                            <div>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={this.state.name}
                                        onChange={this.onChangeName}
                                        validations={[required, vname]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.onChangeEmail}
                                        validations={[required, email]}
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
                                        validations={[required, vpassword]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="register-role">Role</label>
                                    <Select className="register-role" name='register-role' value={this.state.role} validations={[role]} onChange={this.onChangeRole} >
                                        <option value=''>Choose your role</option>
                                        <option value='0'>Teacher</option>
                                        <option value='1'>Student</option>
                                    </Select>
                                </div>

                                <div className="form-group">
                                    <button className="btn btn-primary btn-block btn-auth">Sign Up</button>
                                </div>
                            </div>
                        )}

                        {this.state.message && (
                            <div className="form-group">
                                <div className={
                                    this.state.successful ? "alert alert-success" : "alert alert-danger"
                                }
                                    role="alert"
                                >
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
        );
    }
}

