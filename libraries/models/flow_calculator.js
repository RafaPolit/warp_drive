var flow_calculator = function(flow_calculator) {

  var injectors = {};
  var data = {};

  return {
    injectors: injectors,
    data: data,

    load_injector_data: function(received_data) {
      data.required_combined_flow = received_data.required_combined_flow;
      Object.keys(received_data.available_flows).forEach(function(id) {
        injectors[id] = {};
        injectors[id].available_flow = received_data.available_flows[id];
      });
    },

    get_ideal_flow: function() {
      data.number_of_injectors = Object.keys(injectors).length;
      data.ideal_flow = data.required_combined_flow / data.number_of_injectors;
    },

    get_unfulfilled_flow: function() {
      data.unfulfilled_flow = 0;
      Object.keys(injectors).forEach(function(id) {
        injectors[id].unfulfilled_flow = injectors[id].available_flow - data.ideal_flow;
        data.unfulfilled_flow += injectors[id].unfulfilled_flow;
      });
    },

    get_balanced_flows: function() {
      var average_flow = data.unfulfilled_flow / data.number_of_injectors;
      Object.keys(injectors).forEach(function(id) {
        injectors[id].balanced_flow = injectors[id].available_flow - average_flow;
      });
    },

    set_flows_for_negative_values: function() {
      data.redistributable_flow = 0;
      data.positive_flowed_injectors = [];
      data.negative_flowed_injectors = [];
      Object.keys(injectors).forEach(function(id) {
        if(injectors[id].balanced_flow < 0) {
          data.negative_flowed_injectors.push(id);
          data.redistributable_flow += injectors[id].balanced_flow - injectors[id].available_flow;
          injectors[id].balanced_flow = injectors[id].available_flow;     
        } else {
          data.positive_flowed_injectors.push(id);
        }
      });
    },

    redistribute_negative_flows: function() {
      data.positive_flowed_injectors.forEach(function(id) {
        injectors[id].balanced_flow += data.redistributable_flow / data.positive_flowed_injectors.length; 
      });
    },

    assign_all_ideal_if_possible: function() {
      var all_flows_under_available = true;
      Object.keys(injectors).forEach(function(id) {
        var current_flow_under_available = (data.ideal_flow <= injectors[id].available_flow)
        all_flows_under_available = (all_flows_under_available && current_flow_under_available);
      });
      if (all_flows_under_available) {
        Object.keys(injectors).forEach(function(id) {
          injectors[id].balanced_flow = data.ideal_flow;
        });        
      }
    },

    go_Scotty: function(received_data) {
      this.load_injector_data(received_data);
      this.get_ideal_flow();
      this.get_unfulfilled_flow();
      this.get_balanced_flows();
      this.set_flows_for_negative_values();
      this.redistribute_negative_flows();
      this.assign_all_ideal_if_possible();
    }
  }
}

module.exports = flow_calculator;
  