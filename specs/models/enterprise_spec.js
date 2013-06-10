describe("El USS Enterprise (enterprise)", function() {

  var enterprise;
  var sample_cases;

  beforeEach(function() {
    enterprise = require("../../libraries/models/enterprise.js")();
    test_cases = require("../../specs/fixtures/sample_case_fixture.js")();
  });

  it ("Debe inicializarse con un puente de comando (bridge), el Nucleo Warp y sus Inyectores, y el software warp_drive_manager.", function(done){
    expect(enterprise.bridge).toBeDefined();
    expect(enterprise.warp_core).toBeDefined();
    expect(enterprise.warp_drive).toBeDefined();
    expect(enterprise.injectors).toBeDefined();
    expect(typeof(enterprise.warp_drive.try_warp_go)).toBe('function');
    expect(typeof(enterprise.bridge.go_mr_Sulu)).toBe('function');

    done();
  });

  it("Kirk debe poder dar la ordern GO! y la formula de Scotty debe poner el flujo correcto en los inyectores, si es posible.", function(done){
    
    // enterprise.bridge.go_mr_Sulu(test_cases.case_1);
    // check_test_results_to_be(100, 100, 100, 'Infinito');

    // enterprise.bridge.go_mr_Sulu(test_cases.case_2);
    // check_test_results_to_be(90, 90, 90, 'Infinito');

    // enterprise.bridge.go_mr_Sulu(test_cases.case_3);
    // check_test_results_to_be(30, 30, 30, 'Infinito');

    enterprise.bridge.go_mr_Sulu(test_cases.case_4);
    console.log(enterprise.injectors);
    check_test_results_to_be(90, 100, 110, '90 minutos');

    enterprise.bridge.go_mr_Sulu(test_cases.case_5);
    console.log(enterprise.injectors);
    check_test_results_to_be(120, 120, 0, '80 minutos');

    // enterprise.bridge.go_mr_Sulu(test_cases.case_6);
    // check_test_results_to_be(150, 150, 150, '50 minutos');

    // enterprise.bridge.go_mr_Sulu(test_cases.case_7);
    // check_test_results_to_be(150, 150, 120, '50 minutos');

    // enterprise.bridge.go_mr_Sulu(test_cases.case_8);
    // expect(enterprise.warp_core.remaining_life_string).toBe("0 minutos");
    // expect(enterprise.warp_core.status).toBe('Unable to comply');

    done();
  });

  it("Debe poder infromar de manera legible el estado de la nave, su nucleo y su tiempo de vida", function(done){
    enterprise.bridge.go_mr_Sulu(test_cases.case_5);
    expect(enterprise.bridge.get_injectors_reply()).toBe("A: 120 mg/s, B: 120 mg/s, C: 0 mg/s");
    expect(enterprise.bridge.get_remaining_life()).toBe("80 minutos");

    enterprise.bridge.go_mr_Sulu(test_cases.case_8);
    expect(enterprise.bridge.get_injectors_reply()).toBe("Unable to comply");
    expect(enterprise.bridge.get_remaining_life()).toBe("0 minutos");
    done();
  });

  // ------------------------------------------

  function check_test_results_to_be(expected_A_flow, expected_B_flow, expected_C_flow, expected_life) {
    expect(enterprise.injectors.A.flow).toBe(expected_A_flow);
    expect(enterprise.injectors.B.flow).toBe(expected_B_flow);
    expect(enterprise.injectors.C.flow).toBe(expected_C_flow);
    expect(enterprise.warp_core.remaining_life_string).toBe(expected_life);
  }

});