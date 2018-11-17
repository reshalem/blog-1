<template>
  <!-- Player and Detail -->
  <div class="mt-4">
    <div class="card mb-2 mb-3" style="width: 100%;">
      <div class="card-body">
        <img class="card-img-top img-fluid mb-4" :src="video.snippet.thumbnails.medium.url" alt="">
        <h5 class="card-title">{{video.snippet.title}}</h5>
        <p class="card-text text-justify">
          {{video.snippet.description}}
        </p>
        <p class="card-text text-left">From Channel <i class="fas fa-arrow-circle-right mx-2"></i> {{video.snippet.channelTitle}}</p>
      </div>
    </div>
    <button class="btn btn-sm btn-success" v-if="islogin" @click="likeVideo(video.id.videoId)">{{likeStatement}}</button><br />
  </div>
</template>

<script>
export default {
  name: 'CurrentVideo',
  props: ['id', 'videos', 'islogin'],
  data() {
    return {
      video: {},
      videoId: '',
      likeStatement: 'Like this Video!',
      currentUser: {}
    }
  },
  methods: {
    getVideoById: function() {
      for (let i = 0; i < this.videos.length; i++) {
        if (this.videos[i].id.videoId === this.id) {
          this.video = this.videos[i];
          break;
        }
      }

      if (this.video.id === null) {
        console.log('wrong id');
      }
    },
    likeVideo: function(videoId) {
      axios({
        method: 'PATCH',
        url: 'http://localhost:3000/users/like',
        data: {
          id: videoId
        },
        headers: {
          'access-token': localStorage.getItem('token')
        }
      })
        .then((result) => {
          if (this.likeStatement === 'Like this video!') {
            this.likeStatement = 'Unlike this video!'
          } else if (this.likeStatement === 'Unlike this video!') {
            this.likeStatement = 'Like this video!'
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getUserProfile: function() {
      axios({
        method: 'GET',
        url: 'http://localhost:3000/users/profile',
        headers: {
          'access-token': localStorage.getItem('token')
        }
      })
        .then((user) => {
          this.currentUser = user.data
          loopLiked: for (var i = 0; i < this.currentUser.liked.length; i++) {
            if (this.video.id.videoId === this.currentUser.liked[i]) {
              this.likeStatement = 'Unlike this video!'
              break loopLiked;
            }
          }

          if (i === this.currentUser.liked.length) {
            this.likeStatement = 'Like this video!' //sorry I need to use var
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  created() {
    this.getVideoById()
    this.getUserProfile()
  },
  watch: {
    id(val) {
      this.videoId = val

      for (let i = 0; i < this.videos.length; i++) {
        if (this.videos[i].id.videoId === this.videoId) {
          this.video = this.videos[i];
          break;
        }
      }

      if (this.video.id === null) {
        console.log('wrong id');
      }

      loopLiked: for (var i = 0; i < this.currentUser.liked.length; i++) {
        if (this.videoId === this.currentUser.liked[i]) {
          this.likeStatement = 'Unlike this video!'
          break loopLiked;
        }
      }

      if (i === this.currentUser.liked.length) {
        this.likeStatement = 'Like this video!' //sorry I need to use var
      }
    }
  }
}
</script>

<style>

</style>