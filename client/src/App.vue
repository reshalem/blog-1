<template>
    <div id="app">
        <nav class="navbar navbar-expand-sm navbar-light mb-5 mt-2">
            <div class="container">
                <a id="home-nav" class="navbar-brand text-secondary">
                    BloGate
                </a>
                <div class="collapse navbar-collapse" id="div-main-nav">
                    <ul class="navbar-nav font-weight-bold ml-auto" id="main-nav">
                        <li class="nav-item mr-2">
                            <router-link id="nav-link-btn" to="/featured" class="nav-link">
                                Featured
                                <i class="fas fa-fire"></i>
                            </router-link>
                        </li>
                        <li class="nav-item mr-2">
                            <router-link id="nav-link-btn" to="/articles" class="nav-link">
                                Articles
                                <i class="fas fa-paper-plane ml-1"></i>
                            </router-link>
                        </li>
                        <li class="nav-item dropdown mr-2" v-if="!isLogin">
                            <router-link id="nav-link-btn" to="/register" class="nav-link">
                                Register
                                <i class="fas fa-scroll ml-1"></i>
                            </router-link>
                        </li>
                        <li class="nav-item dropdown mr-2" v-if="!isLogin">
                            <router-link id="nav-link-btn" to="/" class="nav-link">
                                Login
                                <i class="fas fa-user-astronaut ml-1"></i>
                            </router-link>
                        </li>
                        <li class="nav-item mr-2" v-if="isLogin">
                            <router-link id="nav-link-btn" to="/profile" class="nav-link">
                                Profile
                                <i class="fas fa-user-ninja ml-1"></i>
                            </router-link>
                        </li>
                        <li class="nav-item dropdown mr-2" v-if="isLogin">
                            <a class="nav-link" @click="logout" style="cursor: pointer">
                                Log Out
                                <i class="fas fa-sign-out-alt ml-1"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container">
            <router-view :checktoken="checkToken" :isLogin="isLogin" @sendEmail="updateEmail($event)" :userEmail="userEmail"/>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            isLogin: false,
            userEmail: ''
        }
    },
    methods: {
        checkToken: function() {
            let token = localStorage.getItem('token');
            if (token) {
                this.isLogin = true;
                if (this.$router.history.current.name === 'register' || this.$router.history.current.name === 'login') {
                    this.$router.push('/articles');
                }
            } else {
                this.isLogin = false;
                if (this.$router.history.current.name !== 'login' && this.$router.history.current.name !== 'register' && this.$router.history.current.name !== 'articles' && this.$router.history.current.name !== 'featured') {
                    this.$router.push('/');
                }
            }
        },
        logout: function() {
            localStorage.removeItem('token');
            this.checkToken();
            this.$router.push('/');
        },
        updateEmail: function(value) {
            this.userEmail = value;
        }
    },
    created() {
        this.checkToken();
        this.userEmail = localStorage.getItem('email');
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    width: 250px;
    padding: 10px;
}

#top-nav {
    background-color: #133337 !important;
}

#home-nav {
    font-family: 'Roboto Slab', serif;
    font-size: 30px;
    cursor: pointer;
}

#search-nav {
    border-color: #cccccc;
    -webkit-box-shadow: none;
    box-shadow: none;
}

#main-nav {
    font-family: Lato;
    font-size: 18px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}

#comment-symbol {
    font-size: 20px;
}

.link_active {
    outline: 0;
}

.myLink {
    outline: 0;
}

@media (min-width: 34em) {
    .card-columns {
        -webkit-column-count: 2;
        -moz-column-count: 2;
        column-count: 2;
    }
}

#btn-post:hover {
    background-color: #ffa500;
    color: white;
}

#btn-post {
    background-color: #133337;
    color: white;
}

#span-comment {
    font-size: 18px;
}
</style>