// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // self.get_more = function(){
    //     var num_memos = self.vue.memos.length;
    //     $.getJSON(get_memos_url(num_memos, num_memos + 10),function(data){
    //         self.vue.has_more = data.has_more;
    //         self.extend(self.vue.memos, data.memos);
    //         self.vue.user_email = data.user_email
    //     });
    // }

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            photo:'',
            page: 'introduction',
            drawer: true,
            items: [
                { icon: 'subscriptions', text: 'introduction' },
                { icon: 'trending_up', text: 'leaderboard' },
                { icon: 'history', text: 'page1' },
                { icon: 'featured_play_list', text: 'page2' },
                { icon: 'watch_later', text: 'Progress' }
            ],
            exampleList: [
                'Item 1',
                'Item 2',
                'Item 3',
                'Item 4'
            ],
            inputname: '默认没有',
            exampleEmail: '',
            exampleSelect: ''
        },
        methods: {
            capitalize(string) {
                return string.charAt(0).toUpperCase() + string.slice(1)
            },
            changePage(page) {
                if (!USER) return
                else this.page = page
            },
            logout() {
                firebase.auth().signOut().then(function() {
                  // Sign-out successful.
                  location.reload()     
                }, function(error) {
                  // An error happened.
                });
            },
            submit() {
                  firebase.database().ref('users/profile/name').update({
                 inputname : this.inputname
  });
            },
            clear() {

            },
            showpicture(){
                IF(USER)
                photo = USER.photoURL
                return photo
            }
        }

    });
    return self;
};

var APP = null;