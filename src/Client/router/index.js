// import Vue from 'vue'
// import VueRouter from 'vue-router'
const Home = () => import('@/pages/Home');
const Detail = () => import('@/pages/Detail');

// Vue.use(VueRouter)

export default new VueRouter({
  mode:"history",
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/detail/:id',
      name: 'Detail',
      component: Detail
    }
  ]
})
