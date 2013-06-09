describe("El Manejador del Nucleo Warp (wapr_dirve_manage)", function() {

  var warp_drive;
  var sample_cases;

  beforeEach(function() {
    warp_drive = require("../../libraries/models/warp_drive_manage.js")();
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

  it("Debe evaluar el estado de los inyectores, determinar con cuantos inyecotres cuenta y cuales son.", function(done){
    
    prepare_evaluate_injectors_data(4)
    warp_drive.evaluate_injectors();

    expect(warp_drive.status.active_injectors.length).toBe(3);
    expect(warp_drive.status.active_injectors[2]).toBe('C');
    expect(warp_drive.status.num_active_injectors).toBe(3);

    prepare_evaluate_injectors_data(5)
    warp_drive.evaluate_injectors();

    expect(warp_drive.status.active_injectors.length).toBe(2);
    expect(warp_drive.status.active_injectors[2]).toBeUndefined();
    expect(warp_drive.status.num_active_injectors).toBe(2);

    done();
  });

  xit("Debe calcular los ideales por inyector activo de mg/s para la velocidad deseada", function(done){
    warp_drive.warp_core.set_desired_speed(test_cases.case_5.injectors_damage);

    warp_drive.evaluate_injectors();
    warp_drive.calculate_flow_ideals();
    expect(warp_drive.injectors.A.ideal_flow).toBe(120);

    done();
  });

  function prepare_evaluate_injectors_data(test_case){
    var injectors_damage = {};

    injectors_damage = test_cases['case_' + test_case].injectors_damage;
    warp_drive.set_injectors_status(injectors_damage);
  }
});