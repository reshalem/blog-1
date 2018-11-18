<template>
	<div class="col-12 mb-4 d-flex justify-content-center">
		<div class="d-flex align-items-center mr-5">
            <Header></Header>
        </div>
		<div class="col-lg-5 ml-5">
			<div class="card text-center card-form">
				<div class="card-body">
					<h3>Register</h3>
					<p>Please fill out this form to register</p>
					<div>
						<div class="form-group">
							<input type="text" v-model="registerUser.username" class="form-control" placeholder="Username" autofocus>
						</div>
						<div class="form-group">
							<input type="email" v-model="registerUser.email" class="form-control" placeholder="Email">
                            <small id="passwordHelpBlock" class="form-text text-muted text-left">
								Please use a proper email address.
							</small>
						</div>
						<div class="form-group">
							<input type="password" v-model="registerUser.password" class="form-control" placeholder="Password">
							<small id="passwordHelpBlock" class="form-text text-muted text-left">
								Your password must be 4-10 characters long.
							</small>
						</div>
						<p class="text-left mb-1">Upload Your Avatar</p>
                        <div class="custom-file mb-3">
                            <input class="custom-file-input" type="file" v-on:change="getImageForProfile($event)">
                            <label class="custom-file-label text-left">{{ registerUser.avatar.name }}</label>
                        </div>
                        <div class="d-flex justify-content-end mb-3">
                            <button v-if="registerUser.avatar" class="btn text-white font-weight-bold" id="remove-img-btn" @click="removeImage">Remove Image</button>
                        </div>
                        <hr>
						<input type="submit" @click="register" value="Register" class="btn btn-danger btn-block font-weight-bold">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Header from '@/components/Header.vue';
import config from '@/config.js';

export default {
    name: 'register',
    props: ['checktoken'],
    data () {
	    return {
		    registerUser: {
                username: '',
                email: '',
                password: '',
                avatar: ''
		    }
	    }
    },
    components: {
        Header
    },
    methods: {
		register: function() {
			let formdata = new FormData();
			formdata.append('image', this.registerUser.avatar);

			axios.post(`${config.port}/uploadimage`, formdata, {
					
			})
				.then((response) => {
					axios({
						method: 'POST',
						url: `${config.port}/register`,
						data: {
							username: this.registerUser.username,
							email: this.registerUser.email,
							password: this.registerUser.password,
							avatarURL: response.data.link
						}
					})
						.then((result) => {
							this.registerUser.username = '';
							this.registerUser.email = '';
							this.registerUser.password = '';
							this.registerUser.avatar = '';
							this.$router.push('/');
                        })
                        .catch((err) => {
                            console.log('Register Error: ', err);
                        });
				})
				.catch((err) => {
					console.log('Upload Image to GCS Error: ', err);
				});
		},
		getImageForProfile(link){
            this.registerUser.avatar = link.target.files[0];
        },
        removeImage: function() {
            this.registerUser.avatar = '';
        }
    }, 
    created() {
        this.checktoken();
    }
}
</script>

<style scoped>
#remove-img-btn {
    background-color: #192a3d;
}

.custom-file-input {
    cursor: pointer;
}
</style>