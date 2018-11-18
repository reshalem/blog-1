<template>
    <div class="row">
        <div class="col-lg-3">
            <div class="d-flex flex-column">
                <div class="card mb-3" v-if="isLogin">
                    <div class="card-body">
                        <p>Create Article</p>
                        <form @submit.prevent="createArticle()" class="mb-2">
                            <div class="form-group">
                                <input type="text" v-model="createdArticle.title" class="form-control" placeholder="Title">
                            </div>
                            <div class="form-group">
                                <textarea class="form-control" v-model="createdArticle.description" id="message" rows="3" placeholder="Description"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block font-weight-bold">Post</button>
                        </form>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">Article List</div>
                    <div class="card-body">
                        <div class="d-flex flex-column justify-content-start">
                            <ul class="navbar-nav">
                                <li class="nav-item mb-3" v-for="article in articles" @click="addCount(article._id)">
                                    <router-link :to="{ name: 'currentArticle', params: { id: article._id }}">{{ article.title }}</router-link>
                                </li>
                            </ul>
                            <router-link class="" to="/articles">
                                See All Articles
                                <i class="far fa-paper-plane ml-1"></i>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-9">
            <router-view :shouldUpdate="shouldUpdate" :isLogin="isLogin" :userEmail="userEmail" :getarticles="getArticles" :checktoken="checktoken" @update-viewcount="updatePopular"></router-view>
        </div>
        <div class="mt-5">
            <PopularArticles :popularupdate="popularUpdate"></PopularArticles>
        </div>
    </div>
</template>

<script>
import config from '@/config.js';
import PopularArticles from '@/components/PopularArticles.vue';

export default {
    name: 'article',
    props: ['isLogin', 'userEmail', 'checktoken'],
    components: {
        PopularArticles
    },
    data() {
        return {
            articles: [],
            createdArticle: {
                title: '',
                description: ''
            },
            shouldUpdate: 0,
            keyword: '',
            popularUpdate: 0,
            articleId: this.$router.history.current.params.id
        }
    },
    methods: {
        getArticles: function() {
            axios({
                method: 'GET',
                url: `${config.port}/articles`
            })
                .then((articles) => {
                    this.articles = articles.data;
                })
                .catch((err) => {
                    console.log('Get All Articles Error: ', err);
                });
        },
        createArticle: function() {
            axios({
                method: 'POST',
                url: `${config.port}/articles`,
                data: {
                    title: this.createdArticle.title,
                    description: this.createdArticle.description
                },
                headers: {
                    'access-token': localStorage.getItem('token')
                }
            })
                .then((result) => {
                    this.getArticles();
                    this.createdArticle = {};
                    this.shouldUpdate += 1;
                })
                .catch((err) => {
                    console.log('Create Article Error: ', err);
                });
        },
        addCount: function(paramsId) {
            if (this.articleId !== paramsId) {
                axios({
                    method: 'PATCH',
                    url: `${config.port}/articles/addCount/${paramsId}`,
                    headers: {
                        'access-token': localStorage.getItem('token')
                    }
                })
                    .then((result) => {
                        this.getArticles();
                        this.popularUpdate += 1;
                        this.articleId = this.$router.history.current.params.id;
                    })
                    .catch((err) => {
                        console.log('Add View Count Error: ', err);
                    });
            }
        },  
        updatePopular: function() {
            this.popularUpdate += 1;
        }
    },
    created() {
        this.getArticles();
        this.articleId = this.$router.history.current.params.id;
    }
}
</script>