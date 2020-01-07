import React from 'react';
import App from "../../common/App"
import {Result, Button} from 'antd';

export default class Success extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return <div style={{width: "100%", height: '100%'}}>
            <div style={{
                margin: '0 auto',
                width: '400px',
                height: '400px',
                position: 'relative',
                top: '50%',
                transform: "translateY(50%)"
            }}>
                <Result
                    status="success"
                    title="你的密码已重置成功"
                    subTitle="这里可以放一排小提示"
                    extra={[
                        <Button type="primary" key="console" onClick={() => {
                            App.go("/login")
                        }}>
                            立刻登录
                        </Button>,
                        <Button key="buy" onClick={()=>{App.go("/")}}>返回首页</Button>,
                    ]}
                />
            </div>
        </div>
    }
}


