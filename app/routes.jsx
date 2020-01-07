import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom'


import HomeWrap from './component/HomeWrap';
import Login from "./component/login/Login";
import ResetPassword from "./component/login/ResetPassword";
import Success from "./component/login/Success";
import UserSignUp from "./component/login/UserSignUp";
import Question from "./component/question/Question";
import QuestionPractice from "./component/question/QuestionPractice";
import MockExam from "./component/mockExam/MockExam";
import MockExamEdit from "./component/mockExam/MockExamEdit";

//
import Profile from './component/user/Profile'
import UserWrap from './component/UserWrap'
import PracticeRecord from "./component/user/PracticeRecord";
import ExamDetails from "./component/user/ExamDetails";
import Mistakes from "./component/user/Mistakes";
import Collect from "./component/user/Collect";
import Home from "./component/page/Home";
// import About from "./component/page/About";


const routes = (
    <HashRouter>
        <Switch>

            <Route path='/login' component={Login}/>
            <Route path='/resetPassword' component={ResetPassword}/>
            <Route path='/success' component={Success}/>
            <Route path='/userSignUp' component={UserSignUp}/>


            <Route path='/usr' children={() => (
                <UserWrap>
                    <Route path='/usr/profile' component={Profile}/>
                    <Route path='/usr/record/:id' component={PracticeRecord}/>
                    <Route path='/usr/mistakes/:id' component={Mistakes}/>
                    <Route path='/usr/collect/:id' component={Collect}/>
                    <Route path='/usr/msgs' component={Profile}/>
                    <Route path='/usr/examDetails/:id' component={ExamDetails}/>
                </UserWrap>)}>
            </Route>

            <Route path='/' children={() => (
                <HomeWrap>
                    <Switch>
                        <Route path='/question' exact component={Question}/>
                        <Route path='/app/question/questionPractice/:str' exact component={QuestionPractice}/>
                        <Route path='/mockExam' exact component={MockExam}/>
                        <Route path='/app/mockExam/mockExamEdit/:id' exact component={MockExamEdit}/>
                        <Route path='/' exact component={Home}/>
                        {/*<Route path='/page/about' exact component={About}/>*/}
                    </Switch>
                </HomeWrap>
            )}>
            </Route>

        </Switch>
    </HashRouter>
);


export default routes;
