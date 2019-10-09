function getUserType(val){
	if(val==0){
		return '管理员';
	}else if(val==1){
		return '客服';
	}else{
		return val;
	}
}

function getRoleType(val){
	if(val==0){
		return '管理角色';
	}else if(val==1){
		return '普通角色';
	}else{
		return val;
	}
}

function menuType(val){
	if(val==0){
		return '导航类菜单';
	}else if(val==1){
		return '接口类菜单';
	}else{
		return val;
	}
}
//菜单等级
function levelType(val){
	if(val==0){
		return '一级';
	}else if(val==1){
		return '二级';
	}else if(val==2){
		return '三级';
	}else{
		return val;
	}
}

export {
	getUserType,getRoleType,menuType,levelType
}