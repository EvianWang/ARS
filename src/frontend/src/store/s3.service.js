import axios from "axios";

class S3Service {
    // --------------Upload file--------------
    uploadFile(param){
        let formData = param.formData;
        let params = param.params;
        return axios.post('/api/student/assignment/submit', formData, {params});
    }
    
    // --------------Download file--------------
    downloadFile(fileKey){
        return axios.get(`/api/student/assignment/download/${fileKey}`);
    }

    // --------------Delete file--------------
    deleteFile(fileKey){
        return axios.delete(`/api/student/assignment/delete/${fileKey}`);
    }
}

export default new S3Service();