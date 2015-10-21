// compute-add allows me to quickly add vectors
var add = require('compute-add');


// State will hold all of the data which the charts read.
var config = {
  active_residues: ["ARG", "ASN", "ASP", "CYS", "GLU", "GLN", "HIS", "LEU",
                    "LYS", "MET", "PHE", "SER", "TRP", "TYR", "SEC", "PYL"],
  plotted: "histogram",
};

// Build the options invisibly, including sane defaults:
// Cutoff slider (range low to high, with optimal threshold selected)
// Checkboxes for active residues, with default residue set selected
// Chain and resid selectors, with the first entry selected.
function init_options(state) {
  init_aminos(state);
  init_cutoffs(state);
  init_residues(state);
}

// Draws the amino acids options checkboxes. Subfunction of init_options
function init_aminos(state) {
  console.log(state.all_aminos)
  amino_html = Object.keys(state.all_aminos).map(function (x) {
    var active = "";
    if (state.all_aminos[x].selected) { 
      active="checked"; 

    }
    return ['<label class="checkbox-inline">',
            '<input type="checkbox" id="'+x+'" '+active+'>',
            x+ '</label>',
    ].join('\n')
  });
  $("#aminos .checkbox").html(amino_html.join('\n')); 
  // Listener on checkboxes leads to a change in state!
  $("#aminos .checkbox input").change(function() {
    change_id = $(this).attr('id');
    console.log(change_id);
    if ($(this).is(':checked')) {
      state.all_aminos[change_id].selected = true;
      console.log(state.all_aminos[change_id]);
    }
    else {
      state.all_aminos[change_id].selected = false;
      console.log(state.all_aminos[change_id]);
    }
    update_graph(state);
  });
}

function init_cutoffs(state) {
  // Build a cutoff slider with a range of values, with the edge values displayed and the current value displayed.
  max = state.thresholds.length - 1;
  start = state.current_threshold;
  sliced_values = state.thresholds.map(function (x){
    return x.slice(0,6);
  });
  // Removed strong tags, left the space there so I can put it back...
  html_string = ""+sliced_values[0]+" <input id='cutoff_slider' type='range' min='0' max='"+max+"' value='0'/> "+sliced_values[max]+"";
  $("#cutoffs .slider").html(html_string);
  $('#slider-text').html(""+sliced_values[0]+"");
  $("#cutoff_slider").change( function() {
    text = ""+sliced_values[$(this).val()]+"";
    $('#slider-text').html(text);
    state.current_threshold = state.thresholds[$(this).val()];
    console.log(state.current_threshold);
    // Fix the current graph based on the new state.
    update_graph(state);
  });
}

function init_residues(state) {
  chain_html = state.chains.map(function(x){
    return "<option>"+x+"</option>"
  }).join('\n');
  $('#chain-selector').html(chain_html)
  $('#chain-selector').change(function() {
    console.log($(this).val());
    // Update state variables
    state.current_chain = $(this).val();
    state.resid_set = Object.keys(state.data.Residues[state.current_chain]).sort(inty_sort);
    state.current_resid = state.resid_set[0];

    // Update the residue selector
    residue_html = state.resid_set.map(function(x){
      return "<option>"+x+"</option>"
    }).join('\n');
    $('#residue-selector').html(residue_html);

    // Update graph for new 
    update_graph(state)
  })
  residue_html = state.resid_set.map(function(x){
    return "<option>"+x+"</option>"
  }).join('\n');
  $('#residue-selector').html(residue_html);
  $('#residue-selector').change(function() {
    console.log($(this).val());
    // Update state variable
    state.current_resid = $(this).val();
    // Update the graph for the new state
    update_graph(state);
  })
}

// This draws the framework for controlling the graphs. I don't want it to show up unless the data is successfully fetched.
function display_visualization_skeleton(state) {
  console.log("putting in visualization buttons");
  // Option buttons
  $('#buttons').html([
    '<h2>Visualizations</h2>',
    '<div role="group" class="btn-group btn-group-justified">',
    '  <a id="score-btn" type="button" class="btn btn-primary graph-picker">EMRinger Score</a>',
    '  <a id="histogram-btn" type="button" class="btn btn-primary active graph-picker">Histograms</a>',
    '  <a id="individual-btn" type="button" class="btn btn-primary graph-picker">Individual Plots</a>',
    '</div>',
  ].join('\n'));
  // Let the graph start taking up the space it needs. I may move this into the graph display logic later.
  $('#graph').addClass('highchart');
  // Set up listeners for buttons
  $('#buttons').on('click', '.btn', function () {
    console.log("adding active");
    $('.btn').removeClass('active');
    $(this).addClass('active');
    // Change state so I always know what is currently being plotted on the highcharts pane.
    state.plotted = $(this).attr('id').slice(0, -4);
    if (state.plotted == "score") {
      display_scores(state);
    }
    else if (state.plotted == "histogram") {
      display_histograms(state);
    }
    else {
      display_plots(state);
    }
  });
  // Draw the options - keep them hidden until the right graph needs them.
  init_options(state);
}

function calculate_score_data(state) {
  aminos = Object.keys(_.pick(state.all_aminos, function (n) {
    return n.selected;
  }, this.key));
  lengths = state.data["Model Length"];
  length_array = aminos.map(function(x){
    return lengths[x];
  });
  total_length = _.sum(length_array);
  series = {
    "EMRinger Score": [],
    "Fraction Rotameric": []
  }
  _.forEach(state.thresholds, function(x){
    // Do this for each threshold in turn
    score_raw_data = state.data.Thresholds[x];
    // Sum up the number rotameric and the total for the active aminos
    number_rotameric = 0;
    number_total = 0;
    _.forEach(aminos, function(y) {
      number_rotameric += score_raw_data[y]["Rotamer Count"];
      number_total += score_raw_data[y]["Number Scanned"];
    });
    // Calculate the statistics for that threshold
    fraction_rotameric = number_rotameric/(number_total+0.000000000000000000001);
    stdev = Math.sqrt(39.0/72*33.0/72*number_total);
    mean = number_total*39.0/72;
    zscore=(number_rotameric-mean)/(stdev+0.000000000000000000001);
    emringer_score = 10 * zscore / Math.sqrt(total_length+0.0000000000000000001);

    series["EMRinger Score"].push([parseFloat(x), emringer_score])
    series["Fraction Rotameric"].push([parseFloat(x), fraction_rotameric])
  });
  console.log(series)
  return series;
}

// Switch to and display the summary scores chart.
function display_scores(state) {
  // Hide only cutoffs and residues, show aminos
  $('.option-div').removeClass("hide");
  $('#cutoffs').addClass("hide");
  $('#residues').addClass("hide");
  data = calculate_score_data(state)
  console.log('displaying EMRinger score plot');
  $(function () {
    $('#graph').highcharts({
      title: {
        text: 'EMRinger Score'
      },
      xAxis: {
        title: {
          text: 'Chi-1 Angle'
        }
      },
      yAxis: [{
        title: {
          text: 'EMRinger score'
        }
      },{
        title: {
          text: 'Fraction Rotameric'
        },
        min: 0,
        max: 1,
        opposite: true
      }],
      series: [{
          name: "EMRinger Score",
          type: "line",
          data: data["EMRinger Score"]
        },
        {
          name: "Fraction Rotameric",
          type: "line",
          data: data["Fraction Rotameric"],
          yAxis: 1
      }],
      tooltip: {
        shared: true
      }
    });
  });
}

function calculate_histogram_data(state) {
  threshold = state.current_threshold;
  aminos = Object.keys(_.pick(state.all_aminos, function (n) {
    return n.selected;
  }, this.key));
  var values = Array.apply(null, Array(72)).map(Number.prototype.valueOf,0);
  hist_set = state.data.Thresholds[threshold];
  _.forEach(aminos, function(n) {
    values = add(values, hist_set[n]["Peak Histogram"])
  }) ;
  console.log(values);
  var data = new Array(73);
  for (i = 0; i<values.length; i++) {
    data[i] = [i*5, values[i]];
  };
  data[72] = [360, data[0][1]];
  return data
}

// Switch to displaying histograms.
function display_histograms(state) {
  // Hide only residues, show aminos and cutoffs
  data = calculate_histogram_data(state)
  $('.option-div').removeClass("hide");
  $('#residues').addClass("hide");
  // Todo
  console.log('displaying histograms');
  $(function () {
    $('#graph').highcharts({
      chart: {
        type: 'column'
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
          groupPadding: 0,
          shadow: false
        }
      },
      title: {
        text: 'Histogram of Peaks at Threshold ' + state.current_threshold.slice(0,6)
      },
      xAxis: {
        title: {
          text: 'Chi-1 Angle'
        },
        min: 0,
        max: 360,
        tickInterval: 60,
        plotBands: [{
          color: '#CBCFDC',
          from: 30,
          to: 90
        },{
          color: '#CBCFDC',
          from: 150,
          to: 210
        },{
          color: '#CBCFDC',
          from: 270,
          to: 330
        }]
      },
      yAxis: {
        title: {
          text: 'Number of peaks'
        },
        min: 0
      },
      series: [{
        name: "EMRinger peak chi angle counts",
        data: data
      }],
      tooltip: {
        formatter: function() {
          return 'Angle: <b>' + this.x +'°</b>, Peak Counts: <b>'+ this.y +'</b>'
        }
      }
    });
  });
}

function calculate_plots_data(state) {
  chain = state.current_chain;
  console.log(state.current_chain);
  resid = state.current_resid;
  console.log(state.current_resid)
  residue = state.data.Residues[chain][resid]
  values = residue["Map Values"];
  var data = new Array(73);
  for (i = 0; i<values.length; i++) {
    data[i] = [i*5, values[i]];
  };
  data[72] = [360, data[0][1]];
  amino = residue["Residue Name"];

  return {
    chain: chain,
    amino: amino,
    resid: resid,
    data: data
  };
}

// Switch to displaying plots
function display_plots(state) {
  // Hide only cutoffs and aminos, show residues
  $('.option-div').removeClass("hide");
  $('#cutoffs').addClass("hide");
  $('#aminos').addClass("hide");
  // Todo
  result = calculate_plots_data(state);
  console.log(result.data)
  console.log('displaying plots');
  $(function () {
    $('#graph').highcharts({
      chart: {
        type: 'line'
      },
      title: {
        text: 'EMRinger Plot for Chain ' + result.chain +', '+result.amino+' '+result.resid
      },
      xAxis: {
        title: {
          text: 'Chi-1 Angle (º)',
        },
        tickInterval: 60,
        plotBands: [{
          color: '#CBCFDC',
          from: 30,
          to: 90
        },
        {
          color: '#CBCFDC',
          from: 150,
          to: 210
        },
        {
          color: '#CBCFDC',
          from: 270,
          to: 330
        },
        ]
      },
      yAxis: {
        title: {
            text: 'Map Value'
        }
      },
      series: [{
        name: "EMRinger trace",
        data: result.data
      }],
      tooltip: {
        formatter: function() {
          return 'Angle: ' + this.x +'°, Map Value: '+ this.y
        }
      }
    });
  });
}

function update_graph(state) {
  console.log(state.plotted);
  var chart = $("#graph").highcharts();
  if (state.plotted == "individual") {
    result = calculate_plots_data(state);
    chart.series[0].setData(result.data);
    chart.setTitle({
      text: 'EMRinger Plot for Chain ' + result.chain +', '+result.amino+' '+result.resid
    });
  }
  else if (state.plotted=="histogram") {
    data = calculate_histogram_data(state);
    chart.series[0].setData(data);
    chart.setTitle({
      text: 'Histogram of Peaks at Threshold ' + state.current_threshold.slice(0,6)
    })
  }
  else if (state.plotted=="score"){
    data = calculate_score_data(state);
    chart.series[0].setData(data["EMRinger Score"]);
    chart.series[1].setData(data["Fraction Rotameric"]);
  }
  else {
    console.log(state.plotted);
  }
}

// Send an ajax request to fetch scores; return a promise
function fetch_scores(state) {
  console.log('getting data from server');
  return $.ajax({
    type: 'POST',
    url: '/get_result',
    dataType: 'json',
    contentType: "application/json",
    data: JSON.stringify({ job_id: state.id }) // {map: uuid, model: uuid}
  })
}

// Convenience function for sorting as if things were ints.
function inty_sort(a,b) {
  return parseInt(a)-parseInt(b)
}

// Convenience function for sorting as if things were floats.
function floaty_sort(a,b) {
  return parseFloat(a)-parseFloat(b)
}

function calculate_state_variables(state) {
  //Thresholds and starting threshold
  var string_thresh = Object.keys(state.data.Thresholds);

  thresholds = string_thresh.sort(floaty_sort());
  // Current threshold is the first threshold in the list.
  var current_threshold = thresholds[0];
  // Make amino acid dictionary
  var amino_list = Object.keys(state.data["Model Length"])
  var all_aminos = {};
  for (i = 0; i < amino_list.length; i++) {
    x = amino_list[i]
    if (config.active_residues.indexOf(x) > -1) {
      all_aminos[x] = {
        selected: true
      };
    }
    else {
      all_aminos[x] = {
        selected: false
      }
    }
  };
  // Chains come from the list of chain IDs.
  var chains = Object.keys(state.data.Residues).sort();
  var current_chain = chains[0];
  // RESIDs come dependent on the chain...
  var resid_set = Object.keys(state.data.Residues[current_chain]).sort(inty_sort);
  var current_resid = resid_set[0];
  // Return everything so it can get pushed into the state object.
  return {
    thresholds: thresholds,
    all_aminos: all_aminos,
    current_threshold: current_threshold,
    chains: chains,
    current_chain: current_chain,
    resid_set: resid_set,
    current_resid: current_resid,
  }
}

// Initiate the state, then draw the options and the first plot.
function initialize() {
  var state = {};
  state.plotted=config.plotted;
  // state.active_plot = config.active_plot;
  state.id = $('#job-info').data("id");
  var result = fetch_scores(state);
  result.then(function (data) {
    state.data = data;
    $.extend(state,calculate_state_variables(state));
    console.log(state);
    display_visualization_skeleton(state);
    display_histograms(state);
  });
}


$(document).ready(function () {
  initialize();
});
