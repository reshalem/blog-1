<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-xl-7">
        <div class="mt-4">



          <!-- Video List -->
          <ul class="list-unstyled" v-if="!noRelatedVideos">
            <a class="video-link" v-for="video in videos">
              <li class="media my-4">
                <img class="mr-3" :src="video.snippet.thumbnails.default.url" alt="Thumbnail">
                <div class="media-body">
                  <div class="mb-3">
                    <div class="lead">{{ video.snippet.title }}</div>
                  </div>
                  <div class="mb-2">{{video.snippet.description}}</div>
                  <br />
                </div>
              </li>
            </a>
          </ul>
          <div class="lead" v-else>
              There are no related videos regarding this article (title).
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import config from '@/config.js';

export default {
    name: 'relatedvideos',
    props: ['articletitle'],
    data() {
        return {
            videos: [],
            noRelatedVideos: false
        }
    },
    methods: {
        getVideos: function(articleTitle) {
          let params = {
            'maxResults': '3',
            'part': 'snippet',
            'q': `${articleTitle}`,
            'type': 'video',
            'key': `${config.youtubeAPIKey}`
          }
          axios.get('https://www.googleapis.com/youtube/v3/search', {params})
            .then((result) => {
              this.videos = result.data.items;

              if (result.data.items.length === 0) {
                  this.noRelatedVideos = true;
              } else {
                  this.noRelatedVideos = false;
              }
            })
            .catch((err) => {
              console.log('Get Related Videos Error: ', err);
            });
        }
    },
    created() {
        this.getVideos(this.articletitle);
    },
    watch: {
        articletitle() {
            this.getVideos(this.articletitle);
        }
    }
}
</script>

<style>

</style>