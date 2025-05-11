import Vue from 'vue'
import App from './App.vue'
import './public-path'
import VueRouter from 'vue-router'
import dataV from '@jiaminghi/data-view'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(dataV)

let instance = null;
let router = null;

function render(props = {}) {
  const { container } = props;
  router = new VueRouter({
    mode: 'history',
    base: window.__POWERED_BY_QIANKUN__ ? '/data-view' : '/',
    routes: [
      // 你的路由配置
    ]
  });
  instance = new Vue({
    router,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app');
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('vue app bootstraped');
}

export async function mount(props) {
  console.log('vue app mounted', props);
  render(props);
}

export async function unmount() {
  console.log('vue app unmounted');
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  router = null;
}
