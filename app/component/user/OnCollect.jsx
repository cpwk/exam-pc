import React, {Component} from 'react';
import {Icon, Rate} from "antd";
import {App, U} from "../../common";

class OnCollect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collect: {},
        };
    }

    componentDidMount() {
    }

    handleSubmit = () => {
        let {collect = {}} = this.state;
        App.api('/usr/collect/save', {
            collect: JSON.stringify(collect)
        }).then(() => {
            message.success("操作成功");
        })
    };

    render() {
        let {collect = {}} = this.state;
        let {status} = collect;
        return <div className="top-header">
            <Rate style={{fontSize: 14}} allowClear={true} count={1} value={status} onChange={(status) => {
                this.setState({
                    collect: {
                        ...collect,
                        status
                    }
                }, () => {
                    this.handleSubmit()
                })
            }}/>
        </div>

    }
}

export default OnCollect;