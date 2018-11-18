<template>
  <div class="modal fade" id="editModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Edit Article</h5>
            <button class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group d-flex flex-column">
                <label for="title" class="text-left">Title</label>
                <input type="text" placeholder="Task Title" class="form-control" v-model="currentArticle.title" value="currentArticle.title">
            </div>
            <div class="form-group d-flex flex-column">
                <label for="description" class="text-left">Description</label>
                <textarea class="form-control" id="message" rows="3" placeholder="Task Brief Explanation" v-model="currentArticle.description">{{currentArticle.description}}</textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer ">
            <button class="btn btn-danger font-weight-bold" data-dismiss="modal">Cancel</button>
            <button class="btn btn-primary font-weight-bold ml-1" data-dismiss="modal" @click="editArticle">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config.js'

export default {
  name: 'EditModal',
  props: ['articleId', 'getonearticle', 'getarticles'],
  data() {
    return {
      currentArticle: {
        title: '',
        description: ''
      }
    }
  },
  methods: {
    getCurrentArticle: function() {
      axios({
        method: 'GET',
        url: `${config.port}/articles/${this.articleId}`
      })
        .then((article) => {
            this.currentArticle.title = article.data.title
            this.currentArticle.description = article.data.description
        })
        .catch((err) => {
            console.log(err)
        })
    },
    editArticle: function() {
      axios({
        method: 'PUT',
        url: `${config.port}/articles/${this.articleId}`,
        data: {
          title: this.currentArticle.title,
          description: this.currentArticle.description
        },
        headers: {
          'access-token': localStorage.getItem('token')
        }
      })
        .then((result) => {
          this.getCurrentArticle()
          this.getonearticle()
          this.getarticles()
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  created() {
    this.getCurrentArticle()
    this.getonearticle()
  },
  watch: {
    articleId() {
      axios({
          method: 'GET',
          url: `${config.port}/articles/${this.articleId}`
      })
          .then((article) => {
              this.currentArticle.title = article.data.title
              this.currentArticle.description = article.data.description
          })
          .catch((err) => {
              console.log(err)
          })
    }
  }
}
</script>

<style>

</style>