<template>
    <div class="row">
        <div class="col-md-9">
            <PopularArticles :isLogin="isLogin" :userEmail="userEmail"></PopularArticles>
        </div>
        <div class="col-md-3">
            <AllUsers :islogin="isLogin"></AllUsers>
        </div>
    </div>
</template>

<script>
import config from '@/config.js';
import PopularArticles from '@/components/PopularArticles.vue';
import AllUsers from '@/components/AllUsers.vue';

export default {
    name: 'featured',
    props: ['isLogin', 'userEmail'],
    components: {
        PopularArticles, AllUsers
    },
    data() {
        return {

        }
    }
}
</script>

<style>

</style>
