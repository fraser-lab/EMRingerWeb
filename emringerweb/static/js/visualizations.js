// State will hold all of the data which the charts read.
var config = {
  active_residues: ["ARG", "ASN", "ASP", "CYS", "GLU", "GLN", "HIS", "LEU",
                    "LYS", "MET", "PHE", "SER", "TRP", "TYR", "SEC", "PYL"],
  active_plot: "histograms",
};

// Build the options invisibly, including sane defaults:
// Cutoff slider (range low to high, with optimal threshold selected)
// Checkboxes for active residues, with default residue set selected
// Chain and resid selectors, with the first entry selected.
function init_options(state) {
  init_aminos(state);
  // init_cutoffs(state);
  // init_residues(state);
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
}

// This draws the framework for controlling the graphs. I don't want it to show up unless the data is successfully fetched.
function display_visualization_skeleton(state) {
  console.log("putting in visualization buttons");
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
  });
  init_options(state);
}


// Switch to and display the summary scores chart.
function display_scores(state) {
  console.log('displaying EMRinger score plot');
  $('#graph').highcharts({
    chart: {
      type: 'bar'
    },
    title: {
      text: 'EMRinger Score'
    },
    xAxis: {
      title: {
        text: 'Chi-1 Angle'
      }
    },
    yAxis: {
      title: {
        text: 'Number of peaks'
      }
    },
  });
}

// Switch to displaying histograms.
function display_histograms(state) {
  // Todo
  console.log('displaying histograms');
  $('#graph').highcharts({
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Histogram of Peaks'
    },
    xAxis: {
      title: {
        text: 'Chi-1 Angle'
      }
    },
    yAxis: {
      title: {
        text: 'Number of peaks'
      }
    },
  });
}

// Switch to displaying plots
function display_plots(state) {
  // Todo
  console.log('displaying plots');
  $('#graph').highcharts({
    chart: {
      type: 'bar'
    },
    title: {
      text: 'EMRinger Plot'
    },
    xAxis: {
      title: {
        text: 'Chi-1 Angle'
      }
    },
    yAxis: {
      title: {
          text: 'Rho'
      }
    },
  });
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
  // state.active_plot = config.active_plot;
  state.id = $('#job-info').data("id");
  var result = fetch_scores(state);
  result.then(function (data) {
    state.data = data;
    $.extend(state,calculate_state_variables(state));
    console.log(state)
    display_visualization_skeleton(state);
    display_histograms(state)
  });


}


$(document).ready(function () {
  initialize();
});

