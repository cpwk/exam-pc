import React, {Component} from 'react';
import {App, CTYPE, Utils, U} from "../../common";
import {Button, Card, Col, Row, Select, Input, Rate, Modal, message} from "antd";
import BreadcrumbCustom from "../BreadcrumbCustom";
import Link from "react-router-dom/Link";
import Pagination from "antd/es/pagination";
import OnCollect from "./OnCollect";

const {Option} = Select;
const InputSearch = Input.Search;

class Mistakes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            mistakes: [],
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
        U.setWXTitle("我的错题");
        this.loadData();
    }

    loadData = () => {
        let {pageNumber, pageSize, id} = this.state;
        this.setState({loading: true});
        App.api('/usr/mistakes/mistakes_list', {
            mistakesQo: JSON.stringify({
                ...this.getQuery(),
                pageNumber,
                pageSize,
                userId: id
            })
        }).then((mistakes) => {
            let {content = [], totalElements, pageable = {}} = mistakes;
            let {pageSize} = pageable;
            this.setState({list: content, totalElements, pageSize});
        });
    };

    getQuery = () => {
        let {type, status} = this.state;
        let query = {};
        query.type = type;
        query.status = status;
        return query;
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

    render() {
        let {list = [], totalElements, pageNumber, pageSize} = this.state;
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
                {list.map((k, index) => {
                    return <div>
                        <ul>
                            <li>
                                {k.question.type === 1 &&
                                <li>
                                    {k.question.type === 1 &&
                                    index + 1 + (":") + "(" + CTYPE.displayType[`${k.question.type - 1}`] + ")"}
                                    <li dangerouslySetInnerHTML={{__html: k.question.topic}}/>
                                    <li>
                                        {k.question.options.map((obj, i) => {
                                            return <li>{CTYPE.ABC[i]}.{obj}</li>
                                        })}
                                    </li>
                                </li>}
                            </li>
                            <li>
                                {k.question.type === 2 &&
                                <li>
                                    {k.question.type === 2 &&
                                    index + 1 + (":") + "(" + CTYPE.displayType[`${k.question.type - 1}`] + ")"}

                                    {/*<span style={{color: "green"}}>正确答案: {k.question.answer.map((a, index) => {*/}
                                    {/*    return <span>{a}</span>*/}
                                    {/*})}</span>*/}
                                    <li dangerouslySetInnerHTML={{__html: k.question.topic}}/>
                                    <li>
                                        {k.question.options.map((obj, i) => {
                                            return <li>{CTYPE.ABC[i]}.{obj}</li>
                                        })}
                                    </li>
                                </li>}
                            </li>
                            <li>
                                {k.question.type === 3 &&
                                <li>
                                    {k.question.type === 3 &&
                                    index + 1 + (":") + "(" + CTYPE.displayType[`${k.question.type - 1}`] + ")"}
                                    <li dangerouslySetInnerHTML={{__html: k.question.topic}}/>
                                    <li>
                                        {CTYPE.judge.map((j, index) => {
                                            return <li>{index + 1}.{j.label}</li>
                                        })}
                                    </li>
                                </li>}
                            </li>
                            <li>
                                {(k.question.type === 4 || k.question.type === 5) &&
                                <li>
                                    {(k.question.type === 4 || k.question.type === 5) &&
                                    index + 1 + (":") + "(" + CTYPE.displayType[`${k.question.type - 1}`] + ")"}
                                    <li dangerouslySetInnerHTML={{__html: k.question.topic}}/>
                                </li>}
                            </li>
                        </ul>
                        <div style={{margin: "20px 0"}}>
                            <Col span={4}>
                                <Button type="primary" style={{height: "25px"}}
                                        htmlType="submit" onClick={() => {
                                    this.status(k.id)
                                }}>移除</Button>
                            </Col>
                            <span style={{color: "green"}}>正确答案: {k.question.answer}</span>
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

export default Mistakes;