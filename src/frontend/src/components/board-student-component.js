import React, { Component } from "react";
import {
    Table,
    Space,
    Empty,
    Button,
    Badge,
    Tag,
} from "antd";

import userService from "../store/user.service";
import eventBus from "../context/event-bus";
import StudentViewAssignmentDrawerForm from "./drawers/student-view-assignment-drawer.component";

export default class BoardStudent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: [],
            errorContent: "",
            showViewDrawer: false,
            record: null
        };
    }

    fetchAllAssignmentsForStudent = () => {
        userService.getStudentBoard().then(
            response => {
                this.setState({
                    content: response.data.data,
                });
            },
            error => {
                this.setState({
                    errorContent:
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message || error.toString()
                });

                if(error.response && error.response.status === 401) {
                    eventBus.dispatch("logout");
                }
            }
        );
    }

    setShowViewDrawer= () => {
        this.setState({ showViewDrawer: !this.state.showViewDrawer });
    }

    handleViewAction(record) {
        if(record != null) {
            this.setState({record: record});
            console.log(this.state.record);
            this.setShowViewDrawer();
        }
    }

    handleResultAction(record) {

    }

    componentDidMount() {
        this.fetchAllAssignmentsForStudent();
    }

    
    render() {
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Due Date',
                dataIndex: 'dueDate',
                key: 'dueDate'
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: status => {
                    switch (status) {
                        case 0:
                            return <Badge status="success" text="Created" />;
                        case 1:
                            return <Badge status="processing" text="Released" />;
                        case 2:
                            return <Badge status="error" text="Finished" />;
                        default:
                            return <Badge status="default" text="Undefined" />;
                    }
                }
            },
            {
                title: 'Tags',
                key: 'tags',
                dataIndex: 'enrolment_status',
                render: enrolmentStatus => {
                    switch (enrolmentStatus) {
                        case 0:
                            return (
                                <>
                                <Tag color="volcano" key={enrolmentStatus}>
                                    Unsubmitted
                                </Tag>
                                </>
                            );
                        case 1:
                            return (
                                <>
                                <Tag color="green" key={enrolmentStatus}>
                                    Submitted
                                </Tag>
                                </>
                            );
                        case 2:
                            return (
                                <>
                                <Tag color="green" key={enrolmentStatus}>
                                    Marked
                                </Tag>
                                </>
                            );
                        case 3:
                            return (
                                <>
                                <Tag color="volcano" key={enrolmentStatus}>
                                    Missed
                                </Tag>
                                </>
                            );
                        default:
                            break;
                    }
                }
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <Space size='middle'>
                        <Button type='link' value={record} onClick={() => this.handleViewAction(record)}>View</Button>
                        <Button type='link' value={record} onClick={() => this.handleResultAction(record)}>Result</Button>
                        
                    </Space>

                ),
            }
        ];
        return (
            <div className="container">
                <div className="table-container">
                    {this.state.record ? <StudentViewAssignmentDrawerForm
                        assignment={this.state.record}
                        showViewDrawer={this.state.showViewDrawer}
                        setShowViewDrawer={this.setShowViewDrawer}
                        fetchAllAssignmentsForStudent={this.fetchAllAssignmentsForStudent}
                    /> : <></>}
                    {this.state.content ?
                        <Table
                            columns={columns}
                            dataSource={this.state.content}
                            rowKey={(assignment) => assignment.id}
                        /> : <Empty />}
                </div>
            </div>
        );
    }
}