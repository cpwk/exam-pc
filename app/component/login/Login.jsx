import React from "react";
import {Tabs, Input, message, Icon, Button, Row, Col} from "antd";
import {U} from "../../common";
import App from "../../common/App";
import "../../assets/css/common/userlogin.less";
import KvStorage from "../../common/KvStorage";


const {TabPane} = Tabs;

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            vCode: {},
            key: 0,
            type: 1
        }
    }

    componentDidMount() {
        this.genValCode();
        //未授权从index被拦截回login时清除loading效果
        message.destroy();
    }

    handleSubmit = () => {
        let {user, key, accountType, vCode} = this.state;
        let {code} = vCode;
        let {username} = user;
        App.api('/usr/signin', {
            user: JSON.stringify(user),
            vCode: JSON.stringify({key, account: username, code, accountType})
        }).then((result) => {
            let {user = {}, userSession = {}} = result;
            KvStorage.set('user-profile', JSON.stringify(user));
            KvStorage.set('user-token', userSession.token);
            message.success('登录成功');
            App.go('/usr/profile');
        })
    };

    submit = () => {
        let {key, user, accountType} = this.state;
        let {username} = user;
        if (U.str.isChinaMobile(username)) {
            this.setState({accountType: 1});
        } else if (U.str.isEmail(username)) {
            this.setState({accountType: 2});
        } else {
            this.setState({accountType: 3})
        }
        key = Date.now();
        App.api("/send/file", {
            vCode: JSON.stringify({key, account: username, accountType})
        }).then(() => {
            message.success("发送成功");
            this.setState({key});
        })
    };

    genValCode = () => {
        let key = new Date().getTime();
        this.setState({
            img_src: App.API_BASE + '/common/gen_valCode_signin?key=' + key,
            key: key,
            vCode: {}
        });
    };

    callback = (key) => {
        if (key == 1) {
            this.genValCode()
        }
        this.setState({type: parseInt(key), user: {}, vCode: {}})
    };

    render() {
        let {user, vCode, type} = this.state;
        let {username, password} = user;
        let {code} = vCode;

        let {img_src} = this.state;

        return <div className="bac">
            <div className="bac-content">
                <div>
                    <Tabs defaultActiveKey={1} onChange={this.callback}>
                        <TabPane tab="账号登录" key={1}/>
                        <TabPane tab="免密码登录" key={2}/>
                    </Tabs>
                </div>
                <div className="bac-high">
                    <div>
                        <Input value={username}
                               placeholder={type === 1 ? "请输入用户名" : "手机号码/邮箱"}
                               prefix={<Icon type={type === 1 ? "user" : "user"}/>}
                               onChange={(e) => {
                                   this.setState({
                                       user: {
                                           ...user,
                                           username: e.target.value
                                       }
                                   })
                               }}
                        />
                    </div>
                    {type !== 1 ?
                        <div>
                            <Input style={{width: "65%"}} value={code} placeholder="请输入验证码"
                                   onChange={(e) => {
                                       this.setState({
                                           vCode: {
                                               ...vCode,
                                               code: e.target.value
                                           }
                                       })
                                   }}/>
                            <Button style={{width: "30%", float: 'right'}} type='primary' htmlType='submit'
                                    onClick={() => {
                                        this.submit()
                                    }}>
                                发送验证码</Button>
                        </div>
                        :
                        <div>
                            {type === 1 &&
                            <Input.Password value={password} placeholder="请输入密码" maxLength="18"
                                            prefix={<Icon type="lock"/>}
                                            onChange={(e) => {
                                                this.setState({
                                                    user: {
                                                        ...user,
                                                        password: e.target.value
                                                    }
                                                })
                                            }}/>
                            }
                            <Row>
                                <Input value={code} placeholder="验证码" style={{width: '65%'}} onChange={(e) => {
                                    this.setState({
                                        vCode: {
                                            ...vCode,
                                            code: e.target.value
                                        }
                                    })
                                }}/>
                                <img style={{marginLeft: "12px", width: "30%", height: "33px"}} src={img_src}
                                     onClick={this.genValCode}/>
                            </Row>
                        </div>
                    }
                    <Row>
                        <Col span={20}>没有账号
                            <a onClick={() => {
                                App.go('/userSignUp')
                            }}>点击注册</a>
                        </Col>
                        <Col span={4}>
                            <a onClick={() => {
                                App.go('/resetPassword')
                            }}>忘记密码</a>
                        </Col>
                    </Row>

                    <div>
                        <Button className="bac-bottom" type="primary" htmlType="submit" onClick={() => {
                            this.handleSubmit()
                        }}>登录</Button>
                    </div>

                </div>
            </div>
        </div>
    }
}


// https://static.zhihu.com/heifetz/assets/sign_bg.db29b0fb.png