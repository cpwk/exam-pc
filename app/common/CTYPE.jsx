let CTYPE = (() => {

    return {

        addr_cn: '河南郑州市新郑市龙湖镇华南城电商大厦B座303',
        worktime: '周一至周五 9:30-18:00',
        contact: '跑跑13213158880',

        displayType: ['单选题', '多选题', '判断题', '填空题', '问答题'],

        options: [{type: 1, label: '单选'}, {type: 2, label: '多选'}, {type: 3, label: '判断'},
            {type: 4, label: '填空'}, {type: 5, label: '问答'}],

        difficulty: ['简单', '一般', '困难'],

        ABC: ["A", "B", "C", "D", "E"],

        judge: [{id: "1", label: '对'}, {id: "2", label: '错'}],

        pagination: {pageSize: 10},

        commonPagination: {showQuickJumper: true, showSizeChanger: true, showTotal: total => `总共 ${total} 条`},

        bannerTypes: {HOME: 1, JAVA_PRY: 3, JAVA_ADV: 5, SERVICE: 7, REACT_PC: 9, ABOUT_PC: 11},


        //图片裁切工具比例
        imgeditorscale: {
            square: 1,
            rectangle_v: 1.7778,
            rectangle_h: 0.5625,
        },


        dialogItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        formItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 3},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },

    }

})();

export default CTYPE;