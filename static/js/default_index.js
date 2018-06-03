// This is the js for the default/index.html view.

var app = function() {

  var self = {};

  Vue.config.silent = false; // show all warnings
  self.vue = new Vue({
    el: "#vue-div",
    delimiters: ['${', '}'],
    unsafeDelimiters: ['!{', '}'],
    data: {
      photo: '',
      page: 'introduction',
      drawer: true,
      items: [{
          icon: 'home',
          text: 'introduction'
        },
        {
          icon: 'format_list_numbered',
          text: 'leaderboard'
        },
        {
          icon: 'person',
          text: 'profile'
        },
        {
          icon: 'edit',
          text: 'journal'
        },
        {
          icon: 'insert_chart',
          text: 'progress'
        }
      ],
      exampleList: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4'
      ],
      hours: '',
      miles: '',
      time: '',
      minutes: '',
      repetitions: '',
      sets: '',
      date: '',
      aerobicExerciseSelect: '',
      anaerobicExerciseSelect: '',
      anaerobicExerciseList: [
        'pushups',
        'pullups',
        'situps'
      ],
      aerobicExerciseList: [
        'running',
        'walking',
        'swimming'
      ],
      runningChart: null,
      walkingChart: null,
      swimmingChart: null,
      pushupsChart: null,
      pullupsChart: null,
      situpsChart: null,
      journal: null,
      custom_day: '06_01_2018',
      selected_month: '5', //(new Date().getMonth() + 1).toString(),
      selectedExercise: 'running',
      running: {
        x: [],
        y: []
      },
      swimming: {
        x: [],
        y: []
      },
      walking: {
        x: [],
        y: []
      },
      pushups: {
        x: [],
        y: []
      },
      pullups: {
        x: [],
        y: []
      },
      situps: {
        x: [],
        y: []
      },
      parsedAllUserData: null,
      isLogin: false,
      snackbar: false,
      username: '',
      gender: 'male',
      age: 0,
      height: 0,
      weight: 0,
      bodyFat: 0
    },
    mounted() {
      if (USER) {
        this.isLogin = true
        this.snackbar = true
        this.username = USER.displayName
        var ref = firebase.database().ref('users/' + USER.uid);
        ref.once('value').then((snapshot) => {
          if (snapshot.child('journal')) {
            this.journal = snapshot.child('journal').val()
            this.parseAerobicData()
            // this.initAerobicChart()
            this.parseAnaerobicData()
            // this.initAnaerobicChart()
          }
        })
        var ref2 = firebase.database().ref('users');
        ref2.once('value').then((snapshot) => {
          this.allUserData = snapshot.val()
          this.parseLeaderboardList()
        })
      } else this.page = 'introduction'
    },
    watch: {
      selected_month() {
        this.parseAerobicData()
        if (this.runningChart) this.initAerobicChart()
        this.parseAnaerobicData()
        if (this.runningChart) this.initAnaerobicChart()
      },
      page() {
        if (this.page == 'progress') {
          setTimeout(() => {
            this.initAnaerobicChart()
            this.initAerobicChart()
          }, 500)
          console.log('here');
        }
      }
    },
    computed: {
      leaderboard() {
        if (!this.parsedAllUserData) return []
        let l = []
        for (let userKey of Object.keys(this.parsedAllUserData)) {
          l.push({
            user: userKey,
            data: this.parsedAllUserData[userKey][this.selectedExercise][this.selected_month]
          })
        }
        l.sort((a, b) => b.data - a.data)
        return l
      },
      BMI() {
        return (parseInt(this.weight) / ((parseInt(this.height) / 100) * (parseInt(this.height) / 100))).toFixed(2)
      }
    },
    methods: {
      color(i) {
        if (i == 0) return 'red'
        else if (i == 1) return 'orange'
        else if (i == 2) return 'yellow'
      },
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
          inputname: this.inputname
        });
      },
      parseLeaderboardList() {
        console.log(this.allUserData);
        let user = {}

        for (let userKey of Object.keys(this.allUserData)) {
          console.log(this.allUserData[userKey]);
          user[this.allUserData[userKey].username] = {}
          var total = 0
          for (let sportKey of Object.keys(this.allUserData[userKey].journal)) {
            user[this.allUserData[userKey].username][sportKey] = {}
            for (let dataKey of Object.keys(this.allUserData[userKey].journal[sportKey])) {
              var k_list = dataKey.split('_')
              var m = parseInt(k_list[0])
              var d = parseInt(k_list[1])
              var y = parseInt(k_list[2])
              if (user[this.allUserData[userKey].username][sportKey][m] == undefined) {
                user[this.allUserData[userKey].username][sportKey][m] = 0
              }
              if (this.aerobicExerciseList.includes(sportKey)) {
                user[this.allUserData[userKey].username][sportKey][m] = user[this.allUserData[userKey].username][sportKey][m] + parseInt(this.allUserData[userKey].journal[sportKey][dataKey].miles)
              }
              if (this.anaerobicExerciseList.includes(sportKey)) {
                user[this.allUserData[userKey].username][sportKey][m] = user[this.allUserData[userKey].username][sportKey][m] + parseInt(this.allUserData[userKey].journal[sportKey][dataKey].sets) * parseInt(this.allUserData[userKey].journal[sportKey][dataKey].repetitions)
              }
            }
          }
        }
        this.parsedAllUserData = user
      },
      submitprofile() {
        firebase.database().ref('users/' + USER.uid + '/profile/').update({
          age: this.age,
          height: this.height,
          weight: this.weight,
          bodyFat: this.bodyFat,
        });
      },
      submitJournal1() {
        var today = new Date()
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var hr = today.getHours();
        var min = today.getMinutes();
        var sec = today.getSeconds();

        if (dd < 10) {
          dd = '0' + dd
        }
        if (mm < 10) {
          mm = '0' + mm
        }
        today = mm + '_' + dd + '_' + yyyy
        var uid = USER.uid
        firebase.database().ref('users/' + uid + '/journal/' + this.aerobicExerciseSelect + '/' + this.custom_day).update({
          hours: this.hours,
          miles: this.miles
        });
      },
      submitJournal2() {
        var today = new Date()
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var hr = today.getHours();
        var min = today.getMinutes();
        var sec = today.getSeconds();

        if (dd < 10) {
          dd = '0' + dd
        }
        if (mm < 10) {
          mm = '0' + mm
        }
        today = mm + '_' + dd + '_' + yyyy
        var uid = USER.uid

        firebase.database().ref('users/' + uid + '/journal/' + this.anaerobicExerciseSelect + '/' + this.custom_day).update({
          sets: this.sets,
          repetitions: this.repetitions
        });
      },
      initAerobicChart() {
        if (!this.runningChart) this.runningChart = echarts.init(document.getElementById('aerobicRunningChart'));
        if (!this.walkingChart) this.walkingChart = echarts.init(document.getElementById('aerobicWalkingChart'));
        if (!this.swimmingChart) this.swimmingChart = echarts.init(document.getElementById('aerobicSwimmingChart'));
        // specify chart configuration item and data
        var RunningOption = {
          title: {
            text: 'Running'
          },
          tooltip: {},
          legend: {
            data: ['miles']
          },
          xAxis: {
            type: 'category',
            data: this.running.x,
            boundaryGap: false,
          },
          yAxis: {},
          series: [{
            name: 'miles',
            type: 'line',
            data: this.running.y
          }]
        };
        var WalkingOption = {
          title: {
            text: 'Walking'
          },
          tooltip: {},
          legend: {
            data: ['miles']
          },
          xAxis: {
            type: 'category',
            data: this.walking.x,
            boundaryGap: false,
          },
          yAxis: {},
          series: [{
            name: 'miles',
            type: 'line',
            data: this.walking.y
          }]
        };
        var SwimmingOption = {
          title: {
            text: 'Swimming'
          },
          tooltip: {},
          legend: {
            data: ['miles']
          },
          xAxis: {
            type: 'category',
            data: this.swimming.x,
            boundaryGap: false,
          },
          yAxis: {},
          series: [{
            name: 'miles',
            type: 'line',
            data: this.swimming.y
          }]
        };

        // use configuration item and data specified to show chart
        this.runningChart.setOption(RunningOption);
        this.walkingChart.setOption(WalkingOption);
        this.swimmingChart.setOption(SwimmingOption);
      },
      initAnaerobicChart() {
        console.log('init chart');
        this.pushupsChart = echarts.init(document.getElementById('anaerobicpushupsChart'));
        this.pullupsChart = echarts.init(document.getElementById('anaerobicpullupsChart'));
        this.situpsChart = echarts.init(document.getElementById('anaerobicsitupsChart'));
        // specify chart configuration item and data
        var PushUpsOption = {
          title: {
            text: 'PushUps'
          },
          tooltip: {},
          legend: {
            data: ['repetitions']
          },
          xAxis: {
            type: 'category',
            data: this.pushups.x,
            boundaryGap: false,
          },
          yAxis: {},
          series: [{
            name: 'repetitions',
            type: 'line',
            data: this.pushups.y
          }]
        };
        var PullUpsOption = {
          title: {
            text: 'PullUps'
          },
          tooltip: {},
          legend: {
            data: ['repetitions']
          },
          xAxis: {
            type: 'category',
            data: this.pullups.x,
            boundaryGap: false,
          },
          yAxis: {},
          series: [{
            name: 'repetitions',
            type: 'line',
            data: this.pullups.y
          }]
        };
        var SitUpsOption = {
          title: {
            text: 'SitUps'
          },
          tooltip: {},
          legend: {
            data: ['repetitions']
          },
          xAxis: {
            type: 'category',
            data: this.situps.x,
            boundaryGap: false,
          },
          yAxis: {},
          series: [{
            name: 'repetitions',
            type: 'line',
            data: this.situps.y
          }]
        };

        // use configuration item and data specified to show chart

        this.pushupsChart.setOption(PushUpsOption);
        this.pullupsChart.setOption(PullUpsOption);
        this.situpsChart.setOption(SitUpsOption);
      },
      getXAxis() {
        var list = []
        for (let i = 1; i <= this.getDaysInMonth(this.selected_month); i++) {
          list.push(this.selected_month + '/' + i)
        }
        return list
      },
      getDaysInMonth(month) {
        var large = ['1', '3', '5', '7', '8', '10', '12']
        var small = ['4', '6', '9', '11']
        var days = 0
        if (month in large) days = 31
        else if (month in small) days = 30
        else days = 28
        return days
      },
      parseAerobicData() {
        var data = this.journal
        this.running.x = []
        this.running.y = []
        this.walking.x = []
        this.walking.y = []
        this.swimming.x = []
        this.swimming.y = []
        if (data.running && Object.keys(data.running).length != 0) {
          for (let k of Object.keys(data.running)) {
            var k_list = k.split('_')
            var m = parseInt(k_list[0])
            var d = parseInt(k_list[1])
            var y = parseInt(k_list[2])
            if (m == this.selected_month) {
              this.running.x.push(m + '/' + d)
              this.running.y.push(data.running[k].miles)
            }
          }
        }
        if (data.walking && Object.keys(data.walking).length != 0) {
          for (let k of Object.keys(data.walking)) {
            var k_list = k.split('_')
            var m = parseInt(k_list[0])
            var d = parseInt(k_list[1])
            var y = parseInt(k_list[2])
            if (m == this.selected_month) {
              this.walking.x.push(m + '/' + d)
              this.walking.y.push(data.walking[k].miles)
            }
          }
        }
        if (data.swimming && Object.keys(data.swimming).length != 0) {
          for (let k of Object.keys(data.swimming)) {
            var k_list = k.split('_')
            var m = parseInt(k_list[0])
            var d = parseInt(k_list[1])
            var y = parseInt(k_list[2])
            if (m == this.selected_month) {
              this.swimming.x.push(m + '/' + d)
              this.swimming.y.push(data.swimming[k].miles)
            }
          }
        }
      },
      parseAnaerobicData() {
        var data = this.journal
        this.pushups.x = []
        this.pushups.y = []
        this.pullups.x = []
        this.pullups.y = []
        this.situps.x = []
        this.situps.y = []
        if (data.pushups && Object.keys(data.pushups).length != 0) {
          for (let k of Object.keys(data.pushups)) {
            var k_list = k.split('_')
            var m = parseInt(k_list[0])
            var d = parseInt(k_list[1])
            var y = parseInt(k_list[2])
            if (m == this.selected_month) {
              this.pushups.x.push(m + '/' + d)
              this.pushups.y.push(data.pushups[k].repetitions * data.pushups[k].sets)
            }
          }
        }

        if (data.pullups && Object.keys(data.pullups).length != 0) {
          for (let k of Object.keys(data.pullups)) {
            var k_list = k.split('_')
            var m = parseInt(k_list[0])
            var d = parseInt(k_list[1])
            var y = parseInt(k_list[2])
            if (m == this.selected_month) {
              this.pullups.x.push(m + '/' + d)
              this.pullups.y.push(data.pullups[k].repetitions * data.pullups[k].sets)
            }
          }
        }

        if (data.situps && Object.keys(data.situps).length != 0) {
          for (let k of Object.keys(data.situps)) {
            var k_list = k.split('_')
            var m = parseInt(k_list[0])
            var d = parseInt(k_list[1])
            var y = parseInt(k_list[2])
            if (m == this.selected_month) {
              this.situps.x.push(m + '/' + d)
              this.situps.y.push(data.situps[k].repetitions * data.situps[k].sets)
            }
          }
        }
      }
    }

  });
  return self;
};

var APP = null;