import React, {Component} from 'react';
import {Button, Collapse, Form, message, Modal, Radio, Rate} from "antd";
import "../../assets/css/question/exam.less"
import {App, CTYPE, Utils} from "../../common";

const {Panel} = Collapse;
const desc = ['简单', '一般', '困难'];

class MockExam extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            template: [],
            templateId: 0,
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 1,
                total: 0,
            },
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        App.api('/usr/category/category_level').then((list) => {
            this.setState({list});
        });
        let {pagination} = this.state;
        App.api('/usr/template/template_list', {
            templateQo: JSON.stringify({
                pageNumber: pagination.current,
                pageSize: 30,
                status: 1
            })
        }).then((template) => {
            let pagination = Utils.pager.convert2Pagination(template);
            this.setState({
                template: template.content,
                pagination
            });
        })
    };

    edit = () => {
        let {templateId} = this.state;
        let id = templateId;
        if (id === 0) {
            message.warn("请选择模板")
        } else {
            App.go(`/app/mockExam/mockExamEdit/${id}`);
        }
    };

    render() {
        let {list = [], template = [], templateId, sequence = ''} = this.state;

        let code1, code2;
        let show2 = false;
        let show3 = false;
        if (sequence.length === 6) {
            if (sequence.endsWith('0000')) {
                show2 = true;
            } else if (sequence.endsWith('00')) {
                show2 = true;
                show3 = true;
            } else {
                show2 = true;
                show3 = true;
            }

            code1 = sequence.substr(0, 2);
            code2 = sequence.substr(0, 4);

        }

        let _template = template.filter(item => {
            let {category = {}} = item;
            let ctg = category.sequence;
            let ret = false;
            if (!show2) {
                ret = ctg.endsWith('0000') && ctg.substr(0, 2) === code1;
            }
            if (show2 && !show3) {
                ret = ctg.endsWith('00') && ctg.substr(0, 4) === code2;
            }
            if (show2 && show3) {
                ret = ctg === sequence
            }
            return ret;
        });

        return <div className="page-width">
            <div className="page-top">
                <Collapse className="page-collapse-bottom" expandIconPosition="right"
                          defaultActiveKey={['1']}
                          onChange={this.callback}>
                    <Panel header="模板筛选" key={'1'}>

                        <Form.Item {...CTYPE.formItemLayout} required="true" label="按课程筛选">
                            <Radio.Group style={{width: '100%'}} value={code1 + '0000'}
                                         onChange={(vs) => {
                                             this.setState({
                                                 sequence: vs.target.value,
                                             })
                                         }}>
                                {list.map((v, index) => {
                                    if (v.sequence.endsWith('0000')) {
                                        return <Radio value={v.sequence} key={index}>{v.name}</Radio>
                                    }
                                })}
                            </Radio.Group>
                        </Form.Item>
                        {show2 &&
                        <Radio.Group style={{width: '100%'}} value={code2 + '00'}
                                     onChange={(vs) => {
                                         this.setState({
                                             sequence: vs.target.value,
                                         })
                                     }}>
                            <Form.Item {...CTYPE.formItemLayout} label="章节">
                                {list.map((v, index) => {
                                    if (v.sequence.startsWith(code1) && !v.sequence.endsWith('0000') && v.sequence.endsWith('00')) {
                                        return <Radio value={v.sequence} key={index}>{v.name}</Radio>
                                    }
                                })}</Form.Item>
                        </Radio.Group>}
                        {show3 &&
                        <Radio.Group style={{width: '100%'}} value={sequence}
                                     onChange={(vs) => {
                                         this.setState({
                                             sequence: vs.target.value,
                                         })
                                     }}>
                            <Form.Item {...CTYPE.formItemLayout} label="小节">
                                {list.map((v, index) => {
                                    if (v.sequence.startsWith(code2) && !v.sequence.endsWith('00')) {
                                        return <Radio value={v.sequence} key={index}>{v.name}</Radio>
                                    }
                                })}</Form.Item>
                        </Radio.Group>}
                        {sequence !== '' &&
                        <Form.Item {...CTYPE.formItemLayout} required="true" label="模板选择">
                            <Radio.Group style={{width: '100%'}} value={templateId}
                                         onChange={(e) => {
                                             this.setState({
                                                 templateId: e.target.value,
                                             });
                                         }}>
                                {_template.map((t, index) => {
                                    return <Radio key={index} value={t.id}>{t.templateName}</Radio>
                                })}
                            </Radio.Group>
                        </Form.Item>}
                        <div style={{marginTop: "50px"}}>
                            <Button type="primary"
                                    style={{width: "300px", marginLeft: "37%"}}
                                    onClick={() => {
                                        this.edit()
                                    }}
                                    htmlType="submit">试卷生成</Button>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        </div>
    }
}

export default MockExam;
