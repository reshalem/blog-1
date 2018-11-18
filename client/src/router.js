import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    linkActiveClass: "link_active",
    linkExactActiveClass: "myLink",
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import('./views/Login.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('./views/Register.vue')
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('./views/Profile.vue')
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('./views/About.vue'),
            children: [{
                path: '/about/:id',
                name: 'currentVideo',
                component: () => import('./components/CurrentVideo.vue'),
                props: true
            }]
        },
        {
            path: '/articles',
            name: 'articles',
            component: () => import('./views/Article.vue'),
            children: [{
                path: '/articles/:id',
                name: 'currentArticle',
                component: () => import('./components/OneArticle.vue'),
                props: true
            },
            {
                path: '/',
                name: 'allarticles',
                component: () => import('./components/AllArticles.vue'),
            }]
        },
        {
            path: '/featured',
            name: 'featured', 
            component: () => import('./views/Featured.vue')
        },
        {
            path: '/**',
            name: 'notfound', 
            component: () => import('./views/NotFound.vue')
        }
    ]
})
