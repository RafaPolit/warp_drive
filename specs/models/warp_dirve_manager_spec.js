describe("El Manejador del Nucleo Warp (warp_dirve_manager)", function() {

  var warp_drive;
  var sample_cases;

  beforeEach(function() {
    warp_drive = require("../../libraries/models/warp_drive_manager.js")();
    test_cases = require("../../specs/fixtures/sample_case_fixture.js")();
  });

  it("Debe inicializar el manejador con un nucleo, tres inyectores y el estatus de la Enterprise vacio.", function(done){
    expect(warp_drive.warp_core.mgs_per_warp).toBe(300);
    expect(warp_drive.injectors.A.damage).toBe(0);
    expect(warp_drive.injectors.B.flow).toBe(0);
    expect(warp_drive.injectors.C.capacity).toBe(100);
    expect(Object.keys(warp_drive.status).length).toBe(0);
    done();
  });

  it("Debe cambiar las propiedades de cada inyector sin afectar a los otros (verificar instances de Javascript).", function(done){
    warp_drive.injectors.A.set_damage(20);
    expect(warp_drive.injectors.A.damage).toBe(20);
    expect(warp_drive.injectors.C.damage).toBe(0);
    done();
  });

  it("Debe asignar en bloque el estado de los 3 inyectores.", function(done){
    var injectors_damage = test_cases.case_8.injectors_damage;

    warp_drive.set_injectors_status(injectors_damage);
    expect(warp_drive.injectors.A.damage).toBe(20);
    expect(warp_drive.injectors.B.damage).toBe(50);
    expect(warp_drive.injectors.C.damage).toBe(40);

    done();
  });

  it("Debe evaluar el estado de los inyectores, determinar con cuales y cuantos, y registrar los inactivos.", function(done){
    
    prepare_evaluate_injectors_data(4);
    warp_drive.evaluate_injectors();

    expect(warp_drive.status.active_injectors[2]).toBe('C');
    expect(warp_drive.status.num_active_injectors).toBe(3);
    expect(warp_drive.status.num_inactive_injectors).toBe(0);

    prepare_evaluate_injectors_data(5);
    warp_drive.evaluate_injectors();

    expect(warp_drive.status.active_injectors[2]).toBeUndefined();
    expect(warp_drive.status.num_active_injectors).toBe(2);
    expect(warp_drive.status.num_inactive_injectors).toBe(1);
    expect(warp_drive.status.inactive_injectors[0]).toBe('C');

    done();
  });

  it("Debe calcular los ideales (ideal_flow) por inyector activo de mg/s para la velocidad deseada", function(done){

    prepare_calculate_flow_ideals_data(5);       
    warp_drive.calculate_flow_ideals();
    expect(warp_drive.injectors.A.ideal_flow).toBe(120);

    prepare_calculate_flow_ideals_data(8);       
    warp_drive.calculate_flow_ideals();
    expect(warp_drive.injectors.A.ideal_flow).toBe(170);

    done();
  });

  it("Debe promediar los ideales entre los inyectores activos (balanced_flow), segun la capacidad de cada reactor", function(done){

    prepare_calculate_balanced_flow_data(4);
    warp_drive.calculate_balanced_flow();
    expect(warp_drive.injectors.A.balanced_flow).toBe(90);
    expect(warp_drive.injectors.B.balanced_flow).toBe(100);
    expect(warp_drive.injectors.C.balanced_flow).toBe(110);

    prepare_calculate_balanced_flow_data(5);
    warp_drive.calculate_balanced_flow();
    expect(warp_drive.injectors.A.balanced_flow).toBe(120);
    expect(warp_drive.injectors.B.balanced_flow).toBe(120);
    expect(warp_drive.injectors.C.balanced_flow).toBe(0);

    done();
  });

  function prepare_evaluate_injectors_data(test_case){
    var injectors_damage = {};

    injectors_damage = test_cases['case_' + test_case].injectors_damage;
    warp_drive.set_injectors_status(injectors_damage);
  }

  function prepare_calculate_flow_ideals_data(test_case){
    warp_drive.warp_core.set_desired_speed(test_cases['case_' + test_case].desired_speed);
    prepare_evaluate_injectors_data(test_case);
    warp_drive.evaluate_injectors();
  }

  function prepare_calculate_balanced_flow_data(test_case){
    prepare_calculate_flow_ideals_data(test_case);
    warp_drive.calculate_flow_ideals();
  }

});