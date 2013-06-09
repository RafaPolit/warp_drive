describe("El Nucleo Warp (warp_core)", function() {

  var warp_core;
  var test_cases;

  beforeEach(function() {
    warp_core = require("../../libraries/models/warp_core.js")();
    test_cases = require("../../specs/fixtures/sample_case_fixture.js")();
  });

  it("Debe inicializar el objeto en reposo (desired_speed: 0).", function(done) {
    expect(warp_core.desired_speed).toBe(0);
    done();
  });

  it("Debe inicializar el objeto con la Constante de Flujo de Plasma requerido por Warp (mgs_per_warp: 300).", function(done) {
    expect(warp_core.mgs_per_warp).toBe(300);
    done();
  });

  it("Debe permitir que se asigne un requerimiento de velocidad warp deseada, y ser cero o mayor", function(done) {
    var new_desired_speed = test_cases.case_7.desired_speed;

    warp_core.set_desired_speed(new_desired_speed);
    expect(warp_core.desired_speed).toBe(140);

    warp_core.set_desired_speed(-20);
    expect(warp_core.desired_speed).toBe(0);

    warp_core.set_desired_speed({a: 'text'});
    expect(warp_core.desired_speed).toBe(0);

    done();
  });

  it("Debe determinar correctamente el flujo de plasma requerido para lograr la velocidad especificada (@ 300mg/s por Warp).", function(done) {
    var expected_flow = 0;

    warp_core.desired_speed = test_cases.case_1.desired_speed;
    expected_flow = 300;
    warp_core.get_required_flow();
    expect(warp_core.required_flow).toBe(expected_flow);

    warp_core.desired_speed = test_cases.case_3.desired_speed;
    expected_flow = 90;
    warp_core.get_required_flow();
    expect(warp_core.required_flow).toBe(expected_flow);

    warp_core.desired_speed = test_cases.case_8.desired_speed;
    expected_flow = 510;
    warp_core.get_required_flow();
    expect(warp_core.required_flow).toBe(expected_flow);

    done();
  });
});