import React, { Component } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "antd/dist/antd.css";
import './App.css';

import authService from './store/auth.service';

import Login from './components/login.component';
import Register from './components/register.component';
import Profile from './components/profile.component';
import BoardStudent from './components/board-student-component';
import BoardTeacher from './components/board-teacher-component';

import eventBus from './context/event-bus';
import AuthVerify from './components/auth-verify';

import axios from 'axios';

import { createBrowserHistory } from "history";
const history = createBrowserHistory();


const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.jwt) {
    return { Authorization: 'Bearer ' + user.jwt };
  } else {
    return {};
  }
}

// request interceptors
axios.interceptors.request.use(
  (config) => {
    if (localStorage.getItem('user')) {
      config.headers.Authorization = authHeader().Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showStudentBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = authService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        showStudentBoard: user.role.includes("ROLE_STUDENT"),
        showTeacherBoard: user.role.includes("ROLE_TEACHER")
      });
    }

    eventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    eventBus.remove("logout");
  }

  logOut() {
    authService.logout();
    this.setState({
      showStudentBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showStudentBoard, showTeacherBoard } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-light bg-light">
          <div className="container-fluid">
            <Link to={"/"} className="navbar-brand" style={{ marginLeft: '10px', color: 'grey', fontWeight: 'bold' }}>
              <img
                src="https://user-images.githubusercontent.com/46638376/141991982-8201ed1a-55f8-435d-bd2e-8c76f313d9c7.png"
                alt="profile-img"
                className="d-inline-block align-text-top"
                width="60px"
                height="60px"
              />
            </Link>

            <div className="collapse navbar-collapse">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                {showStudentBoard && (
                  <li className="nav-item">
                    <Link to={"/student"} className="nav-link">
                      Student Board
                    </Link>
                  </li>
                )}

                {showTeacherBoard && (
                  <li className="nav-item" >
                    <Link to={"/teacher"} className="nav-link">
                      Teacher Board
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/profile"} className="nav-link">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={this.logOut}>
                    LogOut
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>

                <li className="nav-item" style={{ width: '80px' }}>
                  <Link to={"/register"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </div>
            )}
          </div>
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route path="/student" element={<BoardStudent />} />
            <Route path="/teacher" element={<BoardTeacher />} />
          </Routes>
        </div>

        {<AuthVerify logOut={this.logOut} history={history} />}
      </div>
    );
  }
}

export default App;
