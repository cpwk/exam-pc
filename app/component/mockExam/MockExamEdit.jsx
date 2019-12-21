import React, {Component} from 'react';
import {App, CTYPE, U} from "../../common";
import {Button, Card, Checkbox, Icon, Input, Modal, Radio, Rate, Row, Col, message} from "antd";
import "../../assets/css/question/questionPractice.less"

import moment, {duration} from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

class MockExamEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            template: {},
            usrPaper: {},
            display: 1,
            disabled: false,
            isDisplay: 1,
            count: 0,
            totalScore: 0,
            type: 1
        }
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillUnmount() {
        this.timerId && clearInterval(this.timerId);
    }

    loadData = () => {
        let {id} = this.state;
        App.api('/usr/template/template_id', {id}).then((template) => {
            this.setState({
                    template,
                    count: template.duration / 1000
                }, () => {
                    this.countDown()
                }
            );
        })
    };

    countDown = () => {
        this.timerId = setInterval(() => {
            let {count} = this.state;
            if (count > 0) {
                this.setState({
                    count: count - 1,
                });
            } else {
                clearInterval(this.timerId);
                message.warn("考试结束");
                this.submit();
            }
        }, 1000);
    };

    handleSubmit = () => {
        let _this = this;
        let {totalScore, usrPaper = {}, template = {}, count, type} = this.state;
        let {questions = []} = template;
        questions.map((obj, index) => {
            if (obj.answer === obj.userAnswer) {
                this.setState({totalScore: totalScore += 2})
            }
        });
        usrPaper.totalScore = totalScore;
        usrPaper.questions = questions;
        usrPaper.templateId = template.id;
        usrPaper.totalTime = count * 1000;
        usrPaper.type = type;
        App.api('/usr/usrPaper/save', {
            usrPaper: JSON.stringify(usrPaper)
        }).then(() => {
            let {totalScore} = this.state;
            Modal.success({
                title: "考试结束",
                content: `本次考试共计得:${totalScore}分`,
                okText: "确认",
                keyboard: true,
                onOk() {
                    _this.setState({
                        isDisplay: 2,
                        disabled: true,
                        display: 2
                    });
                },
                onCancel() {
                },
            });
        })
    };

    render() {
        let {display, disabled, isDisplay, template, count} = this.state;
        let {questions = [], templateName, totalScore, passingScore, difficulty} = template;
        let _duration = U.date.seconds2MS(count);
        let time = (template.duration / 1000) - count;
        let _time = U.date.seconds2MS(time);
        return <div>
            <Card className="mockExam">
                <div className="mockExam-time">
                    {display === 1 ? <span>距离结束:{_duration}</span> : <span>用时:{_time}</span>}
                </div>
                <div className="mockExam-card">
                    <div className="mockExam-name">
                        <span>{templateName}</span>
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

                    </Row>
                    {questions.map((k, index) => {
                        return <div>
                            {index + 1 + (":") + "(" + CTYPE.displayType[`${k.type - 1}`] + ")"}
                            {display === 2 && (k.answer === k.userAnswer ?
                                <Icon type="check" style={{color: "green"}}/> :
                                <span style={{color: "red"}}>正确答案: {k.answer}</span>)}
                            <li dangerouslySetInnerHTML={{__html: k.topic}}/>
                            {k.type === 1 &&
                            <span>
                                {k.options.map((obj, i) => {
                                    return <Col span={12}>
                                        <Radio.Group value={questions[index].userAnswer}
                                                     disabled={disabled}
                                                     onChange={(e) => {
                                                         questions[index].userAnswer = e.target.value;
                                                         this.setState({
                                                             questions
                                                         })
                                                     }}>
                                            <Radio value={CTYPE.ABC[i]}>{CTYPE.ABC[i]}.{obj}</Radio>
                                        </Radio.Group>
                                    </Col>
                                })}
                                    </span>}
                            {k.type === 2 &&
                            <Checkbox.Group value={questions[index].userAnswer}
                                            disabled={disabled} onChange={(checkedValue) => {
                                questions[index].userAnswer = checkedValue;
                                this.setState({
                                    questions
                                })
                            }}>
                                {k.options.map((obj, index) => {
                                    return <Col span={12}>
                                        <Checkbox value={CTYPE.ABC[index]}
                                                  key={index}>{CTYPE.ABC[index]}.{obj}</Checkbox>
                                    </Col>
                                })}
                            </Checkbox.Group>
                            }
                            {k.type === 3 &&
                            <span>
                                {CTYPE.judge.map((obj, i) => {
                                    return <Radio.Group value={questions[index].userAnswer}
                                                        disabled={disabled} onChange={(e) => {
                                        questions[index].userAnswer = e.target.value;
                                        this.setState({
                                            questions
                                        })
                                    }}>
                                        <Radio value={obj.id}>{obj.label}</Radio>
                                    </Radio.Group>
                                })}
                                    </span>}
                            {k.type === 4 &&
                            <Input value={questions[index].userAnswer}
                                   disabled={disabled} onChange={(e) => {
                                questions[index].userAnswer = e.target.value;
                                this.setState({
                                    questions
                                })
                            }}/>}
                            {k.type === 5 &&
                            <Input.TextArea rows={3} value={questions[index].userAnswer}
                                            disabled={disabled} onChange={(e) => {
                                questions[index].userAnswer = e.target.value;
                                this.setState({
                                    questions
                                })
                            }}/>
                            }
                        </div>
                    })}
                    <div style={{marginTop: "50px"}}>
                        {isDisplay === 1 &&
                        <Button type="primary"
                                style={{width: "300px", marginLeft: "37%"}}
                                onClick={() => {
                                    this.handleSubmit()
                                }}
                                htmlType="submit">点击提交</Button>}
                    </div>
                </div>
            </Card>
        </div>
    }
}

export default MockExamEdit;