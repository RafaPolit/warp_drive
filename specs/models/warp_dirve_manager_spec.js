describe("El Manejador del Nucleo Warp (warp_drive_manager)", function() {

  var warp_drive;
  var sample_cases;

  beforeEach(function() {
    warp_drive = require("../../libraries/models/warp_drive_manager.js")();
    test_cases = require("../../specs/fixtures/sample_case_fixture.js")();
  });

  it("Debe inicializar el manejador con un nucleo, tres inyectores y el estatus de la Enterprise vacio.", function(done){
    expect(warp_drive.utils).toBeDefined();
    expect(warp_drive.warp_core.mgs_per_warp).toBe(300);
    expect(warp_drive.injectors.A.damage).toBe(0);
    expect(warp_drive.injectors.B.flow).toBe(0);
    expect(warp_drive.injectors.C.capacity).toBe(100);
    expect(Object.keys(warp_drive.status).length).toBe(0);
    done();
  });

  it("Debe tener acceso a la calculadora de Scotty!", function(done ){
    expect(warp_drive.calculator).toBeDefined();
    expect(typeof(warp_drive.calculator.go_Scotty)).toBe('function');
    done();
  });

  it("Debe cambiar las propiedades de cada inyector sin afectar a los otros (verificar instances de Javascript).", function(done){
    warp_drive.injectors.A.set_damage(20);
    expect(warp_drive.injectors.A.damage).toBe(20);
    expect(warp_drive.injectors.C.damage).toBe(0);
    done();
  });

  it("Debe poder asignar en bloque el estado de los 3 inyectores.", function(done){
    var injectors_damage = test_cases.case_8.injectors_damage;

    warp_drive.set_injectors_damage(injectors_damage);
    expect(warp_drive.injectors.A.damage).toBe(20);
    expect(warp_drive.injectors.B.damage).toBe(50);
    expect(warp_drive.injectors.C.damage).toBe(40);

    done();
  });

  it("Debe evaluar el estado de los inyectores, determinar con cuales y cuantos cuenta, y registrar los inactivos.", function(done){
    
    prepare_evaluate_injectors_data('case_4');
    warp_drive.evaluate_injectors();

    expect(warp_drive.status.active_injectors[2]).toBe('C');
    expect(warp_drive.status.num_active_injectors).toBe(3);
    expect(warp_drive.status.num_inactive_injectors).toBe(0);

    prepare_evaluate_injectors_data('case_5');
    warp_drive.evaluate_injectors();

    expect(warp_drive.status.active_injectors[2]).toBeUndefined();
    expect(warp_drive.status.num_active_injectors).toBe(2);
    expect(warp_drive.status.num_inactive_injectors).toBe(1);
    expect(warp_drive.status.inactive_injectors[0]).toBe('C');
    expect(warp_drive.status.all_injectors_inactive).toBe(false);

    done();
  });

  it("Debe poder preguntar a Scotty el flujo correcto de plasma", function(done) {
    prepare_calculate_balanced_flow_data('case_5');
    warp_drive.ask_Scotty_the_flows();
    expect(warp_drive.injectors.A.balanced_flow).toBe(120);
    expect(warp_drive.injectors.C.status).toBe('');
    expect(warp_drive.injectors.C.flow).toBe(0);
    expect(warp_drive.injectors.C.balanced_flow).toBe(0);

    prepare_calculate_balanced_flow_data('case_8');
    warp_drive.ask_Scotty_the_flows();
    expect(warp_drive.injectors.A.balanced_flow).toBeCloseTo(186.7, 1);

    prepare_calculate_balanced_flow_data('case_10');
    warp_drive.ask_Scotty_the_flows();
    expect(warp_drive.injectors.A.balanced_flow).toBe(1);
    expect(warp_drive.injectors.B.balanced_flow).toBe(1);
    expect(warp_drive.injectors.C.balanced_flow).toBe(34);
    
    done();
  });

  it("Debe intentar asignar los flujos de los inyectores y poner el estado general del nucleo warp", function(done){
    
    prepare_try_warp_go('case_1');

    warp_drive.try_warp_go();
    expect(warp_drive.injectors.A.flow).toBe(100);
    expect(warp_drive.injectors.B.flow).toBe(100);
    expect(warp_drive.injectors.C.flow).toBe(100);
    expect(warp_drive.warp_core.remaining_life).toBe("Infinito");

    prepare_try_warp_go('case_7');

    warp_drive.try_warp_go();
    expect(warp_drive.injectors.A.flow).toBe(150);
    expect(warp_drive.injectors.B.flow).toBe(150);
    expect(warp_drive.injectors.C.flow).toBe(120);
    expect(warp_drive.warp_core.status).toBe('OK!');
    expect(warp_drive.warp_core.remaining_life_string).toBe("50 minutos");

    prepare_try_warp_go('case_8');

    warp_drive.try_warp_go();
    expect(warp_drive.warp_core.status).toBe('Unable to comply');
    expect(warp_drive.warp_core.remaining_life).toBe(0);

    done();
  });

  it("Debe generar la respuesta de los inyectores en un string legible", function(done){
    warp_drive.evaluate_injectors();
    warp_drive.set_injectors_reply();
    expect(warp_drive.injectors_reply).toBe("A: 0 mg/s, B: 0 mg/s, C: 0 mg/s");

    prepare_try_warp_go('case_11');
    warp_drive.try_warp_go();
    warp_drive.set_injectors_reply();
    expect(warp_drive.injectors_reply).toBe("Unable to comply");
    done();
  });

  // -----------------------------------------------------------------

  function prepare_evaluate_injectors_data(test_case){
    var injectors_damage = {};

    injectors_damage = test_cases[test_case].injectors_damage;
    warp_drive.set_injectors_damage(injectors_damage);
  }

  function prepare_calculate_balanced_flow_data(test_case){
    warp_drive.warp_core.set_desired_speed(test_cases[test_case].desired_speed);
    prepare_evaluate_injectors_data(test_case);
    warp_drive.evaluate_injectors();
  }

  function prepare_try_warp_go(test_case){
    prepare_calculate_balanced_flow_data(test_case);
    warp_drive.ask_Scotty_the_flows();
  }

});