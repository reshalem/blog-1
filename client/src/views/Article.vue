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
                    <div class="card-header font-weight-bold">Latest Articles</div>
                    <div class="card-body">
                        <div class="d-flex flex-column justify-content-start">
                            <ul class="navbar-nav">
                                <li class="nav-item mb-3" v-for="article in articles" @click="addCount(article._id)">
                                    <router-link :to="{ name: 'currentArticle', params: { id: article._id }}">{{ article.title }}</router-link>
                                </li>
                            </ul>
                            <router-link class="text-danger" to="/articles">
                                See All Articles
                                <i class="far fa-paper-plane ml-1"></i>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-9">
            <router-view :shouldUpdate="shouldUpdate" :isLogin="isLogin" :userEmail="userEmail" :getarticles="getArticles" :checktoken="checktoken"></router-view>
        </div>
    </div>
</template>

<script>
import config from '@/config.js';

export default {
    name: 'article',
    props: ['isLogin', 'userEmail', 'checktoken'],
    data() {
        return {
            articles: [],
            createdArticle: {
                title: '',
                description: ''
            },
            shouldUpdate: 0,
            keyword: '',
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
                    this.articles = articles.data.reverse();
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
                        this.articleId = this.$router.history.current.params.id;
                    })
                    .catch((err) => {
                        console.log('Add View Count Error: ', err);
                    });
            }
        }
    },
    created() {
        this.getArticles();
        this.articleId = this.$router.history.current.params.id;
    }
}
</script>

<style scoped>
.card-header {
    background-color: #ff4b4b !important;
    color: white;
    border: none;
}
</style>
