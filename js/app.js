apiURL = "https://qg.jonathanconde.com/api/films";


// var assistance = Vue.extend({
//     template: '#assistance'
// })


var App = Vue.extend({});

var editMovie = Vue.extend({
    template: '#edit-movie',

    data: function(){
        return {
            film: '',
            title: '',
            body: ''
        }
    },

    ready: function(){
        this.getTheMovie();
    },

    methods: {
        getTheMovie: function(){
            this.$http.get(apiURL + '/' + this.$route.params.movieID, function(film){
                this.$set('film', film);
            });
        },
        updateTheMovie: function(event){
            event.preventDefault();

            var data = {
                '_links': {
                    'type': {
                        'href' : 'https://qg.jonathanconde.com/qg/rest/type/node/films'
                    }
                },
                'title': [
                    {
                        'value':this.title
                    }
                ],
                'body': [
                    {
                        'value' : this.body
                    }
                ]
            }
            this.$http.patch('https://qg.jonathanconde.com/qg/node/' + this.$route.params.movieID, data, function(response){
                this.$route.router.go('/');
            },{
                headers: {
                    'Accept': 'json',
                    'Content-Type' : 'application/hal+json',
                    'Authorization' : 'Basic YWRtaW46MEowbmFtM1Q='
                }
            });
        }
    }
});

var deleteMovie = Vue.extend({
    template: '#delete-movie',
    http:{
        headers: {
            'Accept': 'json',
            'Content-Type' : 'application/hal+json',
            'Authorization' : 'Basic YWRtaW46MEowbmFtM1Q='
        }
    },

    methods:{
        deleteTheMovie: function(){
            this.$http.delete('https://qg.jonathanconde.com/qg/node/' + this.$route.params.movieID, function(response){
                this.$route.router.go('/');
            });
        }
    }
});

var createMovie = Vue.extend({
    template: '#create-movie',

    data: function(){
        return {
            title: '',
            body: '',
            success:''
        }
    },


    http:{
        headers: {
            'Accept': 'json',
            'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
            'Authorization' : 'Basic YWRtaW46MEowbmFtM1Q='
        }
    },

    ready: function(){
        //  this.createMovie();
    },


    methods: {
        createTheMovie: function (event){

            event.preventDefault();

            var data = {
                '_links': {
                    'type': {
                        'href' : 'https://qg.jonathanconde.com/qg/rest/type/node/films'
                    }
                },
                'title': [
                    {
                        'value':this.title
                    }
                ],
                'body': [
                    {
                        'value' : this.body
                    }
                ]
            }
            this.$http.post('https://qg.jonathanconde.com/qg/entity/node/', data, function(response){
                this.$set('success', 'ok');
                this.$set('title', '');
                this.$set('body', '');
            });
        }
    }
})

var movieList = Vue.extend({
    template: '#movie-list-template',

    data: function(){
        return {
            films: '',
            liveFilter: '',
            genreFilter: '',
            genres: '',
            film: '',
            loading: false
        }
    },

    ready: function(){
        this.getMovies();
    },

    methods: {
        getMovies: function(){
            this.$set('film', '');
            this.$set('loading',true);
            
            this.$http.get(apiURL, function(films){
                this.$set('loading',false);
                this.$set('films', films);

                genresArr=[];

                jQuery.each(films, function(index, film){
                    jQuery.each(film.field_genre, function(index, genre){
                        if(jQuery.inArray(genre.value, genresArr) === -1) {
                            genresArr.push(genre.value);
                        }
                    });
                });
                this.$set('genres', genresArr);
            });
        }
    }
})

var singleMovie = Vue.extend({
    template: '#single-movie-template',
    data: function(){
        return {
            film:'',
            loading: false
        }
    },

    ready: function(){
        this.getTheMovie();
    },
    methods: {
        getTheMovie: function(){
            this.$set('loading', true);
            this.$http.get(apiURL + '/' + this.$route.params.movieID, function(film){
                this.$set('loading', false);
                this.$set('film', film);
            });
        }
    }
});

var router = new VueRouter();

router.map({
    '/':{
        component: movieList
    },
    'create':{
        component:createMovie
    },
    // '/assistance':{
    //     component: assistance
    // },
    'film/:movieID':{
        name: 'film',
        component: singleMovie
    },
    'delete/:movieID':{
        name: 'delete',
        component: deleteMovie
    },
    'edit/:movieID':{
        name: 'edit',
        component: editMovie
    }
});

router.start(App, '#app');

// new Vue({
//     el: '#app',

//     data: {
//         films: '',
//         liveFilter: '',
//         genreFilter: '',
//         genres: '',
//         film: ''
//     },


//     ready: function(){
//         this.getMovies();
//     },

//     methods: {
//         getMovies: function(){
//             this.$set('film', '');
//             this.$http.get(apiURL, function(films){
//                 this.$set('films', films);

//                 genresArr=[];

//                 jQuery.each(films, function(index, film){
//                     jQuery.each(film.field_genre, function(index, genre){
//                         if(jQuery.inArray(genre.value, genresArr) === -1) {
//                             genresArr.push(genre.value);
//                         }
//                     });
//                 });
//                 this.$set('genres', genresArr);
//             });
//         },

//         getTheMovie: function(movieID){
//             this.$http.get(apiURL + '/' + movieID, function(film){
//                 this.$set('film', film);
//             });
//         }
//     }
// })
