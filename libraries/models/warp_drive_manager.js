var warp_drive_manager = function(warp_drive_manager){
  
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

    set_injectors_status: function(injectors_damage) {
      Object.keys(injectors_damage).forEach(function(injector) {
        var damage = injectors_damage[injector];
        injectors[injector].set_damage(damage);
      });
    },

    evaluate_injectors: function() {
      status.active_injectors = [];
      status.inactive_injectors = [];
      this.assign_active_inactive_injectors();
    },

    calculate_flow_ideals: function() {
      warp_core.get_required_flow();
      status.active_injectors.forEach(function(injector) {
        injectors[injector].ideal_flow = warp_core.required_flow / status.num_active_injectors;
      });
    },

    calculate_balanced_flow: function() {
      this.calculate_combined_available_flow();      
      var remaining_required_flow = warp_core.required_flow - status.combined_available_flow;
      this.assign_remaining_and_balanced_flow(remaining_required_flow);
      this.clear_inactive_injectors_status();
    },

    assign_active_inactive_injectors: function(injector) {
      Object.keys(injectors).forEach(function(injector) {
        injectors[injector].get_available_flow();
        if (injectors[injector].active)
          status.active_injectors.push(injector);
        if (!injectors[injector].active)
          status.inactive_injectors.push(injector);
      });
      status.num_active_injectors = status.active_injectors.length;
      status.num_inactive_injectors = status.inactive_injectors.length;
    },

    calculate_combined_available_flow: function() {
      status.combined_available_flow = 0;
      status.active_injectors.forEach(function(injector) {
        status.combined_available_flow += injectors[injector].available_flow;
      });
    },

    assign_remaining_and_balanced_flow: function(remaining_required_flow) {
      status.active_injectors.forEach(function(injector) {
        injectors[injector].remaining_flow = remaining_required_flow / status.num_active_injectors;
        injectors[injector].balanced_flow = injectors[injector].available_flow + injectors[injector].remaining_flow;
      });
    },

    clear_inactive_injectors_status: function() {
      status.inactive_injectors.forEach(function(injector) {
        injectors[injector].remaining_flow = 0;
        injectors[injector].balanced_flow = 0;
      });
    }
  };
};

module.exports = warp_drive_manager;