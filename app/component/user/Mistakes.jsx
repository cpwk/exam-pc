import React, {Component} from 'react';
import {App, CTYPE, U} from "../../common";
import {Button, Card, Select, Modal, message, Icon, Tooltip, Empty} from "antd";
import Pagination from "antd/es/pagination";

const {Option} = Select;

class Mistakes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mistakes: [],
            loading: false,
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 1,
                total: 0,
            },
        }
    }

    componentDidMount() {
        U.setWXTitle("我的错题");
        this.loadData();
    }

    loadData = () => {
        this.setState({loading: true});
        App.api('/usr/mistakes/mistakes_list', {}).then((mistakes) => {
            this.setState({
                mistakes: mistakes.questions
            });
        });
    };

    status = (id) => {
        Modal.confirm({
            title: `如已掌握,请点击确定按钮`,
            onOk: () => {
                App.api("/usr/mistakes/delete", {id}).then(() => {
                    message.success(`操作成功`);
                    this.loadData();
                })
            },
            onCancel() {
            }
        })
    };

    onChange = (page) => {
        let {pagination} = this.state;
        this.setState({
            pagination: {
                ...pagination,
                current: page
            }
        });
    };

    render() {
        let {mistakes = [], pagination} = this.state;

        let _mistakes = mistakes.slice((pagination.current - 1) * pagination.pageSize, (pagination.current - 1) * pagination.pageSize + pagination.pageSize);

        return <div>
            <Card
                title={"我的错题"}
                extra={
                    <Select placeholder="全部类型" onSelect={(value) => {
                        this.setState({
                            type: value,
                        }, () => {
                            this.loadData();
                        })
                    }} style={{width: 105}}>
                        <Option value={0}>全部类型</Option>
                        {CTYPE.options.map((k, index) => {
                            return <Option value={k.type} key={CTYPE.options}>{k.label}</Option>
                        })}
                    </Select>
                }
            >
                {_mistakes.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/> :
                    _mistakes.map((question, index) => {
                        return <div>
                            {index + 1 + (":") + "(" + CTYPE.displayType[`${question.type - 1}`] + ")"}
                            {question.answer === question.userAnswer ?
                                <Icon type="check" style={{color: "green"}}/> :
                                <Tooltip
                                    title={`参考答案: ${question.answer}`}>
                                    <Icon type='question-circle' style={{color: "red", margin: "0 10px"}}/></Tooltip>}
                            <li dangerouslySetInnerHTML={{__html: question.topic}}/>
                            <ul>
                                {question.type === 1 &&
                                <li>
                                    {question.options.map((obj, i) => {
                                        return <li>{CTYPE.ABC[i]}.{obj}</li>
                                    })}
                                </li>}
                                {question.type === 2 &&
                                <li>
                                    {question.options.map((obj, i) => {
                                        return <li>{CTYPE.ABC[i]}.{obj}</li>
                                    })}
                                </li>}
                                {question.type === 3 &&
                                <li>
                                    {CTYPE.judge.map((j, index) => {
                                        return <li>{index + 1}.{j.label}</li>
                                    })}
                                </li>}
                            </ul>
                            <div style={{margin: "20px 0"}}>
                                <Button type="primary" style={{height: "25px"}}
                                        htmlType="submit" onClick={() => {
                                    this.status(question.id)
                                }}>移除</Button>
                            </div>
                        </div>
                    })}
            </Card>
            <Pagination
                style={{float: 'right', marginTop: '10px'}}
                pageSize={pagination.pageSize}
                total={mistakes.length}
                current={pagination.current}
                onChange={(page) => {
                    this.onChange(page)
                }}
                showTotal={(total) => `总共 ${total} 条`}
            />
        </div>
    }
}

export default Mistakes;