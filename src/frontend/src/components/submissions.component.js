import { Component } from "react";
import {
    Table,
    Space,
    Empty,
    Button,
    Tag
} from "antd";
import s3Service from "../store/s3.service";
import userService from "../store/user.service";
import { errorNotification, successNotification } from "./notification.component";
import MarkAssignmentDrawerForm from "./drawers/mark-assignment-drawer.component";


export default class Submissions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: [],
            errorContent: "",
            submitting: false,
            showDrawer: false,
            record: null,
        }
    }

    setShowDrawer = () => {
        this.setState({ showDrawer: !this.state.showDrawer });
    }

    handleDownloadAction = (record) => {
        if(record.fileKey === null){
            return errorNotification("Not submitted");
        }
        s3Service.downloadFile(record.fileKey)
            .then((res) => {
                successNotification("Assignment downloaded");
                const fileName = res.headers["content-disposition"]
                    .split("=")[1]
                    .replace(/['"]+/g, "");
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
            })
            .catch(err => {
                errorNotification("Download failed");
            });

    }

    handleMarkAction = (record) => {
        if(record != null) {
            this.setState({record: record});
            console.log(this.state.record);
            this.setShowDrawer();
        }
    }

    fetchSubmissions = () => {

        this.setState({ submitting: true });
        userService.viewSubmissions(localStorage.getItem('markAssignmentId'))
            .then((res) => {
                this.setState({ content: res.data.data });
            })
            .catch((err) => {
                errorNotification("Failed to fetch all submissions");
            })
            .finally(() => {
                this.setState({ submitting: false });
            })
    }

    componentDidMount() {
        this.fetchSubmissions();
    }

    render() {
        const columns = [
            {
                title: 'Id',
                dataIndex: 'studentId',
                key: 'studentId'
            },
            {
                title: 'Name',
                dataIndex: 'studentName',
                key: 'studentName'
            },
            {
                title: 'Tags',
                key: 'tags',
                dataIndex: 'enrolmentStatus',
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
                        <Button type='link' value={record} onClick={() => this.handleDownloadAction(record)} disabled={record.enrolmentStatus === 0}>Download</Button>
                        <Button type='link' value={record} onClick={() => this.handleMarkAction(record)} disabled={record.enrolmentStatus === 0}>Mark</Button>
                    </Space>

                ),
            }
        ];
        return (
            <div className="container">
                <div className="table-container">
                    {this.state.record ? <MarkAssignmentDrawerForm
                        record={this.state.record}
                        showDrawer={this.state.showDrawer}
                        setShowDrawer={this.setShowDrawer}
                        fetchAssignments={this.fetchSubmissions}
                    />:<></>}
                    {this.state.content ?
                        <Table
                            columns={columns}
                            dataSource={this.state.content}
                            rowKey={(submission) => submission.studentId}
                        /> : <Empty />}
                </div>
            </div>
        );
    }
}