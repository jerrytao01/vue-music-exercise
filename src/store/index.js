import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger' // 修改vuex会打印一条修改

Vue.use(Vuex)

// 调试工具
const debug = process.env.NODE_ENV !== 'production' // 监测state修改是否来源于mutation

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
