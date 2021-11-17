import React, { Component } from "react";
// import { withRouter } from "react-router-dom";

const parseJwt = (token) => {
    try {
        console.log("Decoded jwt: " + JSON.parse(atob(token.split('.')[1])));
        return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
        return null;
    }
};

class AuthVerify extends Component {
    constructor(props){
        super(props);

        props.history.listen(() => {
            const user = JSON.parse(localStorage.getItem("user"));

            if (user) {
                const decodeJwt = parseJwt(user.jwt);
                console.log('Emplified exp: ' + decodeJwt.exp * 1000);
                console.log('Date now: ' + Date.now());
                if(decodeJwt.exp * 1000 < Date.now()) {
                    props.logOut();
                }
            }
        });
    }

    render() {
        return <div></div>;
    }
}

// export default withRouter(AuthVerify);
export default AuthVerify;