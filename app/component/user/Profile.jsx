import React from 'react';
import UserProfile from "./UserProfile";
import {App, U, CTYPE} from "../../common";
import '../../assets/css/trainee/profile.scss'
import {Modal, Icon, Form, Radio, Input, Select, Card, Button, message, Avatar} from "antd";
import KvStorage from "../../common/KvStorage";
import {PosterEdit} from "../../common/update/CommonEdit";


export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: {},
            display: false,
            show_edit: false,
        };
    }

    componentDidMount() {
        U.setWXTitle('个人中心');
        UserProfile.get().then((profile) => {
            let {user = {}} = profile;
            this.setState({user});
        });
    };

    handleSubmit = () => {
        let {user} = this.state;
        App.api('/usr/modify_profile', {
            user: JSON.stringify(user),
        }).then((result) => {
            let {user = {}, userSession = {}} = result;
            KvStorage.set('user-profile', JSON.stringify(user));
            KvStorage.set('user-token', userSession.token);
            message.success("修改成功");
            this.showEdit();
            this.showEdit1();
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

    syncPoster = (avatar) => {
        this.setState({
            user: {
                ...this.state.user,
                avatar
            }
        });
    };

    render() {
        let {show_edit = false, user = {}, display = false} = this.state;

        let {avatar, username, mobile, email} = user;

        return <div className="profile-page">

            <div className='block-title'>
                <span style={{}}>个人中心</span>
                <Button type="primary" style={{float: "right"}} onClick={() => {
                    this.edit1()
                }} htmlType="submit"><Icon type="edit"/>编辑</Button>
            </div>
            <div>
                <div className='profile'>
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
                    <ul className='info'>
                        <li>
                            姓名：{username}
                        </li>
                        <li>
                            手机号：{mobile}
                        </li>
                        <li>
                            邮箱：{email}
                        </li>
                    </ul>
                </div>
            </div>
            <Modal title={'修改头像'}
                   visible={show_edit}
                   width={'500px'}
                   okText='提交'
                   onOk={this.handleSubmit}
                   onCancel={() => this.showEdit()}>
                <PosterEdit type='s' img={avatar} required={true} syncPoster={this.syncPoster}/>
            </Modal>
            <Modal title={'修改资料'}
                   visible={display}
                   width={'500px'}
                   okText='提交'
                   onOk={this.handleSubmit}
                   onCancel={() => this.showEdit1()}>
                <Form.Item {...CTYPE.formItemLayout} label="姓名">
                    <Input value={username} onChange={(e) => {
                        this.setState({
                            user: {
                                ...user,
                                username: e.target.value
                            }
                        })
                    }}/>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} label="手机">
                    <Input value={mobile} onChange={(e) => {
                        this.setState({
                            user: {
                                ...user,
                                mobile: e.target.value
                            }
                        })
                    }}/>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} label="邮箱">
                    <Input value={email} onChange={(e) => {
                        this.setState({
                            user: {
                                ...user,
                                email: e.target.value
                            }
                        })
                    }}/>
                </Form.Item>
            </Modal>

        </div>
    }
}