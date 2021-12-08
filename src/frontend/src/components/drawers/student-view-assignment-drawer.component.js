import { Drawer, Upload, Row, Card, Button, Col, Divider } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { successNotification, errorNotification } from "../notification.component";
import authService from "../../store/auth.service";
import userService from "../../store/user.service";
import s3Service from "../../store/s3.service";
import React from "react";

function StudentViewAssignmentDrawerForm({ assignment, showViewDrawer, setShowViewDrawer, fetchAllAssignmentsForStudent }) {
    const [submitting, setSubmitting] = useState(false);
    const [dateDiff, setDateDiff] = useState(-1);
    const [fileList, setFileList] = useState([]);
    const [file,setFile] = useState(null);
    const [fileName,setFileName] = useState("");

    const [passedAssignment, setPassedAssignment] = useState(assignment);

    const calculateDateDiff = React.useCallback(() => {
        let dateArr = passedAssignment.dueDate.split('-');
        let oneDay = 1000 * 60 * 60 * 24;
        let current = new Date();
        let due = new Date(Number(dateArr[0]), Number(dateArr[1])-1, Number(dateArr[2]));

        let result = Math.ceil((due.getTime() - current.getTime()) / (oneDay));
        // result = result.toFixed(0);
        setDateDiff(result);
    }, [passedAssignment]);

    const onClose = () => {
        setShowViewDrawer();
        fetchAllAssignmentsForStudent();
    };

    const refreshInfo = () => {
        console.log("refreshing");
        setSubmitting(true);
        userService.studentViewAssignment(passedAssignment.id)
            .then((res)=>{
                setPassedAssignment(res.data.data);
            })
            .catch(err => {
                errorNotification("Update failed");
            })
            .finally(() => {
                setSubmitting(false);
            });
    }

    const handleUpload = () => {
        if(dateDiff < 0){
            setFileList([]);
            return errorNotification("Upload not allowed");
        }
        let formData = new FormData();

        formData.append('file', file);

        const currentUser = authService.getCurrentUser();
        const params = {
            assignmentId: passedAssignment.id,
            studentId: currentUser.id,
        };

        setSubmitting(true);

        const param = {
            formData: formData,
            params: params,
        }

        // if there is an existing submission, delete it
        if(passedAssignment.fileKey != null){
            s3Service.deleteFile(passedAssignment.fileKey)
                .then(() => {
                    console.log("Previous submission deleted.");
                })
                .catch(err => {
                    console.log("Delete failed " + err.toString());
                })
        }

        // actuall submission
        s3Service.uploadFile(param)
        // return axios.post('/api/student/passedAssignment/submit', formData, {params})
            .then(() => {
                successNotification("Assignment uploaded");
                setFileList([]);
                refreshInfo();
            })
            .catch(err => {
                errorNotification("Upload failed");
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const handleDownloadSubmission = () => {
        setSubmitting(true);
        s3Service.downloadFile(passedAssignment.fileKey)
            .then((res) => {
                successNotification("Assignment downloaded");
                const fileName=res.headers["content-disposition"]
                    .split("=")[1]
                    .replace(/['"]+/g,"");
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download",fileName);
                document.body.appendChild(link);
                link.click();
            })
            .catch(err => {
                errorNotification("Download failed");
            })
            .finally(() => {
                setSubmitting(false);
            });
    }


    const props = {
        onRemove: file => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: file => {
            setFileList([...fileList, file]);
            setFile(file);
            return false;
        },
        onChange: (info) => {
            let newFileList = [...info.fileList];
            newFileList = newFileList.slice(-1);
            setFileList(newFileList);
        },
        fileList: fileList,
    };

    useEffect(() => {
        setSubmitting(false);
        calculateDateDiff();
        if(passedAssignment.fileKey){
            let fileKeyArr = passedAssignment.fileKey.split('-');
            setFileName(fileKeyArr[fileKeyArr.length-1]);
        }
    }, [calculateDateDiff,passedAssignment.fileKey,dateDiff]);

    return <Drawer
        title="Submit passedAssignment"
        width={720}
        onClose={onClose}
        visible={showViewDrawer}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
            <div style={{ textAlign: 'right' }}>
                <Button onClick={onClose} style={{ marginRight: 8 }}>
                    Cancel
                </Button>
            </div>
        }
    >
        <div className="passedAssignment-info-container">
            <h5>{passedAssignment.name}</h5>
            <Card style={{ width: 600 }}>
                <p>{passedAssignment.description}</p>
            </Card>
            <Row gutter={16} style={{ marginTop: 20 }}>
                <Col span={12}>
                    <p>Assigned By: {passedAssignment.teacherName}</p>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <p>due date: {passedAssignment.dueDate}</p>
                </Col>
                <Col span={12}>
                    {dateDiff < 0 ? <p style={{ color: "red", fontWeight: 'bold' }}>Due date has passed</p>
                    :<p style={{ fontWeight: 'bold' }}>{dateDiff} day(s) left</p>}
                    
                </Col>
            </Row>
        </div>
        {passedAssignment.fileKey ? <Button
            type="link"
            onClick={handleDownloadSubmission}
        >Download {fileName}</Button> : <></>}
        <Divider/>
        <Upload {...props} >
            <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={submitting}
            style={{ marginTop: 16 }}
        >
            {submitting ? "Uploading" : 'Start Upload'}
        </Button>

    </Drawer>

}

export default StudentViewAssignmentDrawerForm;