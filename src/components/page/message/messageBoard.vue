<template>
	<div class="table">
		<!-- <div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades"></i>用户管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div> -->
		<div class="container">
			<search-condition @clickSearchData="searchEvent">
				<div class="element">
					<p class="inline">状态</p>
					<div class="inline">
						<el-select v-model="searchForm.status" @change="statusChange" class="handle-select mr10 width120">
							<el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.value"></el-option>
						</el-select>
					</div>
				</div>
				<!-- <div class="element">
					<p class="inline">日期</p>
					<div class="inline">
						<el-date-picker class="width160" type="date" placeholder="选择日期" v-model="searchForm.date" value-format="yyyy-MM-dd"></el-date-picker>
					</div>
				</div> -->
			</search-condition>
			<el-table :data="tableData" border stripe class="table" ref="multipleTable" style="width: 100%">
				<el-table-column prop="ID" label="留言ID" width="80"></el-table-column>
				<!-- <el-table-column prop="date" label="日期"  width="120"></el-table-column> -->
				<el-table-column prop="date" label="用户ID" width="150"></el-table-column>
				<el-table-column prop="date" label="留言时间" width="120"></el-table-column>
				<el-table-column prop="date" label="留言类型" min-width="120"></el-table-column>
				<el-table-column prop="coupon" label="留言标题" width="150"></el-table-column>
				<el-table-column prop="leaveWord" label="留言内容" show-overflow-tooltip width="200"></el-table-column>
				<el-table-column prop="remark" label="回复内容" show-overflow-tooltip width="200">
					<!-- <template slot-scope="props">
						<span class="ellipsis">{{ props.row.remark }}</span>
					</template> -->
				</el-table-column>
				<el-table-column label="状态" fixed="right" width="80">
					<template slot-scope="props">
						<span :class="getColor(props.row.status)">{{ props.row.status | filterStatus }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="90" align="center" fixed="right">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-link>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<el-dialog :title="visibleType=='detail'?'详情':'编辑'" :visible.sync="detailOrEditVisible" fullscreen>
			<el-form ref="form" :model="form" label-width="auto" :inline="false" :disabled="visibleType=='detail'?true:false">
				<el-form-item label="用户ID">
					<el-input v-model="form.name" class="width200"></el-input>
				</el-form-item>
				<el-form-item label="留言时间">
					<el-input v-model="form.name" class="width200"></el-input>
				</el-form-item>
				<el-form-item label="留言类型">
					<el-input v-model="form.name" class="width200"></el-input>
				</el-form-item>
				<el-form-item label="留言标题">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="留言内容" class="block">
					<el-input type="textarea" autosize v-model="form.leaveWord"></el-input>
				</el-form-item>
				<el-form-item label="回复内容" class="block">
					<el-input type="textarea" autosize v-model="form.name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer left">
				<!-- <el-button @click="detailOrEditVisible = false">取 消</el-button> -->
				<el-button type="primary" icon="el-icon-edit" @click="replyBtn">回 复</el-button>
			</span>
		</el-dialog>

		<!-- 删除提示框 -->
		<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
			<div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delVisible = false">取 消</el-button>
				<el-button type="primary" @click="deleteRow">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="回复留言" :visible.sync="dialogFormVisible4reply">
			<el-form :model="replyRuleForm" :rules="rules" ref="replyRuleForm" label-width="100px">
				<el-form-item label="回复内容" prop="content">
				    <el-input type="textarea" v-model="replyRuleForm.content" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
				    <el-button @click="dialogFormVisible4reply = false">取 消</el-button>
				    <el-button type="primary" @click="sureReplyEvent('replyRuleForm')">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import searchCondition from "@/components/common/searchCondition.vue";
	export default {
		data() {
			return {
				replyRuleForm: {
					content: '',
				},
				rules: {
					content: [{
							type: 'string',
							required: true,
							message: '请输入回复内容',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 100,
							message: '长度在 3 到 100 个字符',
							trigger: 'blur'
						}
					],
				},
				imagesList: [
					'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
					'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
				],
				images: [{
						id: '1',
						url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
					},
					{
						id: '2',
						url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
					},
					{
						id: '3',
						url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
					},
					{
						id: '4',
						url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
					},
				],
				url: '',
				tableData: [],
				total: 400,
				pageIndex: 1,
				pageSizes: '',
				pageSize: '',
				currentPage: 1,
				multipleSelection: [],
				searchForm: {
					date: '',
					status: '未处理',
					condition: '',
					searchContent: ''
				},
				status: "",
				statusOptions: [{
						id: "0",
						value: "未处理"
					},
					{
						id: "1",
						value: "已处理"
					}
				],
				conditionOptions: [{
						id: "0",
						value: "买家ID"
					},
					{
						id: "1",
						value: "买家手机号"
					},
					{
						id: "2",
						value: "卖家ID"
					},
					{
						id: "3",
						value: "卖家手机号"
					}
				],
				select_cate: '',
				select_word: '',
				del_list: [],
				is_search: false,
				visibleType: 'detail',
				detailOrEditVisible: false,
				delVisible: false,
				form: {
					date: '',
					status: '',
					name: '',
					address: '',
					leaveWord: ''
				},
				adressWidth: '200px',
				idx: -1,
				checkedMineralDesc: false,
				dialogFormVisible4reply: false,
				replyContent: ''
			}
		},
		filters: {
			filterStatus(val) {
				var result = '';
				if (val == 0) {
					result = '未处理';
				} else if (val == 1) {
					result = '已处理';
				}
				return result;
			}
		},
		components: {
			searchCondition
		},
		created() {
			console.log("created")
			this.initData();
			this.getData();
		},
		computed: {
			// data() {
			//     return this.tableData.filter((d) => {
			//         let is_del = false;
			//         for (let i = 0; i < this.del_list.length; i++) {
			//             if (d.name === this.del_list[i].name) {
			//                 is_del = true;
			//                 break;
			//             }
			//         }
			//         if (!is_del) {
			//             if (d.address.indexOf(this.select_cate) > -1 &&
			//                 (d.name.indexOf(this.select_word) > -1 ||
			//                     d.address.indexOf(this.select_word) > -1)
			//             ) {
			//                 return d;
			//             }
			//         }
			//     })
			// }
		},
		methods: {
			getColor(status) {
				return status == "0" ? "red" : status == "1" ? "green" : "";
			},
			initData() {
				this.pageSizes = this.$config.pageSizes;
				this.pageSize = this.$config.pageSize;
			},
			checkedMineralDescChange() {
				console.log('checkedMineralDesc', this.checkedMineralDesc)
			},
			statusChange(val) {
				console.log('val', val)
			},
			conditionChange(val) {
				console.log('val', val)
			},
			searchEvent() {
				this.pageIndex = 1;
				console.log('searchForm', this.searchForm)

				// this.getList();
			},
			sureReplyEvent(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.dialogFormVisible4reply = false;
						this.detailOrEditVisible = false;
						console.log('replyContent', this.replyRuleForm.content)
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			replyBtn() {
				this.dialogFormVisible4reply = true;
				// this.$confirm('此操作将帮卖方确认, 是否继续?', '提示', {
				// 	confirmButtonText: '确定',
				// 	cancelButtonText: '取消',
				// 	type: 'warning'
				// }).then(() => {
				// 	this.$message({
				// 		type: 'success',
				// 		message: '确认成功'
				// 	});
				// 	this.detailOrEditVisible = false;
				// }).catch(() => {
				// 	this.$message({
				// 		type: 'info',
				// 		message: '我再考虑考虑'
				// 	});
				// });

			},
			cancelDealBtn() {
				this.$confirm('此操作将取消此单交易, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '取消成功'
					});
					this.detailOrEditVisible = false;
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '我再考虑考虑'
					});
				});
			},
			// 分页导航
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getData();
			},
			handleSizeChange(val) {
				console.log('size', val)
			},
			// 获取 easy-mock 的模拟数据
			getData() {
				// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
				if (process.env.NODE_ENV === 'development') {
					this.url = '/ms/table/list';
				};
				// this.$axios.post(this.url, {
				//     page: this.cur_page
				// }).then((res) => {
				//     this.tableData = res.data.list;
				// })
				this.tableData = [{
					ID: 1,
					date: '2016-05-02',
					name: '王小虎',
					region: '上海',
					phone: '13958776325',
					leaveWord: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
					zip: 200333,
					coupon: 10,
					status: 0
				}, {
					ID: 2,
					date: '2016-05-04',
					name: '王小虎',
					region: '上海',
					phone: '13958776325',
					leaveWord: '上海市普陀区金沙江路 1517 弄上海市普陀区金沙江路 1518 弄',
					zip: 200333,
					coupon: 10,
					status: 0
				}, {
					ID: 3,
					date: '2016-05-01',
					name: '王小虎',
					region: '上海',
					phone: '13958776325',
					leaveWord: '上海市普陀区金沙江路 1519 弄上海市普陀区金沙江路 1518 弄',
					zip: 200333,
					coupon: 10,
					status: 1
				}, {
					ID: 4,
					date: '2016-05-03',
					name: '王小虎',
					region: '上海',
					phone: '13958776325',
					leaveWord: '上海市普陀区金沙江路 1516 弄上海市普陀区金沙江路 1518 弄',
					zip: 200333,
					coupon: 10,
					status: 1
				}, {
					ID: 5,
					date: '2016-05-04',
					name: '王小虎',
					region: '上海',
					phone: '13958776325',
					leaveWord: '上海市普陀区金沙江路 1517 弄上海市普陀区金沙江路 1518 弄',
					zip: 200333,
					coupon: 10,
					status: 1
				}, {
					ID: 6,
					date: '2016-05-01',
					name: '王小虎',
					region: '上海',
					phone: '13958776325',
					address: '上海市普陀区金沙江路 1519 弄上海市普陀区金沙江路 1518 弄',
					zip: 200333,
					coupon: 10,
					status: 1
				}, {
					ID: 7,
					date: '2016-05-03',
					name: '王小虎',
					region: '上海',
					phone: '13958776325',
					address: '上海市普陀区金沙江路 1516 弄上海市普陀区金沙江路 1518 弄',
					zip: 200333,
					coupon: 10,
					status: 1
				}, {
					ID: 8,
					date: '2016-05-04',
					name: '王小虎',
					region: '上海',
					phone: '13958776325',
					address: '上海市普陀区金沙江路 1517 弄上海市普陀区金沙江路 1518 弄',
					zip: 200333,
					remark: "上海市普陀区金沙江路 1517 弄上弄上弄上",
					coupon: 10,
					status: 1
				}]
			},
			search() {
				this.is_search = true;
			},
			formatter(row, column) {
				return row.region;
			},
			filterTag(value, row) {
				return row.tag === value;
			},
			handleDetail(index, row) {
				this.visibleType = 'detail';
				this.detailOrEditVisible = true;
				this.form = row;
				// this.idx = index;
				// console.log('index',index)
				// console.log('row.id',row.ID)
				// this.$store.commit('setMerchantId',row.ID)
				// console.log('getMerchantId',this.$store.state.merchantId)
				// this.$router.push('/shopOrderManage')
			},
			handleEdit(index, row) {
				this.visibleType = 'edit';
				this.idx = index;
				const item = this.tableData[index];
				this.form = {
					name: item.name,
					date: item.date,
					address: item.address
				}
				this.detailOrEditVisible = true;
			},
			handleDelete(ID) {
				console.log('ID', ID);
				this.delVisible = true;
			},
			delAll() {
				const length = this.multipleSelection.length;
				let str = '';
				this.del_list = this.del_list.concat(this.multipleSelection);
				for (let i = 0; i < length; i++) {
					str += this.multipleSelection[i].name + ' ';
				}
				this.$message.error('删除了' + str);
				this.multipleSelection = [];
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 保存编辑
			saveEdit() {
				// this.$set(this.tableData, this.idx, this.form);
				this.detailOrEditVisible = false;
				this.$message.success(`修改 ${this.form.name} 信息成功`);
			},
			// 确定删除
			deleteRow() {
				this.tableData.splice(this.idx, 1);
				this.$message.success('删除成功');
				this.delVisible = false;
				this.detailOrEditVisible = false;
			}
		}
	}
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
	}

	.handle-select {
		width: 120px;
	}

	.handle-input {
		width: 300px;
		display: inline-block;
	}

	.del-dialog-cnt {
		font-size: 16px;
		text-align: center
	}

	.table {
		width: 100%;
		font-size: 14px;
	}

	.red {
		color: #ff0000;
	}

	.mr10 {
		margin-right: 10px;
	}
</style>
