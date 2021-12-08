import axios from "axios";

class S3Service {
    // --------------Upload file--------------
    uploadFile(param){
        let formData = param.formData;
        let params = param.params;
        return axios.post('/api/s3/assignment/submit', formData, {params});
    }
    
    // --------------Download file--------------
    downloadFile(fileKey){
        return axios.get(`/api/s3/assignment/download/${fileKey}`);
    }

    // --------------Delete file--------------
    deleteFile(fileKey){
        return axios.delete(`/api/s3/assignment/delete/${fileKey}`);
    }
}

export default new S3Service();