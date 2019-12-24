import React from 'react';
import {Input, Form, Select, Carousel, Icon, message, InputNumber} from 'antd';
import App from "../../common/App"
import "../../assets/css/common/user_sign_up.less"
import {CTYPE, U} from "../../common";

const {Option} = Select;

export default class UserSignUp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorUserName: 1,
            errorPassword: 1,
            see: 1,
            user: {},
            key: 0,
            vCode: '',
            accountType: 1,
            account: ''
        }
    }

    handleSubmit = () => {
        let {user, vCode, key, accountType} = this.state;
        let {code} = vCode;
        let {mobile} = user;
        App.api('/usr/signup', {
            user: JSON.stringify(user),
            vCode: JSON.stringify({key, accountType, code, account: mobile})
        }).then(() => {
            message.success('注册成功');
            App.go('/success')
        })
    };

    send = () => {
        let {key, user, accountType} = this.state;
        let {mobile} = user;
        if (!U.str.isChinaMobile(mobile)) {
            message.warn("请输入手机号码")
        } else {
            key = Date.now();
            App.api("/send/file", {
                vCode: JSON.stringify({key, account: mobile, accountType})
            }).then(() => {
                message.success("发送成功");
                this.setState({key});
            })
        }
    };

    render() {

        let {vCode, user = {}, see, errorPassword, tipsName, errorUserName} = this.state;
        let {name, password, username, mobile} = user;
        let {code} = vCode;
        return <div className="page_signup">
            <div className="signup-img">
                <Carousel autoplay style={{width: "100%", height: "100%"}}>
                    <div className="box">
                        <img src="../../assets/img/hu.jpeg" className="lbt"/>
                    </div>
                    <div className="box">
                        <img src="../../assets/img/li.jpeg" className="lbt"/>
                    </div>
                    <div className="box">
                        <img src="../../assets/img/tu.jpeg" className="lbt"/>
                    </div>
                </Carousel>
                <div className="logo"/>
            </div>

            <div className="signup">
                <div className="signup-top">
                    <a href="">登录</a>
                    <span></span>
                    <a href="">意见反馈</a>
                </div>
                <Form.Item {...CTYPE.formItemLayout}>
                    <h1>欢迎注册BiuBiu</h1>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout}>
                    <h2>开启Biu之旅</h2>
                </Form.Item>

                <Form.Item {...CTYPE.formItemLayout} required="true" label="用户名">
                    <Input value={username} placeholder="请输入用户名6-12位"
                           onBlur={(e) => {
                               if (e.target.value.length === 0) {
                                   this.setState({errorUserName: 0});
                               } else {
                                   this.setState({errorUserName: 1})
                               }
                           }}
                           onChange={(e) => {
                               this.setState({
                                   user: {
                                       ...user,
                                       username: e.target.value
                                   }
                               })
                           }}/>
                    {
                        errorUserName === 0 && <div className="error">
                            <Icon type="close-circle" theme="twoTone" twoToneColor="red"/>
                            用户名不可以为空
                        </div>
                    }
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="手机号">
                    <Input max={11} value={mobile} placeholder="请输入手机号"
                           onBlur={(e) => {
                               if (e.target.value.length === 0) {
                                   this.setState({see: 1});
                               }
                           }}
                           onChange={(e) => {
                               this.setState({
                                   see: 0,
                                   user: {
                                       ...user,
                                       mobile: e.target.value
                                   }
                               })
                           }}/>
                </Form.Item>
                {
                    see === 0 && <div className="a">
                        <Form.Item {...CTYPE.formItemLayout} required="true" label="验证码">
                            <Input value={code} style={{width: "250px"}} placeholder="短信验证码"
                                   onChange={(e) => {
                                       this.setState({
                                           vCode: {
                                               ...vCode,
                                               code: e.target.value
                                           }
                                       })
                                   }}/>
                            <div className="b">
                                <a onClick={() => {
                                    this.send()
                                }}>发送验证码</a>
                            </div>
                        </Form.Item>
                    </div>
                }
                <Form.Item {...CTYPE.formItemLayout} required="true" label="密码">
                    <Input value={password} type="password" placeholder="请输入密码"
                           onFocus={() => {
                               this.setState({tipsName: 2, errorPassword: 1})
                           }}
                           onBlur={(e) => {
                               this.setState({tipsName: 1});
                               if (e.target.value.length === 0) {
                                   this.setState({errorPassword: 0});
                               }
                           }}
                           onChange={(e) => {
                               this.setState({
                                   user: {
                                       ...user,
                                       password: e.target.value
                                   }
                               })
                           }}/>
                    {tipsName === 2 && <div className="tips">
                        <Icon type="exclamation-circle" theme="twoTone" twoToneColor="#00BC19"/>
                        长度为6~18位的字符
                    </div>}
                    {errorPassword === 0 && <div className="error">
                        <Icon type="close-circle" theme="twoTone" twoToneColor="red"/>
                        密码不可以为空
                    </div>}
                </Form.Item>

                <div className="signup-sign"><a onClick={() => {
                    this.handleSubmit()
                }}>立即注册</a></div>
            </div>
        </div>
    }
}