module.exports = function() {

  return {

    form: function(req, res){
      var results = prepare_data(req);
      res.render('index_form', { "results": results });
    },

    form_post: function(req, res){
      req.session.submit_data = req.body;
      req.session.submit_data_exists = true;
      res.redirect("/go");
    }
  }

  function prepare_data(req) {
    var test_cases = require("../specs/fixtures/sample_case_fixture.js")();
    var results = [];

    for(i=0;i<12;i++) {    
      var enterprise = require("../libraries/models/enterprise.js")();
      var session_data_submited = (typeof(req.session.submit_data_exists) != 'undefined' && req.session.submit_data_exists === true);

      if (i==11 && session_data_submited) {
        var new_case = create_go_array(req);
        enterprise.bridge.go_mr_Sulu(new_case);
        req.session.submit_data_exists = false;
      } else {
        enterprise.bridge.go_mr_Sulu(test_cases['case_'+(i+1)]);
      }

      var tr_class = 'warning';
      switch(enterprise.bridge.get_remaining_life()) {
        case "Infinito":
          tr_class = "success";
          break;
        case "0 minutos":
          tr_class = "error";
          break;
      }

      results.push({
        data: enterprise,
        injector_results: enterprise.bridge.get_injectors_reply(),
        remaining_time: enterprise.bridge.get_remaining_life(),
        tr_class: tr_class
      });
    }
    return results;
  }

  function create_go_array(req) {
    var new_data = {
      "desired_speed": req.session.submit_data.speed,
      "injectors_damage": {
        "A":req.session.submit_data.damage_a,
        "B":req.session.submit_data.damage_b,
        "C":req.session.submit_data.damage_c
      }
    }
    return new_data;
  }
};