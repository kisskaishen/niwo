webpackJsonp([45],{I2WQ:function(e,r){},"h//x":function(e,r,o){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=o("aA9S"),t=o.n(s),d=o("3cXf"),a=o.n(d),c={name:"pages_scoreCardForm",data:function(){return{loading:!1,pageName:"pages_scoreCardForm",scoreCard:{nodeId:"",nodeName:"评分卡",scorecardId:"",scorecardName:"评分卡"},scoreCardlList:[],isNewNode:!0,vLock:!1,localIndex:"-1"}},created:function(){this.scoreCard.nodeId=this.$route.query.nodeId,this.getScorecardList()},methods:{getScorecardList:function(){var e=this;this.$post("/mcs/mold/config/list",{appId:this.$route.query.appId,moldType:this.$route.query.needmoldtype}).then(function(r){e.scoreCardlList=r.moldList,e.$local.get("scoreListId")&&"{}"!=a()(e.$local.get("scoreList"))&&(e.scoreCard.scorecardId=e.$local.get("scoreListId"),e.$local.get("scoreList").map(function(r,o){r.id==e.scoreCard.scorecardId&&(e.localIndex=o)})),e.getSelected()})},getSelected:function(){var e=this;this.$post("/mcs/node/mold/query",{nodeId:this.$route.query.nodeId.slice(4)}).then(function(r){r.bindMoldList.length>0?(e.scoreCard.scorecardId=r.bindMoldList[e.$local.get("formIndex")-1||0].bindId,e.scoreCard.scorecardName=r.bindMoldList[e.$local.get("formIndex")-1||0].bindName):e.scoreCard.scorecardId="",e.scoreCard.id=e.scoreCard.scorecardId,e.scoreCardlList.map(function(r,o){e.scoreCard.id==r.id&&e.getVariableList(r.moldCode)})})},getVariableList:function(e){var r=this;this.$post("/mcs/mold/variable/query",{moldCode:e,appId:this.$route.query.appId}).then(function(e){r.creditInfo=e,r.loading=!1})},changeSD:function(e){var r=this;this.scoreCardlList.map(function(o,s){o.id==e&&(r.scoreCard.scorecardName=o.moldName,t()(r.scoreCard,r.scoreCardlList[s]),r.getVariableList(o.moldCode),console.log(r.scoreCard))})},bindscoreCard:function(){var e=this;if("kingForm"==this.$route.query.from){var r="{}"!=a()(this.$local.get("scoreList"))?this.$local.get("scoreList"):[];this.$local.get("formIndex")?r[this.$local.get("formIndex")-1]=this.scoreCard:r.push(this.scoreCard),this.$local.set("scoreList",r),this.$router.push(this.$route.fullPath.replace("/scoreCardForm","/kingForm"))}else{var o=JSON.parse(a()(this.scoreCard));o.bindId=o.bindId||o.id||o.scorecardId,o.bindName=o.scorecardName;var s=[];s.push(o),console.log(o),o.scorecardId?this.$post("/mcs/node/mold/bind",{nodeId:this.$route.query.nodeId.slice(4),bindMoldList:s}).then(function(r){e.$message.success("绑定成功"),o.nodeName=e.scoreCard.scorecardName,o.nodeId=e.$route.query.nodeId,e.$emit("saveForm",o)}):this.$notify({message:"请选择评分卡",type:"warning",customClass:"pos-bindscoreCard"})}}}},i={render:function(){var e=this,r=e.$createElement,o=e._self._c||r;return o("div",{staticClass:"pages_scoreCardForm"},[o("el-form",{ref:"scoreCard",staticClass:"scoreCard",attrs:{model:e.scoreCard,"status-icon":""}},[o("el-form-item",[o("el-select",{staticClass:"w310",class:{solid_red:e.vLock&&!e.scoreCard.scorecardId},attrs:{"popper-append-to-body":!0,filterable:"",placeholder:"请选择评分卡",size:"medium","no-match-text":"查询无结果","no-data-text":"暂无数据","popper-class":"stratList",disabled:"look"==e.$route.query.type},on:{change:e.changeSD},model:{value:e.scoreCard.scorecardId,callback:function(r){e.$set(e.scoreCard,"scorecardId",e._n(r))},expression:"scoreCard.scorecardId"}},e._l(e.scoreCardlList,function(r,s){return o("el-option",{key:s,attrs:{label:r.moldName,value:r.id}},[o("div",{staticClass:"stratOption overhide",attrs:{title:r.moldName}},[e._v("\n                        "+e._s(r.moldName)+"V."+e._s(r.moldVersion)+"\n                    ")])])}))],1),e._v(" "),"look"!=e.$route.query.type?o("div",{staticClass:"text-center"},[o("el-button",{attrs:{type:"primary",size:"medium"},on:{click:e.bindscoreCard}},[e._v("保存")])],1):e._e()],1)],1)},staticRenderFns:[]};var n=o("C7Lr")(c,i,!1,function(e){o("I2WQ")},null,null);r.default=n.exports}});