<template>
    <div class="position-relative" id="one-wrapper">
        <div class="position-fixed d-flex align-items-center justify-content-center rounded" id="drum-btn" @click="clap">
            <i class="fas fa-drum mr-2" title="ba dum tss"></i>
            <div class="lead" id="clapcount">{{ clapCount }}</div>
        </div>
        <div class="d-flex justify-content-start mb-2">
            <button class="btn btn-link" @click="backToAll"><i class="fas fa-undo-alt"></i> Back</button>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div v-if="isLogin && userEmail === article.author.email" class="d-flex justify-content-end align-items-center mb-4">
                    <i class="fas fa-edit text-dark mr-3" data-toggle="modal" data-target="#editModal" id="btn-edit-delete"></i>
                    <i class="fas fa-minus-circle text-danger" id="btn-edit-delete" data-toggle="modal" data-target="#confirmModalDelete"></i>
                </div>
                <EditModal :articleId="article._id" :getonearticle="getOneArticle" :getarticles="getarticles"></EditModal>
                <div class="modal fade mt-5" id="confirmModalDelete">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-body">
                                <div class="mb-4 mt-3">Are you sure you want to delete this article?</div>
                                <div class="mb-3">
                                    <button class="btn btn-danger font-weight-bold" data-dismiss="modal">Cancel</button>
                                    <button class="btn btn-primary font-weight-bold ml-5" data-dismiss="modal" @click="deleteArticle(article._id)">Positive</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <h4 class="card-title">{{ article.title }}</h4>
                <div class="container mb-4">
                    <p class="card-text text-justify">{{ article.description }}</p>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="font-weight-bold ml-5">By {{ article.author.username }}</div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <i class="far fa-comment-alt mr-2" id="comment-symbol"></i>
                        <div class="lead font-weight-bold mr-5">{{commentBadge}}</div>
                    </div>
                </div>
                <div class="text-right mr-5" @click="showCommentForm" style="cursor:pointer">Toggle comments</div>
            </div>
        </div>
        <div class="card mb-3" v-if="commentForm">
            <div class="h3 text-left ml-4 mt-4 mb-3" id="comment-section-h">Comment Section</div>
            <div class="card-body">
                <textarea type="text" class="form-control mb-3" placeholder="Add Comment" v-model="commentContent"></textarea>
                <div class="d-flex justify-content-end mb-4">
                    <input @click="addComment" type="submit" class="btn btn-block btn-primary font-weight-bold" value="Submit">
                </div>
                <div v-for="comment in comments" class="d-flex justify-content-between container mb-3 border py-3 px-4">
                    <div class="d-flex flex-column align-items-start justify-content-center">
                        <div class="mb-2">{{comment.content}}</div>
                        <div class="font-weight-bold">{{comment.user.username}}</div>
                    </div>
                    <div class="d-flex justify-content-end align-items-center">
                        <i class="far fa-trash-alt text-warning text-right" id="btn-edit-delete" v-if="userEmail === comment.user.email" @click="deleteComment(comment._id)"></i>
                    </div>
                </div>
            </div>
        </div>

        <RelatedVideos :articletitle="article.title"></RelatedVideos>
    </div>
</template>

<script>
import EditModal from '@/components/EditModal.vue';
import RelatedVideos from '@/components/RelatedVideos.vue';
import config from '@/config.js';
import database from '../assets/fireconfig';

export default {
    name: 'OneArticle',
    props: ['id', 'isLogin', 'userEmail', 'getarticles', 'checktoken'],
    components: {
        EditModal, RelatedVideos
    },
    data() {
        return {
            article: {},
            articleId: '',
            comments: [],
            commentContent: '',
            commentBadge: 0,
            commentForm: true, 
            clapCount: 0
        }
    },
    methods: {
        getOneArticle: function() {
            axios({
                method: 'GET',
                url: `${config.port}/articles/${this.id}` // could use this.$route.params.id
            })
                .then((article) => {
                    this.article = article.data
                    
                    let self = this;
                    let refClap = database.ref('clap/' + this.article.clapKey + '/clapCount');
                    refClap.on('value', function(snapshot) {
                        self.clapCount = snapshot.val();
                    });
                })
                .catch((err) => {
                    console.log('Get One Article Error: ', err)
                });
        },
        getComments: function() {
            axios({
                method: 'GET',
                url: `${config.port}/comments/${this.id}`,
                headers: {
                    'access-token': localStorage.getItem('token')
                }
            })
                .then((comments) => {
                    this.comments = comments.data.reverse();
                    this.commentBadge = this.comments.length;
                })
                .catch((err) => {
                    console.log('Get Article Comments Error: ', err);
                });
        },
        addComment: function() {
            axios({
                method: 'POST',
                url: `${config.port}/comments/${this.id}`,
                data: {
                    content: this.commentContent
                },
                headers: {
                    'access-token': localStorage.getItem('token')
                }
            })
                .then((result) => {
                    this.commentContent = '';
                    this.getComments();
                })
                .catch((err) => {
                    console.log('Add Comment Error: ', err);
                });
        },
        deleteComment: function(commentId) {
            axios({
                method: 'DELETE',
                url: `${config.port}/comments/${this.id}`,
                headers: {
                    'access-token': localStorage.getItem('token')
                },
                data: {
                    id: commentId
                }
            })
                .then((result) => {
                    this.getComments();
                })
                .catch((err) => {
                    console.log('Delete Comment Error: ', err);
                });
        },
        showCommentForm: function() {
            if (this.commentForm === true) {
                this.commentForm = false;
            } else {
                this.commentForm = true;
            }
        },
        backToAll: function() {
            this.$router.push('/articles');
        },
        deleteArticle: function(articleId) {
            axios({
                method: 'DELETE',
                url: `${config.port}/articles/${articleId}`,
                headers: {
                    'access-token': localStorage.getItem('token')
                }
            })
                .then((result) => {
                    this.getarticles();
                    this.backToAll();
                })
                .catch((err) => {
                    console.log('Delete Article Error: ', err);
                });
        },
        clap: function() {
            let refClap = database.ref('clap/' + this.article.clapKey + '/clapCount');
            refClap.once('value', function(snapshot) {
                let count = Number(snapshot.val());
                let newCount = count + 1;

                refClap.set(newCount);
            });
        }
    },
    created() {
        this.getOneArticle();
        this.getComments();
        this.checktoken();
    },
    watch: {
        id(val) {
            this.articleId = val;

            axios({
                method: 'GET',
                url: `${config.port}/articles/${this.articleId}`
            })
                .then((article) => {
                    this.article = article.data;
                })
                .catch((err) => {
                    console.log('Get One Article Watch Error: ', err);
                });

            this.getComments();
        },
        article() {
            this.commentForm = true;
        },
        $route() {
            this.getOneArticle();
        }
    }
}
</script>

<style>
#comment-section-h {
    font-family: 'Oswald', serif;
}

#drum-btn {
    top: 90%;
    left: 5%;
    transform: translateY(-50%);    
    width: 80px;
    height: 50px;
    font-size: 30px;
}

#drum-btn i {
    cursor: pointer;
}

#clapcount {
    font-family: 'Titillium Web', serif !important;
    font-size: 25px;
}

#btn-edit-delete {
    font-size: 20px;
    cursor: pointer;
}
</style>