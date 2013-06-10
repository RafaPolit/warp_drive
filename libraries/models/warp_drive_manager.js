var warp_drive_manager = function(warp_drive_manager) {
  
  var warp_core = require('../../libraries/models/warp_core.js')();
  var injectors = {
    A: require('../../libraries/models/injector.js')(),
    B: require('../../libraries/models/injector.js')(),
    C: require('../../libraries/models/injector.js')()
  };
  var calculator = require('../../libraries/models/flow_calculator.js')();
  var status = {};

  return {
    warp_core: warp_core,
    injectors: injectors,
    status: status,
    calculator: calculator, 

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

    ask_Scotty_the_flows: function(){
      warp_core.set_required_flow();
      this.prepare_data_for_calculation();
      calculator.go_Scotty(status.calculator_data);
      Object.keys(calculator.injectors).forEach(function(id) {
        injectors[id].balanced_flow = calculator.injectors[id].balanced_flow;
        injectors[id].status = ''; 
      });
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

      Object.keys(injectors).forEach(function(id) {
        injectors_fetched += 1;
        var current_injector = injectors[id];

        var is_injector_undefined = (typeof(current_injector.status) == "undefined");
        var is_injector_active = (current_injector.active == true);
        var is_injector_unable = (current_injector.status !== "Unable to comply");
        if (is_injector_undefined || is_injector_unable) {
          able_to_comply = able_to_comply || (true && is_injector_active);
          injectors_reply += id + ": " + current_injector.get_flow_reply();
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

    prepare_data_for_calculation:function() {
      status.calculator_data = {};
      status.calculator_data.required_combined_flow = warp_core.required_flow;
      status.calculator_data.available_flows = {};
      status.active_injectors.forEach(function(id){
        status.calculator_data.available_flows[id] = injectors[id].available_flow;
      });
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