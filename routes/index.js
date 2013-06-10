exports.index = function(req, res){
  var test_cases = require("../specs/fixtures/sample_case_fixture.js")();
  var results = [];

  for(i=0;i<12;i++) {    
    var enterprise = require("../libraries/models/enterprise.js")();

    enterprise.bridge.go_mr_Sulu(test_cases['case_'+(i+1)]);

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

  res.render('index', { "results": results });
};