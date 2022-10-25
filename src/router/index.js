import Vue from 'vue'
import a from './component/a'
import b from './component/b'
import Router from './router'

Vue.use(Router)


const routes = [
    {
        path: '/',
        component: a,
    },
    {
        path: '/b',
        component: b
    }
]


const router = new Router({
    routes,
    mode: 'history'
})

export default router