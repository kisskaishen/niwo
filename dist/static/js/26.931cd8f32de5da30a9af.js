webpackJsonp([26],{W1HH:function(e,r,o){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=o("aA9S"),t=o.n(s),d=o("3cXf"),a=o.n(d),c={name:"pages_scoreCardForm",data:function(){return{loading:!0,pageName:"pages_scoreCardForm",scoreCard:{nodeId:"",nodeName:"评分卡",scorecardId:"",scorecardName:"评分卡"},scoreCardlList:[],isNewNode:!0,vLock:!1,localIndex:"-1",creditInfo:{}}},created:function(){this.scoreCard.nodeId=this.$route.query.nodeId,this.getScorecardList()},methods:{getScorecardList:function(){var e=this;this.$post("/mcs/mold/config/list",{appId:this.$route.query.appId,moldType:this.$route.query.needMoldType}).then(function(r){e.scoreCardlList=r.moldList,console.log(e.scoreCardlList),e.$local.get("scoreListId")&&"{}"!=a()(e.$local.get("scoreList"))&&(e.scoreCard.scorecardId=e.$local.get("scoreListId"),e.$local.get("scoreList").map(function(r,o){r.id==e.scoreCard.scorecardId&&(e.localIndex=o)})),e.getSelected(),e.loading=!1})},getSelected:function(){var e=this;this.$post("/mcs/node/mold/query",{nodeId:this.$route.query.nodeId.slice(4)}).then(function(r){r.bindMoldList.length>0?(e.scoreCard.scorecardId=r.bindMoldList[e.$local.get("formIndex")-1||0].bindId,e.scoreCard.scorecardName=r.bindMoldList[e.$local.get("formIndex")-1||0].bindName):e.scoreCard.scorecardId="",e.scoreCard.id=e.scoreCard.scorecardId,e.scoreCardlList.map(function(r,o){e.scoreCard.id==r.id&&e.getVariableList(r.moldCode)})})},getVariableList:function(e){var r=this;this.$post("/mcs/mold/variable/query",{moldCode:e,appId:this.$route.query.appId}).then(function(e){console.log(e),r.creditInfo=e})},changeSD:function(e){var r=this;this.scoreCardlList.map(function(o,s){o.id==e&&(r.scoreCard.scorecardName=o.moldName,t()(r.scoreCard,r.scoreCardlList[s]),r.getVariableList(o.moldCode))})},bindscoreCard:function(){var e=this;if("kingForm"==this.$route.query.from){var r="{}"!=a()(this.$local.get("formList"))?this.$local.get("formList"):[];console.log(this.$local.get("formIndex")),this.$local.get("formIndex")?r[this.$local.get("formIndex")-1]=this.scoreCard:r.push(this.scoreCard),console.log(r),this.$local.set("formList",r),this.$router.push(this.$route.fullPath.replace("/scoreCardForm","/kingForm"))}else{var o=JSON.parse(a()(this.scoreCard));o.bindId=o.bindId||o.id||o.scorecardId,o.bindName=o.scorecardName;var s=[];s.push(o),console.log(o),o.scorecardId?this.$post("/mcs/node/mold/bind",{nodeId:this.$route.query.nodeId.slice(4),bindMoldList:s}).then(function(r){e.$message.success("绑定成功"),o.nodeName=e.scoreCard.scorecardName,o.nodeId=e.$route.query.nodeId,e.$emit("saveForm",o)}):this.$notify({message:"请选择评分卡模型",type:"warning",customClass:"pos-bindscoreCard"})}}}},i={render:function(){var e=this,r=e.$createElement,o=e._self._c||r;return o("div",{staticClass:"pages_scoreCardForm"},[o("el-form",{ref:"scoreCard",staticClass:"scoreCard",attrs:{model:e.scoreCard,"status-icon":""}},[o("el-form-item",[o("el-select",{staticClass:"w310",class:{solid_red:e.vLock&&!e.scoreCard.scorecardId},attrs:{"popper-append-to-body":!0,filterable:"",placeholder:"请选择评分卡模型",size:"medium","no-match-text":"查询无结果","no-data-text":"暂无数据","popper-class":"stratList",disabled:"look"==e.$route.query.type},on:{change:e.changeSD},model:{value:e.scoreCard.scorecardId,callback:function(r){e.$set(e.scoreCard,"scorecardId",e._n(r))},expression:"scoreCard.scorecardId"}},e._l(e.scoreCardlList,function(r,s){return o("el-option",{key:s,attrs:{label:r.moldName,value:r.id}},[o("div",{staticClass:"stratOption overhide",attrs:{title:r.moldName}},[e._v("\n                        "+e._s(r.moldName)+"V."+e._s(r.moldVersion)+"\n                    ")])])}))],1),e._v(" "),e.scoreCard.scorecardId?o("div",{staticClass:"creditInfoDiv"},[o("p",[e._v("风险定价模型过程变量：")]),e._v(" "),o("ul",[o("li",[o("p",[e._v("变量名称（中文）")]),e._v(" "),o("p",[e._v("类型")]),e._v(" "),o("p",[e._v("映射")]),e._v(" "),o("p",[e._v("备注")])]),e._v(" "),o("li",[o("p",[e._v(e._s(e.creditInfo.variableName))]),e._v(" "),o("p",[e._v("\n                        "+e._s("1"==e.creditInfo.variableType?"字符串":"2"==e.creditInfo.variableType?"整型":"3"==e.creditInfo.variableType?"浮点型":"4"==e.creditInfo.variableType?"日期型":"5"==e.creditInfo.variableType?"枚举型":"6"==e.creditInfo.variableType?"布尔型":""))]),e._v(" "),o("p",[e._v("评分总和")]),e._v(" "),o("p",[e._v(e._s(e.creditInfo.remark))])])])]):e._e(),e._v(" "),"look"!=e.$route.query.type?o("div",{staticClass:"text-center"},[o("el-button",{attrs:{type:"primary",size:"medium"},on:{click:e.bindscoreCard}},[e._v("保存")])],1):e._e()],1)],1)},staticRenderFns:[]};var n=o("C7Lr")(c,i,!1,function(e){o("hI5d")},null,null);r.default=n.exports},hI5d:function(e,r){}});