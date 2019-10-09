import Vue from 'vue';
import Vuex from 'vuex';
// import * as actions from './actions';
// import * as mutations from './mutations';
// import * as getters from './getters';
Vue.use(Vuex);
const state={   //要设置的全局访问的state对象
    merchantId: ''
};
// const getters = {   //实时监听state值的变化(最新状态)
//     getMerchantId(state) {  //承载变化的showFooter的值
//        return state.merchantId
//     }
// };
const mutations = {
    setMerchantId(state,merchantId){ //同上，这里面的参数除了state之外还传了需要增加的值sum
       state.merchantId = merchantId;
    }
};
// const actions = {
//     setMerchantId(context,merchantId){   //同上注释，num为要变化的形参
//         context.commit('setMerchantId',merchantId)
//      }
// };
export default new Vuex.Store({
  state,
  // getters,
  mutations,
  // actions
});
