describe("Utilidades Generales (general_utils)", function() {

  var utils;

  beforeEach(function() {
    utils = require("../../libraries/utils/general_utils.js")();
  });

  it("Debe regresar un porcentage como numero decimal.", function(done) {
    expect(utils.decimal_value(70)).toBe(0.7);
    done();
  });

  it("Debe regresar un valor como numero, y, si no es un numero, cero.", function(done) {
    expect(utils.input_to_number(70)).toBe(70);
    expect(utils.input_to_number("invalid data")).toBe(0);
    done();
  });

});