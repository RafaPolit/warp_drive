var injector = function(injector){

  function input_to_number(input){
    input = Number(input);
    return (isNaN(input))? 0 : input;
  }

  return {
    damage: 0,
    flow: 0,
    active: true,
    capacity: 100,
    life_beyond_capacity: 100,
    max_flow_beyond_capacity: 100,

    set_damage: function(damage){
      damage = input_to_number(damage);
      damage = Math.max(damage, 0);
      damage = Math.min(damage, 100);
      this.damage = damage;
    },

    get_available_flow: function(){
      this.available_flow = this.capacity - this.damage;
      if(this.available_flow == 0) this.active = false;
    },

    get_life_expectancy: function(){
      if (typeof(this.available_flow) === 'undefined'){
        this.get_available_flow();
      }
      this.life_expectancy = (this.max_flow_beyond_capacity - this.delta_flow()) * this.life_expectancy_coeficient();

      this.validate_life_expectancy();
    },

    validate_life_expectancy: function(){
      if (this.life_expectancy >= this.life_beyond_capacity){
        this.life_expectancy = 'infinite';
        return;
      }
      if((this.available_flow + this.max_flow_beyond_capacity) <= this.flow){
        this.life_expectancy = 'Unable to comply';
        return;
      }
    },

    life_expectancy_coeficient: function(){
      return (this.life_beyond_capacity/this.max_flow_beyond_capacity);
    },

    delta_flow: function() {
      return (this.flow - this.available_flow);
    }
  }
}

module.exports = injector;