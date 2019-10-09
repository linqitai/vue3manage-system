import $ from 'jquery'
// import http from './public'
import qs from 'qs'
import router from '../../router/index'
// import axios from 'axios'
// import http from './service'

export default {
	getJson(url, doSuccess) {
		$.getJSON(url, function(res) {
			if (typeof doSuccess == "function") {
				doSuccess(res);
			}
		})
	},
	ajax(url, method, params, doSuccess) {
		var that = this;
		$.ajax({
			url: url,
			type: method,
			processData: false,
			// contentType: 'application/json',
			// dataType:'json',
			// data : JSON.stringify(params), 
			data: method == 'GET' ? qs.stringify(params) : qs.stringify(params),
			beforeSend: function(XMLHttpRequest) {
				// XMLHttpRequest.setRequestHeader("token", localStorage.getItem('token'));
				// that.progressDialog = true;
				localStorage.getItem('token')?XMLHttpRequest.setRequestHeader('token', localStorage.getItem('token')):'';
			},
			complete: function(xhr, data) {
				// this.authorization = xhr.getResponseHeader('authorization')
				// console.log(xhr.getResponseHeader('authorization'),'authorization')
				// console.log(data,'data')
			},
			success: function(res) {
				console.log(res, "====res====")
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				if (res.code == 4001) {
					// that.$router.push('/login')
					router.replace({
						path: '/login'
					});
				}
				if (typeof doSuccess == "function") {
					doSuccess(res);
				}
			},
			error: function(error) {
				console.log("error", error)
				if (error.status == 500) {
					console.log("这里是要重定向")
					// router.replace({
					// 	path: '/home'
					// })
				}
			}
		});
	}
}
