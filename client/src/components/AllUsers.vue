<template>
    <div>
        <div class="card mb-4" v-if="islogin">
            <div class="card-body">
                <h5 class="font-weight-light mb-3">Popular Users</h5>
                <div class="d-flex p-2 align-items-center justify-content-center" v-for="user in popularUsers">
                    <img class="card-img-top img-fluid mr-4" id="popularAvatar" v-bind:src="user.avatarURL" alt="">
                    <div class="d-flex flex-column align-items-start ">
                        <span class="font-weight-bold">{{ user.username }} </span> 
                        <span class="font-weight-bold">Followers: {{ user.followers.length }} </span> 
                    </div>
                </div>
            </div>
        </div>
        <div class="card mb-5" v-if="islogin">
            <div class="card-body">
                <h5 class="font-weight-light mb-3">Who To Follow</h5>
                <div class="d-flex py-2 px-3 justify-content-between align-items-center" v-for="user in blogUsers">
                    <span class="font-weight-bold mr-4">{{ user.username }} </span> 
                    <div class="d-flex justify-content-center align-items-center">
                        <button class="btn mr-1" id="btn-follow" @click="follow(user._id)">Follow</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import config from '@/config.js';

export default {
    name: 'allusers',
    props: ['islogin'],
    data() {
        return {
            blogUsers: [], 
            popularUsers: []
        }
    },
    methods: {
        getAllUsers: function() {
            axios({
                method: 'GET',
                url: `${config.port}/users/allfollow`,
                headers: {
                    'access-token': localStorage.getItem('token')
                }
            })
                .then((users) => {
                    this.blogUsers = users.data;
                })
                .catch((err) => {
                    console.log('Get All Users To Follow Error: ', err);
                });
        }, 
        getPopularUsers: function() {
            axios({
                method: 'GET',
                url: `${config.port}/users/all`, 
                headers: {
                    'access-token': localStorage.getItem('token')
                }
            })
                .then((users) => {
                    this.popularUsers = users.data;

                    let arr_users = users.data;
                    arr_users.sort(function(a, b) {
                        return b.followers.length - a.followers.length;
                    });

                    this.popularUsers = [];

                    let limit;

                    if (users.data.length > 3) {
                        limit = 3;
                    } else {
                        limit = users.data.length;
                    }

                    for (let i = 0; i < limit; i++) {
                        this.popularUsers.push(arr_users[i]);
                    }
                })
                .catch((err) => {
                    console.log('Get Popular Users Error: ', err);
                });
        },
        follow: function(userId) {
            axios({
                method: 'PATCH',
                url: `${config.port}/users/follow/${userId}`,
                headers: {
                    'access-token': localStorage.getItem('token')
                }
            })
                .then((result) => {
                    this.getAllUsers();
                })
                .catch((err) => {
                    console.log('Follow User Error: ', err);
                });
        }
    }, 
    created() {
        this.getAllUsers();
        this.getPopularUsers();
    }
}
</script>

<style scoped>
#popularAvatar {
    width: 40px;
    height: 40px;
}

#btn-follow {
    background-color: #008080;
    color: white;
}
</style>
