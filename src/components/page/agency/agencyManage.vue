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
						<el-button type="primary" icon="el-icon-circle-plus-outline" @click="addBtn('province')">添加省代理</el-button>
					</div>
				</div>
				<div class="element">
					<div class="inline">
						<el-button type="primary" icon="el-icon-circle-plus-outline" @click="addCityBtn">添加市代理</el-button>
					</div>
				</div>
				<div class="element">
					<p class="inline">状态</p>
					<div class="inline">
						<el-select v-model="searchForm.status" @change="statusChange" class="handle-select mr10 width120">
							<el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.value"></el-option>
						</el-select>
					</div>
				</div>
			</search-condition>
			<el-table :data="tableData" row-key="ID" :tree-props="{children: 'children',hasChildren: 'hasChildren'}" border
			 stripe class="table" style="width: 100%">
				<el-table-column prop="ID" label="ID" width="80"></el-table-column>
				<!-- <el-table-column prop="date" label="日期"  width="120"></el-table-column> -->
				<el-table-column prop="areaName" label="省市名称" min-width="120"></el-table-column>
				<el-table-column prop="status" label="状态" min-width="120"></el-table-column>
				<el-table-column prop="startTime" label="开拍日期" min-width="150"></el-table-column>
				<el-table-column prop="endTime" label="截拍日期" min-width="150"></el-table-column>
				<el-table-column prop="masterName" label="拍者姓名" min-width="150"></el-table-column>
				<el-table-column prop="masterPhone" label="拍者手机号" min-width="150"></el-table-column>
				<el-table-column prop="isPayment" label="是否缴纳" min-width="150"></el-table-column>
				<el-table-column label="操作" width="150" align="center" fixed="right">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-link>
						<i class="placeholderVertical">|</i>
						<el-link type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-link>
						<i class="placeholderVertical">|</i>
						<el-link type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-link>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>

		<!-- 添加编辑弹出框 -->
		<el-dialog :title="visibleType=='add'?'添加省代理':'编辑省代理'" v-dialogDrag :visible.sync="addlOrEditVisible" width="500px">
			<!-- <el-form :model="replyRuleForm" :rules="rules" ref="replyRuleForm" label-width="100px">
				<el-form-item label="回复内容" prop="content"> -->
			<el-form ref="form" :model="form" :rules="rules" label-width="auto">
				<el-form-item label="省名称" prop="areaName">
					<el-select v-model="form.areaName" @change="areaNameChange" class="handle-select mr10 width200">
						<el-option v-for="item in provinceOptions" :key="item.ProID" :label="item.name" :value="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-select v-model="form.status" @change="statusChange" class="handle-select mr10 width200">
						<el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="开拍日期" prop="startTime">
					<el-date-picker class="width200" type="datetime" placeholder="选择日期" v-model="form.startTime" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item label="截拍日期" prop="endTime">
					<el-date-picker class="width200" type="datetime" placeholder="选择日期" v-model="form.endTime" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item label="拍者姓名" prop="masterName">
					<el-input v-model="form.masterName" class="width200"></el-input>
				</el-form-item>
				<el-form-item label="拍者电话" prop="masterPhone">
					<el-input v-model="form.masterPhone" class="width200"></el-input>
				</el-form-item>
				<el-form-item label="是否缴纳" prop="isPayment">
					<el-switch v-model="form.isPayment" @change="isPaymentChange" active-color="#13ce66" inactive-color="#c7c7c7"
					 active-text="是" inactive-text="否">
					</el-switch>
				</el-form-item>
				<el-button class="editor-btn" icon="el-icon-check" type="primary" @click="submit('form')">确认</el-button>
			</el-form>
			<!-- <span slot="footer" class="dialog-footer center">
				<el-button type="primary" icon="el-icon-finished" @click="saveBtn">确 定</el-button>
			</span> -->
		</el-dialog>
		
		<el-dialog :title="visibleType=='add'?'添加市代理':'编辑市代理'" v-dialogDrag :visible.sync="addlOrEditCityVisible" width="500px">
			<!-- <el-form :model="replyRuleForm" :rules="rules" ref="replyRuleForm" label-width="100px">
				<el-form-item label="回复内容" prop="content"> -->
			<el-form ref="form" :model="form" :rules="rules" label-width="auto">
				<el-form-item label="省名称" prop="areaName">
					<el-select v-model="form.areaName" @change="areaNameChange" class="handle-select mr10 width200">
						<el-option v-for="item in provinceOptions" :key="item.ProID" :label="item.name" :value="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="市名称" prop="cityName">
					<el-select v-model="form.cityName" @change="cityNameChange" class="handle-select mr10 width200">
						<el-option v-for="item in provinceOptions" :key="item.ProID" :label="item.name" :value="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-select v-model="form.status" @change="statusChange" class="handle-select mr10 width200">
						<el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="开拍日期" prop="startTime">
					<el-date-picker class="width200" type="datetime" placeholder="选择日期" v-model="form.startTime" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item label="截拍日期" prop="endTime">
					<el-date-picker class="width200" type="datetime" placeholder="选择日期" v-model="form.endTime" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item label="拍者姓名" prop="masterName">
					<el-input v-model="form.masterName" class="width200"></el-input>
				</el-form-item>
				<el-form-item label="拍者电话" prop="masterPhone">
					<el-input v-model="form.masterPhone" class="width200"></el-input>
				</el-form-item>
				<el-form-item label="是否缴纳" prop="isPayment">
					<el-switch v-model="form.isPayment" @change="isPaymentChange" active-color="#13ce66" inactive-color="#c7c7c7"
					 active-text="是" inactive-text="否">
					</el-switch>
				</el-form-item>
				<el-button class="editor-btn" icon="el-icon-check" type="primary" @click="submit('form')">确认</el-button>
			</el-form>
			<!-- <span slot="footer" class="dialog-footer center">
				<el-button type="primary" icon="el-icon-finished" @click="saveBtn">确 定</el-button>
			</span> -->
		</el-dialog>

		<!-- 删除提示框 -->
		<el-dialog title="提示" :visible.sync="delVisible" width="300px" v-dialogDrag center>
			<div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delVisible = false">取 消</el-button>
				<el-button type="primary" @click="deleteRow">确 定</el-button>
			</span>
		</el-dialog>
		<!-- <el-dialog title="回复留言" :visible.sync="dialogFormVisible4reply">
			<el-form :model="replyRuleForm" :rules="rules" ref="replyRuleForm" label-width="100px">
				<el-form-item label="回复内容" prop="content">
				    <el-input type="textarea" v-model="replyRuleForm.content" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
				    <el-button @click="dialogFormVisible4reply = false">取 消</el-button>
				    <el-button type="primary" @click="sureReplyEvent('replyRuleForm')">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog> -->
	</div>
</template>

<script>
	import searchCondition from "@/components/common/searchCondition.vue";
	export default {
		data() {
			return {
				form: {
					areaName: '',
					cityName:'',
					status: '',
					startTime: '',
					endTime: '',
					masterName: '',
					masterPhone: '',
					isPayment: '0'
				},
				rules: {
					areaName: [{
						type: 'string',
						required: true,
						message: '请选择省',
					}],
					cityName: [{
						type: 'string',
						message: '请选择市',
					}],
					status: [{
						type: 'string',
						required: true,
						message: '请选择状态',
					}],
					startTime: [{
						type: 'string',
						required: true,
						message: '请选择开拍时间',
					}],
					endTime: [{
						type: 'string',
						required: true,
						message: '请选择截拍时间',
					}],
					masterName: [{
						type: 'string',
					}, {
						min: 2,
						max: 20,
						message: '长度在 2 到 20 个字符',
						trigger: 'blur'
					}],
					masterPhone: [{
						type: 'string',
					}, {
						min: 8,
						max: 11,
						message: '长度在 8 到 11 个字符',
						trigger: 'blur'
					}]
				},
				url: '',
				tableData: [],
				tableData1: [{
					id: 1,
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					id: 2,
					date: '2016-05-04',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1517 弄'
				}, {
					id: 3,
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄',
					hasChildren: true
				}, {
					id: 4,
					date: '2016-05-03',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1516 弄'
				}],
				total: 400,
				pageIndex: 1,
				pageSizes: '',
				pageSize: '',
				currentPage: 1,
				multipleSelection: [],
				searchForm: {
					date: '',
					status: '',
					condition: '',
					searchContent: ''
				},
				status: "",
				statusOptions: [{
						id: "0",
						value: "未开拍"
					},
					{
						id: "1",
						value: "竞拍中"
					},
					{
						id: "2",
						value: "已截止"
					}
				],
				areaOptions: [{
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
				visibleType: 'add',
				detailOrEditVisible: false,
				addlOrEditVisible: false,
				addlOrEditCityVisible: false,
				delVisible: false,
				adressWidth: '200px',
				idx: -1,
				checkedMineralDesc: false,
				dialogFormVisible4reply: false,
				replyContent: '',
				pc: 'province',
				provinceOptions: [{
					"ProID": 1,
					"name": "北京市",
					"ProSort": 1,
					"ProRemark": "直辖市"
				}, {
					"ProID": 2,
					"name": "天津市",
					"ProSort": 2,
					"ProRemark": "直辖市"
				}, {
					"ProID": 3,
					"name": "河北省",
					"ProSort": 5,
					"ProRemark": "省份"
				}, {
					"ProID": 4,
					"name": "山西省",
					"ProSort": 6,
					"ProRemark": "省份"
				}, {
					"ProID": 5,
					"name": "内蒙古自治区",
					"ProSort": 32,
					"ProRemark": "自治区"
				}, {
					"ProID": 6,
					"name": "辽宁省",
					"ProSort": 8,
					"ProRemark": "省份"
				}, {
					"ProID": 7,
					"name": "吉林省",
					"ProSort": 9,
					"ProRemark": "省份"
				}, {
					"ProID": 8,
					"name": "黑龙江省",
					"ProSort": 10,
					"ProRemark": "省份"
				}, {
					"ProID": 9,
					"name": "上海市",
					"ProSort": 3,
					"ProRemark": "直辖市"
				}, {
					"ProID": 10,
					"name": "江苏省",
					"ProSort": 11,
					"ProRemark": "省份"
				}, {
					"ProID": 11,
					"name": "浙江省",
					"ProSort": 12,
					"ProRemark": "省份"
				}, {
					"ProID": 12,
					"name": "安徽省",
					"ProSort": 13,
					"ProRemark": "省份"
				}, {
					"ProID": 13,
					"name": "福建省",
					"ProSort": 14,
					"ProRemark": "省份"
				}, {
					"ProID": 14,
					"name": "江西省",
					"ProSort": 15,
					"ProRemark": "省份"
				}, {
					"ProID": 15,
					"name": "山东省",
					"ProSort": 16,
					"ProRemark": "省份"
				}, {
					"ProID": 16,
					"name": "河南省",
					"ProSort": 17,
					"ProRemark": "省份"
				}, {
					"ProID": 17,
					"name": "湖北省",
					"ProSort": 18,
					"ProRemark": "省份"
				}, {
					"ProID": 18,
					"name": "湖南省",
					"ProSort": 19,
					"ProRemark": "省份"
				}, {
					"ProID": 19,
					"name": "广东省",
					"ProSort": 20,
					"ProRemark": "省份"
				}, {
					"ProID": 20,
					"name": "海南省",
					"ProSort": 24,
					"ProRemark": "省份"
				}, {
					"ProID": 21,
					"name": "广西壮族自治区",
					"ProSort": 28,
					"ProRemark": "自治区"
				}, {
					"ProID": 22,
					"name": "甘肃省",
					"ProSort": 21,
					"ProRemark": "省份"
				}, {
					"ProID": 23,
					"name": "陕西省",
					"ProSort": 27,
					"ProRemark": "省份"
				}, {
					"ProID": 24,
					"name": "新 疆维吾尔自治区",
					"ProSort": 31,
					"ProRemark": "自治区"
				}, {
					"ProID": 25,
					"name": "青海省",
					"ProSort": 26,
					"ProRemark": "省份"
				}, {
					"ProID": 26,
					"name": "宁夏回族自治区",
					"ProSort": 30,
					"ProRemark": "自治区"
				}, {
					"ProID": 27,
					"name": "重庆市",
					"ProSort": 4,
					"ProRemark": "直辖市"
				}, {
					"ProID": 28,
					"name": "四川省",
					"ProSort": 22,
					"ProRemark": "省份"
				}, {
					"ProID": 29,
					"name": "贵州省",
					"ProSort": 23,
					"ProRemark": "省份"
				}, {
					"ProID": 30,
					"name": "云南省",
					"ProSort": 25,
					"ProRemark": "省份"
				}, {
					"ProID": 31,
					"name": "西藏自治区",
					"ProSort": 29,
					"ProRemark": "自治区"
				}, {
					"ProID": 32,
					"name": "台湾省",
					"ProSort": 7,
					"ProRemark": "省份"
				}, {
					"ProID": 33,
					"name": "澳门特别行政区",
					"ProSort": 33,
					"ProRemark": "特别行政区"
				}, {
					"ProID": 34,
					"name": "香港特别行政区",
					"ProSort": 34,
					"ProRemark": "特别行政区"
				}]

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

		},
		methods: {
			isPaymentChange(val) {
				console.log('val', val)
			},
			load(tree, treeNode, resolve) {
				setTimeout(() => {
					resolve([{
						ID: 31,
						areaName: '杭州市',
						status: '已截止',
						startTime: '2020-01-20',
						endTime: '2020-01-23',
						masterName: '张三',
						masterPhone: '13948585822',
						isPayment: '0',
					}, {
						ID: 32,
						areaName: '杭州市',
						status: '已截止',
						startTime: '2020-01-20',
						endTime: '2020-01-23',
						masterName: '张三',
						masterPhone: '13948585822',
						isPayment: '0',
					}])
				}, 1000)
			},
			submit(formName) {
				let _this = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						console.log('form', _this.form)
					} else {
						console.log('error submit!!');
						return false;
					}
				});
				// console.log(this.form);
				// this.$message.success('提交成功！');
				// this.$router.push('noticeManage')
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
					areaName: '浙江省',
					status: '未开拍',
					startTime: '2020-01-20',
					endTime: '2020-01-23',
					masterName: '张三',
					masterPhone: '13948585822',
					isPayment: '0',
					children: [{
						ID: 31,
						areaName: '杭州市',
						status: '已截止',
						startTime: '2020-01-20',
						endTime: '2020-01-23',
						masterName: '张三',
						masterPhone: '13948585822',
						isPayment: '0',
					}, {
						ID: 32,
						areaName: '宁波市',
						status: '未开拍',
						startTime: '2020-01-20',
						endTime: '2020-01-23',
						masterName: '',
						masterPhone: '',
						isPayment: '0',
					}]
				}, {
					ID: 2,
					areaName: '湖南省',
					status: '已开拍',
					startTime: '2020-01-20',
					endTime: '2020-01-23',
					masterName: '李四',
					masterPhone: '13948585823',
					isPayment: '0'
				}, {
					ID: 3,
					areaName: '河南省',
					status: '已开拍',
					startTime: '2020-01-20',
					endTime: '2020-01-23',
					masterName: '王五',
					masterPhone: '13948585821',
					isPayment: '0'
				}]
			},
			// 保存编辑
			saveBtn() {
				// this.$set(this.tableData, this.idx, this.form);
				this.addlOrEditVisible = false;
				this.$message.success(`${this.visibleType=='add'?'添加':'修改'} ${this.form.name} 信息成功`);
			},
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
			cityNameChange(val){
				console.log('val', val)
			},
			areaNameChange(val) {
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
			addCityBtn() {
				this.visibleType = 'add';
				this.addlOrEditCityVisible = true;
				this.form = {
					areaName: '',
					status: '',
					startTime: '',
					endTime: '',
					masterName: '',
					masterPhone: '',
					isPayment: '0'
				}
				//this.getProvinceJson();
			},
			addBtn(pc) {
				this.visibleType = 'add';
				this.addlOrEditVisible = true;
				this.pc = pc;
				this.form = {
					areaName: '',
					status: '',
					startTime: '',
					endTime: '',
					masterName: '',
					masterPhone: '',
					isPayment: '0'
				}
				//this.getProvinceJson();
			},
			handleEdit(index, row) {
				this.visibleType = 'edit';
				this.addlOrEditVisible = true;
				console.log('row', row)
				this.form = {
					areaName: row.areaName || '',
					status: row.status || '',
					startTime: row.startTime || '',
					endTime: row.endTime || '',
					masterName: row.masterName || '',
					masterPhone: row.masterPhone || '',
					isPayment: row.isPayment || '',
				}
				// this.idx = index;
				// const item = this.tableData[index];
				// this.form = {
				// 	name: item.name,
				// 	date: item.date,
				// 	address: item.address
				// }
				// this.detailOrEditVisible = true;
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
