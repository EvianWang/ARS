import React, { Component } from "react";

import userService from "../store/user.service";
import eventBus from "../context/event-bus";

export default class BoardStudent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: ""
        };
    }

    componentDidMount() {
        userService.getStudentBoard().then(
            response => {
                this.setState({
                    content: response.data
                });
            },
            error => {
                this.setState({
                    content:
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message || error.toString()
                });

                if(error.response && error.response.status === 401) {
                    eventBus.dispatch("logout");
                }
            }
        );
    }

    render() {
        return (
            <div className="container">
                <header className="jumbotron">
                    <h3>{this.state.content}</h3>
                </header>
            </div>
        );
    }
}