import Vue from 'vue'
import App from './App'
import request from './api/request'

Vue.config.productionTip = false

// vue 原型挂载
Vue.prototype.request = request


App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()