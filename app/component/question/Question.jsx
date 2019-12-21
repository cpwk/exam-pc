import React, {Component} from 'react';
import "../../assets/css/question/exam.less"
import {Form, message, InputNumber, Collapse, Checkbox, Radio, Button, Input} from "antd";
import {App, CTYPE, U} from "../../common";

const {Panel} = Collapse;

class Question extends Component {

    constructor() {
        super();
        this.state = {
            list: [],
            usrPaper: {},
            user: {}
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        App.api('/usr/category/category_level').then((list) => {
            this.setState({list});
        });
    };

    callback = (key) => {
        console.log(key);
    };

    handleSubmit = () => {
        let {usrPaper} = this.state;
        let {difficulty, categoryId, content} = usrPaper;
        if (U.str.isEmpty(categoryId)) {
            message.warn("请选择分类");
            return;
        }
        if (U.str.isEmpty(difficulty)) {
            message.warn("请选择难度");
            return;
        }
        if (U.str.isEmpty(content)) {
            message.warn("请选择题目类型");
            return;
        }
        let str = encodeURIComponent(encodeURIComponent(JSON.stringify(usrPaper)));
        App.go(`/app/question/questionPractice/${str}`);

    };

    render() {
        let {list = []} = this.state;
        let {usrPaper} = this.state;
        let {difficulty, categoryId, content = []} = usrPaper;
        let checkTypes = [];
        content.map((detail) => {
            checkTypes.push(detail.type);
        });
        return <div>
            <div className="page-width">
                <div className="page-top">
                    <Collapse className="page-collapse-bottom" expandIconPosition="right" defaultActiveKey={['1']}
                              onChange={this.callback}>
                        <Panel header="试卷生成" key={'1'}>
                            <Radio.Group style={{width: '100%'}} value={categoryId} onChange={(vs) => {
                                this.setState({
                                    usrPaper: {
                                        ...usrPaper,
                                        categoryId: vs.target.value
                                    }
                                })
                            }}>
                                <Form.Item required="true" label="分类">
                                    {list.map((v, index) => {
                                        if (v.sequence % 1000 === 0) {
                                            return <Radio style={{margin: "0 12px"}} value={v.id}
                                                          key={index}>{v.name}</Radio>
                                        }
                                    })}
                                </Form.Item>
                            </Radio.Group>
                            <Radio.Group style={{width: '100%'}} value={difficulty} onChange={(vs) => {
                                this.setState({
                                    usrPaper: {
                                        ...usrPaper,
                                        difficulty: vs.target.value
                                    }
                                })
                            }}>
                                <Form.Item required="true" label="难度">
                                    {CTYPE.difficulty.map((d, index) => {
                                        return <Radio style={{margin: "0 12px"}} value={index + 1}
                                                      key={index}>{d}</Radio>
                                    })}
                                </Form.Item>
                            </Radio.Group>
                            <Checkbox.Group style={{width: '100%'}} value={checkTypes} onChange={(checkTypes) => {
                                if (checkTypes.length === 0) {
                                    content = [];
                                } else {
                                    checkTypes.map((type) => {
                                        let _type = content.find((item) => item.type === type);
                                        if (!_type) {
                                            content.push({type, number: 5});
                                        }
                                    });
                                    content.map((detail) => {
                                        let type = checkTypes.find((t) => t === detail.type);
                                        if (!type) {
                                            content = content.filter((item) => item.type !== detail.type);
                                        }
                                    });
                                }
                                this.setState({
                                    usrPaper: {
                                        ...usrPaper,
                                        content
                                    }
                                });
                            }}
                            >
                                <Form.Item required="true" label="类型">
                                    {CTYPE.options.map((k, index) => {
                                        return <Checkbox style={{margin: "0 12px"}} value={k.type}
                                                         key={index}>{k.label}</Checkbox>
                                    })}
                                </Form.Item>
                            </Checkbox.Group>
                            {content.map((detail, index) => {
                                let {type, number} = detail;
                                return <span key={index}><span key={index}
                                                               style={{marginLeft: '5px'}}>
                                    {type === 1 ? '单选' : type === 2 ? '多选' :
                                        type === 3 ? '判断' : type === 4 ? '填空' : '问答'}题</span>
                                        <InputNumber min={0} value={number} style={{width: '70px'}}
                                                     onChange={(value) => {
                                                         content[index].number = value;
                                                         this.setState({
                                                             usrPaper: {
                                                                 ...usrPaper,
                                                                 content
                                                             }
                                                         });
                                                     }}/>
                                        <span style={{margin: '0 5px'}}>道</span>
                                </span>
                            })}
                            <div style={{marginTop: "50px"}}>
                                <Button type="primary"
                                        style={{width: "300px", marginLeft: "37%"}}
                                        onClick={() => {
                                            this.handleSubmit()
                                        }}
                                        htmlType="submit">生成</Button>
                            </div>
                        </Panel>
                    </Collapse>

                </div>
            </div>
        </div>
    }
}

export default Question;


// let _template = template.filter(item => {
//     let {category = {}} = item;
//     let ctg = category.sequence;
//     let ret = false;
//     if (!show2) {
//         ret = ctg.endsWith('0000') && ctg.substr(0, 2) === code1;
//     }
//     if (show2 && !show3) {
//         ret = ctg.endsWith('00') && ctg.substr(0, 4) === code2;
//     }
//     if (show2 && show3) {
//         ret = ctg === sequence
//     }
//     return ret;
// });
