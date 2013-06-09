var utils = function(utils) {
  return {
    decimal_value: function(percentage){
      return percentage/100.00;
    },

    input_to_number: function(input){
      input = Number(input);
      return (isNaN(input))? 0 : input;
    }
  }
}
module.exports = utils;