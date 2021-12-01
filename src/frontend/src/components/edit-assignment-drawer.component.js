import { Drawer, Input, Col, Form, Row, Button, Spin, DatePicker } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { successNotification, errorNotification } from "./notification.component";
import userService from "../store/user.service";
const moment = require('moment');

const { TextArea } = Input;


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function EditAssignmentDrawerForm({ assignment, showEditDrawer, setShowEditDrawer, fetchAssignments }) {
    const [submitting, setSubmitting] = useState(false);
    const [date, setDate] = useState(assignment.dueDate);


    // const [id] = useState(assignment.id);
    // const [name, setName] = useState(assignment.name);
    // const [description, setDescription] = useState(assignment.description);
    // const [dueDate] = useState(assignment.dueDate);
    // const [status, setStatus] = useState(record.status);

    const onClose = () => setShowEditDrawer(false);

    const onFinish = assignmentForm => {
        const assignmentParam = {
            id: assignment.id,
            name: assignmentForm.name,
            description: assignmentForm.description,
            dueDate: date,
        }
        setSubmitting(true);
        console.log(assignmentParam);
        // console.log(JSON.stringify(assignment, null, 2));

        userService.editAssignment(assignmentParam)
            .then(() => {
                console.log("assignment edited.")
                onClose();
                successNotification("Assignment successfully edited");
                fetchAssignments();
            })
            .catch(err => {
                console.log(err);
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification("There was an issue", `${res.message} [${res.status}] [${res.error}]`, "bottomLeft");
                });
            })
            .finally(() => {
                setSubmitting(false);
            })
    };

    const onFinishFailed = errorInfo => {
        alert(JSON.stringify(errorInfo, null, 2));
    };

    const onDateChange = (newDate) => {
        // console.log("new date: " + newDate.format("YYYY-MM-DD").toString());
        newDate = newDate.format("YYYY-MM-DD").toString();
        setDate(newDate);
    }

    // const onChangeName = (newName) =>{
    //     setName(newName);
    // }

    // const onChangeDescription = (newDesc) =>{
    //     setDescription(newDesc);
    // }

    return <Drawer
        title="Edit assignment information"
        width={720}
        onClose={onClose}
        visible={showEditDrawer}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
            <div style={{ textAlign: 'right' }}>
                <Button onClick={onClose} style={{ marginRight: 8 }}>
                    Cancel
                </Button>
            </div>
        }
    >
        <Form
            layout="vertical"
            onFinishFailed={onFinishFailed}
            onFinish={onFinish}
            hideRequiredMark
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="id"
                        label="Id"
                    >
                        <Input defaultValue={assignment.id} disabled />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="Name"
                        // rules={[{ required: true, message: 'Please enter assignment name' }]}
                    >
                        <Input defaultValue={assignment.name} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="description"
                        label="Description">
                        <TextArea defaultValue={assignment.description} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item
                        name="dueDate"
                        label="Due Date">
                        <DatePicker defaultValue={moment(assignment.dueDate, "YYYY-MM-DD")} onChange={onDateChange}/>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                {submitting && <Spin indicator={antIcon} />}
            </Row>
        </Form>
    </Drawer>
}

export default EditAssignmentDrawerForm;