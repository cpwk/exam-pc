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
            usrPaper: {},
            template: {},
            display: 1,
            disabled: false,
            isDisplay: 1,
            count: 0,
            totalTime: 0
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
        App.api('/usr/usrPaper/start', {id}).then((result) => {
            let {usrPaper = {}, template = {}} = result;
            if (usrPaper.type === 1) {
                this.setState({
                    usrPaper,
                    template,
                    isDisplay: 2,
                    disabled: true,
                    display: 2,
                    totalTime: U.date.seconds2MS(usrPaper.totalTime / 1000)
                });
            }
            this.setState({
                    usrPaper,
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
        clearInterval(this.timerId);
        let _this = this;
        let {type = 1, usrPaper = {}, count} = this.state;
        usrPaper.type = type;
        usrPaper.totalTime = count * 1000;
        App.api('/usr/usrPaper/end', {
            usrPaper: JSON.stringify(usrPaper)
        }).then((result) => {
            let {usrPaper = {}, template = {}} = result;
            this.setState({
                usrPaper,
                template,
            });
            Modal.success({
                title: "考试结束",
                content: `本次考试共计得:${usrPaper.totalScore}分`,
                okText: "确认",
                keyboard: true,
                onOk() {
                    _this.setState({
                        isDisplay: 2,
                        disabled: true,
                        display: 2,
                        totalTime: U.date.seconds2MS(usrPaper.totalTime / 1000)
                    });
                },
                onCancel() {
                },
            });
        })
    };

    render() {
        let {display, disabled, isDisplay, usrPaper, count, template, totalTime} = this.state;
        let {questions = [], paperName,} = usrPaper;
        let {totalScore, passingScore, difficulty} = template;
        let _duration = U.date.seconds2MS(count);
        return <div>
            <Card className="mockExam">
                <div className="mockExam-time">
                    {display === 1 ? <span>距离结束:{_duration}</span> : <span>用时:{totalTime}</span>}
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
                        {display === 2 &&
                        <Col span={6}>
                            <span style={{color: "red"}}>得分:{usrPaper.totalScore}分</span>
                        </Col>}
                    </Row>
                    {questions.map((question, index) => {
                        return <div>
                            {index + 1 + (":") + "(" + CTYPE.displayType[`${question.type - 1}`] + ")"}
                            {display === 2 && (question.answer === question.userAnswer ?
                                <Icon type="check" style={{color: "green"}}/> :
                                <span style={{color: "red"}}>正确答案: {question.answer}</span>)}
                            <li dangerouslySetInnerHTML={{__html: question.topic}}/>
                            {question.type === 1 &&
                            <span>
                                {question.options.map((obj, i) => {
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
                            {question.type === 2 &&
                            <Checkbox.Group value={questions[index].userAnswer}
                                            disabled={disabled} onChange={(checkedValue) => {
                                questions[index].userAnswer = checkedValue;
                                this.setState({
                                    questions
                                })
                            }}>
                                {question.options.map((obj, index) => {
                                    return <Col span={12}>
                                        <Checkbox value={CTYPE.ABC[index]}
                                                  key={index}>{CTYPE.ABC[index]}.{obj}</Checkbox>
                                    </Col>
                                })}
                            </Checkbox.Group>
                            }
                            {question.type === 3 &&
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
                            {question.type === 4 &&
                            <Input value={questions[index].userAnswer}
                                   disabled={disabled} onChange={(e) => {
                                questions[index].userAnswer = e.target.value;
                                this.setState({
                                    questions
                                })
                            }}/>}
                            {question.type === 5 &&
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


// totalScore: 0,

// let {totalScore} = this.state;

// let {questions = []} = usrPaper;
// questions.map((obj, index) => {
//     if (obj.answer === obj.userAnswer) {
//         this.setState({totalScore: totalScore += 2})
//     }
// });