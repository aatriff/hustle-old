angular
      .module('MyApp')
      .controller('DemoCtrl', DemoCtrl);

  function DemoCtrl ($scope) {
    var self = this;

    //Parse get request
    var param = new Array();
    var get = location.search;
    var currentDancer = 0;
    if(get != '') {
      tmp = (get.substr(1)).split('&');
      for(var i = 0; i < tmp.length; i++) {
        tmp2 = tmp[i].split('=');
        if(tmp2[0] == 'id'){
          currentDancer = tmp2[1];
        }
      }
    }

    // list of `state` value/display objects
    self.dancers        = loadAll();
    self.selectedItem  = null;
    self.searchText    = null;
    self.querySearch   = querySearch;
    self.selectedItemChanged = selectedItemChanged;
    self.competions = [];
    self.dnd = [];
    self.stats = [];

    var allCompetions = $('#competions').data('competions');
    var alldnd = $('#dnd').data('competions');

    if(currentDancer != 0){
      loadById(currentDancer);
    }

    // ******************************
    // Internal methods
    // ******************************

    function loadById(id) {
      for(i in self.dancers){
        d = self.dancers[i];
        if(d.id == parseInt(id)){
          selectedItemChanged(d);
        }
      }
    }

    function selectedItemChanged(item) {
      if(item){
        self.stats = [];
        self.competions=[];
        self.dnd=[];

        self.stats.push({caption:"ID", value:item.id});
        self.stats.push({caption:"ФИО", value:item.fio});
        self.stats.push({caption:"Клуб", value:item.club});
        self.stats.push({caption:"Текущий класс", value:item.class+'/'+item.class_dnd});

        self.stats.push({E:"E", D:"D", C:"C", B:"B", A:"A"});
        self.stats.push({E:item.e_points, D:item.d_points, C:item.c_points, B:item.b_points, A:item.a_points});
        self.stats.push({Bg:"Bg", Rs:"Rs", M:"M", S:"S", Ch:"Ch"});
        self.stats.push({Bg:item.bg_points, Rs:item.rs_points, M:item.m_points, S:item.s_points, Ch:item.ch_points});

        for(i in allCompetions){
          if(allCompetions[i].id === item.id){
            c = allCompetions[i];
            count = 0;
            p = "";
            p_id = 0;
            for(j in allCompetions){
              if(allCompetions[j].competion === c.competion && allCompetions[j].date === c.date && allCompetions[j].class === c.class && allCompetions[j].result === c.result && allCompetions[j].id != c.id ){
                count = count + 1;
                p = allCompetions[j].id;
              }
            }
            if (count != 1) {
              p = "";
            }
            else {
              for(d in self.dancers){
                if(p === self.dancers[d].id){
                  p = self.dancers[d].fio;
                  p_id = self.dancers[d].id;
                  break;
                }
              }

            }
            if(c.result.startsWith('1/')) {
              c.result+='🏆';
            }
            if(c.result.startsWith('2/') || c.result.startsWith('3/')) {
              c.result+='🏅';
            }
            self.competions.push({name:c.competion, date:c.date, class:c.class, result:c.result, points:c.points, partner:p, partnerId:p_id});
          }
        }

        if (self.competions.length > 0) {
          self.competions.unshift({name:"Конкурс", date:"Дата проведения", class:"Класс", result:"Результат", points:"Очки", partner:"Партнер"})
        }


        for(i in alldnd){
          if(alldnd[i].id === item.id){
            c = alldnd[i];
            if(c.result.startsWith('1/')) {
              c.result+='🏆';
            }
            if(c.result.startsWith('2/') || c.result.startsWith('3/')) {
              c.result+='🏅';
            }
            self.dnd.push({name:c.competion, date:c.date, class:c.class, result:c.result, points:c.points, partner:""});
          }
        }

        if (self.dnd.length > 0) {
          self.dnd.unshift({name:"Конкурс", date:"Дата проведения", class:"Класс", result:"Результат", points:"Очки"})
        }

      }
    }

    /**
     * Search for dancers... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.dancers.filter( createFilterFor(query) ) : [];
      if (results.length < 10) {
        return results;
      } else {
        return []
      }

    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) != -1);
      };

    }

        /**
     * Build `dancers` list of key/value pairs
     */
    function loadAll() {
      var allDancers = $('#dancers').data('dancers');

      return allDancers.map( function (dancer) {
        return {
          id: dancer.id,
          fio: dancer.fio,
          club: dancer.club,
          class: dancer.class,
          class_dnd: dancer.class_dnd,
          value: dancer.fio.toLowerCase(),
          display: dancer.fio,
          e_points: dancer.e_points,
          d_points: dancer.d_points,
          c_points: dancer.c_points,
          b_points: dancer.b_points,
          a_points: dancer.a_points,
          bg_points: dancer.bg_points,
          rs_points: dancer.rs_points,
          m_points: dancer.m_points,
          s_points: dancer.s_points,
          ch_points: dancer.ch_points,
        };
      });
    }
  }