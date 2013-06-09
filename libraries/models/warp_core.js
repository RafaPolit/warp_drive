var warp_core = function(warp_core){

  var utils = require('../../libraries/utils/general_utils.js')();
  
  return {
    desired_speed: 0,
    mgs_per_warp: 300,

    set_desired_speed: function(desired_speed){
      desired_speed = utils.input_to_number(desired_speed);
      desired_speed = Math.max(desired_speed, 0);
      this.desired_speed = desired_speed;
    },

    get_required_flow: function(){
      this.required_flow = utils.decimal_value(this.desired_speed)*this.mgs_per_warp;
    }
  };
};

module.exports = warp_core;