import React, {Component} from 'react';
import {App, CTYPE, Utils, U} from "../../common";
import {Checkbox, Col, Icon, Input, message, Radio, Rate, Row, Modal} from "antd";
import "../../assets/css/question/questionPractice.less"

const HeartSvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
        <path
            d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z"/>
    </svg>
);

const HeartIcon = props => <Icon component={HeartSvg} {...props} />;

class ExamDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            usrPaper: {},
            collercts: [],
            loading: false,
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {id} = this.state;
        this.setState({loading: true});
        App.api(`/usr/usrPaper/usrPaper_id`, {id}).then((result) => {
            let {usrPaper = {}, collects = {}} = result;
            this.setState({
                usrPaper,
                collects,
                loading: false
            })
        });
    };

    // Submit = (questionId, collected) => {
    //     let collect = {
    //         questionId,
    //     };
    //     collected === 1 ?
    //         App.api('/usr/collect/save', {
    //             collect: JSON.stringify(collect)
    //         }).then(() => {
    //             message.success("已收藏");
    //         })
    //         :
    //         App.api('/usr/collect/delete', {
    //             id: questionId
    //         }).then(() => {
    //             message.success("已取消");
    //             this.setState({questions: []});
    //             this.loadData();
    //         })
    // };

    Submit = (questionId, collected) => {
        let collect = {
            questionId,
        };
        Modal.confirm({
            title: `${collected === 1 ? "确认收藏此题" : "取消此题收藏"}`,
            onOk: () => {
                collected === 1 ?
                    App.api('/usr/collect/save', {
                        collect: JSON.stringify(collect)
                    }).then(() => {
                        message.success("已收藏");
                    })
                    :
                    App.api('/usr/collect/delete', {
                        id: questionId
                    }).then(() => {
                        message.success("已取消");
                        this.setState({questions: []});
                        // this.loadData();
                    })
            },
            onCancel() {
            }
        })
    };

    render() {
        let {usrPaper = {}, collects = []} = this.state;
        let {questions = [], totalScore, totalTime, paperName, difficulty} = usrPaper;
        collects.map((collect, index) => {
            questions.map((question, index) => {
                if (question.id === collect.questionId) {
                    question.collected = 1;
                }
            })
        });
        return <div>
            <div className="mockExam-card">
                <div style={{textAlign: "center"}}>
                    <h1>{paperName}</h1>
                </div>
                <div style={{margin: "30px 0", fontSize: "20px", fontWeight: 400}}>
                    <Row>
                        <Col span={6}>
                        <span>难度:<Rate disabled count={difficulty}
                                       value={difficulty}/></span>
                        </Col>
                        <Col span={6}>
                            <span>用时:{U.date.seconds2MS(totalTime / 1000)}</span>
                        </Col>
                        <Col span={6}>
                            <span>得分:{totalScore}分</span>
                        </Col>
                    </Row>
                </div>
                {questions.map((question, index) => {
                    return <div>
                        {index + 1 + (":") + "(" + CTYPE.displayType[`${question.type - 1}`] + ")"}
                        <HeartIcon style={question.collected === 1 ?
                            {color: 'red', marginLeft: "10px"} : {color: '#f1f1f1', marginLeft: "10px"}}
                                   onClick={() => {
                                       let _collected = question.collected;
                                       question.collected === 1 ? _collected = 0 : _collected = 1;
                                       questions[index].collected = _collected;
                                       this.setState({
                                           questions
                                       }, () => {
                                           this.Submit(question.id, _collected)
                                       })
                                   }}/>
                        {question.answer === question.userAnswer ?
                            <Icon type="check" style={{color: "green", marginLeft: "10px"}}/> :
                            <span style={{color: "green", marginLeft: "10px"}}>参考答案: {question.answer}</span>}
                        <li dangerouslySetInnerHTML={{__html: question.topic}}/>
                        <ul>
                            <li>
                                {question.type === 1 &&
                                <li>
                                    {question.options.map((obj, i) => {
                                        return <Col span={12}>
                                            <Radio.Group value={questions[index].userAnswer}
                                                         disabled={true} onChange={(e) => {
                                                questions[index].userAnswer = e.target.value;
                                                this.setState({
                                                    questions
                                                })
                                            }}>
                                                <Radio value={CTYPE.ABC[i]}>{CTYPE.ABC[i]}.{obj}</Radio>
                                            </Radio.Group>
                                        </Col>
                                    })}
                                </li>}
                            </li>
                            <li>
                                {question.type === 2 &&
                                <li>
                                    <Checkbox.Group value={questions[index].userAnswer}
                                                    disabled={true} onChange={(checkedValue) => {
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
                                </li>}
                            </li>
                            <li>
                                {question.type === 3 &&
                                <li>
                                    {CTYPE.judge.map((obj, i) => {
                                        return <Radio.Group value={questions[index].userAnswer}
                                                            disabled={true} onChange={(e) => {
                                            questions[index].userAnswer = e.target.value;
                                            this.setState({
                                                questions
                                            })
                                        }}>
                                            <Radio value={obj.id}>{obj.label}</Radio>
                                        </Radio.Group>
                                    })}
                                </li>}
                            </li>
                            <li>
                                {question.type === 4 &&
                                <li>
                                    <Input value={questions[index].userAnswer}
                                           disabled={true} onChange={(e) => {
                                        questions[index].userAnswer = e.target.value;
                                        this.setState({
                                            questions
                                        })
                                    }}/>
                                </li>}
                            </li>
                            <li>
                                {question.type === 5 &&
                                <li>
                                    <Input.TextArea rows={3} value={questions[index].userAnswer}
                                                    disabled={true} onChange={(e) => {
                                        questions[index].userAnswer = e.target.value;
                                        this.setState({
                                            questions
                                        })
                                    }}/>
                                </li>}
                            </li>
                        </ul>
                    </div>
                })}
            </div>
        </div>
    }
}

export default ExamDetails;

// <Rate style={{fontSize: 14, float: "left"}} allowClear={true} count={1}
//       value={question.collected}
//       onChange={(num) => {
//           let _collected = question.collected;
//           if (question.collected === 1) {
//               _collected = 0;
//           } else {
//               _collected = 1;
//           }
//           questions[index].collected = _collected;
//           this.setState({
//               questions
//           }, () => {
//               this.Submit(question.id, _collected)
//           })
//       }}/>