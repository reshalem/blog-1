<template>
    <div class="card-columns">
        <div v-for="article in articles" class="card mb-4">
            <div class="card-body">
                <div v-if="isLogin && userEmail === article.author.email" class="d-flex justify-content-end align-items-center mb-4">
                    <i class="fas fa-fingerprint text-danger mr-2" id="btn-fingerprint"></i>
                    Your Article
                </div>
                <h4 class="card-title">{{ article.title }}</h4>
                <p class="card-text">{{ article.description }}</p>
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="font-weight-bold ml-5">By {{ article.author.name }}</div>
                    <div class="font-weight-bold mr-5">View Count: {{ article.viewCount }}</div>
                </div>
                <button class="btn btn-block font-weight-bold" v-if="isLogin" id="btn-post" @click="goToLink(article._id)">
                    Read More
                </button>
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
            }
        }
    },
    methods: {
        getArticles: function() {
            axios({
                method: 'GET',
                url: `${config.port}/articles`
            })
                .then((articles) => {
                    this.articles = articles.data
                })
                .catch((err) => {
                    console.log(err)
                })
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
                    this.$emit('update-viewcount');
                })
                .catch((err) => {
                    console.log('Add View Count Error: ', err);
                });
        }
    },
    created() {
        this.getArticles()
    },
    watch: {
        shouldUpdate() {
            this.getArticles()
        }
    }
}
</script>

<style>
#btn-fingerprint {
    color: #3a606e;
}
</style>