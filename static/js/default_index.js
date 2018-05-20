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
          drawer: true,
          items: [
            { icon: 'trending_up', text: 'Leaderboard' },
            { icon: 'subscriptions', text: 'Introduction' },
            { icon: 'history', text: 'Journal' },
            { icon: 'featured_play_list', text: 'Chat' },
            { icon: 'watch_later', text: 'Progress' }
          ],
          items2: [
            { picture: 28, text: 'Joseph' },
            { picture: 38, text: 'Apple' },
            { picture: 48, text: 'Xbox Ahoy' },
            { picture: 58, text: 'Nokia' },
            { picture: 78, text: 'MKBHD' }
          ]
        }

    });
    self.get_memo()

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});