// State will hold all of the data which the charts read.
var state = {
  active_residues: ["ARG", "ASN", "ASP", "CYS", "GLU", "GLN", "HIS", "LEU",
                    "LYS", "MET", "PHE", "SER", "TRP", "TYR", "SEC", "PYL"],
  active_plot: "scores",
  current_chain: "",
  current_resid: ""
}

// This draws the framework for controlling the graphs. I don't want it to show up unless the data is successfully fetched.
function display_visualization_skeleton() {
  console.log("putting in visualization buttons")
  $('#buttons').html([
    '<h2>Visualizations</h2>',
    '<div role="group" class="btn-group btn-group-justified">',
    '  <a id="score-btn" type="button" onclick="display_scores();" class="btn btn-primary">EMRinger Score</a>',
    '  <a id="histogram-btn" type="button" onclick="display_histograms();" class="btn btn-primary active">Histograms</a>',
    '  <a id="individual-btn" type="button" onclick="display_plots();" class="btn btn-primary">Individual Plots</a>',
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
}


// Switch to and display the summary scores chart.
function display_scores() {
  // Todo
  console.log('displaying EMRinger score plot');
}

// Switch to displaying histograms.
function display_histograms() {
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
function display_plots() {
  // Todo
  console.log('displaying plots');
}

// Send an ajax request to fetch scores; return a promise
function fetch_scores() {
  console.log('getting data from server');
  return $.ajax({
    type: 'POST',
    url: '/get_result',
    dataType: 'json',
    contentType: "application/json",
    data: JSON.stringify({ job_id: state.id }) // {map: uuid, model: uuid}
  })
}

function initialize() {

  state.id = $('#job-info').data("id");
  var result = fetch_scores();
  result.then(function (data) {
    display_visualization_skeleton();
    state.data = data;
    display_histograms()
  });


}






$(document).ready(function () {
  initialize();
});

