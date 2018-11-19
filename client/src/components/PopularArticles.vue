<template>
    <div class="mb-4">
        <div class="display-4 mb-4 d-flex align-items-center justify-content-center">Most Popular Articles <i class="far fa-hand-point-down ml-4"></i></div>
        <div class="card-columns">
            <div v-for="article in popularArticles" class="card mb-4">
                <div class="card-body">
                    <div v-if="isLogin && userEmail === article.author.email" class="d-flex justify-content-end align-items-center mb-2">
                        <i class="fas fa-fingerprint text-danger mr-2" id="btn-fingerprint"></i>
                        Your Article
                    </div>
                    <h4 class="card-title mb-4">{{ article.title }}</h4>
                    <p class="card-text text-justify px-4 mb-4">{{ article.description }}</p>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div class="font-weight-bold ml-4">By {{ article.author.username }}</div>
                        <div class="font-weight-bold mr-4">View Count: {{ article.viewCount }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import config from '@/config.js';

export default {
    name: 'populararticles',
    props: ['isLogin', 'userEmail'],
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

                    let limit;

                    if (articles.data.length > 3) {
                        limit = 3;
                    } else {
                        limit = articles.data.length;
                    }

                    for (let i = 0; i < limit; i++) {
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
