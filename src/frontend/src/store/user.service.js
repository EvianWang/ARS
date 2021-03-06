import axios from "axios";

// response interceptor
const checkStatus = response => {
    if(response.status === 200) {
        return Promise.resolve(response);
    }
    // convert non-2xx HTTP responses into errors
    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
}

class UserService {
    getPublicContent() {
        return axios.get('/api/test/all');
    }

    // --------------------------- Teacher ---------------------------
    // view all assignments
    getTeacherBoard() {
        return axios.get('/api/teacher/assignment/all')
                .then(res => checkStatus(res))
                .catch(err => Promise.reject(err));
        // return axios.get('/api/test/teacher');
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

    // find students in the assignment
    fetchAllStudentsNotInAssignment = (assignmentId) => {
        console.log("fetching students not in the assignment");
        console.log(assignmentId);
        return axios.get(`/api/teacher/assignment/studentsnotinassignment/${assignmentId}`);
    }

    // find students not in the assignment
    fetchAllStudentsInAssignment = (assignmentId) => {
        console.log("fetching students in the assignment");
        console.log(assignmentId);
        return axios.get(`/api/teacher/assignment/studentsinassignment/${assignmentId}`);
    }

    // find students not in the assignment with searchText
    searchStudentsNotInAssignment = (param) => {
        console.log(`fetching students not in assignment containing ${param.searchText} in their name`);
        console.log(param);
        return axios.post("/api/teacher/assignment/search/studentsnotinassignment", {
            searchText: param.searchText,
            assignmentId: param.assignmentId
        });
    }

    // add a student to the assignment
    addStudentToAssignment = (param) => {
        console.log("adding student to assignment");
        return axios.post("/api/teacher/assignment/addstudent", {
            studentId: param.studentId,
            assignmentId: param.assignmentId
        });
    }

    // delete a student from the assignment
    deleteStudentFromAssignment = (param) => {
        console.log("deleting student from assignment");
        return axios.post("/api/teacher/assignment/deletestudent", {
            studentId: param.studentId,
            assignmentId: param.assignmentId
        })
    }

    // view submission list
    viewSubmissions = (assignmentId) => {
        console.log("fetching assignment list");
        return axios.get(`/api/teacher/assignment/submissions/${assignmentId}`);
    }

    // mark an assignment
    markAssignment = (params) => {
        console.log("marking an assignment");
        return axios.post("/api/teacher/assignment/mark",{
            studentId: params.studentId,
            assignmentId: localStorage.getItem('markAssignmentId'),
            comment: params.comment,
            grade: params.grade,
        })
    }

    // --------------------------- Student ---------------------------
    // view all assignments
    getStudentBoard() {
        return axios.get('/api/student/assignment/all');
        // return axios.get('/api/test/student');
    }

    // view an assignment
    studentViewAssignment(assignmentId){
        return axios.get(`/api/student/assignment/${assignmentId}`);
    }

    // view grade of an assignment
    studentViewGrade = (params) => {
        return axios.post("/api/student/assignment/grade",{
            studentId: params.studentId,
            assignmentId: params.assignmentId
        });
    }
}

export default new UserService();