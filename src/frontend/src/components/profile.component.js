import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import authService from "../store/auth.service";

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {
                name: ""
            }
        };
    }

    componentDidMount() {
        const currentUser = authService.getCurrentUser();

        if (!currentUser) this.setState({ redirect: "/login" });
        this.setState({ currentUser: currentUser, userReady: true });
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />
        }

        const { currentUser } = this.state;

        return (
            <div className="container">
                {(this.state.userReady) ?
                    <div>
                        <header className="jumbotron">
                            <h3>
                                <strong>{currentUser.name}</strong>
                            </h3>
                        </header>
                        <p>
                            <strong>Id:</strong>{" "}
                            {currentUser.id}
                        </p>
                        <p>
                            <strong>Email:</strong>{" "}
                            {currentUser.email}
                        </p>
                        <p>
                            <strong>Role:</strong>{" "}
                            {currentUser.role[0].substr(5, currentUser.role[0].length)}
                            {/* <ul>
                                {currentUser.role &&
                                    currentUser.role.map((role, index) => <li key={index}>{role}</li>)}
                            </ul> */}
                        </p>
                        <p>
                            <strong>Token:</strong>{" "}
                            {currentUser.jwt.substring(0, 20)} ...{" "}
                            {currentUser.jwt.substr(currentUser.jwt.length - 20)}
                        </p>
                    </div> : null}
            </div>
        );
    }
}