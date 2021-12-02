import { Drawer, Empty, Table, Button, Input, Space, Divider } from "antd";
import { useEffect, useState } from "react";
import React from "react";
import { successNotification, errorNotification } from "./notification.component";
import userService from "../store/user.service";

const { Search } = Input;



function AddStudentsToAssignmentDrawerForm({ assignment, showAddStudentsDrawer, setShowAddStudentsDrawer }) {
    const [submitting, setSubmitting] = useState(false);
    const [inAssignmentContent, setInAssignmentContent] = useState(null);
    const [notInAssignmentContent, setNotInAssignmentContent] = useState(null);

    const onClose = () => setShowAddStudentsDrawer(false);

    const fetchAllStudentsInAssignment = React.useCallback(() => {
        setSubmitting(true);
        userService.fetchAllStudentsInAssignment(assignment.id)
            .then(res => {
                console.log(`fetched all students that has the assignment ${assignment.name}`);
                setInAssignmentContent(res.data.data);
            })
            .catch(err => {
                console.log(err);
                errorNotification("There was an issue", `${err.message} [${err.status}] [${err.error}]`, "bottomLeft");
            })
            .finally(() => {
                setSubmitting(false);
            });
    },[assignment]);

    const onSearch = (value) => {
        setSubmitting(true);
        if (value === '') {
            userService.fetchAllStudentsNotInAssignment(assignment.id)
                .then(res => {
                    console.log(`fetched all students that does not have the assignment ${assignment.name}`);
                    setNotInAssignmentContent(res.data.data);
                })
                .catch(err => {
                    console.log(err);
                    errorNotification("There was an issue", `${err.message}`, "bottomLeft");
                })
                .finally(() => {
                    setSubmitting(false);
                })
        } else {
            const param = {
                searchText: value,
                assignmentId: assignment.id
            };
            userService.searchStudentsNotInAssignment(param)
                .then(res => {
                    console.log(`fetched all students that does not have the assignment ${assignment.name}`);
                    setNotInAssignmentContent(res.data.data);
                })
                .catch(err => {
                    console.log(err);
                    errorNotification("There was an issue", `${err.message}`, "bottomLeft");
                })
                .finally(() => {
                    setSubmitting(false);
                })
        }
    };

    const addStudentToAssignment = (studentId,assignmentId) => {
        setSubmitting(true);
        const param = {
            studentId: studentId,
            assignmentId: assignmentId 
        };
        userService.addStudentToAssignment(param)
            .then(() =>{
                console.log(`added student ${studentId} to assignment ${assignmentId}`);
                onSearch('');
                fetchAllStudentsInAssignment();
                successNotification('Success',`Stuednt with Id ${studentId} has been added`,"bottomLeft");
            })
            .catch(err => {
                console.log(err);
                errorNotification("There was an issue", `${err.message} [${err.status}] [${err.error}]`, "bottomLeft");
            })
            .finally(() => {
                setSubmitting(false);
            })
    }

    const deleteStudentFromAssignment = (studentId,assignmentId) => {
        setSubmitting(true);
        const param = {
            studentId: studentId,
            assignmentId: assignmentId 
        };
        userService.deleteStudentFromAssignment(param)
            .then(() =>{
                console.log(`deleted student ${studentId} from assignment ${assignmentId}`);
                onSearch('');
                fetchAllStudentsInAssignment();
                successNotification('Success',`Stuednt with Id ${studentId} has been deleted`,"bottomLeft");
            })
            .catch(err => {
                console.log(err);
                errorNotification("There was an issue", `${err.message} [${err.status}] [${err.error}]`, "bottomLeft");
            })
            .finally(() => {
                setSubmitting(false);
            })
    }

    useEffect(() => {
        fetchAllStudentsInAssignment();
    }, [fetchAllStudentsInAssignment]);

    const inAssignmentColumns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" style={{ color: 'red' }} onClick={() => deleteStudentFromAssignment(record.id, assignment.id)}>Delete</Button>
                </Space>
            ),
        },
    ];
    
    const notInAssignmentColumns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" style={{ color: 'lightgreen' }} onClick={() => addStudentToAssignment(record.id, assignment.id)}>Add</Button>
                </Space>
            ),
        },
    ];

    return <Drawer
        title="Add students to assignment"
        width={720}
        onClose={onClose}
        visible={showAddStudentsDrawer}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
            <div style={{ textAlign: 'right' }}>
                <Button onClick={onClose} style={{ marginRight: 8 }}>
                    Cancel
                </Button>
            </div>
        }
    >
        <h5>{assignment.name}</h5>
        <h6>Students assigned</h6>

        {inAssignmentContent ?
            <div className="in-assignment-table-container">
                <Table
                    columns={inAssignmentColumns}
                    dataSource={inAssignmentContent}
                    rowKey={(student) => student.id}
                    loading={submitting}
                ></Table>
            </div> : <Empty />
        }
        <Divider/>
        <h6>Search for not-assigned students</h6>
        <Search placeholder="input student name" allowClear onSearch={onSearch} style={{ width: 'auto' }} loading={submitting} />
        {notInAssignmentContent ?
            <div className="not-in-assignment-table-container">
                <Table
                    columns={notInAssignmentColumns}
                    dataSource={notInAssignmentContent}
                    rowKey={(student) => student.id}
                    loading={submitting}
                ></Table>
            </div> : <Empty />
        }

    </Drawer>
}

export default AddStudentsToAssignmentDrawerForm;