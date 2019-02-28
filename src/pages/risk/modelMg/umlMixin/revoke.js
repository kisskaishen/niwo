export const revoke = {
	data(){
		return {
			his:[],
			lineInitArr:[],
			tmp:{
				initForm:{},
			},
			pointer:0,
			endpointLock:true,
			dom:{
				oprOpp: {// nodetype: 1：开始，2：结束，3：分类器，4：策略，5：评分卡，6：计算卡，7：AB测试，8：并行
					create:'delete',
					update:'update',
					bind:'bind',
					delete:'create',
	            	3:'/mcs/node/category/bind',
	            	4:'/mcs/node/policy/bind',
	            	5:'/mcs/node/mold/bind',
	            	6:'/mcs/node/computecard/bind',
	            	// 7:'/mcs/node/tester/bind',
	            	7:'/mcs/node/parallel/bind',
	            	line:'/mcs/node/line/update',
				},
				push:(oprtype,nodeData)=> {// create/delete
					const oppData = Object.assign({},nodeData,{oprtype:this.dom.oprOpp[oprtype]})
					this.dom[oprtype] = Object.assign({},this.dom[oprtype],{do:nodeData,undo:oppData})
					this.his = this.his.slice(0,this.pointer+1);// 每次新增动作时，清除当前指针后面的记录。
					this.his.push(this.dom[oprtype]);
					this.pointer = this.his.length-1;
					// console.log('【push】：',oprtype,nodeData,this.pointer,this.his)
				},
				multiPush:(oprtype,oldMsg,nodeData)=> {// update/bind
					oldMsg.oprtype = nodeData.oprtype = oprtype;// 连线的do/undo里面没有oprtype，所以要手动赋值
					this.dom[oprtype] = Object.assign({},this.dom[oprtype],{do:nodeData,undo:oldMsg})
					this.his = this.his.slice(0,this.pointer+1);// 每次新增动作时，清除当前指针后面的记录。
					this.his.push(this.dom[oprtype]);
					this.pointer = this.his.length-1;
					console.log(this.dom[oprtype])
					// console.log('【multiPush】：',oprtype,oldMsg,nodeData,this)
				},
				create:{// 操作类型
					do:{},// do数据
					undo:{},// undo数据
					revoke(vm){// 撤销
						vm.ajax[vm.finalOpr(this.undo.oprtype)+vm.nodeOrLine(this.undo.nodetype)](this.undo);
					},
					recovery(vm){// 恢复
                        console.log('recovery',this.do.oprtype+vm.nodeOrLine(this.do.nodetype),this);
						vm.ajax[vm.finalOpr(this.do.oprtype)+vm.nodeOrLine(this.do.nodetype)](this.do);// 恢复创建时，会更新ID
					},
				},
				delete:{// 操作类型
					do:{},// do数据
					undo:{},// undo数据
					revoke(vm){// 撤销
                        console.log('revoke',this.undo.oprtype+vm.nodeOrLine(this.undo.nodetype),this);
						vm.ajax[vm.finalOpr(this.undo.oprtype)+vm.nodeOrLine(this.undo.nodetype)](this.undo);
					},
					recovery(vm){// 恢复
                        console.log('recovery',this.do.oprtype+vm.nodeOrLine(this.do.nodetype),this);
						vm.ajax[vm.finalOpr(this.do.oprtype)+vm.nodeOrLine(this.do.nodetype)](this.do);// 恢复创建时，会更新ID
					},
				},
				bind:{// 操作类型
					do:{},// do数据
					undo:{},// undo数据
					revoke(vm){// 撤销
						console.log('revoke',this.undo.oprtype+vm.nodeOrLine(this.undo.nodetype),this);
						vm.ajax[vm.finalOpr(this.undo.oprtype)+vm.nodeOrLine(this.undo.nodetype)](this.undo);
					},
					recovery(vm){// 恢复
                        console.log('recovery',this.do.oprtype+vm.nodeOrLine(this.do.nodetype),this);
						vm.ajax[vm.finalOpr(this.do.oprtype)+vm.nodeOrLine(this.do.nodetype)](this.do);// 恢复创建时，会更新ID
					},
				},
				update:{// 操作类型
					do:{},// do数据
					undo:{},// undo数据
					revoke(vm){// 撤销
                        console.log('revoke',this.undo.oprtype+vm.nodeOrLine(this.undo.nodetype),this);
						vm.ajax[vm.finalOpr(this.undo.oprtype)+vm.nodeOrLine(this.undo.nodetype)](this.undo);
					},
					recovery(vm){// 恢复
                        console.log('recovery',this.do.oprtype+vm.nodeOrLine(this.do.nodetype),this);
						vm.ajax[vm.finalOpr(this.do.oprtype)+vm.nodeOrLine(this.do.nodetype)](this.do);// 恢复创建时，会更新ID
					},
				},
			}
		}
	},
	methods:{
		finalOpr(oprtype) {
			return oprtype=='create'?'recovery':oprtype;
		},
		nodeOrLine(nodeType) {
			return nodeType=='line'?'Line':'Node';
		},
	}
}
