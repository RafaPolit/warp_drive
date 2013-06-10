describe("La calculadora de Flujo de Plasma (optimal_flow_calculator)", function() {

  var calculator;
  var sample_cases;

  beforeEach(function() {
    calculator = require("../../libraries/models/optimal_flow_calculator.js")();
    test_cases = require("../../specs/fixtures/flow_calculator_fixture.js")();
  });

  it("Debe iniciar con un objecto Injectors vacio", function(done){
    expect(Object.keys(calculator.injectors).length).toBe(0);
    done();
  });

});