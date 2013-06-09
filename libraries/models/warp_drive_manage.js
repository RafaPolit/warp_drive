var warp_drive_manage = function(warp_drive_manage){
  
  var warp_core = require('../../libraries/models/warp_core.js')();
  var injectors = {
    A: require('../../libraries/models/injector.js')(),
    B: require('../../libraries/models/injector.js')(),
    C: require('../../libraries/models/injector.js')()
  };
  var status = {};

  return {
    warp_core: warp_core,
    injectors: injectors,
    status: status,

    set_injectors_status: function(injectors_damage){
      Object.keys(injectors_damage).forEach(function(injector) {
        var damage = injectors_damage[injector];
        injectors[injector].set_damage(damage);
      });
    },

    evaluate_injectors: function(){
      status.active_injectors = [];
      Object.keys(injectors).forEach(function(injector) {
        injectors[injector].get_available_flow();
        if (injectors[injector].active)
          status.active_injectors.push(injector);
      });
      status.num_active_injectors = status.active_injectors.length;
    },

    calculate_flow_ideals: function() {
      warp_core.get_required_flow();
      status.active_injectors.forEach(function(injector) {
        injectors[injector].ideal_flow = warp_core.required_flow / status.num_active_injectors;
      });
    }




  }
}

module.exports = warp_drive_manage;