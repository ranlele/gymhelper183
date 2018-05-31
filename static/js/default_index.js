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
            gradient: 'to top right, rgba(63,81,181, .7), rgba(25,32,72, .7)',
            photo:'',
            page: 'introduction',
            drawer: true,
            items: [
                { icon: 'subscriptions', text: 'introduction' },
                { icon: 'trending_up', text: 'leaderboard' },
                { icon: 'history', text: 'Profile' },
                { icon: 'featured_play_list', text: 'journal' },
                { icon: 'watch_later', text: 'Progress' }
            ],
            exampleList: [
                'Item 1',
                'Item 2',
                'Item 3',
                'Item 4'
            ],
            hours:'',
            miles:'',
            time:'',
            minutes:'',
            repetitions:'',
            sets:'',
            date:'',
            today:'',
            inputHeight: '183 cm',
            inputWeight: '150 kg',
            inputBFR:'%',
            inputAge:'25',
            inputGender:'',
            genderSelect: [
                'Famale',
                'Male',
            ],
            favoritefoodSelect: [
                'Hotpot',
                'IceCream',
                'Piazza',
            ],
            favoritegameSelect: [
                'League of Legends',
                'OverWatch',
                'Dota',
                'PUBG',

            ],
            aerobicExerciseSelect:'',
            anaerobicExerciseSelect:'',
            anaerobicExerciseList:[
                'pushUps',
                'pullUps',
                'sitUps'


            ],
            aerobicExerciseList:[
                'running',
                'walking',
                'swimming',
                'spinning',
                'kickboxing',
                'dancing'
            ],
        },
        methods: {
            capitalize(string) {
                return string.charAt(0).toUpperCase() + string.slice(1)
            },
            changePage(page) {

                 this.page = page
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
             submitprofile() {
                 var uid = USER.uid
                     firebase.database().ref('users/' + uid + '/profile/').update({
                     BFR: this.inputBFR,
                     inputHeight: this.inputHeight,
                     inputWeight: this.inputWeight,
                     BFR: this.inputWeight,
                     Age: this.inputAge,
                     Gender: this.inputGender
                 });
             },

            submitJournal1(){
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1; //January is 0!
                var yyyy = today.getFullYear();
                var hr = today.getHours();
                var min = today.getMinutes();
                var sec = today.getSeconds();

                  if(dd<10) {
                    dd = '0'+dd
                 }
                  if(mm<10) {
                    mm = '0'+mm
                 }
                today = mm + '_' + dd + '_' + yyyy
                var uid = USER.uid
                firebase.database().ref('users/'+ uid +'/journal/aerobicExerciseData/'+today).update({
                   aerobicExerciseSelect : this.aerobicExerciseSelect,
                   miles : this.miles,
                   hours : this.hours,
                   minutes :  this.minutes
                   });



            },

            submitJournal2(){
                  var today = new Date()
                  var dd = today.getDate();
                  var mm = today.getMonth()+1; //January is 0!
                  var yyyy = today.getFullYear();
                  var hr = today.getHours();
                  var min = today.getMinutes();
                  var sec = today.getSeconds();

                  if(dd<10) {
                      dd = '0'+dd
                  }
                  if(mm<10) {
                      mm = '0'+mm
                  }
                  today = mm + '_' + dd + '_' + yyyy
                  var uid = USER.uid
                
                  firebase.database().ref('users/'+ uid +'/journal/anaerobicExerciseData/'+today).update({
                  anaerobicExerciseSelect : this.anaerobicExerciseSelect,
                  sets : this.sets,
                  repetitions : this.repetitions
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
