<template>
    <div class="card-columns">
        <div v-for="article in popularArticles" class="card mb-4">
            <div class="card-body">
                <div v-if="isLogin && userEmail === article.author.email" class="d-flex justify-content-end align-items-center mb-4">
                    <i class="fas fa-fingerprint text-danger mr-2" id="btn-fingerprint"></i>
                    Your Article
                </div>
                <h4 class="card-title">{{ article.title }}</h4>
                <p class="card-text">{{ article.description }}</p>
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="font-weight-bold ml-5">By {{ article.author.name }}</div>
                    <!-- <i class="far fa-comment-alt mr-5" id="comment-symbol"></i> -->
                    <div class="font-weight-bold mr-5">View Count: {{ article.viewCount }}</div>
                </div>
                <!-- <button class="btn btn-block font-weight-bold" v-if="isLogin" id="btn-post" @click="goToLink(article._id)">
                    Read More
                </button> -->
            </div>
        </div>
    </div>
</template>

<script>
import config from '@/config.js';

export default {
    name: 'populararticles',
    props: ['shouldUpdate', 'isLogin', 'userEmail', 'getarticles', 'popularupdate'],
    data() {
        return {
            popularArticles: []
        }
    },
    methods: {
        getArticles: function() {
            axios({
                method: 'GET',
                url: `${config.port}/articles`
            })
                .then((articles) => {
                    let arr_articles = articles.data;
                    arr_articles.sort(function(a, b) {
                        return b.viewCount - a.viewCount;
                    });

                    this.popularArticles = [];

                    for (let i = 0; i < 5; i++) {
                        this.popularArticles.push(arr_articles[i]);
                    }
                })
                .catch((err) => {
                    console.log('Get Popular Articles Error: ', err);
                });
        }
    },
    created() {
        this.getArticles();
    },
    watch: {
        popularupdate() {
            this.getArticles();
        }
    }
}
</script>

<style scoped>
@media (min-width: 34em) {
    .card-columns {
        -webkit-column-count: 1;
        -moz-column-count: 1;
        column-count: 1;
    }
}
</style>
