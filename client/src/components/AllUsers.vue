<template>
    <div>
        <div class="card mb-5" v-if="islogin">
            <div class="card-body">
                <h5 class="font-weight-light mb-3">Who To Follow</h5>
                <div class="d-flex mb-3 justify-content-between" v-for="user in blogUsers">
                    <span class="font-weight-bold">{{ user.username }} </span> 
                    <div class="d-flex justify-content-center align-items-center">
                        <button class="btn btn-success mr-3" id="btn-done" @click="follow(user._id)">Follow</button>
                        <button class="btn btn-warning text-white ml-3" id="btn-undone" @click="unfollow(user._id)">Unfollow</button>
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
            blogUsers: []
        }
    },
    methods: {
        getAllUsers: function() {
            axios({
                method: 'GET',
                url: `${config.port}/users/all`,
                headers: {
                    'access-token': localStorage.getItem('token')
                }
            })
                .then((users) => {
                    this.blogUsers = users.data;
                })
                .catch((err) => {
                    console.log('Get All Users Error: ', err);
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
        },
        unfollow: function(userId) {
            axios({
                method: 'PATCH',
                url: `${config.port}/users/unfollow/${userId}`,
                headers: {
                    'access-token': localStorage.getItem('token')
                }
            })
                .then((result) => {
                    this.getAllUsers();
                })
                .catch((err) => {
                    console.log('Unfollow User Error: ', err);
                });
        }
    }, 
    created() {
        this.getAllUsers();
    }
}
</script>

<style>

</style>
