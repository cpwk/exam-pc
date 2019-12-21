import React from 'react';

import {BackTop, LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import '../assets/css/common.scss'
import '../assets/css/page/home-wrap.scss'
import {Utils} from "../common";
import {Footer, Header, Robot} from "./Comps";

export default class HomeWrap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        window.addEventListener('hashchange', () => {
            setTimeout(() => {
                Utils.common.scrollTop();
            }, 500);
        });
    }

    scrollTop = () => {
        let x = document.body.scrollTop || document.documentElement.scrollTop;
        let timer = setInterval(function () {
            x = x - 100;
            if (x < 100) {
                x = 0;
                window.scrollTo(x, x);
                clearInterval(timer);
            }
            window.scrollTo(x, x);
        }, 20);
    };

    render() {
        return <LocaleProvider locale={zhCN} style={{height: '100%'}}>
            <div className='home-wrap'>
                <Header/>
                <div className='inner-page'>
                    {this.props.children}
                </div>
                <Footer/>
                <Robot/>
                <BackTop/>
            </div>
        </LocaleProvider>
    }
}

