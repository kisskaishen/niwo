<template>
    <div class="pages_modelUml">
        <div class="uml_hd">
            <div class="uml_back" id="uml_back">
                <div class="uml_icon" alt="返回"></div>
                <p class="uml_title">返回</p>
            </div>
            <div class="uml_revoke" id="uml_revoke">
                <div class="uml_icon" alt="撤销"></div>
                <p class="uml_title">撤销</p>
            </div>
            <div class="uml_recovery" id="uml_recovery">
                <div class="uml_icon" alt="恢复"></div>
                <p class="uml_title">恢复</p>
            </div>
            <div class="uml uml_start" id="uml_start" draggable="true" @dragstart="dragstart($event)">
                <div class="uml_icon" alt="开始" @click="switchForm('/risk/modelMg/modelUml/selectClassify')"></div>
                <p class="uml_title">开始</p>
            </div>
            <div class="uml uml_classify" id="uml_classify" draggable="true" @dragstart="dragstart($event)" @click="switchForm('/risk/modelMg/modelUml/classifyForm')">
                <div class="uml_icon" alt="分类器"></div>
                <p class="uml_title">分类器</p>
            </div>
            <div class="uml uml_strat" id="uml_strat" draggable="true" @dragstart="dragstart($event)" @click="switchForm('/risk/modelMg/modelUml/stratForm')">
                <div class="uml_icon" alt="策略"></div>
                <p class="uml_title">策略</p>
            </div>
            <div class="uml uml_parallel" id="uml_parallel" draggable="true" @dragstart="dragstart($event)" @click="switchForm('/risk/modelMg/modelUml/parallelForm')">
                <div class="uml_icon" alt="并行"></div>
                <p class="uml_title">并行</p>
            </div>
            <!--<div class="uml uml_parallelStrat" id="uml_parallelStrat">
                <div class="uml_icon" alt="并行策略"></div>
                <p class="uml_title">并行策略</p>
            </div>
            <div class="uml uml_together" id="uml_together">
                <div class="uml_icon" alt="聚合"></div>
                <p class="uml_title">聚合</p>
            </div> -->
            <div class="uml uml_test" id="uml_test" draggable="true" @dragstart="dragstart($event)" @click="switchForm('/risk/modelMg/modelUml/testAB')">
                <div class="uml_icon" alt="B测试"></div>
                <p class="uml_title">A/B测试</p>
            </div>
            <div class="uml uml_scoreCard" id="uml_scoreCard" draggable="true" @dragstart="dragstart($event)">
                <div class="uml_icon" alt="评分卡"></div>
                <p class="uml_title">评分卡</p>
            </div>
            <div class="uml uml_calculator" id="uml_calculator" draggable="true" @dragstart="dragstart($event)">
                <div class="uml_icon" alt="计算卡" @click="switchForm('/risk/modelMg/modelUml/computecard')"></div>
                <p class="uml_title">计算卡</p>
            </div>
            <div class="uml uml_end" id="uml_end" draggable="true" @dragstart="dragstart($event)">
                <div class="uml_icon" alt="结束"></div>
                <p class="uml_title">结束</p>
            </div>
        </div>
        <div class="uml_bd wh100" id="uml_bd" @mouseenter="dragEnter($event)" @click="switchForm('/risk/modelMg/modelUml')"></div>
        <div class="dragTmp" id="dragTmp" @mousemove="drag($event)" @mouseleave="dragend($event)" @mouseup="dragend($event)"></div><!-- 放大拖拽图标，但被原生图标覆盖 -->
        <span class="dragIcon" id="dragIcon"></span>
        <div class="uml_form bg_fff pd_l_20 pd_r_20 scrollY" :class="!!show.policyType&&$route.name!='modelUml'?'fadeInLeft':'fadeOutRight'">
            <router-view :policyType="show.policyType" />
        </div>
    </div>
</template>

<script>
let jsPlumb = require('jsplumb').jsPlumb; 
import {importDefaults,endpoint} from 'js/jsPlumbConf'
export default {
    name: 'pages_modelUml',
    data () {
        return {
            pageName: 'pages_modelUml',
            show:{
                policyType:'',
            },
            dragCur:{
                id:'',
                x:0,
                y:0,
                index:0,
                bdWidth:0,
                bdHeight:0,
            },
        }
    },
    created () {

    },
    mounted() {
        this.getUmlBdSize();// 控制画布区域
        window.onresize=()=>{this.getUmlBdSize()};// 控制画布区域  
    },
    methods:{
        dragstart(e) {// 从工具栏开始拖动元素时
            e.preventDefault();
            console.log('拖拽开始',e.x,e.y,e)
            this.dragCur.index ++;
            let crt = e.target.cloneNode(true);
            this.dragCur.id = crt.id = e.target.id+this.dragCur.index;
            document.getElementById('dragTmp').appendChild(crt)
            document.getElementById('dragTmp').style.left = e.x-200-64/2+'px';
            document.getElementById('dragTmp').style.top = e.y-140+77/2+'px';
        },
        drag(e) {// 从工具栏拖动过程中
            // e.preventDefault();
            // console.log('拖拽中',e.x,e.y,e)
            document.getElementById('dragTmp').style.left = e.x-200-64/2+'px';
            document.getElementById('dragTmp').style.top = e.y-140+77/2+'px';
            // document.querySelector('#dragTmp .uml_title').innerText = e.x + ',' + e.y + ',' + this.correctX(e) + this.correctY(e);
        },
        dragend(e) {// 从工具栏拖放再画布时
            // e.preventDefault();
            // console.log('拖拽结束',e.x,e.y)
            // this.dragCur.x = e.x;
            // this.dragCur.y = e.y;
            // // if(e.y<196){
            // //     document.getElementById('dragTmp').style.top = 0+'px';
            // // }
            // this.jsPlumbReady(document.getElementById('uml_bd'))   
            // document.getElementById('dragTmp').style.left = -99999+'px';      
        },
        dragEnter(e) {
            console.log('拖进来了',e.x,e.y)
            this.jsPlumbReady(document.getElementById('uml_bd'))          
        },
        jsPlumbReady(target) {
            if(document.getElementById(this.dragCur.id)){ 
                jsPlumb.ready(()=> {
                    jsPlumb = jsPlumb.importDefaults(importDefaults); 
                    document.getElementById(this.dragCur.id).style.top = document.getElementById('dragTmp').style.top.split('px')[0]-60+'px';
                    document.getElementById(this.dragCur.id).style.left = document.getElementById('dragTmp').style.left;
                    target.appendChild(document.getElementById(this.dragCur.id));
                    this.addEndpoint(this.dragCur.id);// 增加锚点
                    jsPlumb.draggable(document.querySelectorAll('.uml_bd .uml'),{// 添加拖拽事件
                        containment: 'parent',// 设定拖动范围
                        // grid: [10, 10],// 节点网格对齐
                    })
                }); 
            }           
        },
        addEndpoint(id) {
            ["TopRight","TopLeft","BottomLeft","BottomRight","TopCenter", "BottomCenter","LeftMiddle","RightMiddle"].map((item)=>{
                jsPlumb.addEndpoint(id,{
                    anchor:item,
                    cssClass:item,
                    hoverClass:item+'_hover',
                },endpoint.style);                    
            })
        },
        correctX(e){
            return e.x-200+20+'px';
            if(e.x<(255)){
                return 0+'px';
            }else if(e.x>this.dragCur.bdWidth){
                return this.dragCur.bdWidth-e.target.scrollWidth+'px';
            }else{
                return e.x-200-e.target.scrollWidth+'px';
            }
        },
        correctY(e){
            return e.y-60+20+'px';
            if(e.y<=196){
                return e.y-100+'px';
            }else if(e.y>this.dragCur.bdHeight+100){
                return this.dragCur.bdHeight+'px';
            }else{
                return e.y-100+'px';
            } 
        },
        getUmlBdSize() {
            this.dragCur.bdWidth = document.getElementById('uml_bd').scrollWidth;
            this.dragCur.bdHeight = document.getElementById('uml_bd').scrollHeight;            
        },
        switchForm(path) {
            this.show.policyType = ''; 
            this.switchPath(path);
            this.$router.push({path:path,query:this.$route.query});       
        },
        switchForm2(path) {
            this.show.policyType = '';
            if(this.$route.name=='modelUml'){// 关闭时打开
                this.$router.push({path:path,query:this.$route.query});
                this.switchPath(path);                              
            }else{// 打开时关闭
                this.$router.push({path:'/risk/modelMg/modelUml',query:this.$route.query});
            }
        },
        switchPath(path) {
            setTimeout(()=>{
                switch(path){
                    case '/risk/modelMg/modelUml/stratForm':
                        this.show.policyType = 1;
                        break;
                    case '/risk/modelMg/modelUml/classifyForm':
                        this.show.policyType = 2;
                        break;
                    case '/risk/modelMg/modelUml/parallelForm':
                        this.show.policyType = 3;
                        break;
                    default:
                        this.show.policyType = true;
                        break;
                }                      
            },this.$route.name=='modelUml'?0:300)              
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_modelUml{
    position: relative;
    margin-left: -40px;
    .uml_hd{
        width:100%px;
        height:60px;
        padding-top:8px;
        background: #EAEEF0;
        &>div{
            text-align: center;
            display: inline-block;
            cursor: pointer;
            .uml_title{
                font-size: 12px;
            }
        }
        .uml_back{
            padding:0 22px;
            border-right:1px solid #CED1DB;
        }
        .uml_revoke,.uml_start{
            padding-left:22px;
        }
        .uml_recovery{
            padding-right:22px;
            border-right:1px solid #CED1DB;
        }
    }
    .uml_bd{        
        position: relative;
        min-height: 740px;
    }
    .uml_form{
        /*min-width:700px;*/
        border-left:1px solid #E4E7F2;
        position: absolute;
        top:60px;
        right:0;
        bottom:0px;   
        transition: all 0.3s ease;
        &.fadeInLeft{
            transform: translateX(0);
        }
        &.fadeOutRight{
            transform: translateX(100%);
        }
    }
    .dragTmp{
        position: absolute;
        left: -99999px;
    }
    .uml_back .uml_icon{background-image:url(../../../resource/img/uml/opr/back.png)}
    .uml_revoke .uml_icon{background-image:url(../../../resource/img/uml/opr/revoke.png)}
    .uml_recovery .uml_icon{background-image:url(../../../resource/img/uml/opr/recovery.png)}
    .uml_start .uml_icon{background-image:url(../../../resource/img/uml/opr/start.png)}
    .uml_classify .uml_icon{background-image:url(../../../resource/img/uml/opr/classify.png)}
    .uml_strat .uml_icon{background-image:url(../../../resource/img/uml/opr/strat.png)}
    .uml_parallel .uml_icon{background-image:url(../../../resource/img/uml/opr/parallel.png)}
    /*.uml_parallelStrat .uml_icon{background-image:url(../../../resource/img/uml/opr/parallelStrat.png)}*/
    /*.uml_together .uml_icon{background-image:url(../../../resource/img/uml/opr/together.png)}*/
    .uml_test .uml_icon{background-image:url(../../../resource/img/uml/opr/test.png)}
    .uml_end .uml_icon{background-image:url(../../../resource/img/uml/opr/end.png)}

    .uml_scoreCard .uml_icon{background-image:url(../../../resource/img/uml/opr/scoreCard.png)}
    .uml_calculator .uml_icon{background-image:url(../../../resource/img/uml/opr/calculator.png)}
    .uml_icon{
        width:54px;
        height:26px;
        margin-bottom: 4px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 24px auto;
    }
    .uml_bd,.dragTmp{
        .uml{
            padding:5px;
            text-align: center;
            .uml_icon{
                height:42px;
                margin-bottom: 4px;
                background-size: 40px auto;
            } 
            .uml_title{
                font-size: 14px;
            }
        }       
    }
    .uml_bd{
        .uml{
            position: absolute;
        }
    }
}
</style>
