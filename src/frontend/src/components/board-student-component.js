import React, { Component } from "react";
import {
    Table,
    Space,
    Empty,
    Button,
    Badge,
    Tag,
    Modal,
    Input
} from "antd";
import Highlighter from 'react-highlight-words';

import userService from "../store/user.service";
import eventBus from "../context/event-bus";
import StudentViewAssignmentDrawerForm from "./drawers/student-view-assignment-drawer.component";
import authService from "../store/auth.service";
import { errorNotification } from "./notification.component";
import { SearchOutlined } from "@ant-design/icons";

export default class BoardStudent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: [],
            errorContent: "",
            submitting: false,
            showViewDrawer: false,
            record: null,
            isModalVisible: false,
            grade: null,
            comment: null,
            // for table search
            searchText: '',
            searchedColumn: '',
        };
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        // this.setState({ searchText: node });
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                >
                </Input>
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys,confirm,dataIndex)}
                        icon={<SearchOutlined/>}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size='small' style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type='link'
                        size='small'
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            this.setState({
                                searchText: selectedKeys[0],
                                searchedColumn: dataIndex,
                            });
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1880ff' : undefined}} />,
        onFilter: (value,record) => 
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if(visible){
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: ''});
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

                if (error.response && error.response.status === 401) {
                    eventBus.dispatch("logout");
                }
            }
        );
    }

    setShowViewDrawer = () => {
        this.setState({ showViewDrawer: !this.state.showViewDrawer });
    }

    handleViewAction(record) {
        if (record != null) {
            this.setState({ record: record });
            console.log(this.state.record);
            this.setShowViewDrawer();
        }
    }

    handleResultAction(record) {
        if (record.enrolment_status !== 2) {
            return errorNotification('Not marked yet');
        }
        this.setState({ submitting: true });
        const currentUser = authService.getCurrentUser();
        const params = {
            studentId: currentUser.id,
            assignmentId: record.id
        }
        userService.studentViewGrade(params)
            .then((res) => {
                res = res.data.data;
                this.setState({ isModalVisible: true, comment: res.comment, grade: res.grade });
            })
            .catch((err) => {
                errorNotification('Error occurs when fetching the grade');
            })
            .finally(() => {
                this.setState({ submitting: false });
            })
    }

    handleCancel = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    handleOk = () => {
        // do nothing 
    }

    componentDidMount() {
        this.fetchAllAssignmentsForStudent();
    }


    render() {
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Due Date',
                dataIndex: 'dueDate',
                key: 'dueDate',
                width: '10%',
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: '10%',
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
                },
                ellipsis: true,
            },
            {
                title: 'Tags',
                key: 'tags',
                dataIndex: 'enrolment_status',
                width: '10%',
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
                        <Button type='link' value={record} onClick={() => this.handleViewAction(record)} disabled={this.state.submitting}>View</Button>
                        <Button type='link' value={record} onClick={() => this.handleResultAction(record)} disabled={this.state.submitting}>Result</Button>
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

                    <Modal
                        title="Result"
                        visible={this.state.isModalVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" onClick={this.handleCancel}>
                                Back
                            </Button>
                        ]}>
                        <p>Grade: {this.state.grade}</p>
                        <p>Comment: </p>
                        <p>{this.state.comment}</p>
                    </Modal>
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