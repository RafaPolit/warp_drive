var warp_drive_manager = function(warp_drive_manager) {
  
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

    set_injectors_damage: function(injectors_damage) {
      Object.keys(injectors_damage).forEach(function(id) {
        var damage = injectors_damage[id];
        injectors[id].set_damage(damage);
      });
    },

    evaluate_injectors: function() {
      status.active_injectors = [];
      status.inactive_injectors = [];
      this.assign_active_inactive_injectors();
    },

    calculate_ideal_flow: function(){
      warp_core.set_required_flow();
      status.active_injectors.forEach(function(id) {
        injectors[id].ideal_flow = warp_core.required_flow / status.num_active_injectors;
      });
    },

    calculate_balanced_flow: function() {
      this.calculate_combined_available_flow();      
      var remaining_required_flow = warp_core.required_flow - status.combined_available_flow;
      this.assign_remaining_and_balanced_flow(remaining_required_flow);
      this.clear_inactive_injectors_status();
    },

    try_warp_go: function() {
      var remaining_life = this.determine_best_remaining_life();
      var number_of_infinite_injectors = 0;

      warp_core.set_status("OK!");

      status.active_injectors.forEach(function(id) {
         var current_injector = injectors[id];
         current_injector.attempt_flow(current_injector.balanced_flow);
         if (current_injector.status !== 'OK!') warp_core.set_status('Unable to comply');
         if (current_injector.life_expectancy !== 'Infinite') {
          remaining_life = Math.min(remaining_life, current_injector.life_expectancy);
         } else {
          number_of_infinite_injectors += 1;
         }
      });

      warp_core.set_remaining_life(remaining_life);
      var all_active_injectors_infinte = (number_of_infinite_injectors == status.active_injectors.length)
      var all_injectors_infinte = (all_active_injectors_infinte && !status.all_injectors_inactive);
      if (all_injectors_infinte)  {
        warp_core.set_remaining_life('Infinito');
      }

    },

    set_injectors_reply: function() {
      var injectors_reply = '';
      var injectors_fetched = 0;
      var able_to_comply = false;

      Object.keys(injectors).forEach(function(injector_name) {
        injectors_fetched += 1;
        var current_injector = injectors[injector_name];

        if (typeof(current_injector.status) == "undefined" || current_injector.status !== "Unable to comply") {
          able_to_comply = able_to_comply || true;
          injectors_reply += injector_name + ": " + current_injector.get_flow_reply();
          injectors_reply += (injectors_fetched < Object.keys(injectors).length)?", ":"";
        }
      });

      this.injectors_reply = injectors_reply;
      if (!able_to_comply) this.injectors_reply = "Unable to comply";
    },

    // -----------------------------------------------------
    assign_active_inactive_injectors: function() {
      Object.keys(injectors).forEach(function(id) {
        injectors[id].set_available_flow();
        if (injectors[id].active) status.active_injectors.push(id);
        if (!injectors[id].active) status.inactive_injectors.push(id);
      });
      status.num_active_injectors = status.active_injectors.length;
      status.num_inactive_injectors = status.inactive_injectors.length;
      status.all_injectors_inactive = (status.active_injectors.length === 0) ? true : false ;
    },

    calculate_combined_available_flow: function() {
      status.combined_available_flow = 0;
      status.active_injectors.forEach(function(id){
        status.combined_available_flow += injectors[id].available_flow;
      });
    },

    assign_remaining_and_balanced_flow: function(remaining_required_flow) {
      var all_flows_under_available = true;
      status.active_injectors.forEach(function(id){
        var current_flow_under_available = (injectors[id].ideal_flow <= injectors[id].available_flow)
        all_flows_under_available = all_flows_under_available && current_flow_under_available;
      });

      if (all_flows_under_available) {
        status.active_injectors.forEach(function(id){
          injectors[id].balanced_flow = injectors[id].ideal_flow;
        });        
        return;
      }

      var some_negative_balanced_flow = false;
      var added_negative_balance = 0;
      var positive_balanced_injectors = [];
      var negative_balanced_injectors = [];
      status.active_injectors.forEach(function(id){
        injectors[id].remaining_flow = remaining_required_flow / status.num_active_injectors;
        injectors[id].balanced_flow = injectors[id].available_flow + injectors[id].remaining_flow;
        if (injectors[id].balanced_flow < 0) {
          some_negative_balanced_flow = some_negative_balanced_flow || true;
          added_negative_balance += injectors[id].available_flow - injectors[id].balanced_flow;
          injectors[id].balanced_flow = injectors[id].available_flow;
          negative_balanced_injectors.push(id);
        } else {
          positive_balanced_injectors.push(id);
        }
      });

      if (some_negative_balanced_flow) {
        positive_balanced_injectors.forEach(function(id) {
          injectors[id].balanced_flow -= added_negative_balance / positive_balanced_injectors.length;
        });
      }
    },

    clear_inactive_injectors_status: function() {
      status.inactive_injectors.forEach(function(id){
        injectors[id].flow = 0;
        injectors[id].remaining_flow = 0;
        injectors[id].balanced_flow = 0;
        injectors[id].status = '';
      });
    },

    determine_best_remaining_life: function() {
      var best_remaining_life = injectors[Object.keys(injectors)[0]].life_beyond_capacity;
      Object.keys(injectors).forEach(function(id) {
        best_remaining_life = Math.min(best_remaining_life, injectors[id].life_beyond_capacity);
      });
      return best_remaining_life;
    }
  };
};

module.exports = warp_drive_manager;