var enterprise = function(enterprise) {

  var bridge = {};
  var warp_drive = require('../../libraries/models/warp_drive_manager.js')();

  bridge.go_mr_Sulu = function(go_data) {
    warp_drive.warp_core.set_desired_speed(go_data.desired_speed);
    warp_drive.set_injectors_damage(go_data.injectors_damage);
    warp_drive.evaluate_injectors();
    warp_drive.ask_Scotty_the_flows();
    warp_drive.try_warp_go();
  };

  bridge.get_injectors_reply = function() {
    warp_drive.set_injectors_reply();
    return warp_drive.injectors_reply;
  };

  bridge.get_remaining_life = function() {
    return warp_drive.warp_core.remaining_life_string;
  };

  return {
    bridge: bridge,
    warp_core: warp_drive.warp_core,
    injectors: warp_drive.injectors,
    warp_drive: warp_drive
  }
}

module.exports = enterprise;