var injector = function(injector){

  return {
    damage: 0,
    flow: 0,
    capacity: 100,
    life_beyond_capacity: 100,
    max_flow_beyond_capacity: 100,

    set_damage: function(damage){
      damage = Math.max(damage, 0);
      damage = Math.min(damage, 100);
      this.damage = damage;
    },

    get_available_flow: function(){
      this.available_flow = this.capacity - this.damage;
    },

    get_life_expectancy: function(){
      if (typeof(this.available_flow) === 'undefined'){
        this.get_available_flow();
      }
      var life_expectancy_factor = (this.life_beyond_capacity/this.max_flow_beyond_capacity);
      var delta_flow = this.flow - this.available_flow;
      this.life_expectancy = (this.max_flow_beyond_capacity - delta_flow) * life_expectancy_factor;

      this.validate_life_expectancy();
    },

    validate_life_expectancy: function(){
      if (this.life_expectancy >= this.life_beyond_capacity){
        this.life_expectancy = 'infinite';
        return;
      }
      if((this.available_flow + this.max_flow_beyond_capacity) < this.flow){
        this.life_expectancy = 'Unable to comply';
        return;
      }
    }
  }
}

module.exports = injector;