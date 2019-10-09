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
					<div class="inline">
						<el-button type="primary" icon="el-icon-circle-plus-outline" @click="addBtn">添 加</el-button>
					</div>
				</div>
			</search-condition>
			<el-table :data="tableData" border stripe class="table" ref="multipleTable" style="width: 100%">
				<el-table-column prop="id" label="ID" min-width="80"></el-table-column>
				<el-table-column prop="roleName" label="角色" min-width="120"></el-table-column>
				<el-table-column prop="roleCode" label="角色code" min-width="120"></el-table-column>
				<el-table-column prop="roleType" label="角色类型" min-width="120">
					<template slot-scope="scope">
						{{scope.row.roleType | getRoleType}}
					</template>	
				</el-table-column>
				<el-table-column prop="roleDesc" label="角色描述" min-width="200"></el-table-column>
				<el-table-column label="操作" width="140" align="center" fixed="right">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-link>
						<i class="placeholderVertical">|</i>
						<el-link type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-link>
						<i class="placeholderVertical">|</i>
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
		
		<!-- 详情编辑弹出框 -->
		<el-dialog title="详情" :visible.sync="detailVisible" fullscreen>
			<div>
				<!-- 角色:{{ getType(form.roleName) }} -->
				角色: {{ form.roleName | getUserType }}
			</div>
			<div>
				角色code: {{ form.roleCode?form.roleCode:"--" }}
			</div>
			<div>
				角色类型: {{ form.roleType?form.roleType:"--" }}
			</div>
			<div>
				角色描述: {{ form.roleDesc?form.roleDesc:"--" }}
			</div>
			<div class="margT10">
				<el-button  icon="el-icon-add" type="primary" size="medium" @click="addAuth">添加权限</el-button>
				<div class="placeholderLine"></div>
				<el-table :data="menuListByRoleId" border stripe class="table" style="width: 800px">
					<el-table-column prop="id" label="ID" min-width="80"></el-table-column>
					<el-table-column prop="menuName" label="权限" min-width="100"></el-table-column>
					<el-table-column prop="menuUrl" label="URL" min-width="200"></el-table-column>
					<el-table-column label="操作" width="140" align="center" fixed="right">
						<template slot-scope="scope">
							<!-- <el-link type="primary" @click="handleDeleteRoleMenu(scope.$index, scope.row)">删除</el-link> -->
							<!-- <i class="placeholderVertical">|</i>
							<el-link type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-link> -->
						</template>
					</el-table-column>
				</el-table>
			</div>
			<span slot="footer" class="dialog-footer center">
				<!-- <el-button @click="detailOrEditVisible = false">取 消</el-button> -->
				<!-- <el-button type="primary" icon="el-icon-edit">冻结</el-button> -->
				<!-- <el-button type="primary" icon="el-icon-finished" @click="saveEdit" v-show="visibleType=='edit'">确 定</el-button> -->
			</span>
		</el-dialog>

		<!-- 编辑弹出框 -->
		<el-dialog :title="visibleType=='add'?'添加':'编辑'" :visible.sync="addlOrEditVisible" width="340px">
			<el-form ref="form" :model="form" :rules="rules" label-width="auto">
				<el-form-item label="角色" prop="roleName" required>
					<el-input v-model="form.roleName" class="width200"></el-input>
				</el-form-item>
				<el-form-item label="角色类型">
					<!-- <el-input v-model="form.roleType" class="width200"></el-input> -->
					<el-select v-model="form.roleType" class="handle-select mr10 width200">
						<el-option v-for="item in roleTypeOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="角色描述">
					<el-input v-model="form.roleDesc" class="width200"></el-input>
				</el-form-item>
				<el-form-item label="角色code">
					<el-input v-model="form.roleCode" class="width200"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer center">
				<el-button type="primary" icon="el-icon-finished" @click="saveBtn">确 定</el-button>
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
				},
				roleTypeOptions: [{
						id: "0",
						value: "管理角色"
					},
					{
						id: "1",
						value: "普通角色"
					},
				],
				roleOptions: [{
						id: "0",
						value: "管理员"
					},
					{
						id: "1",
						value: "客服总管"
					},
				],
				visibleType: 'add',
				addlOrEditVisible: false,
				detailVisible:false,
				delVisible: false,
				form: {
					roleName: '',
					roleDesc: '',
					roleType: '0',
					roleCode: ''
				},
				rules: {
					roleName: [{
							required: true,
							message: '请输入角色名称',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 16,
							message: '长度在 2 到 16 个字符',
							trigger: 'blur'
						}
					]
				},
				idx: -1,
				checkedMineralDesc: false,
				menuListByRoleId:[],
				deleteType:''
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
		},
		methods: {
			// getType(val){
			// 	return this.$utils.getUserType(val)
			// },
			addAuth(){
				
			},
			getMenuListByRoleId(){
				let _this = this;
				_this.$ajax.ajax(_this.$api.getMenuListByRoleId + _this.form.id, 'GET', null, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.menuListByRoleId = res.data;
						// let list = res.data.list;
						// console.log('list', list);
					}
				})
			},
			handleDetail(index, row){
				let _this = this;
				_this.detailVisible = true;
				_this.form = row;
				_this.getMenuListByRoleId();
			},
			initData(){
				this.pageSizes = this.$config.pageSizes;
				this.pageSize = this.$config.pageSize;
			},
			checkedMineralDescChange() {
				console.log('checkedMineralDesc', this.checkedMineralDesc)
			},
			roleChange(val){
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
			editBtn() {
				this.visibleType = "edit";
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
				
				let _this = this;
				var params = {
					pageNo: this.pageIndex,
					pageSize: this.pageSize,
				}
				_this.$ajax.ajax(_this.$api.getAdminRolePageList, 'GET', params, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						let list = res.data.list;
						console.log('list', list);
						_this.tableData = list;
						_this.total = res.data.total;
					}
				})
				
				
				// this.tableData = [{
				// 	id: 1,
				// 	roleName: '管理',
				// 	roleDesc: '王小虎2016-05-02',
				// 	roleType: '0',
				// 	roleCode: 200333
				// }]
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
			addBtn() {
				this.visibleType = 'add';
				this.addlOrEditVisible = true;
				this.form={
					roleName: '',
					roleDesc: '',
					roleType: '',
					roleCode: ''
				}
			},
			handleEdit(index, row) {
				this.visibleType = 'edit';
				this.form = {
					id:row.id,
					roleName: row.roleName,
					roleDesc: row.roleDesc,
					roleType: row.roleType,
					roleCode: row.roleCode
				}
				this.addlOrEditVisible = true;
			},
			handleDelete(index, row) {
				this.form = {
					id:row.id
				}
				this.deleteType = 'role';
				this.delVisible = true;
			},
			handleDeleteRoleMenu(){
				this.form = {
					id:row.id
				}
				this.deleteType = 'roleMenu';
				this.delVisible = true;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			sureEvent() {
				let _this = this;
				var params = {
					roleName: _this.form.roleName,
					roleDesc: _this.form.roleDesc,
					roleType: _this.form.roleType,
					roleCode: _this.form.roleCode
				}
				let url = "";
				if(_this.visibleType=='add'){
					url = _this.$api.insertAdminRole;
					// _this.pageIndex=1;
				}else if(_this.visibleType == 'edit'){
					url = _this.$api.updateAdminRole;
					params.id = _this.form.id
				}
				_this.$ajax.ajax(url, 'POST', params, function(res) {
					console.log('res', res);
					if(res.code == _this.$api.ERR_OK){
						_this.addlOrEditVisible = false;
						_this.$message.success(`${_this.visibleType=='add'?'添加':'修改'} ${_this.form.name} 信息成功`);
						_this.getData();
					}
				})
			},
			// 保存编辑
			saveBtn() {
				this.sureEvent();
				// this.$set(this.tableData, this.idx, this.form);
				// this.addlOrEditVisible = false;
				// this.$message.success(`${this.visibleType=='add'?'添加':'修改'} ${this.form.name} 信息成功`);
			},
			// 确定删除
			deleteRow() {
				let _this = this;
				if(_this.deleteType=='role'){
					_this.$ajax.ajax(_this.$api.deletedAdminRole + _this.form.id, 'POST', null, function(res) {
						console.log('res', res);
						if (res.code == _this.$api.ERR_OK) { // 200
							// let list = res.data.list;
							// console.log('list', list);
							// _this.tableData = list;
							// _this.total = res.data.total;
							_this.$message.success('删除成功');
							_this.delVisible = false;
							if(_this.currentItemsCount==1&&_this.pageIndex>1){
								_this.pageIndex=_this.pageIndex-1;
							}
							_this.getData();
						}
					})
				}else{
					_this.$ajax.ajax(_this.$api.deletedAdminRole + _this.form.id, 'POST', null, function(res) {
						console.log('res', res);
						if (res.code == _this.$api.ERR_OK) { // 200
							// let list = res.data.list;
							// console.log('list', list);
							// _this.tableData = list;
							// _this.total = res.data.total;
							_this.$message.success('删除成功');
							_this.delVisible = false;
							if(_this.currentItemsCount==1&&_this.pageIndex>1){
								_this.pageIndex=_this.pageIndex-1;
							}
							_this.getData();
						}
					})
				}
				
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
