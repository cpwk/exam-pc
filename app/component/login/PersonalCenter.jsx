import React from 'react';
import {Button, Input, Radio, Form, DatePicker, Avatar, message, Modal, Icon} from "antd";
import {CTYPE, App, U} from "../../common";
import {PosterEdit} from "../../common/update/CommonEdit";
import "../../assets/css/common/personal.less";

import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');


export default class PersonalCenter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            show_edit: false,
            display: false,
            time: Date.now()
        }
    }

    componentDidMount() {
        let user = JSON.parse(App.getCookie("user" || {}));
        this.setState({user});
        console.log(user);
        console.log(user.avatar)
        // this.loadData();
    }

    // loadData = () => {
    //     let user = App.getAdmProfile();
    //     App.api("/user/findId", {id: user.id}).then((user) => {
    //         this.setState({
    //             user: user,
    //         });
    //     });
    // };

    handleSubmit = () => {
        let {user} = this.state;
        App.api('/user/update_personal', {
            user: JSON.stringify(user),
        }).then((result) => {
            App.afterSignin("user", JSON.stringify(result.user));
            console.log(user.name);
            message.success('已保存');
            window.history.back();
        });
    };

    syncPoster = (avatar) => {
        let {user = {}} = this.state;
        this.setState({
            user: {
                ...user,
                avatar
            }
        });
    };

    showEdit = (val) => {
        this.setState({show_edit: val || false});
    };
    showEdit1 = (val) => {
        this.setState({display: val || false});
    };

    edit = () => {
        this.setState({show_edit: true});
    };

    edit1 = () => {
        this.setState({display: true})
    };

    render() {
        let {show_edit = false, display = false, user, time} = this.state;
        let {name, details, birth, avatar, username, sex} = user;
        let _time = U.date.format(new Date(time), 'yyyy');
        let __birth = U.date.format(new Date(birth), 'yyyy');
        let __time = (_time - __birth);
        let _sex = sex === 1 ? "男" : "女";
        let _birth = birth ? moment(new Date(birth), 'YYYY-MM-DD') : null;
        return <div className="personal">
            <div className="personal-content">
                <div className="personal-side">
                    <div className="personal-top">
                        <Button type='primary' onClick={() => {
                            App.go('/app/page/portal')
                        }}>返回</Button>
                    </div>
                    <div className="side-right">
                        <div className="side-bac">
                            <div className="side-shadow">
                                <Avatar size={64}
                                        src={avatar}/>
                            </div>
                        </div>
                        <div className="side-top">
                            <a type='primary' onClick={() => this.edit()}>点击修改</a>
                        </div>
                    </div>
                </div>
                <div className="personal-right">
                    <div style={{marginBottom: "30px"}}>
                        <span><h2>基础资料</h2><a onClick={() => {
                            this.edit1()
                        }}><Icon type="edit"/>编辑</a></span>
                        <div style={{marginTop: "10px"}}>
                            <span><h3>用户名:</h3><span>{username}</span></span>
                        </div>
                    </div>
                    <Form.Item {...CTYPE.formItemLayout} label="姓名">
                        <div>{name}</div>
                    </Form.Item>
                    <Form.Item {...CTYPE.formItemLayout} label="性别">
                        <div>{_sex}</div>
                    </Form.Item>
                    <Form.Item {...CTYPE.formItemLayout} label='年龄'>
                        <div>{__time}</div>
                    </Form.Item>
                    <Form.Item {...CTYPE.formItemLayout} label="介绍">
                        <div>{details}</div>
                    </Form.Item>
                </div>
                <Modal title={'修改资料'}
                       visible={display}
                       width={'500px'}
                       okText='提交'
                       onOk={this.handleSubmit}
                       onCancel={() => this.showEdit1()}>
                    <Form.Item {...CTYPE.formItemLayout} label="姓名">
                        <Input value={name} onChange={(e) => {
                            this.setState({
                                user: {
                                    ...user,
                                    name: e.target.value
                                }
                            })
                        }}/>
                    </Form.Item>
                    <Form.Item {...CTYPE.formItemLayout} label="性别">
                        <Radio.Group defaultValue={1} value={sex}>
                            <Radio value={1} onChange={(e) => {
                                this.setState({
                                    user: {
                                        ...user,
                                        sex: e.target.value
                                    }
                                })
                            }}>男</Radio>
                            <Radio value={2} onChange={(e) => {
                                this.setState({
                                    user: {
                                        ...user,
                                        sex: e.target.value
                                    }
                                })
                            }}>女</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item {...CTYPE.formItemLayout} label='出生日期'>
                        {/*日期时间*/}
                        <DatePicker
                            showTime
                            showToday={false}
                            allowClear={false}
                            format="YYYY-MM-DD"
                            placeholder="请选择出生年月"
                            value={_birth}
                            onChange={(v) => {
                                this.setState({
                                    user: {
                                        ...user,
                                        birth: v.valueOf()
                                    }
                                })
                            }}
                            onOk={(v) => {
                                this.setState({
                                    user: {
                                        ...user,
                                        birth: v.valueOf()
                                    }
                                })
                            }}/>
                    </Form.Item>
                    <Form.Item {...CTYPE.formItemLayout} label="介绍">
                        <Input value={details} onChange={(e) => {
                            this.setState({
                                user: {
                                    ...user,
                                    details: e.target.value
                                }
                            })
                        }}/>
                    </Form.Item>
                </Modal>
                <Modal title={'修改头像'}
                       visible={show_edit}
                       width={'500px'}
                       okText='提交'
                       onOk={this.handleSubmit}
                       onCancel={() => this.showEdit()}>
                    <PosterEdit type='h' img={avatar} required={true} syncPoster={this.syncPoster}/>
                </Modal>
            </div>
        </div>
    }
}

