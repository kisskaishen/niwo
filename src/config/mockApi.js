import Mock from 'mockjs'
let Random = Mock.Random;
Mock.setup({
    timeout: '200-600' // 响应时间
})

// 配置API接口地址
let example = {
    getData: function(args, data = {}) {
        if (args.ret == 0) {
            return Mock.mock(apiUrl + args.url, {
                ret: args.ret,
                message: args.success ? ('模拟数据：' + args.success) : '模拟数据',
                data,
            })
        } else {
            return Mock.mock(apiUrl + args.url, {
                ret: args.ret,
                message: getErrMsg(args.ret),
                "success": false,
            })
        }
    },
    postData(args) {
        example.getData(args, {});
    },
}
let line = {
    create(args) { // 3.2.40模型配置—查看分类器节点
        example.getData(args, {
            'id': Random.id(), // 节点ID    Number  Y   
        });
    },
    update: example.getData,
    delete: example.getData,
}
let node = {
    create(args) { // 3.2.40模型配置—查看分类器节点
        example.getData(args, {
            'id': Random.id(), // 节点ID    Number  Y   
        });
    },
    update: example.getData,
    delete: example.getData,
}
let version = {
    list(args) { // 3.2.40模型配置—查看分类器节点
        example.getData(args, {
            'policyList|1-9': [{ // 分类器分类列表 List
                'id|+1': 100, // 策略ID    Number  Y
                'policyName|1': getMore('ctitle'), // 策略名称    String  Y
                'logic|1-2': 1, // 逻辑操作    Number  Y   1：与，2：或
                'sort|+1': 1, // 顺序  Number  Y
                'policyVersion|100-999': 100, // 模型版本    number  Y   100、101
                'createBy|1': getMore('cname'), // 创建人 String  Y
                'createTime|1': getMore('datetime'), // 创建时间    String  Y 
            }],
        });
    },
    bind: example.getData,
}
let scorecard = {
    query(args) { // 3.2.47模型配置—获取评分卡
        example.getData(args, {
            'moldId|+1': 100, // 评分卡ID   Number  Y   评分卡ID
            'moldName': Random.ctitle(), // 评分卡名    String  Y
            'moldVersion|100-999': 100, // 评分卡版本   Number  Y
        });
    },
    bind: example.getData, // 3.2.46模型配置--绑定评分卡
    list(args) { // 3.2.55评分卡—获取已上线的评分卡列表(下拉选择时使用)
        example.getData(args, {
            'scorecardList|1-9':[{
                'id|+1':100,// 评分卡模型ID number  Y   
                'moldName|1':getMore('ctitle'),// 评分卡名称   String  Y   
                'moldVersion|100-999': 100,// 版本号 Number  Y   
                'moldCode':Random.id(),// 模型编码    Numer   Y    
            }]
        });
    },
}
let feature = {
    list(args) { // 3.2.53评分卡—获取特征内容
        example.getData(args, {
            'featureList|2-2': [{
                'id|+1': 100, // 特征ID Number  Y
                // 'featureName':Random.ctitle(),// 特征名称    String  Y
                'featureWeight|0.1': 1, // 特征权重    Float   N
                'exceptionScore|0.1': 1, // 异常时系数   Float   N
                'missScore|0.1': 1, // 其他情况系数  Float   N
                'featureRuleList|1-1': [{ // 特征规则列表  List    Y
                    'coefficient': [ // 系数  Float   N    //type:1常量、type:2变量、type:3符号   // {0.1}+{{varId}}-({{varId}})
                        { type: 1, value: '0.2' },
                        { type: 3, value: '+' },
                        { type: 2, value: '1' },
                        { type: 3, value: '-' },
                        { type: 3, value: '(' },
                        { type: 2, value: '1' },
                        { type: 3, value: ')' },
                        { type: 3, value: '/' },
                        { type: 3, value: '(' },
                        { type: 3, value: ')' },
                    ],
                    'sort|+1': 1, // 顺序  Number  N
                    'rule': { // 规则内容    List    Y
                        'logic|1-2': 1, // 逻辑操作    Numbrt  Y   1：与，2：或
                        'ruleContent|1-1': [{ // 特征规则列表  List    Y
                            'variableId': Random.integer(1, 6), // 变量ID    Number  Y   不超过255
                            'variableName': Random.ctitle, // 变量名 String  Y   不超过255
                            'variableType|1-6': 1, //变量类型    Number  N   1：字符串(==、!=、is null、startsWith、contains)，2：整型，3：浮点型，4：日期型(排除is nll+startsWith+contains)，5：枚举(多选)，6：布尔型(是否)
                            'logic|1-2': 1, // 逻辑操作    Numbrt  Y   1：与，2：或
                            'content|1-2': [{ // 规则内容    List    Y
                                'operation|1-9': 1, // 操作符 Number  Y   1: 等于, 2: 不等于, 3: is null, 4: 大于, 5: 大于或等于, 6: 小于, 7: 小于或等于,8:以...开始,9包含
                                'operationValue|1-99': 1, // 操作值 String  Y   不超过255
                                'valueDescription|1': getMore('cparagraph'), // 操作值描述   Numbrt  Y   1：与，2：或
                                'sort|+1': 1, // 顺序  Number  N
                            }],
                        }],
                    },
                }],
            }],
        });
    },
    create: example.getData,
    delete: example.getData,
}
let tester = {
    query(args) { // 3.2.45模型配置—获取计算卡
        example.getData(args, {
            'name|1': getMore('ctitle'), // ab测试节点名 String  Y
            'bValue|0.2': 1, // B模型流量比率 Float   Y   小于1的浮点数，只需要保留小数点后两位
        });
    },
    bind: example.getData,
}
let computecard = {
    query(args) { // 3.2.45模型配置—获取计算卡
        example.getData(args, {
            'formula|1-15': 1, // 公式  Number  Y   根据计算引擎来
            'computeType|1-2': 1, // 计算方式    Number  Y   1：value为左值，2：value为右值
            'value|100-999': 100, // 运算值 String  N   为空表示不需要填计算值
            'valueType|0-2': 1, // 值类型 Number  Y   0:无需value值，1：value为常量，2：value为变量ID
        });
    },
    bind: example.getData,
}
let parallel = { // 3.2.40模型配置—查看分类器节点
    query(args) {
        example.getData(args, {
            'parallelName|1': getMore('ctitle'), // 并行节点名    String  Y
            'policyList|1-9': [{ // 分类器分类列表 List
                'id|+1': 100, // 策略ID    Number  Y
                'policyName|1': getMore('ctitle'), // 策略名称    String  Y
                'logic|1-2': 1, // 逻辑操作    Number  Y   1：与，2：或
                'sort|+1': 1, // 顺序  Number  Y
            }],
            'decisions|5': [{ // 决策建议    List    Y
                'result|-1-1': 1, // 策略结果    Number  Y   0：未命中，1：命中，-1：异常
                'condition|0-1': 1, // 条件  Number  Y   0：任意的情况，1：全部的情况
                'decision|1-3': 1, // 决策  Numbrt  Y   0：通过，1：拒绝，2：人工审核，3：继续执行
                'sort|+1': 1, // 顺序  Number  N
            }],
        });
    },
    bind: example.getData,
}
let category = {
    query(args) { // 3.2.40模型配置—查看分类器节点
        example.getData(args, {
            'categoryName|1': getMore('ctitle'), // 分类器名称   String
            'policyList|1-9': [{ // 分类器分类列表 List
                'id|+1': 100, // 策略ID    Number  Y
                'policyName|1': getMore('ctitle'), // 策略名称    String  Y
                'logic|1-2': 1, // 逻辑操作    Number  Y   1：与，2：或
                'sort|+1': 1, // 顺序  Number  Y
            }],
        });
    },
    bind: example.getData,
}
let variable = {
    enums(args) {
        example.getData(args, {
            'enumList|9': [{
                'enumValue|+1': 1, // 产品线 String  Y
                'enumName|1': getMore('ctitle'), // 变量中文名   String  Y
            }],
        });
    },
    list(args) {
        example.getData(args, {
            'variableList|6': [{
                'variableId|+1': 1, // 变量ID    Number  Y
                'variableName|+1': ['学历', '年龄', '身高', '生日', '爱好', '性别'], // 变量中文名   String  Y
                'productName|1': getMore('ctitle'), // 产品线 String  Y
                'variableType|+1': 1, //变量类型    Number  N   1：字符串(==、!=、is null、startsWith、contains)，2：整型，3：浮点型，4：日期型(排除is nll+startsWith+contains)，5：枚举(多选)，6：布尔型(是否)
                'source|1-10': 1, //变量来源    Number  N   1：Mysql,2：Hbase,3:数据仓库，4：第三方变量，5：数据仓库计算变量，6：风控引擎计算变量，7：接口请求变量，8：评分卡变量，9：团贷网变量，10：实时计算变量
                'createTime|1': getMore('datetime'), // 创建日期    String  Y
                'variableStatus|1-2': 1, // 变量状态    Number  Y   1：可用。2：不可用
            }],
        });
    },
}
let config = { // 获取变量列表（规则配置时使用）
    list: variable.list,
}
let number = { // 获取量化型变量列表（评分卡配置时使用）
    list: variable.list,
}
let set = {
    query(args) {
        example.getData(args, {
            'id': Random.id(), // 规则ID    Number  Y
            'ruleName|1': getMore('ctitle'), // 规则名称    String  Y
            'decisionCode': Random.id(), // 规则编码    String  Y   字符串数组
            'logic|1-2': 1, // 逻辑操作    Number  Y   1：与，2：或
            'ruleContent|1-2': [{ // 规则内容    List    Y
                'variableId|+1': 1, // 变量ID    Number  Y   不超过255
                'variableName|1': getMore('ctitle'), // 变量名 String  Y   不超过255
                'variableType|+1': 1, //变量类型    Number  N   1：字符串(==、!=、is null、startsWith、contains)，2：整型，3：浮点型，4：日期型(排除is nll+startsWith+contains)，5：枚举(多选)，6：布尔型(是否)
                'logic|1-2': 1, // 逻辑操作    Numbrt  Y   1：与，2：或
                'content|1-2': [{ // 规则内容    List    Y
                    'operation|1-9': 1, // 操作符 Number  Y   1: 等于, 2: 不等于, 3: is null, 4: 大于, 5: 大于或等于, 6: 小于, 7: 小于或等于,8:以...开始,9包含
                    'operationValue|1-99': 1, // 操作值 String  Y   不超过255
                    'valueDescription|1': getMore('cparagraph'), // 操作值描述   Numbrt  Y   1：与，2：或
                    'sort|+1': 1, // 顺序  Number  N
                }],
            }],
        });
    },
    list(args) {
        example.getData(args, {
            'id': Random.id(), // 规则ID    Number  Y
            'ruleName|1': getMore('ctitle'), // 规则名称    String  Y
            'decisionCode': Random.id(), // 规则编码    String  Y   字符串数组
            'logic|1-2': 1, // 逻辑操作    Number  Y   1：与，2：或
            'setList|10': [{ // 规则内容    List    Y
                'id': '12312312312312',
                'createTime': '2018-05-24', // 变量ID    Number  Y   不超过255
                'createBy': 'sdas', // 变量名 String  Y   不超过255
                'setName': '集合名称', //变量类型    Number  N   1：字符串(==、!=、is null、startsWith、contains)，2：整型，3：浮点型，4：日期型(排除is nll+startsWith+contains)，5：枚举(多选)，6：布尔型(是否)
                'productName': '阿打算', // 逻辑操作    Numbrt  Y   1：与，2：或
                'remark': 'asdasdasdsadsa',
            }],
            'count': 100
        });
    },
    create(args) {
        example.getData(args);
    },
    delete(args) {
        example.getData(args);
    }
}
let policy = {
    create(args) {
        example.getData(args);
    },
    update(args) {
        example.getData(args);
    },
    query(args) {
        example.getData(args, {
            'id|+1': 1, // 策略ID    Number  Y
            'appId|+1': 100, // 产品ID    Number  N
            'policyName|1': getMore('ctitle'), // 分类器名称   String  Y
            'logic|1-2': 1, // 逻辑操纵    Number  Y
            'policyVersion|100-999': 100, // 模型版本    number  Y   100、101
            'ruleList|0-9': [{
                'id': Random.id(), // 规则ID    Number  Y
                'ruleName|1': getMore('ctitle'), // 规则名称    String  Y
                'decisionCode': Random.id(), // 规则编码    String  Y   字符串数组
                'logic|1-2': 1, // 逻辑操作    Number  Y   1：与，2：或
                'sort|1-99': 1, // 顺序 Number  Y
            }],
        });
    },
    query_node(args) {
        example.getData(args, {
            'policyName|1': getMore('ctitle'), // 分类器名称   String  Y
            'logic|1-2': 1, // 逻辑操纵    Number  Y
            'hitThen|0-3': 0, // 命中时操作   Number  Y   0：通过，1：拒绝，2：人工审核，3：继续执行
            'missThen|0-3': 0, // 未命中时操作  Number  Y   0：通过，1：拒绝，2：人工审核，3：继续执行
            'exceptionThen|0-3': 0, // 异常时操作   Number  Y   0：通过，1：拒绝，2：人工审核，3：继续执行
            'ruleList|0-9': [{
                'id': Random.id(), // 规则ID    Number  Y
                'ruleName|1': getMore('ctitle'), // 规则名称    String  Y
                'decisionCode': Random.id(), // 规则编码    String  Y   字符串数组
                'logic|1-2': 1, // 逻辑操作    Number  Y   1：与，2：或
                'sort|1-99': 1, // 顺序 Number  Y
                'ruleContent|1-2': [{ // 规则内容    List    Y
                    'variableId|+1': 1, // 变量ID    Number  Y   不超过255
                    'variableName|1': getMore('ctitle'), // 变量名 String  Y   不超过255
                    'variableType|+1': 1, //变量类型    Number  N   1：字符串(==、!=、is null、startsWith、contains)，2：整型，3：浮点型，4：日期型(排除is nll+startsWith+contains)，5：枚举(多选)，6：布尔型(是否)
                    'logic|1-2': 1, // 逻辑操作    Numbrt  Y   1：与，2：或
                    'content|1-2': [{ // 规则内容    List    Y
                        'operation|1-9': 1, // 操作符 Number  Y   1: 等于, 2: 不等于, 3: is null, 4: 大于, 5: 大于或等于, 6: 小于, 7: 小于或等于,8:以...开始,9包含
                        'operationValue|1-99': 1, // 操作值 String  Y   不超过255
                        'valueDescription|1': getMore('cparagraph'), // 操作值描述   Numbrt  Y   1：与，2：或
                        'sort|+1': 1, // 顺序  Number  N
                    }],
                }],
            }],
        });
    },
}
let template = {
    list_policyList(args) {
        example.getData(args, {
            'count|1-99': 1,
            'policyList|9': [{
                'id|+1': 1, // 策略ID    number  Y
                'policyName|1': getMore('ctitle'), // 策略名   String  Y
                'policyStatus|1-3': 1, // 策略状态    number  Y   1：未上线，2：已上线，3：已下线
                'createBy|1': getMore('cname'), // 创建人 String  Y
                'createTime|1': getMore('datetime'), // 创建时间    String  Y
                'updateTime|1': getMore('datetime'), // 更新时间    String  Y
                'policyVersion|100-999': 100, // 模型版本    number  Y   100、101
            }]
        });
    },
    list_ruleTmplList(args) {
        example.getData(args, {
            'count|1-99': 1,
            'ruleList|9': [{
                'id|+1': 1, // 规则ID    number  Y
                'decisionCode': Random.id(), // 规则决策代码  String  Y
                'ruleName|1': getMore('ctitle'), // 规则名称    String  Y
                'ruleStatus|1-2': 1, // 规则状态    Number  Y   1：有效，2：无效
                'productName|1': getMore('ctitle'), // 产品线名称   String  Y
                'createTime|1': getMore('datetime'), // 创建时间    String  Y   yyyy-MM-dd HH:mm:ss
                'updateTime|1': getMore('datetime'), // 修改时间    String  Y   yyyy-MM-dd HH:mm:ss
                'createBy|1': getMore('cname'), // 创建人 String  Y
            }]
        });
    },
}
let rule = {
    create(args) {
        example.getData(args, {
            id: Random.id(), // 返回一个规则ID
        });
    },
    list_policyRuleList(args) {
        example.getData(args, {
            'count|1-99': 1,
            'ruleList|0-5': [{
                'id|+1': 1, // 策略ID    number  Y
                'ruleName|1': getMore('ctitle'), // 策略名   String  Y
                'ruleId|+1': 1, // 策略ID    number  Y
                'sort|1-99': 1, // 顺序 Number  Y
                'decisionCode|1': Random.id(), // 规则编码    String  Y   不超过255
                'logic|1-2': 1, // 逻辑操作    Numbrt  Y   1：与，2：或
            }]
        });
    },
}
let mold = {
    online: example.getData,
    offline: example.getData,
    create: example.getData,
    list(args) {
        example.getData(args, {
            'count|1-99': 1,
            'moldList|9': [{
                'id|+1': 1, // 模型ID    number  Y
                'appId|+1': 1, // 产品线名称   String  Y
                'productName|1': getMore('ctitle'), // 产品线名称   String  Y
                'moldName|1': getMore('cname'), // 模型名称    String  Y
                'moldStatus|1-3': 1, // 模型状态    number  Y   1：未上线，2：已上线，3：已下线
                'moldCheckStatus|1-7': 1, // 模型评估状态  Number  Y   1：待测试，2：测试中，3：测试完成，4：测试不通过，5：待审核，6：审核不通过，7：审核完成
                'moldVersion|100-999': 100, // 模型版本    number  Y   100、101
                'moldType|1-3': 1, // 模型类型    Number  Y   1：反欺诈，2：授信，3：评分卡
            }]
        });
    },
    variables(args) { // 参数列表
        example.getData(args, {
            'count|1-99': 1,
            'variableList|9': [{
                'id|+1': 1, // 序号
                'fieldName|1': getMore('name'), // 字段名(英文)
                'variableName|1': getMore('cname'), // 变量名(中文)
                'variableType|1-6': 1, //变量类型    Number  N   1：字符串(==、!=、is null、startsWith、contains)，2：整型，3：浮点型，4：日期型(排除is nll+startsWith+contains)，5：枚举(多选)，6：布尔型(是否)
                'isRequire|1-2': 1, // 是否必填
                'remark|1': getMore('cparagraph'), // 备注
            }]
        });
    },
    content(args) {
        example.getData(args, {
            'id|+1':1,// 模型id    Number  Y   
            'moldName':Random.ctitle(),// 模型名称    String  Y   
            'moldCode':Random.id(),// 模型编码    Number  Y   
            'moldVersion|100-999':100,// 模型版本    Number  Y   
            'nodeList|2':[{// 节点列表    List    Y  
                'id|+1':100,// 节点id    number  Y   
                'nodeName|1':getMore('cname'),// 节点名称    String  Y   
                'nodetype|1-8':1,// 节点类型    Number  Y   1：开始，2：结束，3：分类器，4：策略，5：评分卡，6：计算卡，7：AB测试，8：并行
                'positionLeft|1-1100':1,// 左偏移量    Number  Y   
                'positionTop|1-740':1,// 上偏移量    Number  Y   
            }], 
            'lineList|1-9':[{// 连线列表    List    Y   
                'id|+1':200,// 连线id    number  Y   
                'startNodeId|+1':100,// 起始节点ID  Number  Y   
                'endNodeId|+1':101,// 结束节点ID  Number  Y   
                'lineValue|1':getMore('ctitle'),// 节点上的值   String  Y   
                'valueDescription|1':getMore('cparagraph'),// 值的描述    String  Y   
                'startNodeDirect|1-8':1,// 起始节点方位  Number  Y   1：上，2：下，3：左，4：右，5左上，6右上，7左下，8右下
                'endNodeDirect|1-8':1,// 结束节点方位  Number  Y   1：上，2：下，3：左，4：右，5左上，6右上，7左下，8右下
            }],
        });
    },
}
let mcs = {
    login(args) {
        example.getData(args, {
            name: Random.cname(), // 用户姓名
            token: Random.id(), // 访问令牌
            'permissions|1-8': getMore('first').concat(['proMg', 'proList']), // 权限名
            'menuList': [{
                    "id": "1",
                    "sort": 1,
                    "menuName": "产品管理",
                    "menuHref": "/risk/proMg",
                    "isShow": 1,
                    // "permission":"proMg",
                    "menuIcon": "proMg",
                    "childrenList": [{
                        "id": "1-1",
                        "sort": 1,
                        "menuName": "产品列表",
                        "menuHref": "/risk/proMg/proList",
                        "isShow": 1,
                        // "permission":"proList"
                    }, ]
                },
                {
                    "id": "2",
                    "sort": 2,
                    "menuName": "模型管理",
                    "menuHref": "/risk/modelMg",
                    "isShow": 1,
                    // "permission":"modelMg",
                    "menuIcon": "modelMg",
                    "childrenList": [{
                            "id": "2-1",
                            "sort": 1,
                            "menuName": "模型列表",
                            "menuHref": "/risk/modelMg/modelList",
                            "isShow": 1,
                            // "permission":"modelList"
                        },
                        {
                            "id": "2-1",
                            "sort": 2,
                            "menuName": "新增模型",
                            "menuHref": "/risk/modelMg/modelList/modelAdd",
                            "isShow": 1,
                            // "permission":"modelAdd"
                        },
                    ]
                },
                {
                    "id": "3",
                    "sort": 3,
                    "menuName": "策略管理",
                    "menuHref": "/risk/stratMg",
                    "isShow": 1,
                    // "permission":"stratMg",
                    "menuIcon": "stratMg",
                    "childrenList": [{
                            "id": "3-1",
                            "sort": 1,
                            "menuName": "规则模板",
                            "menuHref": "/risk/stratMg/ruleList",
                            "isShow": 1,
                            // "permission":"stratList"
                        },
                        {
                            "id": "3-2",
                            "sort": 1,
                            "menuName": "策略模板",
                            "menuHref": "/risk/stratMg/stratList",
                            "isShow": 1,
                            // "permission":"stratList"
                        },
                        /*{
                          "id": "3-2",
                          "sort": 2,
                          "menuName": "新增策略",
                          "menuHref": "/risk/stratMg/ruleList/stratAdd",
                          "isShow": 1,
                          // "permission":"stratAdd"
                        },*/
                    ]
                },
                {
                    "id": "4",
                    "sort": 4,
                    "menuName": "字典管理",
                    "menuHref": "/risk/dictMg",
                    "isShow": 1,
                    // "permission":"dictMg",
                    "menuIcon": "dictMg",
                    "childrenList": [{
                            "id": "4-1",
                            "sort": 1,
                            "menuName": "字典列表",
                            "menuHref": "/risk/dictMg/dictList",
                            "isShow": 1,
                            // "permission":"dictList"
                        },
                        {
                            "id": "4-2",
                            "sort": 2,
                            "menuName": "自定义列表",
                            "menuHref": "/risk/dictMg/dictCustom",
                            "isShow": 1,
                            // "permission":"dictAdd"
                        },
                    ]
                },
                {
                    'id': Random.id(),
                    'sort|5-99': 5,
                    'menuName': Random.cname(),
                    'menuHref': Random.first(),
                    'isShow|1-2': 1,
                    // 'permission':Random.first(),// 权限名
                    'menuIcon': Random.first(), // 权限名
                    'childrenList|0-9': [{
                        'id|1': getMore('id'),
                        'sort|+1': 1,
                        'menuName|1': getMore('cname'),
                        'menuHref|1': getMore('first'),
                        'isShow|1-2': 1,
                        'permission|1': getMore('first'), // 权限名
                    }],
                }
            ],

        });
    },
    logout: example.getData,
}
let product = {
    delete: example.getData,
    create: example.getData,
    update: example.getData,
    list(args) {
        example.getData(args, {
            'count|1-99': 1,
            'productList|9': [{
                'id|+1': 1,
                'productName|+1': getMore('ctitle'),
                'createTime|1': getMore('datetime'), // 创建时间
                'createBy|1': getMore('cname'),
            }]
        });
    },
}


let getMore = function(item, arg1 = '', arg2 = '') {
    let items = new Array;
    for (let i = 0; i < 100 + Math.ceil(Math.random() * 100); i++) {
        if (arg1) {
            items = items.concat([Random[item](arg1, arg2)]);
        } else {
            items = items.concat([Random[item]()]);
        }
    }
    return items;
}

// 返回在vue模板中的调用接口
export default {
    Random,
    mcs,
    product,
    mold,
    template,
    rule,
    set,
    variable,
    policy,
    category,
    parallel,
    number,
    config,
    computecard,
    tester,
    feature,
    scorecard,
    version,
    node,
    line,
}


let getErrMsg = function(ret) {
    switch (ret) {
        case 10000:
            return "系统异常，发生了为处理的异常。";
        case 20000:
            return "请求参数与接口定义的参数匹配不上";
        case 30000:
            return "业务流程类错误 ";

        case 1001:
            return "其他错误";
            /** 系统不能处理 （一般情况是系统有bug） */
        case 1002:
            return "系统不能处理";
            /** 参数异常 */
        case 1003:
            return "参数异常";
            /** api层接口错误 */
        case 1004:
            return "api层接口错误";
            /** api层接口失败 */
        case 1005:
            return "api层接口失败";
            /** 不支持的请求参数 */
        case 1006:
            return "不支持的请求参数";
            /** 不支持的媒体类型*/
        case 1007:
            return "不支持的媒体类型";
            /** 当前登录用户无此权限*/
        case 1008:
            return "当前登录用户无此权限";
            /** 资源不存在 */
        case 1009:
            return "资源不存在";
        case 1010:
            return "未登录或者登录过期";
        case 1011:
            return "RSA加解密错误";

        case 20001:
            return "用户未登录";
        case 20002:
            return "无访问权限";
        case 20003:
            return "错误次数过多，请次日再试";
        case 20004:
            return "手机号码错误";
        case 20005:
            return "发送验证码类型错误";
        case 20006:
            return "登录失败";
        case 20007:
            return "密码错误";
        case 20008:
            return "验证码错误";
        case 20009:
            return "该用户已存在";
        case 20010:
            return "用户名或密码错误";
        case 20011:
            return "邮箱未激活";
        case 20012:
            return "验证码发送次数过多，请次日再试";
        case 20013:
            return "验证码发送次数过多,请次月再试";
        case 20014:
            return "邮件发送失败,请稍后再试";
        case 20015:
            return "参数错误";
        case 20016:
            return "记录不存在";
        case 20017:
            return "企业认证未完成";
        case 20018:
            return "抱歉，您有申请中的订单，请不要重复提交订单";
        case 20019:
            return "用户已被禁用";
        case 20020:
            return "两次新密码输入不一致";
        case 20021:
            return "账户不存在";
        case 20022:
            return "密码修改失败";
        case 20023:
            return "邮箱已是激活状态";
        case 20024:
            return "激活邮件已发送,请先处理";
        case 20025:
            return "对不起，该激活已经失效，请重新发送邮箱激活";
        case 20026:
            return "已存在相同激活成功邮箱,请修改邮箱";
        case 20027:
            return "输入的密码不正确";
        case 20028:
            return "原始密码不正确";
        case 20029:
            return "密码错误超过4次，还剩1次机会";
        case 20030:
            return "密码错误超过5次";
            /** Jim修改于2018-04-02 14:16:26 @接口协议规范：\天秤解决方案\架构设计\接口协议\天秤内部系统接口协议文档.docx */
        case 'E0000000':
            return '成功';
        case 'E0000001':
            return '请求消息为空或参数错误';
        case 'E0000002':
            return '验签失败（计费系统专用）';
        case 'E0000003':
            return '请求数据解析失败（计费系统专用）';
        case 'E0000004':
            return '请求的用户不存在（计费系统专用）';
        case 'E0000005':
            return '用户名密码错误（计费系统专用）';
        case 'E0000006':
            return '交易流水重复（计费系统专用）';
        case 'E0000007':
            return 'base64解码失败（计费系统专用）';
        case 'E0000008':
            return '3des解码失败（计费系统专用）';
        case 'E0000009':
            return '错误的请求方式（计费系统专用）';
        case 'E0000010':
            return '用户余额不足（计费系统专用）';
        case 'E0000011':
            return '服务无响应';
        case 'E0000012':
            return '功能号格式错误';
        case 'E0000013':
            return '系统正在升级中，请稍后再试';
        case 'E0000014':
            return '获取数据超时（魔方系统专用）';
        case 'E0000015':
            return '数据异常（魔方系统专用）';
        case 'E0000016':
            return '模型计算结果已经推送成功（魔方系统专用）';
        case 'E0000017':
            return '模型在计算中（魔方系统专用）';
        case 'E0000018':
            return '其它错误（魔方系统专用）';
    }
}

/*****************************************************************************/
// 时间
function rangeDate(min, max) {
    var min = min,
        max = max,
        days = (new Date(max) - new Date(min)) / 1000 / 60 / 60 / 24,
        i = 0,
        len = Math.floor(days),
        dates = [];

    for (; i < len; i++) {
        dates.push(format(new Date(min).getTime() + 1000 * 60 * 60 * 24 * i));
    }
    return dates;
}

function format(date) {
    var dateString = new Date(date),
        month = (dateString.getMonth() + 1) < 10 ? '0' + (dateString.getMonth() + 1) : (dateString.getMonth() + 1),
        day = dateString.getDate() < 10 ? '0' + dateString.getDate() : dateString.getDate();
    return dateString.getFullYear() + '-' + month + '-' + day
}
