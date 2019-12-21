import React, {Component} from 'react';
import {App, CTYPE, U} from "../../common";
import {Card, Row, Select, Input, Button, Col, Rate, message, Icon} from "antd";
import Pagination from "antd/es/pagination";

const {Option} = Select;
const InputSearch = Input.Search;

class Collect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            collects: [],
            loading: false,
            type: 0,
            status: 1,
            list: [],
            totalElements: 0,
            pageSize: CTYPE.pagination.pageSize,
            pageNumber: 1,
        }
    }

    componentDidMount() {
        U.setWXTitle("我的收藏");
        this.loadData();
    }

    loadData = () => {
        let {pageNumber, pageSize, id} = this.state;
        this.setState({loading: true});
        App.api('/usr/collect/collect_list', {
            collectQo: JSON.stringify({
                ...this.getQuery(),
                pageNumber,
                pageSize,
                userId: id
            })
        }).then((list) => {
            let {content = [], totalElements, pageable = {}} = list;
            let {pageSize} = pageable;
            this.setState({collects: content, totalElements, pageSize});
        });
    };

    getQuery = () => {
        let {type, status} = this.state;
        let query = {};
        query.type = type;
        query.status = status;
        return query;
    };

    Submit = (questionId) => {
        App.api('/usr/collect/delete', {
            id: questionId
        }).then(() => {
            message.success("已取消");
            this.loadData();
        })
    };

    render() {
        let {collects = [], totalElements, pageNumber, pageSize} = this.state;
        return <div>
            <Card
                title={"我的收藏"}
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
                            return <Option value={k.type} key={index}>{k.label}</Option>
                        })}
                    </Select>
                }
            >
                {collects.map((collect, index) => {
                    console.log(collects[index].questionId);

                    let {question = {}} = collect;
                    return <div>
                        <ul>
                            <li>
                                {question.type === 1 &&
                                <li>
                                    {question.type === 1 &&
                                    index + 1 + (":") + "(" + CTYPE.displayType[`${question.type - 1}`] + ")"}
                                    <li dangerouslySetInnerHTML={{__html: question.topic}}/>
                                    <li>
                                        {question.options.map((obj, i) => {
                                            return <li>{CTYPE.ABC[i]}.{obj}</li>
                                        })}
                                    </li>
                                </li>}
                            </li>
                            <li>
                                {question.type === 2 &&
                                <li>
                                    {question.type === 2 &&
                                    index + 1 + (":") + "(" + CTYPE.displayType[`${question.type - 1}`] + ")"}

                                    {/*<span style={{color: "green"}}>正确答案: {question.answer.map((a, index) => {*/}
                                    {/*    return <span>{a}</span>*/}
                                    {/*})}</span>*/}

                                    <li dangerouslySetInnerHTML={{__html: question.topic}}/>
                                    <li>
                                        {question.options.map((obj, i) => {
                                            return <li>{CTYPE.ABC[i]}.{obj}</li>
                                        })}
                                    </li>
                                </li>}
                            </li>
                            <li>
                                {question.type === 3 &&
                                <li>
                                    {question.type === 3 &&
                                    index + 1 + (":") + "(" + CTYPE.displayType[`${question.type - 1}`] + ")"}
                                    <li dangerouslySetInnerHTML={{__html: question.topic}}/>
                                    <li>
                                        {CTYPE.judge.map((j, index) => {
                                            return <li>{index + 1}.{j.label}</li>
                                        })}
                                    </li>
                                </li>}
                            </li>
                            <li>
                                {(question.type === 4 || question.type === 5) &&
                                <li>
                                    {(question.type === 4 || question.type === 5) &&
                                    index + 1 + (":") + "(" + CTYPE.displayType[`${question.type - 1}`] + ")"}
                                    <li dangerouslySetInnerHTML={{__html: question.topic}}/>
                                </li>}
                            </li>
                        </ul>
                        <div style={{margin: "20px 0"}}>
                            <Col span={4}>
                                <Button type="primary" style={{height: "25px"}} onClick={() => {
                                    this.Submit(collects[index].questionId)
                                }} htmlType="submit">点击取消</Button>
                            </Col>
                            <span style={{color: "green"}}>参考答案: {question.answer}</span>
                        </div>
                    </div>
                })}
            </Card>
            <Pagination
                style={{float: 'right', marginTop: '10px'}}
                showSizeChanger
                onChange={(page, pageSize) => {
                    this.setState({pageNumber: page, pageSize}, () => {
                        this.loadData()
                    })
                }}
                onShowSizeChange={(current, size) => {
                    this.setState({
                        pageNumber: current,
                        pageSize: size
                    }, () => {
                        this.loadData();
                    })
                }}
                defaultCurrent={pageNumber}
                pageSize={pageSize}
                total={totalElements}/>
        </div>
    }
}


export default Collect;