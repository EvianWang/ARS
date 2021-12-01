import React, { Component } from "react";
import {
    Table,
    Space,
    Menu,
    Dropdown,
    Empty,
    Button,
    Tooltip,
    Badge,
    Modal
} from "antd";
import {
    DownOutlined,
    PlusOutlined
} from '@ant-design/icons';

import NewAssignmentDrawerForm from "./new-assignment-drawer.component";
import EditAssignmentDrawerForm from "./edit-assignment-drawer.component";
import { successNotification, errorNotification } from "./notification.component";

import userService from "../store/user.service";
import eventBus from "../context/event-bus";


export default class BoardTeacher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: [],
            showDrawer: false,
            showEditDrawer: false,
            record: null,
            isModalVisible: false,
        };
    }

    // onClick = ({ key }) => {
        // message.info(`Click on item ${key}`)
        // message.info(`Click on item ${record}`);
        // message.info(`${record}`);
    // };

    handleEditAction(record) {
        if (record != null) {
            this.setState({ record: record });
            console.log(this.state.record);
            this.setShowEditDrawer(true);
        }
    }

    handleDeleteAction(record) {
        if (record != null) {
            this.setState({ record: record });
            console.log(this.state.record);
            this.setState({isModalVisible: !this.state.isModalVisible});
        }
    }

    handleOk = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
        userService.deleteAssignment(this.state.record)
            .then(() => {
                console.log("assignment deleted.")
                successNotification("Assignment successfully deleted");
                this.fetchAllAssignments();
            }).catch(err => {
                console.log(err);
                // err.response.json().then(res => {
                //     console.log(res);
                //     errorNotification("There was an issue", `${res.message} [${res.status}] [${res.error}]`, "bottomLeft");
                // });
                errorNotification("There was an issue", `${err.message}`, "bottomLeft");
            })
    }

    handleCancel = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    handleStatusChange = (status, record) => {
        if(status === 'release') {
            userService.updateAssignmentStatus(record,1)
            .then(() => {
                console.log(`assignment with Id ${record.id} was changed to released`);
                successNotification("Assignment status successfully updated");
                this.fetchAllAssignments();
            }).catch(err => {
                console.log(err);
                errorNotification("There was an issue", `${err.message}`, "bottomLeft");
            })
        }

        if(status === 'close') {
            userService.updateAssignmentStatus(record,2)
            .then(() => {
                console.log(`assignment with Id ${record.id} was changed to finished`);
                successNotification("Assignment status successfully updated");
                this.fetchAllAssignments();
            }).catch(err => {
                console.log(err);
                errorNotification("There was an issue", `${err.message}`, "bottomLeft");
            })
        }
    }

    setShowDrawer = () => {
        this.setState({ showDrawer: !this.state.showDrawer });
    }

    setShowEditDrawer = () => {
        this.setState({ showEditDrawer: !this.state.showEditDrawer });
    }

    fetchAllAssignments = () => {
        userService.getTeacherBoard().then(
            response => {
                this.setState({
                    content: response.data.data
                });
            },
            error => {
                this.setState({
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message || error.toString()
                });

                if (error.response && error.response.status === 401) {
                    eventBus.dispatch("logout");
                }
            }
        );
    }

    componentDidMount() {
        this.fetchAllAssignments();
    }

    render() {
        const menu = record => (
            <Menu
            // onClick={() => {
            // console.log(record);
            // this.onClick(record);
            // }}
            // onClick={this.onClick}
            >
                <Menu.Item key="0">Add students</Menu.Item>
                <Menu.Item key="1" onClick={() => this.handleStatusChange('release',record)}>Release</Menu.Item>
                <Menu.Item key="2" onClick={() => this.handleStatusChange('close',record)}>Close</Menu.Item>
                {/* <Menu.Item key="3">Delete</Menu.Item> */}
                <Menu.Item key="3" onClick={() => this.handleDeleteAction(record)}>Delete</Menu.Item>
                {/* <Menu.Item key="4">Extend</Menu.Item> */}
            </Menu>
        );

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
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <Space size='middle'>
                        <Button type='link' value={record} onClick={() => this.handleEditAction(record)}>Edit</Button>
                        <Dropdown overlay={menu(record)}>
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()} href="/#">
                                More actions<DownOutlined />
                            </a>
                        </Dropdown>
                    </Space>

                ),
            }
        ];

        return (
            <div className="container">
                <div className="create-assignment-button-container" style={{ display: 'flex', marginBottom: '15px' }}>
                    <h4 style={{ margin: '0px 10px 0px 0px', textAlign: 'center' }}>Assignment List</h4>
                    <Tooltip title="Create new assignment">
                        <Button
                            className="create-assignment-btn"
                            shape="circle"
                            icon={<PlusOutlined />}
                            onClick={() => this.setShowDrawer(!this.state.showDrawer)}
                        />
                    </Tooltip>

                </div>
                {this.state.record ? <Modal title="Delete Assignment" visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <p>Are you sure deleting {this.state.record.name} ?</p>
                </Modal> : <></>}
                <NewAssignmentDrawerForm
                    showDrawer={this.state.showDrawer}
                    setShowDrawer={this.setShowDrawer}
                    fetchAssignments={this.fetchAllAssignments}
                />
                {this.state.record ? <EditAssignmentDrawerForm
                    assignment={this.state.record}
                    showEditDrawer={this.state.showEditDrawer}
                    setShowEditDrawer={this.setShowEditDrawer}
                    fetchAssignments={this.fetchAllAssignments}
                /> : <></>}

                <div className="table-container">
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