var injector = function(injector) {

  var utils = require('../../libraries/utils/general_utils.js')();

  return {
    damage: 0,
    flow: 0,
    active: true,
    capacity: 100,
    life_beyond_capacity: 100,
    max_flow_beyond_capacity: 100,

    set_damage: function(damage) {
      damage = utils.input_to_number(damage);
      damage = Math.min(Math.max(damage, 0), 100);
      this.damage = damage;
    },

    set_available_flow: function() {
      this.available_flow = this.capacity - this.damage;
      this.active = (this.available_flow > 0) ? true : false;
    },

    attempt_flow: function(flow) {
      this.flow = flow;
      this.status = 'OK!';
      this.set_life_expectancy();
    },

    set_life_expectancy: function() {
      this.set_available_flow();
      this.life_expectancy = (this.max_flow_beyond_capacity - this.flow_above_capacity()) * this.life_expectancy_coeficient();
      this.validate_injector();
    },

    get_flow_reply: function() {
      return utils.decimal_to_fixed(this.flow) + " mg/s";
    },

    // -------------------------------------------------------

    validate_injector: function() {
      this.check_expectancy_infinite();
      this.check_unable_to_comply();
    },

    check_expectancy_infinite: function() {
      if (this.life_expectancy >= this.life_beyond_capacity) {
        this.life_expectancy = 'Infinite';
      }
    },

    check_unable_to_comply: function() {
      if((this.available_flow + this.max_flow_beyond_capacity) <= this.flow) {
        this.flow = 0;
        this.life_expectancy = 0;
        this.status = 'Unable to comply'
      }
    },

    life_expectancy_coeficient: function() {
      return (this.life_beyond_capacity/this.max_flow_beyond_capacity);
    },

    flow_above_capacity: function() {
      return (this.flow - this.available_flow);
    }
  };
};

module.exports = injector;