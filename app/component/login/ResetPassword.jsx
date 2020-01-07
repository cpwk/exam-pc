import React from 'react';
import {Form, Input, Button, Tabs, message, Icon} from 'antd';
import {CTYPE, U} from "../../common";
import App from "../../common/App";
import "../../assets/css/common/tabs.less"

const {TabPane} = Tabs;

export default class ResetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            vCode: {},
            key: 0,
            user: {},
            current: 0,
            accountType: 1,
            type: 1,
        }
    }

    componentDidMount() {
    }

    callback = (key) => {
        this.setState({type: parseInt(key), user: {}, vCode: {}})
    };


    handleSubmit = () => {
        let {user, vCode, key, accountType} = this.state;
        let {username} = user;
        this.setState({username});
        let {code} = vCode;
        accountType === 1 ? user.email = null : user.mobile = null;
        App.api('/usr/resetPassword', {
            user: JSON.stringify(user),
            vCode: JSON.stringify({accountType, account: username, code, key})
        }).then(() => {
            message.success('修改成功');
            // this.setState({key});
            App.logout();
            App.go('/success')
        })
    };

    send = () => {
        let {key, user, accountType} = this.state;
        let {username} = user;
        this.setState({username});
        key = Date.now();
        App.api("/send/file", {vCode: JSON.stringify({key, account: username, accountType})}).then(() => {
            message.success("发送成功");
            this.setState({key});
        })
    };


    render() {
        let {vCode, user, type} = this.state;
        let {code} = vCode;
        let {username, password} = user;
        return <div className="reset">
            <div className="reset-header">
                <ul className="header-left">
                    <li><a href="">首页</a></li>
                    <li><span></span></li>
                    <li><a href="">首页</a></li>
                    <li><span></span></li>
                    <li><a href="">首页</a></li>
                </ul>
                <ul className="header-right">
                    <li><a href="">首页</a></li>
                    <li><span></span></li>
                    <li><a href="">首页</a></li>
                    <li><span></span></li>
                    <li><a href="">首页</a></li>
                </ul>
            </div>
            <div className="reset-model">
                <Tabs defaultActiveKey={1} onChange={this.callback} className="reset-tabs">
                    <TabPane tab="通过手机号码修改" key={1}/>
                    <TabPane tab="通过邮箱修改" key={2}/>
                </Tabs>
                <div className="reset-content">
                    <Form.Item label={type === 1 ? '手机' : '邮箱'} {...CTYPE.formItemLayout} required>
                        <Input value={username} placeholder={type === 1 ? "请输入手机号码" : "请输入邮箱号码"}
                               prefix={<Icon type={type === 1 ? "mobile" : "mail"}/>}
                               onChange={(e) => {
                                   this.setState({
                                       user: {
                                           ...user,
                                           username: e.target.value
                                       }
                                   })
                               }}
                        />
                    </Form.Item>
                    <Form.Item label='验证码' {...CTYPE.formItemLayout} required>
                        <Input value={code} style={{width: '350px'}} placeholder="请输入验证码" onChange={(e) => {
                            this.setState({
                                vCode: {
                                    code: e.target.value
                                }
                            })
                        }}/>
                        <Button className="reset-send" type='primary' htmlType='submit' onClick={() => {
                            this.send();
                        }}>
                            发送验证码</Button>
                    </Form.Item>
                    <Form.Item label='密码' {...CTYPE.formItemLayout} required>
                        <Input.Password type='password' value={password} placeholder="请输入新密码"
                                        prefix={<Icon type="lock"/>}
                                        onChange={(e) => {
                                            this.setState({
                                                user: {
                                                    ...user,
                                                    password: e.target.value
                                                }
                                            })
                                        }}
                                        onPressEnter={() => {
                                            this.handleSubmit();
                                        }}/>
                    </Form.Item>
                    <div className="reset-bottom">
                        <Button type="primary" htmlType="submit" style={{
                            display: 'block', margin: '0 0 0 260px', width: '200px'
                        }} onClick={() => {
                            this.handleSubmit()
                        }}>
                            确认
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    }
}


