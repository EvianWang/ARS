import axios from "axios";

class UserService {
    getPublicContent() {
        return axios.get('/api/test/all');
    }

    getTeacherBoard() {
        return axios.get('/api/test/teacher');
    }

    getStudentBoard() {
        return axios.get('/api/test/student');
    }
}

export default new UserService();