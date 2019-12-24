import React, {Component} from 'react';
import {App, CTYPE, U} from "../../common";
import {Card, Row, Select, Input, Button, Col, Rate, message, Icon, Modal, Tooltip} from "antd";
import Pagination from "antd/es/pagination";

const {Option} = Select;
const HeartSvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
        <path
            d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z"/>
    </svg>
);

const HeartIcon = props => <Icon component={HeartSvg} {...props} />;

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
            //
            content.map((collect, index) => {
                let {question} = collect;
                question.collected = 1;
            });
            //
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
        Modal.confirm({
            title: `取消此题收藏`,
            onOk: () => {
                App.api('/usr/collect/collect', {
                    collect: JSON.stringify({questionId})
                }).then(() => {
                    message.success("已取消");
                    this.loadData()
                });
            },
            onCancel() {
            }
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
                    let {question = {}} = collect;
                    return <div>
                        <br/>
                        {index + 1 + (":") + "(" + CTYPE.displayType[`${question.type - 1}`] + ")"}
                        <HeartIcon onClick={() => {
                            this.Submit(question.id)
                        }} style={{color: 'red', marginLeft: "10px"}}/>
                        <Tooltip title={`参考答案: ${question.answer}`}>
                            <Icon type='question-circle' style={{margin: "0 10px"}}/></Tooltip>
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
                        {/*<div style={{margin: "10px 0"}}>*/}
                        {/*    <span style={{color: "green"}}>参考答案: {question.answer}</span>*/}
                        {/*</div>*/}
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