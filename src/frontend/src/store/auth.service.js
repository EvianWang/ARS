import axios from "axios";

// const API_URL = "http://localhost:8080/auth";

class AuthService {
    login(email, password) {
        return axios
            .post("api/auth/signin", {
                email,
                password
            })
            .then(response => {
                if(response.data.jwt) {
                    localStorage.setItem('user',JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

    register(email,name,password,role) {
        return axios.post("api/auth/signup", {
            email,
            name,
            password,
            role
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();