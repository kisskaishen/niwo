webpackJsonp([23],{GX7Z:function(t,s,i){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var e=i("aA9S"),a=i.n(e),o={name:"pages_stratVersion",data:function(){return{pageName:"pages_stratVersion",classifyForm:{policyList:[]},vLock:!1}},components:{policyItem:i("+5dV").a},created:function(){this.getStratVersionList()},methods:{getStratVersionList:function(){var t=this;this.$post("/mcs/policy/template/version/list",{id:this.$route.query.policyTmpId}).then(function(s){t.isNewNode=!1,s.policyList.map(function(t){t.policyShow=!1,t.ruleList=[]}),a()(t.classifyForm,s)})}}},c={render:function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"pages_stratVersion"},[s("el-form",{staticClass:"classifyForm",attrs:{model:this.classifyForm,"status-icon":""}},[s("div",{staticClass:"f20 text-center pd_30"},[this._v("版本记录")]),this._v(" "),s("div",{staticClass:"classifyForm_bd"},[s("policyItem",{ref:"policyItem",attrs:{classifyForm:this.classifyForm,vLock:this.vLock}})],1)])],1)},staticRenderFns:[]};var r=i("C7Lr")(o,c,!1,function(t){i("J9Ph")},"data-v-d3cfbcdc",null);s.default=r.exports},J9Ph:function(t,s){}});