describe("El Nucleo Warp (warp_core)", function() {

  var warp_core;
  var sample_cases;

  beforeEach(function() {
    warp_core = require("../../libraries/models/warp_core.js")();
    test_cases = require("../../specs/fixtures/sample_case_fixture.js")();
  });

  it("Debe inicializar el objeto warp_core con velocidad deseada (desired_speed) y daños (injectors_damage) en cero.", function(done) {
    expect(warp_core.desired_speed).toBe(0);
    expect(warp_core.injectors_damage.A).toBe(0);
    expect(warp_core.injectors_damage.B).toBe(0);
    expect(warp_core.injectors_damage.C).toBe(0);
    done();
  });

  it("Debe permitir que se asigne un requerimiento de velocidad warp deseada.", function(done) {
    var new_desired_speed = test_cases.case_7.desired_speed;

    warp_core.set_speed(new_desired_speed, function(error) {
      expect(warp_core.desired_speed).toBe(140);
      done();
    });
  });

  it("Debe permitir que se asigne un estado de daño de los inyectores.", function(done) {
    var new_injectors_damage = test_cases.case_4.injectors_damage;

    warp_core.set_injectors_damage(new_injectors_damage, function(error) {
      expect(warp_core.injectors_damage.A).toBe(20);
      expect(warp_core.injectors_damage.B).toBe(10);
      expect(warp_core.injectors_damage.C).toBe(0);
      done();
    });
  });

  it("Debe determinar correctamente el flujo de plasma requerido para lograr la velocidad especificada.", function(done) {
    var warp_100 = test_cases.case_1.desired_speed;
    var desired_speed = warp_100;
    var expected_flow = 300;
    set_speed_and_test_flow(desired_speed, expected_flow, done);

    var warp_30 = test_cases.case_3.desired_speed;
    var desired_speed = warp_30;
    var expected_flow = 90;
    set_speed_and_test_flow(desired_speed, expected_flow, done);

    var warp_170 = test_cases.case_8.desired_speed;
    var desired_speed = warp_170;
    var expected_flow = 510;
    set_speed_and_test_flow(desired_speed, expected_flow, done);
  });

  function set_speed_and_test_flow(desired_speed, expected_flow, done) {
    warp_core.set_speed(desired_speed, function(error) {
      warp_core.get_required_flow(function(error){
        expect(warp_core.required_flow).toBe(expected_flow);
        done();
      });
    });
  }
});