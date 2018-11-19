<template>
    <div class="container-fluid border mb-5">
        <div class="row">
            <div class="col-md-12">
                <div class="text-left h3 ml-2 mt-4 mb-3" id="related-header">Related Videos</div>
                <div class="mt-4">
                    
                    <!-- Video List -->
                    <ul class="list-unstyled mx-2" v-if="!noRelatedVideos">
                        <a class="video-link" v-for="video in videos">
                            <li>
                                <div class="embed-responsive embed-responsive-16by9">
                                    <iframe class="embed-responsive-item" :src="video.url" allowfullscreen></iframe>
                                </div>
                                <div class="mt-3">
                                    <div class="mb-3">
                                        <div class="lead">{{ video.snippet.title }}</div>
                                    </div>
                                    <div class="mb-2">{{ video.snippet.description }}</div>
                                    <div class="mb-4 font-weight-bold">{{ video.snippet.channelTitle }}</div>
                                    <hr>
                                </div>
                            </li>
                        </a>
                    </ul>
                    <div class="lead text-left mb-4 ml-2" v-else>
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

              for (let i = 0; i < this.videos.length; i++) {
                  this.videos[i].url = `https://youtube.com/embed/${this.videos[i].id.videoId}?rel=0`
              }

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

<style scoped>
#related-header {
    font-family: 'Oswald', sans-serif;
}
</style>