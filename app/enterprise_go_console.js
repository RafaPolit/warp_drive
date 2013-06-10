var enterprise = require("../libraries/models/enterprise.js")();
var go_data = {
  desired_speed: Number(process.env.npm_package_config_speed),
  injectors_damage: {
    A: Number(process.env.npm_package_config_Adamage),
    B: Number(process.env.npm_package_config_Bdamage),
    C: Number(process.env.npm_package_config_Cdamage)
  }
};

enterprise.bridge.go_mr_Sulu(go_data);

console.log('---------------------------------------------------------------');
console.log(' Capitan: ');
console.log('  Para la velocidad WARP requerida de: ' + enterprise.warp_drive.warp_core.desired_speed + "%");
console.log('  Con los injectoyres en el siguiente estado de daño: ');
Object.keys(enterprise.injectors).forEach(function(injector_name) {
  var current_injector = enterprise.injectors[injector_name];
  console.log('    ' + injector_name + ': ' + current_injector.damage + "%");
});
console.log('  Se ha asignado el siguiente flujo de plasma:');
console.log('    ' + enterprise.bridge.get_injectors_reply());
console.log('  Y podemos mantener este curso durante:');
console.log('    ' + enterprise.bridge.get_remaining_life());
console.log('---------------------------------------------------------------');
