var utils = function(utils) {
  return {
    decimal_value: function(percentage){
      return percentage/100.00;
    },

    input_to_number: function(input){
      input = Number(input);
      return (isNaN(input))? 0 : input;
    },

    decimal_to_fixed: function(decimal){
      return ((decimal % 1) == 0)? decimal : Number(decimal.toFixed(2));
    },

    append_minutes: function(minutes){
      return minutes + " minuto" + ((minutes !== 1)?"s":"");
    }
  }
}
module.exports = utils;