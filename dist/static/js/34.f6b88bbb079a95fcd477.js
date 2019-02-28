webpackJsonp([34],{CmBW:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("MgeX"),s=a.n(i),o={name:"pages_stratList",data:function(){return{btnDisabled:!1,modelForm:{appId:"",policyName:""},productList:[],policyList:[],pagePara:{currentPage:1,count:0,pageNo:1,pageSize:10}}},beforeRouteUpdate:function(t,e,a){this.getPolicyList(),this.products(),a()},created:function(){this.getPolicyList(),this.products()},methods:{handleSizeChange:function(t){this.pagePara.pageSize=Number(t),this.getPolicyList()},handleCurrentChange:function(t){this.pagePara.pageNo=t},updatePolicyStatus:function(t){var e=this,a=1==t.policyStatus?"禁用成功":"启用成功";this.$msgbox.confirm("",{title:"系统提示",message:'<p class="f_333">确认要'+a+t.policyName+"模板？",dangerouslyUseHTMLString:!0,type:"warning"}).then(function(){axios({url:"/mcs/policy/status/update",data:{id:t.id},successMsg:a},function(t){e.getPolicyList()},function(t){})})},delPolicyItem:function(t){var e=this;this.$msgbox.confirm("",{title:"系统提示",message:'<p class="f_333">确认要删除'+t.policyName+"模板？",dangerouslyUseHTMLString:!0,type:"warning"}).then(function(){e.$post("/mcs/policy/delete",{id:t.id}).then(function(t){e.$message.success("删除成功"),e.getPolicyList()})})},stratVersion:function(t){this.$router.push({path:"/risk/stratMg/stratVersion",query:{policyTmpId:t.id}})},getPolicyList:function(){var t=this,e=this.$session.get("stratListData"),a={appId:this.modelForm.appId,policyName:this.modelForm.policyName,pageNo:this.pagePara.pageNo,pageSize:this.pagePara.pageSize};s()(a).map(function(a){s()(e).map(function(i){a!=i&&(a=i,t.pagePara.pageNo=e.pageNo)})}),this.$post("/mcs/policy/template/list",a).then(function(e){t.policyList=e.policyList,t.pagePara.count=e.count,t.btnDisabled=!1,t.$session.set("stratListData",a)})},btnSearch:function(){this.btnDisabled=!0,this.pagePara.pageNo=1,this.getPolicyList()},addStratTmp:function(){this.$router.push({path:"/risk/stratMg/stratList/stratAdd",query:{type:"add"}})},editPolicyItem:function(t){this.$router.push({path:"/risk/stratMg/stratList/stratEdit",query:{type:"edit",policyId:t.id,appId:t.appId}})},products:function(){var t=this;this.$post("/mcs/product/list",{pageNo:"-1"}).then(function(e){t.productList=e.productList})}},components:{noData:a("VGsm").a}},l={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return"stratList"==t.$route.name?a("div",{staticClass:"pages_stratList"},[a("el-form",{ref:"modelForm",staticClass:"modelForm inlineBlock mg_t_20",staticStyle:{width:"100%"},attrs:{"status-icon":"","label-position":"left"}},[a("el-form-item",{staticClass:"fl mg_r_20 productList",attrs:{label:"产品线：","label-width":"60px"}},[a("el-select",{attrs:{filterable:"",placeholder:"请选择",size:"small"},model:{value:t.modelForm.appId,callback:function(e){t.$set(t.modelForm,"appId",e)},expression:"modelForm.appId"}},[a("el-option",{attrs:{label:"全部",value:""}}),t._v(" "),t._l(t.productList,function(t,e){return a("el-option",{key:e,attrs:{label:t.productName,value:t.appId}})})],2)],1),t._v(" "),a("el-form-item",{staticClass:"fl mg_r_20 moldName",attrs:{label:"策略名称：","label-width":"80px"}},[a("el-input",{attrs:{size:"small",placeholder:"请输入关键字",clearable:""},nativeOn:{keyup:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?t.btnSearch(e):null}},model:{value:t.modelForm.policyName,callback:function(e){t.$set(t.modelForm,"policyName","string"==typeof e?e.trim():e)},expression:"modelForm.policyName"}}),t._v(" "),a("el-button",{staticStyle:{width:"80px","margin-left":"20px"},attrs:{type:"primary",size:"small",disabled:t.btnDisabled},on:{click:t.btnSearch}},[t._v("查询")])],1),t._v(" "),a("el-form-item",{staticClass:"btn",attrs:{label:""}},[a("el-button",{attrs:{size:"small",plain:""},on:{click:t.addStratTmp}},[t._v("+新增策略模板")])],1)],1),t._v(" "),a("div",{staticClass:"container containerFlexStart"},t._l(t.policyList,function(e){return a("div",{staticClass:"list-item fl"},[a("h2",[a("span",{staticClass:"overhide inlineBlock w200 text-middle"},[t._v(t._s(e.policyName))]),t._v(" "),1==e.policyStatus?a("b",[t._v("生效")]):a("b",{staticClass:"invalid"},[t._v("失效")])]),t._v(" "),a("p",{staticClass:"mg_t_30"},[t._v("产品线："+t._s(e.productName))]),t._v(" "),a("p",[t._v("创建人："+t._s(e.createBy))]),t._v(" "),a("p",[t._v("创建时间："+t._s(e.createTime))]),t._v(" "),a("p",[t._v("最后更新时间："+t._s(e.updateTime))]),t._v(" "),a("p",{staticClass:"p-box"},[a("a",{class:{"stop-btn":1==e.policyStatus},attrs:{href:"javascript:;"},on:{click:function(a){t.updatePolicyStatus(e)}}},[t._v(t._s(1==e.policyStatus?"禁用":"启用"))]),t._v(" "),a("a",{attrs:{href:"javascript:;"},on:{click:function(a){t.editPolicyItem(e)}}},[t._v("编辑")]),t._v(" "),a("a",{attrs:{href:"javascript:;"},on:{click:function(a){t.delPolicyItem(e)}}},[t._v("删除")])])])})),t._v(" "),t.policyList.length<=0?a("noData",{attrs:{img:"noData",p2:"暂无数据"}}):t._e(),t._v(" "),t.policyList.length?a("div",{staticClass:"block pagination"},[a("el-pagination",{attrs:{"current-page":t.pagePara.pageNo,"page-sizes":[10,15,20],"page-size":10,layout:"total, sizes, prev, pager, next, jumper",total:t.pagePara.count},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1):t._e()],1):a("router-view",{attrs:{productList:t.productList,policyList:t.policyList}})},staticRenderFns:[]};var n=a("C7Lr")(o,l,!1,function(t){a("WNqe")},"data-v-696f90c8",null);e.default=n.exports},WNqe:function(t,e){}});