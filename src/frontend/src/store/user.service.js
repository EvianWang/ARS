import axios from "axios";

// response interceptor
// const checkStatus = response => {
//     if(response.code === 200) {
//         return Promise.resolve(response);
//     }
//     // convert non-2xx HTTP responses into errors
//     const error = new Error(response.statusText);
//     error.response = response;
//     return Promise.reject(error);
// }

class UserService {
    getPublicContent() {
        return axios.get('/api/test/all');
    }

    getTeacherBoard() {
        return axios.get('/api/teacher/assignment/all');
        // return axios.get('/api/test/teacher');
    }

    getStudentBoard() {
        return axios.get('/api/test/student');
    }

    // create new assignment
    createNewAssignment = assignment => {
        console.log("creating assignment");
        console.log(assignment);
        return axios.post('/api/teacher/assignment/create',{
            teacherId: assignment.id,
            name: assignment.name,
            description: assignment.description,
            dueDate: assignment.dueDate
        });
    }

    // update assignment info
    editAssignment = assignment => {
        console.log("updating assignment");
        console.log(assignment);
        return axios.put('/api/teacher/assignment/update',{
            description: assignment.description,
            name: assignment.name,
            id: assignment.id,
            dueDate: assignment.dueDate
        });
    }

    // delete assignment
    deleteAssignment = assignment => {
        console.log("deleting assignment");
        console.log(assignment);
        return axios.delete(`/api/teacher/assignment/${assignment.id}`);
    }

    // update assignment status
    updateAssignmentStatus = (assignment, statusInt) => {
        console.log("updating assignment status");
        console.log(assignment);
        return axios.post('/api/teacher/assignment/status',{
            id: assignment.id,
            status: statusInt
        });
    }
}

export default new UserService();