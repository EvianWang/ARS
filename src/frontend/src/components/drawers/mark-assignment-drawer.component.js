import { Drawer, message, Button, Row, Col, Input, Form, Spin, InputNumber } from "antd";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import userService from "../../store/user.service";

const { TextArea } = Input;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function MarkAssignmentDrawerForm({ record, showDrawer, setShowDrawer, fetchAssignments }){
    const onClose = () => setShowDrawer(false);
    const [submitting, setSubmitting] = useState(false);

    const onFinish = filled => {
        filled = {
            studentId: record.studentId,
            comment: filled.comment,
            grade: filled.grade
        };
        setSubmitting(true);
        console.log(JSON.stringify(filled, null, 2));
        userService.markAssignment(filled)
            .then(() => {
                console.log("grade added");
                onClose();
                message.success("grade added");
                fetchAssignments();
            })
            .catch(err => {
                console.log(err);
                message.error("mark failed");
            })
            .finally(() => {
                setSubmitting(false);
            })
    };

    const onFinishFailed = errorInfo => {
        alert(JSON.stringify(errorInfo, null, 2));
    };

    return <Drawer
        title="Mark assignment"
        width={720}
        onClose={onClose}
        visible={showDrawer}
        bodyStyle={{ paddingBottom: 80}}
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
                        name="grade"
                        label="Grade"
                        rules={[{ required: true, message: 'Please enter grade' }]}
                    >
                        <InputNumber min={0} max={100} precision={2} step={0.01}/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="comment"
                        label="Comment"
                    >
                        <TextArea placeholder="(optional)Comments on the submission"/>
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

export default MarkAssignmentDrawerForm;