var warp_core = function(warp_core) {

  var utils = require('../../libraries/utils/general_utils.js')();
  
  return {
    desired_speed: 0,
    mgs_per_warp: 300,

    set_desired_speed: function(desired_speed) {
      desired_speed = utils.input_to_number(desired_speed);
      desired_speed = Math.max(desired_speed, 0);
      this.desired_speed = desired_speed;
    },

    set_required_flow: function() {
      this.required_flow = utils.decimal_value(this.desired_speed)*this.mgs_per_warp;
    },

    set_status: function(status) {
      this.status = status;
    },

    set_remaining_life: function(remaining_life) {
      this.remaining_life = remaining_life;
      this.remaining_life_string = remaining_life;
      if (remaining_life >= 0) 
        this.remaining_life_string = remaining_life + " minuto" + ((remaining_life !== 1)?"s":"");
    }
  };
};

module.exports = warp_core;