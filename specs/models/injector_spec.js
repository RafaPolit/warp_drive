describe("El Inyector (injector)", function() {

  var injector;
  var sample_cases;

  beforeEach(function() {
    injector = require("../../libraries/models/injector.js")();
    test_cases = require("../../specs/fixtures/sample_case_fixture.js")();
  });

  it("Debe inicializar el objeto en perfecto estado de salud (damage: 0, flow: 0, active: true).", function(done) {
    expect(injector.damage).toBe(0);
    expect(injector.flow).toBe(0);
    expect(injector.active).toBe(true);
    done();
  });

  it("Debe contener sus especificaciones tecnicas (capacity: 100, life_beyond_capacity: 100, max_flow_beyond_capacity: 100).", function(done) {
    expect(injector.capacity).toBe(100);
    expect(injector.life_beyond_capacity).toBe(100);
    expect(injector.max_flow_beyond_capacity).toBe(100);
    done();
  });

  it("Debe asignar un daño al inyector, y limitar su valor entre 0 y 100.", function(done) {
    injector.set_damage(test_cases.case_4.injectors_damage.B);
    expect(injector.damage).toBe(10);

    injector.set_damage(-20);
    expect(injector.damage).toBe(0);
    injector.set_damage(130);
    expect(injector.damage).toBe(100);
    injector.set_damage("Invalid input");
    expect(injector.damage).toBe(0);

    done();
  });

  it("Debe saber cuanto puede entregar de plasma (available_flow) sin incurrir en desgaste y determinar si esta activo (active).", function(done) {
    injector.damage = test_cases.case_4.injectors_damage.A;
    injector.get_available_flow();
    expect(injector.available_flow).toBe(80);
    expect(injector.active).toBe(true);

    injector.damage = test_cases.case_5.injectors_damage.C;
    injector.get_available_flow();
    expect(injector.available_flow).toBe(0);
    expect(injector.active).toBe(false);

    done();
  });

  it("Debe asignar el flujo disponible si se pregunta la vida util sin haber llamado antes a get_available_flow.", function(done){
    injector.get_life_expectancy();
    expect(injector.available_flow).toBe(injector.capacity);
    done();
  });

  it("Debe reportar el tiempo de vida que le queda para un flujo determinado.", function(done){
    injector.flow = 100;
    injector.get_life_expectancy();
    expect(injector.life_expectancy).toBe('infinite');

    injector.flow = 110;
    injector.get_life_expectancy();
    expect(injector.life_expectancy).toBe(90);

    injector.flow = 160;
    injector.damage = 50;
    delete(injector['available_flow']);
    injector.get_life_expectancy();
    expect(injector.life_expectancy).toBe("Unable to comply");

    injector.flow = 200;
    injector.damage = 0;
    delete(injector['available_flow']);
    injector.get_life_expectancy();
    expect(injector.life_expectancy).toBe("Unable to comply");

    done();
  });

  it("*BONUS* Reportar el tiempo de vida restante utilizando distintas especificaciones tecnicas (por si Scotty mejora los inyectores).", function(done) {
    var life_expectancy_factor = mock_injector_tec_specs();


    injector.flow = 71;
    injector.get_life_expectancy();
    expect(injector.life_expectancy).toBeCloseTo(120 - life_expectancy_factor, 3);

    injector.flow = 70;
    injector.get_life_expectancy();
    expect(injector.life_expectancy).toBe('infinite');

    injector.flow = 160;
    injector.get_life_expectancy();
    expect(injector.life_expectancy).toBe("Unable to comply");

    done();
  });

  function mock_injector_tec_specs() {
    var mock_injector_tec_specs = {
      capacity: 80,
      life_beyond_capacity: 120,
      max_flow_beyond_capacity: 90,
      damage: 10,
      available_flow: 70
    }

    injector.capacity = mock_injector_tec_specs.capacity;
    injector.life_beyond_capacity = mock_injector_tec_specs.life_beyond_capacity;
    injector.max_flow_beyond_capacity = mock_injector_tec_specs.max_flow_beyond_capacity;
    injector.damage = mock_injector_tec_specs.damage;
    injector.available_flow = mock_injector_tec_specs.available_flow;

    return (injector.life_beyond_capacity / injector.max_flow_beyond_capacity);
  }
});