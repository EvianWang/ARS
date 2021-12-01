import { Drawer, Input, Col, Form, Row, Button, Spin, DatePicker } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { successNotification, errorNotification } from "./notification.component";
import userService from "../store/user.service";
import authService from '../store/auth.service';

const { TextArea } = Input;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function NewAssignmentDrawerForm({ showDrawer, setShowDrawer, fetchAssignments }) {
    const onClose = () => setShowDrawer(false);
    const [submitting, setSubmitting] = useState(false);
    const [date, setDate] = useState(null);

    const onFinish = assignment => {
        assignment = { id: authService.getCurrentUser().id, dueDate: date , name: assignment.name, description: assignment.description };
        setSubmitting(true);
        console.log(JSON.stringify(assignment, null, 2));
        userService.createNewAssignment(assignment)
            .then(() => {
                console.log("assignement added");
                onClose();
                successNotification("Assignment successfully added", `${assignment.name} was added to the system`);
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

    return <Drawer
        title="Create new assignment"
        width={720}
        onClose={onClose}
        visible={showDrawer}
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
            hideRequiredMark>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter assignment name' }]}>
                        <Input placeholder="Please enter assignment name" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="description"
                        label="Description">
                        <TextArea placeholder="(optional)Please enter assignment description"/>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item
                        name="dueDate"
                        label="Due Date">
                        <DatePicker onChange={onDateChange}/>
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

export default NewAssignmentDrawerForm;
