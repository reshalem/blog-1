<template>
    <div>
        <div class="d-flex justify-content-end mb-3">
            <div class="form-inline col-md-6 d-flex justify-content-end p-0">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">
                            <i class="fas fa-search"></i>
                        </span>
                    </div>
                    <input type="text" v-model="keyword" class="form-control mr-1" placeholder="Search All Articles">
                </div>
                <button class="btn btn-outline-dark ml-2" @click="searchArticle">Search</button>
            </div>
        </div>
        <div class="card-columns">
            <div v-for="article in articles" class="card mb-4">
                <div class="card-body">
                    <div v-if="isLogin && userEmail === article.author.email" class="d-flex justify-content-end align-items-center mb-4">
                        <i class="fas fa-fingerprint text-danger mr-2" id="btn-fingerprint"></i>
                        Your Article
                    </div>
                    <h4 class="card-title mb-4">{{ article.title }}</h4>
                    <p class="card-text text-justify px-4 mb-4">{{ article.description }}</p>
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="font-weight-bold ml-4">By {{ article.author.username }}</div>
                        <div class="font-weight-bold mr-4">View Count: {{ article.viewCount }}</div>
                    </div>
                    <button class="btn btn-block font-weight-bold" v-if="isLogin" id="btn-post" @click="goToLink(article._id)">
                        Read More
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import config from '@/config.js'

export default {
    name: 'AllArticles',
    props: ['shouldUpdate', 'isLogin', 'userEmail', 'getarticles'],
    data() {
        return {
            articles: [],
            article: {
                title: '',
                description: ''
            }, 
            keyword: ''
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
        goToLink: function(paramsId) {
            axios({
                method: 'PATCH',
                url: `${config.port}/articles/addCount/${paramsId}`,
                headers: {
                    'access-token': localStorage.getItem('token')
                }
            })
                .then((result) => {
                    this.getArticles();
                    this.$router.push(`/articles/${paramsId}`);
                })
                .catch((err) => {
                    console.log('Add View Count Error: ', err);
                });
        }, 
        searchArticle: function() {
            axios({
                method: 'GET', 
                url: `${config.port}/articles/search/${this.keyword}` 
            })
                .then((articles) => {
                    this.articles = articles.data;
                })
                .catch((err) => {
                    console.log('Search Article Error: ', err);
                });
        }
    },
    created() {
        this.getArticles();
    },
    watch: {
        shouldUpdate() {
            this.getArticles();
        },
        keyword() {
            if (this.keyword.length === 0) {
                this.getArticles();
            } else {
                this.searchArticle();
            }
        }
    }
}
</script>

<style>
#btn-fingerprint {
    color: #3a606e;
}
</style>