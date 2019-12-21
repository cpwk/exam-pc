import React from 'react';
import {Utils} from "../../common";
import MockExam from "./MockExam";


let MockExamUtils = (() => {
    let edit = (mockExam, loadDate) => {
        Utils.common.renderReactDOM(<MockExam mockExam={mockExam} loadData={loadDate}/>)
    };
    return {
        edit
    }
})();


export default MockExamUtils;

