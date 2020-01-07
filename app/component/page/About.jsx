import React, {Component} from 'react';
import "../../assets/css/page/about.scss"
import {Button, Form, Input} from "antd";

class About extends Component {
    render() {
        return <div className="box">

            <div className="box box-primary">
                <div className="box-header with-border">
                    <h3 className="box-title">Quick Example</h3>
                </div>
                <Form role="form">
                    <div className="box-body">
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <Input type="email" className="form-control" id="exampleInputEmail1"
                                   placeholder="Enter email"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <Input type="password" className="form-control" id="exampleInputPassword1"
                                   placeholder="Password"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputFile">File input</label>
                            <input type="file" id="exampleInputFile"/>

                                <p className="help-block">Example block-level help text here.</p>
                        </div>
                        <div className="checkbox">
                            <label>
                                <Input type="checkbox"/> Check me out
                            </label>
                        </div>
                    </div>
                    <div className="box-footer">
                        <Button type="submit" className="btn btn-primary">Submit</Button>
                    </div>
                </Form>
            </div>

            </div>
    }
}

export default About;