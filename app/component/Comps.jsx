import React from 'react'
import {Avatar, Button, Carousel, Comment, Input, List, message, Modal, Dropdown, Menu} from 'antd'
import '../assets/css/comps.scss'
import {App, CTYPE, U, Utils} from "../common";
import UserProfile from "./user/UserProfile";
import NavLink from '../common/NavLink.jsx';

const TextArea = Input.TextArea;

const id_div_free_box = 'id_div_free_box';

const menus = [{
    cn: '首页', path: '/'
},
//     {
//     cn: '题库', path: '/e'
// },
    {
    cn: '练习', path: '/question'
}, {
    cn: '模拟考试', path: '/mockExam'
},
    // {
//     cn: '就业保障', path: '/3'
// }, {
//     cn: '技术交流', path: '/4'
// },
    {
        cn: '关于我们',
        path: '/page/about'
    }];

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {}
        };
    }

    componentDidMount() {
        UserProfile.get().then((profile) => {
            let {user = {}} = profile;
            this.setState({user});
        });
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

        const menu = (
            <Menu>
                <Menu.Item key="1" onClick={() => {
                    App.go('/resetPassword')
                }}>修改密码</Menu.Item>
                <Menu.Item key="2" onClick={() => {
                    this.logout()
                }}>退出登录</Menu.Item>
            </Menu>
        );

        return <div className="top-header">
            <div className="inner">
                <a href='/'>
                    <div className="logo"/>
                </a>

                {!user.id && <div className='btn' onClick={() => App.go('/login')}>登录</div>}
                {/*{user.id && <div className='btn' onClick={() => App.go('/usr/profile')}>个人中心</div>}*/}


                {user.id &&
                <Dropdown className='btn' overlay={menu}>
                    <a className="ant-dropdown-link" onClick={() => App.go('/usr/profile')}>
                        个人中心
                    </a>

                </Dropdown>}

                <ul>
                    {menus.map((menu, index) => {
                        let {key, cn, en, path} = menu;
                        return <li key={index}>
                            <NavLink to={path} cn={cn} en={en}/>
                        </li>
                    })}
                </ul>

            </div>
        </div>

    }
}

class Footer extends React.Component {
    render() {
        return <div className="footer">

            <div className="inner">

                <div className='links'>
                    <div className='uls'>
                        <ul>
                            <li><b>公司介绍</b></li>
                            <li>
                                <a onClick={() => {
                                    App.go('/')
                                }}>关于我们</a>
                            </li>
                            <li>
                                <a onClick={() => {
                                    App.go('/')
                                }}>关于我们</a>
                            </li>
                            <li>
                                <a onClick={() => {
                                }}>关于我们</a>
                            </li>
                        </ul>
                        <ul>
                            <li><b>友情链接</b></li>
                            <li><a href='http://www.baidu.com/' target='_blank'>百度</a></li>
                            <li><a href='http://www.baidu.com/' target='_blank'>百度</a></li>
                            <li><a href='http://www.baidu.com/' target='_blank'>百度</a></li>
                        </ul>
                        <ul style={{width: 450}}>
                            <li><b>联系我们</b></li>
                            <li>电话专线：{CTYPE.contact}</li>
                            <li>办公时间：{CTYPE.worktime}</li>
                            <li>公司地址：{CTYPE.addr_cn}</li>
                        </ul>
                    </div>

                </div>

                <div className='qrcode'>
                    <div className='img'/>
                    <p>扫码关注公众号</p>
                </div>

                <div className="copyright">
                    Copyright © 2018 飞奔的跑跑 ALL Rights Reserved. 豫ICP备18043229号-1
                </div>
            </div>

        </div>
    }
}

class Banners extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            banners: this.props.banners,
            bannerType: this.props.bannerType
        }
    }

    go = (banner) => {
        let {url} = banner;
        if (url) {
            window.location.href = url;
        }
    };

    renderBtn = (type) => {
        if (type === CTYPE.bannerTypes.HOME || type === CTYPE.bannerTypes.SERVICE || type === CTYPE.bannerTypes.REACT_PC) {
            return <div className={`mcbtn mcbtn-${type}`} onClick={() => Utils.namecard.show()}>立即咨询</div>;
        }
    };

    render() {

        let {banners = [], bannerType} = this.state;
        let length = banners.length;

        return <div className='main-carousel'>
            {length > 0 && <Carousel autoplay={length > 1} dots={length > 1}
                                     speed={1000} autoplaySpeed={4000} infinite>
                {banners.map((banner, index) => {
                    let {img, title} = banner;
                    return <div key={index} className='item'>
                        <div className={`item item-${bannerType}`}
                             style={{
                                 backgroundImage: `url(${img})`,
                                 backgroundPosition: '50% 50%',
                                 backgroundRepeat: 'no-repeat'
                             }}
                             onClick={() => {
                                 this.go(banner);
                             }}/>
                    </div>
                })}
            </Carousel>}

            {this.renderBtn(bannerType)}
        </div>
    }
}

class Custevals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: this.props.limit,
            list: []
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {limit = 4} = this.state;
        App.api('/usr/home/custevals', {limit}).then((list) => {
            this.setState({list})
        });
    };

    render() {

        let {list = []} = this.state;

        return <div className='custeval-list'>
            <div className='eval-header'/>
            <ul>
                {list.map((ce, index) => {
                    let {img, title, customer} = ce;
                    return <li key={index} className='item'>
                        <img src={img} className='img'/>
                        <div className='title'>{title}</div>
                        <div className='customer'>{customer}</div>
                    </li>
                })}
            </ul>
            <div className='clearfix-h20'/>
        </div>
    }
}

class FreeBar extends React.Component {

    showBox = () => {
        Utils.common.renderReactDOM(<FreeBox/>, {id: id_div_free_box});
    };

    render() {
        return <div className='free-bar'>
            <div className='inner'>
                <div className='btn' onClick={this.showBox}>立即报名</div>
            </div>
        </div>
    }
}

class FreeBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 2,
            timers: [99, 23, 59, 59]
        };
        this.timerInterval = null;
    }

    componentDidMount() {
        this.startTimer();
        let {id} = this.state;
        App.api('ws/home/qaTemplate', {id}).then((qaTemplate) => {
            this.setState({
                qaTemplate
            });
        });
    }

    valueChanged = (v, index) => {
        let {qaTemplate = {}} = this.state;
        qaTemplate.items[index].value = v;
        this.setState({qaTemplate});
    };

    fillForm = () => {

        let {qaTemplate = {}, id} = this.state;
        let {items = []} = qaTemplate;

        let errs = [];
        items.map((item, index) => {
            let {required, value, question} = item;
            if (required === 1 && (value == null || value.length === 0)) {
                errs.push(question);
            }
        });

        if (errs.length > 0) {
            message.warn('请完善以下信息：' + errs.toString(), 3, null);
            return;
        }

        items.map((item, index) => {
            let {value} = item;
            item.values = [value];
        });

        App.api('ws/home/save_qaPaper', {qaPaper: JSON.stringify({tplId: id, items})}).then(() => {
            message.success('我们会尽快与您联系');
            this.close();
        });
    };

    startTimer = () => {

        this.setState({
            timerInterval: window.setInterval(() => {

                let diff = 1562688000 - new Date().getTime() / 1000;
                if (diff <= 0) {
                    this.setState({
                        timers: [0, 0, 0, 0]
                    });
                    clearInterval(this.timerInterval);
                } else {
                    this.setState({timers: U.date.countdownTimers(diff)});
                }

            }, 1000),
        });
    };

    componentWillUnmount() {
        clearInterval(this.timerInterval);
    }

    close = () => {
        Utils.common.closeModalContainer(id_div_free_box);
    };

    render() {

        let {timers = [99, 23, 59, 59]} = this.state;

        return <div>
            <div className='overlay'/>
            <div className='free-box'>
                <div className='close' onClick={this.close}/>
                <div className='inner'>
                    <ul className='light'>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <div className='center-box'>
                        <div className='timeout'>
                            <div className='txt'>剩余：</div>
                            <div className='label'>{U.date.pad(timers[0])}</div>
                            <div className='txt'>天</div>
                            <div className='label'>{U.date.pad(timers[1])}</div>
                            <div className='txt'>时</div>
                            <div className='label'>{U.date.pad(timers[2])}</div>
                            <div className='txt'>分</div>
                            <div className='label'>{U.date.pad(timers[3])}</div>
                            <div className='txt'>秒</div>
                        </div>
                        <div className='info-box'>
                            <div className='line'>
                                <div className='p'>姓名：</div>
                                <input className='input' placeholder='请输入姓名' onChange={(e) => {
                                    this.valueChanged(e.target.value, 0)
                                }}/>
                            </div>
                            <div className='line'>
                                <div className='p'>手机号：</div>
                                <input className='input' type='number' placeholder='请输入正确手机号，凭手机号领取' onChange={(e) => {
                                    this.valueChanged(e.target.value, 1)
                                }}/>
                            </div>
                        </div>
                        <div className='btn' onClick={this.fillForm}>立即申请</div>
                    </div>
                    <ul className='light'>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
            </div>
        </div>
    }
}

class HtmlContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content,
            _content: '',
        };
    }

    componentDidMount() {
        this.parseContent(this.state.content);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.content === nextProps.content) {
            return;
        }
        this.parseContent(nextProps.content);
        this.setState({
            content: nextProps.content
        });
    }

    parseContent = (content) => {

        let dom = U.htmlstr.html2dom(content || '<div></div>');

        let urls = [];
        let imgs = dom.getElementsByTagName('img');
        for (let i = 0; i < imgs.length; i++) {
            let img = imgs[i];
            let src = img.src;
            if (src.startsWith('http://') || src.startsWith('https://')) {
                if (U.url.getDomainFromUrl(src) !== window.location.host) {
                    urls.push(src);
                }
            }
        }

        this.setState({_content: dom.innerHTML}, () => {
            this.doListener(urls);
        });
    };

    doListener = (urls) => {

        let imgs = document.getElementsByTagName('img');
        for (let i = 0; i < imgs.length; i++) {
            let img = imgs[i];
            let src = img.src;
            if (urls.toString().indexOf(src) > -1) {
                img.onclick = () => {
                    if (img.parentNode.tagName !== 'A') {
                        this.viewImgs(urls, i);
                    }

                };
            }
        }
    };

    viewImgs = (urls, index) => {
        Utils.common.showImgLightbox(urls, index);
    };

    render() {
        let {_content} = this.state;
        return <div className="common-content">
            <div dangerouslySetInnerHTML={{__html: _content}}/>
        </div>;
    }

}

class NameCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    close = () => {
        let e = document.getElementById('div-namecard');
        if (e) {
            document.body.removeChild(e);
        }
    };

    render() {

        return <div>
            <div className="overlay" onClick={() => this.close()}/>
            <div className="namecard-dialog">
                <div className="close" onClick={this.close}/>
                <div className="inner">
                    <div className="card-title">
                        <div className="title">迈道教育</div>
                        <p>加微信号，了解最全信息，获取最新优惠</p></div>
                    <img className="card-qrcode" src={require('../assets/image/common/qrcode.jpg')}/>
                    <div className="tip">微信扫描二维码加好友</div>

                    <div className="tip">招生电话：15021129897</div>
                </div>
            </div>
        </div>;
    }
}

class TrainingProject extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            currentSlide: 0
        };
    }

    componentDidMount() {
        App.api('ws/home/trainingProjects').then((list) => {
            this.setState({list});
        });
    }

    render() {

        let {list = [], currentSlide = 0} = this.state;
        let length = list.length;

        let curr = {};
        if (length > 0) {
            curr = list[currentSlide];
        }

        return <div className='page-block training-project'>
            <div className='inner'>
                <div className='f-title'>超多实战项目，为你一一剖析</div>
                <div className='s-title'>我们的每一个项目都是真实的企业案例，为了让学员能够毕业后跟企业无缝对接</div>


                <div className='carousel-block'>
                    {length > 0 &&
                    <Carousel autoplay={length > 1} dots={length > 1} speed={500} autoplaySpeed={6000} effect="fade"
                              afterChange={(current) => {
                                  this.setState({currentSlide: current});
                              }}>
                        {list.map((item, index) => {
                            let {img} = item;
                            return <div key={index} className='item'>
                                <img src={img}/>
                            </div>
                        })}
                    </Carousel>}

                    <div className='info'>
                        <div className='i-title'>{curr.title}</div>
                        <div className='i-descr'>{curr.descr}</div>
                    </div>

                </div>

            </div>
        </div>
    }
}

class CourseChapters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            course: this.props.course
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({course: nextProps.course})
    }


    go = (id) => {
        window.open(window.location.protocol + '//' + window.location.host + `#/lesson/${id}`);
    };

    render() {

        let {course = {}} = this.state;

        let {chapters = []} = course;

        return <div className='page-block course-chapters'>
            <div className='inner'>

                <div className='f-title'>课程体系大纲</div>

                <div className='course-block'>

                    {chapters.map((chapter, index) => {
                        let {name, classHour, lessonNum, lessons = []} = chapter;

                        return <div className='chapter' key={index}>

                            <div className='tag'>第{U.str.numToChinese(index + 1)}章</div>

                            <div className='box'>
                                <div className='top'>
                                    <div className='title'>{name}</div>
                                    <div className='num'>{lessonNum}节&nbsp;&nbsp;/&nbsp;&nbsp;{classHour}课时</div>
                                </div>

                                <ul className='lessons'>
                                    {lessons.map((lesson, index2) => {
                                        let {id, name, classHour} = lesson;
                                        return <li key={index2}>
                                            <a onClick={() => this.go(id)}>{index2 + 1}&nbsp;.&nbsp;[{classHour}课时]&nbsp;{name}</a>
                                        </li>

                                    })}
                                </ul>

                            </div>
                            <div className='clearfix'/>

                        </div>
                    })}

                </div>

                <div className='clearfix'/>

            </div>
        </div>

    }

}

class Robot extends React.Component {

    comment = () => {
        Utils.common.renderReactDOM(<RobotComment/>);
    };

    render() {
        // return <div className='robot' onClick={this.comment}/>
        return <div className='' onClick={this.comment}/>
    }
}

const id_robot_comment = 'id_robot_comment';

const visitor = {author: '游客', avatar: require('../assets/image/common/avatar_visitor.png')};
const robot = {author: '小迈', avatar: require('../assets/image/common/avatar_maidao.png')};

class RobotComment extends React.Component {

    state = {
        comments: [],
        submitting: false,
        value: '',
        visible: true
    };

    handleSubmit = () => {

        let {value, comments = []} = this.state;

        if (!value) {
            return;
        }

        this.setState({
            submitting: true,
        });

        setTimeout(() => {
            App.api('ws/home/faq_ask', {q: value}).then((faq) => {

                let content = faq.id ? <div dangerouslySetInnerHTML={{__html: faq.content}}/> : <div>
                    <div dangerouslySetInnerHTML={{__html: faq.content}}/>
                    <a onClick={Utils.namecard.show}>联系老师</a>
                </div>;

                comments.push({
                    ...visitor,
                    content: <p>{value}</p>,
                    datetime: U.date.splashTime(new Date().getTime())
                });

                comments.push({
                    ...robot,
                    content,
                    datetime: U.date.splashTime(faq.replyAt)
                });

                this.setState({
                    submitting: false,
                    value: '',
                    comments
                });
                let ele = document.getElementById('div_comments');
                if (ele) {
                    ele.scrollTop = ele.scrollHeight;
                }

            });
        }, 500);

    };

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    close = () => {
        this.setState({visible: false});
        Utils.common.closeModalContainer(id_robot_comment);
    };

    render() {
        const {comments = [], submitting, value, visible} = this.state;
        return <Modal title={'小迈为您解答'}
                      getContainer={() => Utils.common.createModalContainer(id_robot_comment)}
                      visible={visible}
                      width={'800px'}
                      height={'500px'}
                      footer={null}
                      onCancel={this.close}>
            <div className='robot-comment'>
                <div className='comments' id='div_comments'>
                    {comments.length > 0 && <List
                        dataSource={comments}
                        header={null}
                        itemLayout="horizontal"
                        renderItem={props => <Comment {...props} />}/>}
                </div>

                <Comment avatar={<Avatar src={visitor.avatar} alt={visitor.author}/>}
                         content={
                             <div>
                                 <TextArea rows={4} onChange={this.handleChange} value={value}
                                           placeholder='请输入您想得到解答的问题，小迈机器人为您服务'/>
                                 <div className='clearfix-h20'/>
                                 <Button htmlType="submit" loading={submitting} onClick={this.handleSubmit}
                                         style={{float: 'right'}} type="primary">
                                     提交
                                 </Button>
                             </div>
                         }/>
            </div>

        </Modal>
    }
}

export {
    Header,
    Footer,
    Banners,
    Custevals,
    FreeBar,
    FreeBox,
    HtmlContent,
    NameCard,
    TrainingProject,
    CourseChapters,
    Robot, RobotComment
}