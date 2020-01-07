import React from 'react';

import {Card, Icon, ConfigProvider, Menu, Modal} from 'antd';
import {Link} from 'react-router-dom';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import '../assets/css/common.scss'
import '../assets/css/page/home-wrap.scss'
import '../assets/css/trainee/trainee-wrap.scss'

import {App} from '../common'
import {Footer, Header} from "./Comps";

const SubMenu = Menu.SubMenu;

export default class UserWrap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {}
        }
    }

    componentDidMount() {
        let user = App.getUserProfile();
        this.setState({user});
    }

    logout = () => {
        Modal.confirm({
            title: '确定要退出吗?',
            content: null,
            onOk() {
                App.logout();
                App.go('/');
            },
            onCancel() {
            },
        });
    };

    render() {
        let {user = {}} = this.state;
        return <ConfigProvider locale={zhCN} style={{height: '100%'}}>
            <div className='home-wrap trainee-wrap'>
                <Header/>

                <div className='inner-content'>
                    <Card
                        // title={<BreadcrumbCustom
                        //     first={<Link to={'/usr/profile'}>个人中心</Link>}/>}
                        className='main-content'>
                        {this.props.children}
                    </Card>
                    <div className='left-menu'>

                        <Menu mode='inline' theme='light' className="right-menu">
                            <Menu.Item>
                                <Link to={'/usr/profile'}><Icon type="home"/><span
                                    className="nav-text">个人中心</span></Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to={`/usr/Record/${user.id}`}><Icon type="file-pdf"/><span
                                    className="nav-text">我的记录</span></Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to={`/usr/collect/${user.id}`}><Icon type="file-pdf"/><span
                                    className="nav-text">收藏夹</span></Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to={`/usr/mistakes/${user.id}`}><Icon type="file-pdf"/><span
                                    className="nav-text">错题本</span></Link>
                            </Menu.Item>
                            {/*<Menu.Item>*/}
                            {/*    <a onClick={this.logout}><Icon type="logout"/><span*/}
                            {/*        className="nav-text">注销</span></a>*/}
                            {/*</Menu.Item>*/}
                        </Menu>

                    </div>
                </div>
                <Footer/>
            </div>
        </ConfigProvider>
    }
}
