<template>
	<div class="table">
		<!-- <div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades"></i>用户管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div> -->
		<div class="container">
			<!-- <el-select
			  class="width200"
			  size="medium"
			  v-model="form.courtId"
			  @change="courtChange"
			  placeholder="请选择"
			>
			  <el-option
			    v-for="item in courtOptions4search"
			    :key="item.value"
			    :label="item.label"
			    :value="item.value"
			  ></el-option>
			</el-select> -->
			<search-condition @clickSearchData="searchEvent">
				<div class="element">
					<p class="inline">排序</p>
					<div class="inline">
						<el-select v-model="searchForm.order" @change="orderChange" placeholder="排序方式" class="handle-select mr10 width160">
							<el-option v-for="item in orderOptions" :key="item.id" :label="item.value" :value="item.value"></el-option>
						</el-select>
					</div>
				</div>
				<div class="element">
					<p class="inline">来自</p>
					<div class="inline">
						<el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
							<el-option key="1" label="广东省" value="广东省"></el-option>
						</el-select>
					</div>
				</div>
				<div class="element">
					<p class="inline">条件查询</p>
					<div class="inline">
						<el-select v-model="searchForm.condition" @change="conditionChange" class="handle-select mr10">
							<el-option v-for="item in conditionOptions" :key="item.id" :label="item.value" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class="inline width160">
						<el-input v-model="searchForm.searchContent" size="medium" placeholder="请输入搜索内容" clearable></el-input>
					</div>
				</div>
				<div class="element">
					<p class="inline">日期</p>
					<div class="inline">
						<el-date-picker class="width160" type="date" placeholder="选择日期" v-model="searchForm.date" value-format="yyyy-MM-dd"></el-date-picker>
					</div>
				</div>
			</search-condition>
			<!-- <div class="handle-box">
				<el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
					<el-option key="1" label="广东省" value="广东省"></el-option>
					<el-option key="2" label="湖南省" value="湖南省"></el-option>
				</el-select>
				<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
			</div> -->
			<el-table :data="tableData" border stripe class="table" ref="multipleTable" style="width: 100%">
				<el-table-column prop="ID" label="ID" width="80"></el-table-column>
				<el-table-column prop="parentID" label="上级ID" width="80"></el-table-column>
				<el-table-column prop="date" label="注册日期" width="150"></el-table-column>
				<el-table-column prop="name" label="姓名" width="120"></el-table-column>
				<el-table-column prop="role" label="角色" width="120"></el-table-column>
				<el-table-column prop="level" label="级别" width="120"></el-table-column>
				<el-table-column prop="level" label="拥有矿石" width="120"></el-table-column>
				<el-table-column prop="level" label="贡献值" width="120"></el-table-column>
				<el-table-column prop="level" label="平台券" width="120"></el-table-column>
				<el-table-column prop="level" label="算力" width="120"></el-table-column>
				<el-table-column prop="phone" label="手机号" width="120"></el-table-column>
				<el-table-column prop="region" label="地区" :formatter="formatter" width="120">
				</el-table-column>
				<el-table-column label="操作" width="140" align="center" fixed="right">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-link>
						<!-- <el-button type="text" icon="el-icon-view" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
						<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
						<!-- <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>

		<!-- 详情编辑弹出框 -->
		<el-dialog :title="visibleType=='detail'?'详情':'编辑'" :visible.sync="detailOrEditVisible" fullscreen>
			<el-form ref="form" :model="form" label-width="auto" :inline="true" :disabled="visibleType=='detail'?true:false">
				<el-form-item label="注册时间">
					<el-date-picker type="datetime" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd hh:mm:ss" class="width200" :disabled="true"></el-date-picker>
				</el-form-item>
				<el-form-item label="上级ID">
					<el-input v-model="form.parentID"></el-input>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="角色">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="级别">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="手机号">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="微信号">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="上周拥有矿石">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="当前拥有矿石">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="贡献值">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="平台券">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
				<el-form-item label="待释放矿石">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="临时冻结矿石">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="临时冻结贡献值">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="临时冻结平台券">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
				<el-form-item label="买入次数">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="卖出次数">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
				<el-form-item label="临时冻结贡献值">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="区块地址">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
				<el-form-item label="是否激活">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="被打小报告次数">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
				<el-form-item label="被冻结账号次数">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="账号状态">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="账号冻结原因">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
				<el-form-item label="口号">
					<el-input v-model="form.address" class="width400"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer center">
				<!-- <el-button @click="detailOrEditVisible = false">取 消</el-button> -->
				<el-button type="primary" icon="el-icon-edit" @click="operateBtn">冻结</el-button>
				<el-button type="danger" icon="el-icon-delete" v-show="visibleType=='detail'" @click="handleDelete(form.ID)">删除</el-button>
				<!-- <el-button type="primary" icon="el-icon-finished" @click="saveEdit" v-show="visibleType=='edit'">确 定</el-button> -->
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
	</div>
</template>

<script>
	import searchCondition from "@/components/common/searchCondition.vue";
	export default {
		data() {
			return {
				url: '',
				tableData: [],
				total: 400,
				pageIndex: 1,
				pageSizes:'',
				pageSize:'',
				currentPage: 1,
				multipleSelection: [],
				searchForm:{
					order:"",
					condition: '',
					searchContent: '',
					date:''
				},
				orderOptions: [{
						id: "0",
						value: "按拥有矿石降序"
					},
					{
						id: "1",
						value: "按算力降序"
					},
					{
						id: "2",
						value: "按贡献值降序"
					},
					{
						id: "3",
						value: "按平台券降序"
					},
					{
						id: "4",
						value: "被打小报告次数"
					},
					{
						id: "5",
						value: "被冻结账号次数"
					},
				],
				conditionOptions: [{
						id: "0",
						value: "姓名"
					},
					{
						id: "1",
						value: "手机号"
					},
					{
						id: "2",
						value: "微信号"
					},
					{
						id: "3",
						value: "支付宝"
					},
					{
						id: "4",
						value: "角色"
					},
					{
						id: "5",
						value: "级别"
					},{
						id: "6",
						value: "上级ID"
					},
				],
				select_cate: '',
				select_word: '',
				del_list: [],
				is_search: false,
				visibleType: 'detail',
				detailOrEditVisible: false,
				delVisible: false,
				form: {
					name: '',
					date: '',
					address: ''
				},
				adressWidth: '200px',
				idx: -1,
				checkedMineralDesc: false
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
			initData(){
				this.pageSizes = this.$config.pageSizes;
				this.pageSize = this.$config.pageSize;
			},
			checkedMineralDescChange() {
				console.log('checkedMineralDesc', this.checkedMineralDesc)
			},
			orderChange(val){
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
			operateBtn() {
				//这里需要根据账号状态来判断是冻结还是解冻
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
				let _this = this;
				// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
				if (process.env.NODE_ENV === 'development') {
					this.url = '/ms/table/list';
				};
				this.searchForm.condition = this.$route.query.condition;
				this.searchForm.searchContent = this.$route.query.id;
				console.log('searchForm',this.searchForm);
				// this.$axios.post(this.url, {
				//     page: this.cur_page
				// }).then((res) => {
				//     this.tableData = res.data.list;
				// })
				var params = {
					pageNo:1,
					pageSize:4
				}
				_this.$ajax.ajax(_this.$api.getAdminUserPageList, 'GET', params, function(res){
					console.log('res',res)
				})
				this.tableData = [{
					ID: 1,
					parentID:"0",
					date: '2016-05-02',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1518 弄',
					zip: 200333
				}, {
					ID: 2,
					parentID:"0",
					date: '2016-05-04',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1517 弄',
					zip: 200333
				}, {
					ID: 3,
					parentID:"0",
					date: '2016-05-01',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1519 弄',
					zip: 200333
				}, {
					ID: 4,
					parentID:"0",
					date: '2016-05-03',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1516 弄',
					zip: 200333
				}, {
					ID: 5,
					parentID:"0",
					date: '2016-05-04',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1517 弄',
					zip: 200333
				}, {
					ID: 6,
					date: '2016-05-01',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1519 弄',
					zip: 200333
				}, {
					ID: 7,
					parentID:"0",
					date: '2016-05-03',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1516 弄',
					zip: 200333
				}, {
					ID: 8,
					parentID:"0",
					date: '2016-05-04',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1517 弄',
					zip: 200333
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
				this.idx = index;
				const item = this.tableData[index];
				this.form = {
					name: item.name,
					date: item.date,
					address: item.address
				}
				this.detailOrEditVisible = true;
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
				console.log('ID',ID);
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
