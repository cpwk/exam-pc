import React, {Component} from 'react';
import {App, U, CTYPE, Utils} from "../../common";
import '../../assets/css/trainee/profile.scss'
import {Tabs, Table, Rate, Dropdown, Menu, Icon, Modal,message} from "antd";

const {TabPane} = Tabs;

class PracticeRecord extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 1,
                total: 0,
            },
            usrPaper: [],
            questions: [],
            loading: false,
            type: 0
        }
    }

    componentDidMount() {
        U.setWXTitle("我的记录");
        this.loadData();
    }

    loadData = () => {
        let {pagination = {}} = this.state;
        this.setState({loading: true});
        App.api(`/usr/usrPaper/record`, {
            usrPaperQo: JSON.stringify({
                ...this.getQuery(),
                pageNumber: pagination.current,
                pageSize: pagination.pageSize,
            })
        }).then((usrPaper) => {
            let pagination = Utils.pager.convert2Pagination(usrPaper);
            this.setState({
                usrPaper: usrPaper.content,
                loading: false,
                pagination
            });
        });
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    getQuery = () => {
        let {type} = this.state;
        let query = {};
        query.type = type;
        return query;
    };

    status = (item, index) => {
        Modal.confirm({
            title: `确认删除此试卷`,
            onOk: () => {
                App.api("/usr/usrPaper/status", {id: item.id}).then(() => {
                    this.loadData();
                    message.success(`操作成功`);
                })
            },
            onCancel() {
            }
        })
    };

    details = (item) => {
        App.go(`/usr/examDetails/${item.id}`)
    };

    render() {

        let {pagination, usrPaper = [], loading} = this.state;

        return <div className="profile-page">

            <Tabs defaultActiveKey={0} onChange={(value) => {
                this.setState({
                    type: value, pagination: {
                        ...pagination,
                        current: 1
                    }
                }, () => {
                    this.loadData();
                })
            }}>
                <TabPane tab="全部记录" key={0}/>
                <TabPane tab="考试记录" key={1}/>
                <TabPane tab="练习记录" key={2}/>
            </Tabs>

            <Table
                columns={[{
                    title: '序号',
                    dataIndex: 'id',
                    className: 'txt-center',
                    render: (text, item, i) => i + 1
                }, {
                    title: '试卷名称',
                    dataIndex: 'paperName',
                    className: 'txt-center',
                    render: (obj, item) => {
                        return <div className="state">
                            <a onClick={() => {
                                this.details(item);
                            }}>{item.paperName}</a>
                        </div>
                    }
                }, {
                    title: '难度',
                    dataIndex: 'd-difficulty',
                    className: 'txt-center',
                    render: (ob, d) => {
                        return <div className="">
                            <Rate style={{fontSize: 14}} disabled count={d.difficulty} value={d.difficulty}/>
                        </div>
                    }
                }, {
                    title: '用时',
                    dataIndex: 'totalTime',
                    className: 'txt-center',
                    render: (totalTime) => {
                        return <div>
                            {<span>{U.date.seconds2MS(totalTime / 1000)}</span>}
                        </div>
                    }
                }, {
                    title: '得分',
                    dataIndex: 'totalScore',
                    className: 'txt-center',
                }, {
                    title: '创建时间',
                    dataIndex: 'createdAt',
                    className: 'txt-center',
                    render: (createdAt) => {
                        return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm');
                    }
                }, {
                    title: '操作',
                    dataIndex: 'option',
                    className: 'txt-center',
                    render: (text, item, index) => {
                        return <Dropdown overlay={
                            <Menu>
                                <Menu.Item key="1">
                                    <a onClick={() => this.status(item, index)}>
                                        删除
                                    </a>
                                </Menu.Item>
                            </Menu>} trigger={['click']}>
                            <a className={"ant-dropdown-link"}>
                                操作<Icon type="down"/>
                            </a>
                        </Dropdown>
                    }
                }]}
                rowkey={item => item.index}
                dataSource={usrPaper}
                loading={loading}
                pagination={{...pagination, ...CTYPE.commonPagination}}
                onChange={this.handleTableChange}
            />

        </div>
    }
}

export default PracticeRecord;