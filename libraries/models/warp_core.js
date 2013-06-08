module.exports = function(){

  var warp_core = {
    desired_speed: 0,
    injectors_damage: {
      A: 0,
      B: 0,
      C: 0
    }
  };

  warp_core.set_speed = function(desired_speed, callback, error) {
    warp_core.desired_speed = desired_speed;
    callback(error);
  };

  warp_core.set_injectors_damage = function(injectors_damage, callback, error) {
    warp_core.injectors_damage = injectors_damage;
    callback(error);
  };

  warp_core.get_required_flow = function(callback, error) {
    warp_core.required_flow = decimal_value(warp_core.desired_speed)*300;
    callback(error);
  };

  function decimal_value(number) {
    return number/100.00;
  }

  return warp_core;
}