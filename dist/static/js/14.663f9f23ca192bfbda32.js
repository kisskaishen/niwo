webpackJsonp([14,43],{DjeO:function(t,e){},KPgr:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i("3cXf"),r=i.n(s),a=i("aA9S"),o=i.n(a),l=i("Mn3y"),n={plus:i("hSzm"),remove:i("ZRMD"),sort:i("n13j"),ruleConOpen:i("k19Z"),arrowLeft:i("Oglh")},c={name:"pages_stratForm",data:function(){return{pageName:"pages_stratForm",icon:n,show:{stratName:!0,ruleForm:!1},policyList:[],variableList:[],allEnmuList:[],oprList:[{id:1,name:"="},{id:2,name:"!="},{id:3,name:"is null"},{id:4,name:">"},{id:5,name:">="},{id:6,name:"<"},{id:7,name:"<="},{id:8,name:"startsWith"},{id:9,name:"contains"}],oprList_str:[{id:1,name:"="},{id:2,name:"!="},{id:3,name:"is null"},{id:8,name:"startsWith"},{id:9,name:"contains"}],oprList_num:[{id:1,name:"="},{id:2,name:"!="},{id:4,name:">"},{id:5,name:">="},{id:6,name:"<"},{id:7,name:"<="}],oprList_bl:[{id:"1",name:"是"},{id:"0",name:"否"}],hitList:[{id:0,name:"通过"},{id:1,name:"拒绝"},{id:2,name:"人工审核"},{id:3,name:"继续执行"}],stratForm:{policyType:"true",nodeId:"",appId:"",policyName:"",rate:"",policyId:"",logic:"",missThen:"",hitThen:"",exceptionThen:"",ruleList:""},vLock:!1,isNewNode:!0,stratLoading:!0,policyListFilter:[],isDisabled:!1,canShow:!0}},props:["policyType","appId","variableListUml","policyListUml"],components:{ruleItem:l.a},created:function(){this.canShow=!0,this.variableList=this.variableListUml,this.policyListFilter=this.policyList=this.policyListUml?this.policyListUml:[],this.variableListUml.length&&this.policyList.length?this.initData():this.variableListUml.length?this.getPolicyList():this.getVariableList(!!this.policyList.length),this.stratForm.appId=this.$route.query.appId,"edit"==this.$route.query.type&&this.$route.query.policyId&&(console.log("如果有policyId,直接请求策略详情"),this.stratForm.policyId=this.$route.query.policyId,this.getPolicyDetail()),this.getOprList_enumList()},methods:{getPolicyList:function(){var t=this;!(arguments.length>0&&void 0!==arguments[0])||arguments[0];this.$post("/mcs/policy/template/list",{appId:this.$route.query.appId,policyName:"",pageNo:"",pageSize:999,statusOrder:2}).then(function(e){t.policyList=e.policyList,t.policyListFilter=e.policyList,t.initData()})},initData:function(){this.$route.name.indexOf("_stratForm")>-1?(this.stratForm.policyId=this.$route.query.policyId,this.stratAdd2()):"stratAdd"==this.$route.name?this.stratAdd():"stratEdit"==this.$route.name?this.getPolicyDetail():this.getPolicyNode(),this.stratLoading=!1},getPolicyNode:function(){var t=this;this.$post("/mcs/node/policy/query",{nodeId:this.$route.query.nodeId.slice(4)}).then(function(e){e&&(t.stratForm.policyId=t.$route.query.policyId||e.policyList[0].policyId,console.log("this.stratForm.policyId="+t.stratForm.policyId),e.policyList[0].policyName&&(t.show.stratName=!1),e.policyList.map(function(i,s){t.stratForm.policyId==i.policyId&&(e.policyList[s].ruleList.map(function(e,i){e.ruleConShow=!1,e.ruleContent.map(function(e,i){e.sort=i,e.operationArray=e.content.map(function(t){return t.operationValue}),e.oprList=[],t.getVarType(e,i,0)}),e.isTemplate||(e.id=e.ruleName)}),e.policyList[s].ruleList.sort(function(t,e){return t.sort-e.sort}),o()(t.stratForm,e.policyList[s]))}),console.log(t.stratForm));var i=JSON.parse(r()(t.stratForm));i.nodeName=t.stratForm.policyName,i.nodeId=t.$route.query.nodeId,i.clear=!e})},stratAdd:function(){var t=this;this.canShow=!1,this.$refs.policyName.blur(),this.show.stratName=!1,this.resetStratForm(),this.$nextTick(function(){t.$refs.ruleItem.rule_plus()})},stratAdd2:function(){var t=this;this.$route.query.policyId=this.stratForm.policyId,this.show.stratName=!1,this.resetStratForm(),this.$nextTick(function(){t.$refs.ruleItem.rule_plus()}),this.$route.query.policyType&&(this.stratForm.policyType=this.$route.query.policyType)},arrowLeft:function(){this.$route.name.indexOf("_stratForm")>-1?(this.$router.push({query:this.$route.query}),this.$router.go(-1)):(this.show.stratName=!0,this.$route.query.policyId?(this.stratForm.policyId=this.$route.query.policyId,this.changeStratName(this.$route.query.policyId),delete this.$route.query.policyId):this.stratForm.policyId="")},changeStratName:function(t){var e=this;this.canShow=!0,this.policyList.map(function(i){i.id==t&&(e.stratForm.policyName=i.policyName)}),this.getPolicyDetail(),this.$nextTick(function(){e.show.stratName=!1})},validateStrat:function(){var t=this;this.vLock=!0;var e=this.stratForm.ruleList.filter(function(e){var i=t.$refs.ruleItem.validateRule(e);return!!e.ruleName&&!!e.logic&&i}).length,i=function(){return"stratForm"!=t.$route.name&&"parallelForm_stratForm"!=t.$route.name||!t.stratForm.policyId||""!==t.stratForm.missThen&&""!==t.stratForm.hitThen&&""!==t.stratForm.exceptionThen};return console.log("完整rule",e,"所有rule",this.stratForm.ruleList.length,i()),!!this.stratForm.policyName&&this.stratForm.logic&&e==this.stratForm.ruleList.length&&i()},saveStrat:function(t){var e=this;if(this.validateStrat())if(this.canShow=!1,console.log("验证通过"),"isAddBtn"==t){this.canShow=!0,this.stratForm.appId=this.appId?this.appId:this.$route.query.appId;var i=JSON.parse(r()(this.stratForm));i.ruleList.map(function(t){t.id=""}),console.log(i),this.createPolicy(),"kingForm"==this.$route.query.from&&(this.$local.set("isAddBtnData",i),1==this.stratForm.policyType||this.$local.get("isAddBtnData"))}else if("isChooseBtn"==t){console.log(this.stratForm);var s=JSON.parse(r()(this.stratForm));s.nodeId=this.$route.query.nodeId.slice(4),s.ruleList.map(function(t,e){t.id=""});var a=[];"{}"!=r()(this.$local.get("policyList"))?(a=this.$local.get("policyList"),console.log(this.$local.get("isAddBtnData")),console.log(!this.$local.get("isAddBtnData")),this.$local.get("isAddBtnData")?this.$local.get("formIndex")?a[this.$local.get("formIndex")-1]=this.stratForm:a.push(s):(a.push(this.$local.get("isAddBtnData")),this.$local.delete("isAddBtnData")),this.$route.query.policyId&&a.map(function(t,i){t.policyId==e.$route.query.policyId&&(a[i]=s)}),console.log(a),this.$local.set("policyList",a),console.log(this.$local.get("policyList"))):(a.push(s),this.$local.set("policyList",a)),this.$router.push(this.$route.fullPath.replace("/stratForm","/kingForm"))}else if("newCelueBtn"==t)if(console.log(this.$route.name),"stratAdd"==this.$route.name||"stratEdit"==this.$route.name)this.$route.query.policyId?this.updatePolicy(this.$route.query.policyId):this.createPolicy();else{var o=JSON.parse(r()(this.stratForm));o.nodeId=this.$route.query.nodeId.slice(4),o.ruleList.map(function(t,e){t.id=""}),o.policyId="",this.bindStrat(o)}else"stratEditBtn"==t&&this.$route.query.policyId&&this.updatePolicy(this.$route.query.policyId);else{var l="";l=""==this.stratForm.policyName?"请输入策略名称":""==this.stratForm.logic?"请选择策略执行条件":"请填写相关必填项",this.$notify({message:l,type:"warning",customClass:"pos-stratForm1"})}},bindStrat:function(t){var e=this;this.stratForm.policyType=this.stratForm.policyType?0:this.stratForm.policyType;if(this.validateStrat()){this.canShow=!1;var i=[];i.push(t),this.$post("/mcs/node/policy/bind",{nodeId:this.$route.query.nodeId.slice(4),policyList:i}).then(function(i){e.$message.success("绑定成功"),t.nodeName=e.stratForm.policyName,t.nodeId=e.$route.query.nodeId,e.$emit("saveForm",t),e.resetStratForm(),e.show.stratName=!0})}else this.$notify({message:"策略信息不完整",type:"warning",customClass:"pos-stratForm2"})},createPolicy:function(){var t=this;this.stratForm.appId=this.appId?this.appId:this.$route.query.appId;var e=JSON.parse(r()(this.stratForm));e.ruleList.map(function(t){t.id=""}),e.policyType=1==e.policyType?"0":"1","stratAdd"==this.$route.name&&(e.policyType=0),this.$post("/mcs/policy/create",e).then(function(e){t.$message.success("创建成功"),"stratAdd"==t.$route.name||"stratEdit"==t.$route.name?t.$router.push("/risk/stratMg/stratList"):t.stratForm.policyId=""})},updatePolicy:function(t){var e=this,i=JSON.parse(r()(this.stratForm));i.policyId=t,i.nodeId=this.$route.query.nodeId?this.$route.query.nodeId.slice(4):"",i.newVersion=1,i.ruleList.map(function(t,e){t.id=t.id_back}),delete i.appId,delete i.policyType;this.$post("/mcs/policy/update",i).then(function(t){e.$message.success("修改成功"),"stratAdd"==e.$route.name||"stratEdit"==e.$route.name?e.$router.push("/risk/stratMg/stratList"):(i.nodeName=i.policyName,e.$emit("saveForm",i),e.resetStratForm(),e.show.stratName=!0)})},resetStratForm:function(){this.stratForm={appId:this.$route.query.appId,policyName:"",policyId:"",logic:"",missThen:"",hitThen:"",exceptionThen:"",ruleList:[],policyType:!1,policyShow:!0},this.vLock=!1},getVariableList:function(){var t=this,e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];this.$post("/mcs/variable/config/list",{appId:this.$route.query.appId}).then(function(i){t.variableList=i.variableList,e&&t.getPolicyList(!1),t.initData()})},getPolicyDetail:function(){var t=this;this.show.stratName=!1,this.$post("/mcs/policy/query",{id:this.stratForm.policyId}).then(function(e){e.ruleList.map(function(e,i){e.ruleConShow=!1,e.ruleContent.map(function(e,i){e.sort=i,e.operationArray=e.content.map(function(t){return t.operationValue}),e.oprList=[],t.getVarType(e,i,0)}),e.isTemplate||(e.id_back=e.id,e.id=e.ruleName)}),e.ruleList.sort(function(t,e){return t.sort-e.sort}),delete e.appId,o()(t.stratForm,e)})},ruleAdd:function(){this.$router.push({path:this.$route.path+"/ruleForm",query:this.$route.query})},pushRule:function(t){console.log("策略中新增规则"),this.stratForm.ruleList=this.stratForm.ruleList.filter(function(t){return!!t.ruleName}),console.log("保存规则到策略模板",this.$route.query),this.$refs.ruleItem.ruleTmplList.push(t),this.stratForm.ruleList.push(t),this.$router.push({query:this.$route.query}),this.$router.go(-1)},getVarType:function(t,e,i){var s=this;this.variableList.map(function(e){t.variableId==e.variableId&&(t.variableName=e.variableName,t.variableType=e.variableType,1==e.variableType?t.oprList=s.oprList_str:2==e.variableType||3==e.variableType||4==e.variableType?t.oprList=s.oprList_num:5==e.variableType?(t.oprList=[],s.allEnmuList.map(function(e){t.variableId==e.variableId&&(e.id=e.enumValue,e.name=e.enumName,t.oprList.push(e))})):6==e.variableType?t.oprList=s.oprList_bl:s.$notify({message:"未知变量",type:"warning"}))})},getOprList_enumList:function(){var t=this;this.$post("/mcs/variable/enum/list",{}).then(function(e){t.allEnmuList=e.enumList})},operation:function(t){switch(t){case 1:return"=";case 2:return"!=";case 3:return"is null";case 4:return">";case 5:return">=";case 6:return"<";case 7:return"<=";case 8:return"startsWith";case 9:return"contains"}}},watch:{"stratForm.policyType":function(t){console.log(t)}}},u={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{directives:[{name:"loading",rawName:"v-loading",value:t.stratLoading,expression:"stratLoading"}],staticClass:"pages_stratForm"},[i("div",{directives:[{name:"show",rawName:"v-show",value:-1==t.$route.name.indexOf("_ruleForm"),expression:"$route.name.indexOf('_ruleForm')==-1"}]},[t.show.stratName?i("el-form",{ref:"stratName",staticClass:"stratName",attrs:{model:t.stratForm,"status-icon":""}},[i("el-form-item",{attrs:{label:""}},[i("el-select",{ref:"policyName",staticClass:"w310",attrs:{filterable:"",placeholder:"请选择已有的策略模版",size:"medium","no-match-text":"查询无结果","no-data-text":"暂无数据","popper-class":t.policyListFilter.length?"stratList toNew hasData":"stratList toNew"},on:{change:t.changeStratName},model:{value:t.stratForm.policyId,callback:function(e){t.$set(t.stratForm,"policyId",t._n(e))},expression:"stratForm.policyId"}},[t._l(t.policyListFilter,function(e,s){return i("el-option",{key:s,attrs:{label:e.policyName,value:e.id,disabled:"2"==e.policyStatus}},[i("div",{staticClass:"stratOption overhide",attrs:{title:e.policyName}},[t._v(t._s(e.policyName))])])}),t._v(" "),i("div",{staticClass:"stratAdd f_blue pointer mg_l_20 toNewBtn",on:{click:t.stratAdd}},[t._v("+新建策略")])],2)],1)],1):i("el-form",{ref:"stratForm",staticClass:"stratForm",attrs:{model:t.stratForm,"status-icon":""}},["stratAdd"==t.$route.name||!t.$route.query.moldType&&"stratEdit"==t.$route.name||"look"==t.$route.query.type?t._e():i("img",{staticClass:"backTostratName pointer",attrs:{src:t.icon.arrowLeft,alt:"返回策略名称"},on:{click:t.arrowLeft}}),t._v(" "),i("el-form-item",{attrs:{label:""}},["look"==t.$route.query.type?i("div",{staticClass:"w300 overhide"},[t._v("\n                    "+t._s(t.stratForm.policyName)+"\n                ")]):i("el-input",{staticClass:"w310",class:{solid_red:t.vLock&&!t.stratForm.policyName},attrs:{placeholder:"请输入策略名称",size:"medium",clearable:""},model:{value:t.stratForm.policyName,callback:function(e){t.$set(t.stratForm,"policyName",e)},expression:"stratForm.policyName"}})],1),t._v(" "),"stratForm"!=t.$route.name&&"parallelForm_stratForm"!=t.$route.name||!t.canShow?t._e():i("div",{staticClass:"stratForm_sug"},[i("p",{staticClass:"sug_title"},[t._v("决策意见：")]),t._v(" "),i("el-form-item",{staticClass:"inlineBlock missThen",attrs:{label:"策略未命中","label-width":"80px"}},[i("el-select",{staticClass:"w150",class:{solid_red:t.vLock&&""===t.stratForm.missThen},attrs:{disabled:"look"==t.$route.query.type,placeholder:"请选择",size:"medium","no-match-text":"查询无结果","no-data-text":"暂无数据","popper-class":"hitList"},model:{value:t.stratForm.missThen,callback:function(e){t.$set(t.stratForm,"missThen",t._n(e))},expression:"stratForm.missThen"}},t._l(t.hitList,function(t,e){return i("el-option",{key:e,attrs:{label:t.name,value:t.id}})}))],1),t._v(" "),i("el-form-item",{staticClass:"inlineBlock hitThen",attrs:{label:"策略命中","label-width":"88px"}},[i("el-select",{staticClass:"w150",class:{solid_red:t.vLock&&""===t.stratForm.hitThen},attrs:{disabled:"look"==t.$route.query.type,placeholder:"请选择",size:"medium","no-match-text":"查询无结果","no-data-text":"暂无数据","popper-class":"hitList"},model:{value:t.stratForm.hitThen,callback:function(e){t.$set(t.stratForm,"hitThen",t._n(e))},expression:"stratForm.hitThen"}},t._l(t.hitList,function(t,e){return i("el-option",{key:e,attrs:{label:t.name,value:t.id}})}))],1),t._v(" "),i("el-form-item",{staticClass:"inlineBlock exceptionThen",attrs:{label:"异常","label-width":"50px"}},[i("el-select",{staticClass:"w150",class:{solid_red:t.vLock&&""===t.stratForm.exceptionThen},attrs:{disabled:"look"==t.$route.query.type,placeholder:"请选择",size:"medium","no-match-text":"查询无结果","no-data-text":"暂无数据","popper-class":"hitList"},model:{value:t.stratForm.exceptionThen,callback:function(e){t.$set(t.stratForm,"exceptionThen",t._n(e))},expression:"stratForm.exceptionThen"}},t._l(t.hitList,function(t,e){return i("el-option",{key:e,attrs:{label:t.name,value:t.id}})}))],1)],1),t._v(" "),i("div",{staticClass:"stratForm_rule mg_t_20"},[i("el-form-item",{attrs:{label:"策略执行条件：",prop:"logic"}},[i("el-radio-group",{class:{solid_red:t.vLock&&!t.stratForm.logic},model:{value:t.stratForm.logic,callback:function(e){t.$set(t.stratForm,"logic",t._n(e))},expression:"stratForm.logic"}},["look"!=t.$route.query.type||2==t.stratForm.logic?i("el-radio",{attrs:{label:2}},[t._v("满足任意条件\n                        ")]):t._e(),t._v(" "),"look"!=t.$route.query.type||1==t.stratForm.logic?i("el-radio",{attrs:{label:1}},[t._v("满足全部条件\n                        ")]):t._e()],1)],1),t._v(" "),i("el-form-item",{staticClass:"stratForm_bd"},[i("ruleItem",{ref:"ruleItem",attrs:{icon:t.icon,variableList:t.variableList,ruleTmplListUml:[],ruleList:t.stratForm.ruleList,show:t.show,vLock:t.vLock,appId:t.appId},on:{getVarType:t.getVarType}})],1),t._v(" "),"stratAdd"==t.$route.name||"stratEdit"==t.$route.name||t.stratForm.policyId?t._e():i("el-form-item",{staticClass:"policyType",attrs:{label:""}},[i("el-checkbox",{model:{value:t.stratForm.policyType,callback:function(e){t.$set(t.stratForm,"policyType",e)},expression:"stratForm.policyType"}},[t._v("保存为策略模板")])],1)],1),t._v(" "),t.$route.path.indexOf("/stratMg/stratList/stratEdit")>0?i("div",[i("el-button",{attrs:{type:"primary",size:"medium"},on:{click:function(e){t.saveStrat("stratEditBtn")}}},[t._v("保存")])],1):i("div",{staticClass:"modelBtn"},["edit"==t.$route.query.type&&"kingForm"==t.$route.query.from&&t.canShow?i("div",[i("el-button",{attrs:{type:"primary",size:"medium"},on:{click:function(e){t.saveStrat("isChooseBtn")}}},[t._v("保存\n                    ")])],1):"edit"==t.$route.query.type&&!t.$route.query.from&&t.canShow||t.$route.path.indexOf("stratAdd")&&"add"==t.$route.query.type?i("div",[i("el-button",{attrs:{type:"primary",size:"medium"},on:{click:function(e){t.saveStrat("newCelueBtn")}}},[t._v("保存\n                    ")])],1):t._e(),t._v(" "),"edit"!=t.$route.query.type||t.canShow?t._e():i("div",[i("el-button",{attrs:{type:"primary",size:"medium"},on:{click:function(e){t.saveStrat("isAddBtn")}}},[t._v("保存")])],1)])],1)],1),t._v(" "),i("router-view",{attrs:{icon:t.icon,variableList:t.variableList,appId:t.appId},on:{createRuleSuccess:t.pushRule,getVarType:t.getVarType}})],1)},staticRenderFns:[]};var p=i("C7Lr")(c,u,!1,function(t){i("DjeO")},"data-v-4a12571e",null);e.default=p.exports},UIfv:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s={name:"pages_stratAdd",data:function(){return{pageName:"pages_stratAdd",variableList:[],stratAddForm:{appId:""},rules:{}}},props:["productList","policyList"],components:{stratForm:i("KPgr").default},created:function(){"edit"==this.$route.query.type&&(this.stratAddForm.appId=this.$route.query.appId)},methods:{}},r={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"pages_stratAdd"},[i("el-form",{ref:"stratAddForm",staticClass:"stratAddForm",attrs:{model:t.stratAddForm,"status-icon":"",rules:t.rules}},[i("el-form-item",{staticClass:"productList",attrs:{label:"edit"==t.$route.query.type?"产品线：":"选择产品线："}},[i("el-select",{attrs:{filterable:"",placeholder:"请选择",size:"medium",disabled:"edit"==t.$route.query.type},model:{value:t.stratAddForm.appId,callback:function(e){t.$set(t.stratAddForm,"appId",e)},expression:"stratAddForm.appId"}},t._l(t.productList,function(t,e){return i("el-option",{key:t.appId,attrs:{label:t.productName,value:t.appId}})}))],1),t._v(" "),i("div",{staticClass:"stratAddForm_bd"},[i("stratForm",{ref:"stratForm",attrs:{policyType:0,appId:t.stratAddForm.appId,variableListUml:t.variableList,policyListUml:t.policyList}})],1)],1)],1)},staticRenderFns:[]};var a=i("C7Lr")(s,r,!1,function(t){i("bmMe")},"data-v-bc4f6ac0",null);e.default=a.exports},bmMe:function(t,e){}});