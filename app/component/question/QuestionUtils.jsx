import React from 'react';
import {Utils} from "../../common";
import Question from "./Question";


let QuestionUtils = (() => {
    let edit = (question, loadDate) => {
        Utils.common.renderReactDOM(<Question question={question} loadData={loadDate}/>)
    };
    return {
        edit
    }
})();


export default QuestionUtils;