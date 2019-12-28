import React, {Component} from 'react';
import {App, CTYPE, U} from "../../common";
import {Card, Input, Checkbox, Radio, Button, message, Icon, Modal, Col} from "antd";
import "../../assets/css/question/questionPractice.less"

class QuestionPractice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            str: this.props.match.params.str,
            display: 1,
            totalScore: 0,
            isDisplay: 1,
            disabled: false,
            questions: [],
            type: 2,
        }
    }

    componentDidMount() {
        U.setWXTitle("练习");
        this.loadData();
    }

    loadData = () => {
        let {str} = this.state;
        let usrPaper = decodeURIComponent(decodeURIComponent(str));
        App.api('/usr/usrPaper/question', {usrPaper}).then((questions) => {
            this.setState({questions,});
        });
    };

    handleSubmit = () => {
        let {str, totalScore, questions = [], type} = this.state;
        let usrPaper = decodeURIComponent(decodeURIComponent(str));
        let _usrPaper = JSON.parse(usrPaper);
        let _this = this;
        questions.map((obj, index) => {
            if (obj.answer === obj.userAnswer) {
                this.setState({totalScore: totalScore += 2})
            }
        });
        _usrPaper.totalScore = totalScore;
        _usrPaper.questions = questions;
        _usrPaper.type = type;
        App.api('/usr/usrPaper/save', {
            usrPaper: JSON.stringify(_usrPaper)
        }).then(() => {
            let {totalScore} = this.state;
            message.success("操作成功");
            Modal.success({
                title: "考试结束",
                content: `本次考试共计得:${totalScore}分`,
                okText: "确认",
                keyboard: true,
                onOk() {
                    _this.setState({isDisplay: 2});
                    _this.setState({disabled: true});
                    _this.setState({display: 2});
                },
                onCancel() {
                },
            });
        })
    };

    render() {

        let {display, isDisplay, disabled, questions = []} = this.state;
        return <div>
            <Card className="mockExam">
                <div className="mockExam-card">
                    {questions.map((question, index) => {
                        return <div>
                            {index + 1 + (":") + "(" + CTYPE.displayType[`${question.type - 1}`] + ")"}
                            <ul>
                                <li>
                                    {question.type === 1 &&
                                    <li>
                                        {display === 2 && (question.answer === question.userAnswer ?
                                            <Icon type="check" style={{color: "green"}}/> :
                                            <span style={{color: "red"}}>正确答案: {question.answer}</span>)}
                                        <li dangerouslySetInnerHTML={{__html: question.topic}}/>
                                        <li>
                                            {question.options.map((obj, i) => {
                                                return <Col span={12}> <Radio.Group value={questions[index].userAnswer}
                                                                                    disabled={disabled}
                                                                                    onChange={(e) => {
                                                                                        questions[index].userAnswer = e.target.value;
                                                                                        this.setState({
                                                                                            questions
                                                                                        })
                                                                                    }}>
                                                    <Col span={12}> <Radio
                                                        value={CTYPE.ABC[i]}>{CTYPE.ABC[i]}.{obj}</Radio></Col>
                                                </Radio.Group></Col>
                                            })}
                                        </li>
                                    </li>}
                                </li>
                                <li>
                                    {question.type === 2 &&
                                    <li>
                                        {display === 2 && (question.answer === question.userAnswer ?
                                            <Icon type="check" style={{color: "green"}}/> :
                                            <span style={{color: "red"}}>正确答案: {question.answer}</span>)}
                                        <li dangerouslySetInnerHTML={{__html: question.topic}}/>
                                        <li>
                                            <Checkbox.Group value={questions[index].userAnswer}
                                                            disabled={disabled} onChange={(checkedValue) => {
                                                questions[index].userAnswer = checkedValue;
                                                console.log(questions);
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
                                        </li>
                                    </li>}
                                </li>
                                <li>
                                    {question.type === 3 &&
                                    <li>
                                        {display === 2 && (question.answer === question.userAnswer ?
                                            <Icon type="check" style={{color: "green"}}/> :
                                            <span
                                                style={{color: "red"}}>正确答案: {question.answer === 1 ? "对" : "错"}</span>)}
                                        <li dangerouslySetInnerHTML={{__html: question.topic}}/>
                                        <li>
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
                                        </li>
                                    </li>}
                                </li>
                                <li>
                                    {question.type === 4 &&
                                    <li>
                                        {display === 2 && (question.answer === question.userAnswer ?
                                            <Icon type="check" style={{color: "green"}}/> :
                                            <span style={{color: "red"}}>正确答案: {question.answer}</span>)}
                                        <li dangerouslySetInnerHTML={{__html: question.topic}}/>
                                        <li>
                                            <Input.TextArea value={questions[index].userAnswer}
                                                            disabled={disabled} onChange={(e) => {
                                                questions[index].userAnswer = e.target.value;
                                                this.setState({
                                                    questions
                                                })
                                            }}/>
                                        </li>
                                    </li>}
                                </li>
                                <li>
                                    {question.type === 5 &&
                                    <li>
                                        {display === 2 && (question.answer === question.userAnswer ?
                                            <Icon type="check" style={{color: "green"}}/> :
                                            <span style={{color: "red"}}>正确答案: {question.answer}</span>)}
                                        <li dangerouslySetInnerHTML={{__html: question.topic}}/>
                                        <li>
                                            <Input.TextArea rows={3} value={questions[index].userAnswer}
                                                            disabled={disabled} onChange={(e) => {
                                                questions[index].userAnswer = e.target.value;
                                                this.setState({
                                                    questions
                                                })
                                            }}
                                            />
                                        </li>
                                    </li>}
                                </li>
                            </ul>
                        </div>
                    })}
                </div>
                <div style={{marginTop: "50px"}}>
                    {isDisplay === 1 &&
                    <Button type="primary"
                            style={{width: "300px", marginLeft: "37%"}}
                            onClick={() => {
                                this.handleSubmit()
                            }}
                            htmlType="submit">点击提交</Button>}
                </div>
            </Card>
        </div>
    }
}

export default QuestionPractice;


// let {str} = this.state;
// let usrPaper = decodeURIComponent(decodeURIComponent(str));
// let _usrPaper = JSON.parse(usrPaper);