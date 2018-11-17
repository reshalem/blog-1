<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-xl-7">
        <div class="mt-4">

          <!-- Search Form -->
          <form>
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Search videos across YouTube..."
                aria-label="Search videos across YouTube..."
                aria-describedby="go-button-addon"
                auto-complete="off"
                autofocus v-model="keyword">
              <div class="input-group-append">
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  id="go-button-addon" @click="searchVideo">
                  Go!
                </button>
              </div>
            </div>
          </form>

          <!-- Video List -->
          <ul class="list-unstyled">
            <a class="video-link" v-for="video in videos">
              <li class="media my-4">
                <img class="mr-3" :src="video.snippet.thumbnails.default.url" alt="Thumbnail">
                <div class="media-body">
                  <div class="mb-3">
                    <router-link class="lead" :to="{ name: 'id', params: { id: video.id.videoId }}">{{ video.snippet.title }}</router-link>
                  </div>
                  <div class="mb-2">{{video.snippet.description}}</div>
                  <br />
                </div>
              </li>
            </a>
          </ul>
        </div>
      </div>

      <div class="col-xl-5">
        <router-view :videos="videos" :islogin="isLogin"></router-view>
      </div>
    </div>
  </div>
</template>

<script>

export default {
    name: 'Likes',
    props: ['isLogin', 'checktoken'],
    data() {
        return {
            videos: [],
            shouldUpdate: 0,
            keyword: ''
        }
    },
    methods: {
        getVideos: function() {
          let params = {
            'maxResults': '25',
            'part': 'snippet',
            'q': 'barcelona beat real madrid',
            'type': 'video',
            'key': 'AIzaSyBpYDx39wTskgZBIF9flVSP3TW77s7_ppo'
          }
          axios.get('https://www.googleapis.com/youtube/v3/search', {params})
            .then((result) => {
              this.videos = result.data.items
            })
            .catch((err) => {
              console.log(err)
            })
        },
        searchVideo: function() {
          let params = {
            'maxResults': '25',
            'part': 'snippet',
            'q': this.keyword,
            'type': 'video',
            'key': 'AIzaSyBpYDx39wTskgZBIF9flVSP3TW77s7_ppo'
          }
          axios.get('https://www.googleapis.com/youtube/v3/search', {params})
            .then((result) => {
              this.videos = result.data.items
            })
            .catch((err) => {
              console.log(err)
            })
        }
    },
    created() {
        this.getVideos()
    },
    watch: {
        
    }
}
</script>

<style>

</style>