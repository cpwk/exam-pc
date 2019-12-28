import React, {Component} from 'react';
import {App, CTYPE, U} from "../../common";
import {Button, Card, Checkbox, Icon, Input, Modal, Radio, Rate, Row, Col, message} from "antd";
import "../../assets/css/question/questionPractice.less"

import moment, {duration} from 'moment';
import 'moment/locale/zh-cn';
import KvStorage from "../../common/KvStorage";
import Pagination from "antd/es/pagination";

moment.locale('zh-cn');

class MockExamEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            usrPaper: {},
            count: 0,
            pagination: {
                pageSize: CTYPE.paginations.pageSize,
                current: 1,
                total: 0,
            },
        };
        this.timerId = null;
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillUnmount() {
        this.timerId && clearInterval(this.timerId);
    }

    _saveCookie = (usrPaper) => {
        KvStorage.set('usrPaper_' + usrPaper.id, JSON.stringify(usrPaper));
    };

    loadData = () => {
        let {id} = this.state;
        let usrPaper = App.getPaper(id);
        if (usrPaper.id != null) {
            this.initPaper(usrPaper);
        } else {
            App.api('/usr/usrPaper/start', {id}).then((result) => {
                let {usrPaper = {}, template = {}} = result;
                usrPaper.template = template;
                this._saveCookie(usrPaper);
                this.initPaper(usrPaper);
            })
        }
    };

    initPaper = (usrPaper) => {
        let {template = {}, createdAt} = usrPaper;
        let count = template.duration - (new Date().getTime() - createdAt);
        this.setState({
            usrPaper, count
        }, () => {
            if (usrPaper.type !== 1 && count > 0) {
                this.countDown();
            }
        });
    };

    countDown = () => {
        this.timerId = setInterval(() => {
            let {count} = this.state;
            if (count > 0) {
                this.setState({
                    count: count - 1000,
                });
            } else {
                clearInterval(this.timerId);
                message.warn("考试结束");
                this.handleSubmit();
            }
        }, 1000);
    };

    handleSubmit = () => {
        clearInterval(this.timerId);
        let {type = 1, usrPaper = {}, count} = this.state;
        App.removeUsrPaper(usrPaper.id);
        usrPaper.type = type;
        usrPaper.totalTime = count;
        App.api('/usr/usrPaper/end', {
            usrPaper: JSON.stringify(usrPaper)
        }).then((result) => {
            let {usrPaper = {}, template = {}} = result;
            usrPaper.template = template;
            this.setState({usrPaper});
            Modal.success({
                title: "考试结束",
                content: `本次考试共计得:${usrPaper.totalScore}分`,
                okText: "确认",
                keyboard: true,
                onOk: () => {
                    this.setState({
                        count: 0,
                    });
                },
                onCancel() {
                },
            });
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

        let {usrPaper, count, pagination} = this.state;
        let {questions = [], paperName, template = {}, type} = usrPaper;
        let {totalScore, passingScore, difficulty} = template;
        let _duration = U.date.seconds2HMS(count / 1000);
        let finished = type === 1 || count <= 0;
        let _questions = questions.slice((pagination.current - 1) * pagination.pageSize, (pagination.current - 1) * pagination.pageSize + pagination.pageSize);

        return <div>
            <Card className="mockExam">
                <div className="mockExam-time">
                    {!finished ? <span>距离结束:{_duration}</span> :
                        <span>用时:{U.date.seconds2HMS(usrPaper.totalTime / 1000)}</span>}
                </div>
                <div className="mockExam-card">
                    <div className="mockExam-name">
                        <span>{paperName}</span>
                    </div>
                    <Row className="mockExam-row">
                        <Col span={6}>
                        <span>难度:<Rate disabled count={difficulty}
                                       value={difficulty}/></span>
                        </Col>
                        <Col span={6}>
                            <span>总分:{totalScore}分</span>
                        </Col>
                        <Col span={6}>
                            <span>及格分:{passingScore}分</span>
                        </Col>
                        {finished &&
                        <Col span={6}>
                            <span style={{color: "red"}}>得分:{usrPaper.totalScore}分</span>
                        </Col>}
                    </Row>
                    {_questions.map((question, index) => {
                        return <div key={index}>
                            {index + 1 + (":") + "(" + CTYPE.displayType[`${question.type - 1}`] + ")"}
                            {finished && (question.answer === question.userAnswer ?
                                <Icon type="check" style={{color: "green"}}/> :
                                <span style={{color: "red"}}>正确答案: {question.answer}</span>)}
                            <li dangerouslySetInnerHTML={{__html: question.topic}}/>
                            {question.type === 1 &&
                            <span>
                                {question.options.map((obj, i) => {
                                    return <Col span={12} key={i}>
                                        <Radio.Group value={questions[index].userAnswer}
                                                     disabled={finished}
                                                     onChange={(e) => {
                                                         questions[index].userAnswer = e.target.value;
                                                         this.setState({
                                                             questions
                                                         }, () => {
                                                             this._saveCookie(usrPaper);
                                                         })
                                                     }}>
                                            <Radio value={CTYPE.ABC[i]}>{CTYPE.ABC[i]}.{obj}</Radio>
                                        </Radio.Group>
                                    </Col>
                                })}
                                                         </span>}
                            {question.type === 2 &&
                            <Checkbox.Group value={questions[index].userAnswer}
                                            disabled={finished} onChange={(checkedValue) => {
                                questions[index].userAnswer = checkedValue;
                                this.setState({
                                    questions
                                }, () => {
                                    this._saveCookie(usrPaper);
                                })
                            }}>
                                {question.options.map((obj, index) => {
                                    return <Col span={12} key={index}>
                                        <Checkbox value={CTYPE.ABC[index]}
                                                  key={index}>{CTYPE.ABC[index]}.{obj}</Checkbox>
                                    </Col>
                                })}
                            </Checkbox.Group>
                            }
                            {question.type === 3 &&
                            <span>
                                {CTYPE.judge.map((obj, i) => {
                                    return <Radio.Group key={i}
                                                        value={questions[index].userAnswer}
                                                        disabled={finished} onChange={(e) => {
                                        questions[index].userAnswer = e.target.value;
                                        this.setState({
                                            questions
                                        }, () => {
                                            this._saveCookie(usrPaper);
                                        })
                                    }}>
                                        <Radio value={obj.id}>{obj.label}</Radio>
                                    </Radio.Group>
                                })}
                            </span>}
                            {question.type === 4 &&
                            <Input value={questions[index].userAnswer}
                                   disabled={finished} onChange={(e) => {
                                questions[index].userAnswer = e.target.value;
                                this.setState({
                                    questions
                                }, () => {
                                    this._saveCookie(usrPaper);
                                })
                            }}/>}
                            {question.type === 5 &&
                            <Input.TextArea rows={3} value={questions[index].userAnswer}
                                            disabled={finished} onChange={(e) => {
                                questions[index].userAnswer = e.target.value;
                                this.setState({
                                    questions
                                }, () => {
                                    this._saveCookie(usrPaper);
                                })
                            }}/>
                            }
                        </div>
                    })}
                    <div style={{marginTop: "50px"}}>
                        {!finished &&
                        <Button type="primary" style={{width: "300px", marginLeft: "37%"}} onClick={() => {
                            this.handleSubmit()
                        }} htmlType="submit">点击提交</Button>}
                    </div>
                </div>
                <Pagination
                    pageSize={pagination.pageSize}
                    total={questions.length}
                    current={pagination.current}
                    onChange={(page) => {
                        this.onChange(page)
                    }}
                    showTotal= {(total) => `总共 ${total} 条`}
                />
            </Card>
        </div>
    }
}

export default MockExamEdit;