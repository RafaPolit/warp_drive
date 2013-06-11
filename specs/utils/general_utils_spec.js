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

  it("Debe regresar un no entero como un decimal con dos guarismos.", function(done) {
    expect(utils.decimal_to_fixed(70)).toBe(70);
    expect(utils.decimal_to_fixed(70.336)).toBe(70.34);
    done();
  });

  it("Debe regresar un valor con la palabra: minutos al final (minuto si es singular).", function(done) {
    expect(utils.append_minutes(5)).toBe('5 minutos');
    expect(utils.append_minutes(1)).toBe('1 minuto');
    done();
  });

  it("Debe concatenar una arreglo en una cadena con un elemento delimitador.", function(done) {
    expect(utils.concat_string(["A", "b", "C"], ", ")).toBe('A, b, C');
    expect(utils.concat_string([], ", ")).toBe('');
    done();
  });


});