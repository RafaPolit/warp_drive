describe("La Calculadora de Flujo", function(){

  var calculator;

  beforeEach(function() {
    calculator = require("../../libraries/models/flow_calculator.js")();
    test_cases = require("../../specs/fixtures/calculator_case_fixture.js")();
    calculator.load_injector_data(test_cases.case_1);
  });

  it("Debe cargar los datos requeridos para realizar los calculos.", function(done) {
    calculator.load_injector_data(test_cases.case_1);
    expect(calculator.data.required_combined_flow).toBe(9);
    expect(calculator.injectors.A.available_flow).toBe(1);
    expect(calculator.injectors.C.available_flow).toBe(100);
    done();
  });

  it("Debe almacenar en numero de inyectores y el ideal de flujo para cada inyector.", function(done){
    calculator.get_ideal_flow();
    expect(calculator.data.number_of_injectors).toBe(3);
    expect(calculator.data.ideal_flow).toBe(3);
    done();
  });

  it("Debe calcular la diferencia de flujo entre ideal y disponible, tanto individuales como el general.", function(done){
    calculator.get_ideal_flow();
    calculator.get_unfulfilled_flow();
    expect(calculator.injectors.A.unfulfilled_flow).toBe(-2);
    expect(calculator.data.unfulfilled_flow).toBe(93);
    done();
  });

  it("Debe calcular la el flujo balanceado (balanced_flow) de cada inyector.", function(done){
    calculator.get_ideal_flow();
    calculator.get_unfulfilled_flow();
    calculator.get_balanced_flows();

    expect(calculator.injectors.A.balanced_flow).toBe(-30);
    expect(calculator.injectors.C.balanced_flow).toBe(69);
    done();
  });

  it("Debe cambiar el flujo balanceado de aquellos inyectores que muestren flujo negativo y acumular el saldo.", function(done){
    calculator.get_ideal_flow();
    calculator.get_unfulfilled_flow();
    calculator.get_balanced_flows();
    calculator.set_flows_for_negative_values();

    expect(calculator.injectors.A.balanced_flow).toBe(1);
    expect(calculator.data.redistributable_flow).toBe(-62);
    expect(calculator.data.positive_flowed_injectors.length).toBe(1);
    expect(calculator.data.negative_flowed_injectors.length).toBe(2);

    done();
  });

  it("Debe redistribuir el flujo negativo acumulado entre los inyectores restantes.", function(done){
    calculator.get_ideal_flow();
    calculator.get_unfulfilled_flow();
    calculator.get_balanced_flows();
    calculator.set_flows_for_negative_values();
    calculator.redistribute_negative_flows();

    expect(calculator.injectors.C.balanced_flow).toBe(7);
    done();
  });

  it("Debe, si todos los ideales son menores o igual a lo disponible, asignar ese valor.", function(done){
    calculator.load_injector_data(test_cases.case_2);
    calculator.get_ideal_flow();
    calculator.get_unfulfilled_flow();
    calculator.get_balanced_flows();
    calculator.set_flows_for_negative_values();
    calculator.redistribute_negative_flows();
    calculator.assign_all_ideal_if_possible();

    expect(calculator.injectors.A.balanced_flow).toBe(3);

    done();
  });

  it("Debe poder realizar todos los calculos en secuencia sobre los datos cargados.", function(done){
    calculator.go_Scotty(test_cases.case_1);
    expect(calculator.injectors.A.balanced_flow).toBe(1);
    expect(calculator.injectors.B.balanced_flow).toBe(1);
    expect(calculator.injectors.C.balanced_flow).toBe(7);
    done();
  })
});