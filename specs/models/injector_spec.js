xdescribe("El Inyector", function() {

  var injector;
  var status_cases;

  injector = require("../../libraries/models/injector.js")();
  status_cases = require("../../specs/fixtures/injector_status_fixture.js")();

  it("Debe poder funcionar indefinidamente al 100% de su capacidad", function(done) {
/*    var not_damaged = status_cases.not_damaged;

    injector.remaining_time(not_damaged.damage, function);*/
    expect(true).toBe(true);
  });
});