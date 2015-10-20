(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// MODULES //

var isArray = require( 'validate.io-array' ),
	isObject = require( 'validate.io-object' ),
	isFunction = require( 'validate.io-function' ),
	isBoolean = require( 'validate.io-boolean-primitive' ),
	isNumber = require( 'validate.io-number-primitive' );


// ADD //

/**
* FUNCTION: add( arr, x[, opts] )
*	Computes an element-wise addition.
*
* @param {Number[]|Array} arr - input array
* @param {Number[]|Array|Number} x - either an array of equal length or a scalar
* @param {Object} [opts] - function options
* @param {Boolean} [opts.copy=true] - boolean indicating whether to return a new array
* @param {Function} [opts.accessor] - accessor function for accessing array values
* @returns {Number[]} output array
*/
function add( arr, x, opts ) {
	var isArr = isArray( x ),
		copy = true,
		arity,
		clbk,
		out,
		len,
		i;

	if ( !isArray( arr ) ) {
		throw new TypeError( 'add()::invalid input argument. Must provide an array. Value: `' + arr + '`.' );
	}
	if ( !isArr && !isNumber( x ) ) {
		throw new TypeError( 'add()::invalid input argument. Second argument must either be an array or number primitive. Value: `' + x + '`.' );
	}
	if ( arguments.length > 2 ) {
		if ( !isObject( opts ) ) {
			throw new TypeError( 'add()::invalid input argument. Options argument must be an object. Value: `' + opts + '`.' );
		}
		if ( opts.hasOwnProperty( 'copy' ) ) {
			copy = opts.copy;
			if ( !isBoolean( copy ) ) {
				throw new TypeError( 'add()::invalid option. Copy option must be a boolean primitive. Option: `' + copy + '`.' );
			}
		}
		if ( opts.hasOwnProperty( 'accessor' ) ) {
			clbk = opts.accessor;
			if ( !isFunction( clbk ) ) {
				throw new TypeError( 'add()::invalid option. Accessor must be a function. Option: `' + clbk + '`.' );
			}
			arity = clbk.length;
		}
	}
	len = arr.length;
	if ( copy ) {
		out = new Array( len );
	} else {
		out = arr;
	}
	// Case 1: x is an array
	if ( isArr ) {
		if ( len !== x.length ) {
			throw new Error( 'add()::invalid input argument. Array to be added must have a length equal to that of the input array.' );
		}
		if ( arity === 3 ) { // clbk implied
			for ( i = 0; i < len; i++ ) {
				out[ i ] = clbk( arr[i], i, 0 ) + clbk( x[i], i, 1 );
			}
		}
		else if ( clbk ) {
			for ( i = 0; i < len; i++ ) {
				out[ i ] = clbk( arr[i], i ) + x[ i ];
			}
		}
		else {
			for ( i = 0; i < len; i++ ) {
				out[ i ] = arr[ i ] + x[ i ];
			}
		}
	}
	// Case 2: accessor and scalar
	else if ( clbk ) {
		for ( i = 0; i < len; i++ ) {
			out[ i ] = clbk( arr[i], i ) + x;
		}
	}
	// Case 3: scalar
	else {
		for ( i = 0; i < len; i++ ) {
			out[ i ] = arr[ i ] + x;
		}
	}
	return out;
} // end FUNCTION add()


// EXPORTS //

module.exports = add;

},{"validate.io-array":2,"validate.io-boolean-primitive":3,"validate.io-function":4,"validate.io-number-primitive":5,"validate.io-object":6}],2:[function(require,module,exports){
'use strict';

/**
* FUNCTION: isArray( value )
*	Validates if a value is an array.
*
* @param {*} value - value to be validated
* @returns {Boolean} boolean indicating whether value is an array
*/
function isArray( value ) {
	return Object.prototype.toString.call( value ) === '[object Array]';
} // end FUNCTION isArray()

// EXPORTS //

module.exports = Array.isArray || isArray;

},{}],3:[function(require,module,exports){
/**
*
*	VALIDATE: boolean-primitive
*
*
*	DESCRIPTION:
*		- Validates if a value is a boolean primitive.
*
*
*	NOTES:
*		[1]
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2015. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2015.
*
*/

'use strict';

/**
* FUNCTION: isBoolean( value )
*	Validates if a value is a boolean primitive.
*
* @param {*} value - value to be validated
* @returns {Boolean} boolean indicating if a value is a boolean primitive
*/
function isBoolean( value ) {
	return value === true || value === false;
} // end FUNCTION isBoolean()


// EXPORTS //

module.exports = isBoolean;

},{}],4:[function(require,module,exports){
/**
*
*	VALIDATE: function
*
*
*	DESCRIPTION:
*		- Validates if a value is a function.
*
*
*	NOTES:
*		[1]
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2014.
*
*/

'use strict';

/**
* FUNCTION: isFunction( value )
*	Validates if a value is a function.
*
* @param {*} value - value to be validated
* @returns {Boolean} boolean indicating whether value is a function
*/
function isFunction( value ) {
	return ( typeof value === 'function' );
} // end FUNCTION isFunction()


// EXPORTS //

module.exports = isFunction;

},{}],5:[function(require,module,exports){
/**
*
*	VALIDATE: number-primitive
*
*
*	DESCRIPTION:
*		- Validates if a value is a number primitive.
*
*
*	NOTES:
*		[1]
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2015. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2015.
*
*/

'use strict';

/**
* FUNCTION: isNumber( value )
*	Validates if a value is a number primitive, excluding `NaN`.
*
* @param {*} value - value to be validated
* @returns {Boolean} boolean indicating if a value is a number primitive
*/
function isNumber( value ) {
	return (typeof value === 'number') && (value === value);
} // end FUNCTION isNumber()


// EXPORTS //

module.exports = isNumber;

},{}],6:[function(require,module,exports){
'use strict';

// MODULES //

var isArray = require( 'validate.io-array' );


// ISOBJECT //

/**
* FUNCTION: isObject( value )
*	Validates if a value is a object; e.g., {}.
*
* @param {*} value - value to be validated
* @returns {Boolean} boolean indicating whether value is a object
*/
function isObject( value ) {
	return ( typeof value === 'object' && value !== null && !isArray( value ) );
} // end FUNCTION isObject()


// EXPORTS //

module.exports = isObject;

},{"validate.io-array":2}],7:[function(require,module,exports){
// compute-add allows me to quickly add vectors
var add = require('compute-add');


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
  values = state.thresholds.map(function (x){
    return x.slice(0,6);
  });
  // Removed strong tags, left the space there so I can put it back...
  html_string = ""+values[0]+" <input id='cutoff_slider' type='range' min='0' max='"+max+"' value='0'/> "+values[max]+"";
  $("#cutoffs .slider").html(html_string);
  $('#slider-text').html(""+values[0]+"");
  $("#cutoff_slider").change( function() {
    text = ""+values[$(this).val()]+"";
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


// Switch to and display the summary scores chart.
function display_scores(state) {
  // Hide only cutoffs and residues, show aminos
  $('.option-div').removeClass("hide");
  $('#cutoffs').addClass("hide");
  $('#residues').addClass("hide");

  console.log('displaying EMRinger score plot');
  $('#graph').highcharts({
    chart: {
      type: 'line'
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
  // Hide only residues, show aminos and cutoffs
  $('.option-div').removeClass("hide");
  $('#residues').addClass("hide");
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
  // Hide only cutoffs and aminos, show residues
  $('.option-div').removeClass("hide");
  $('#cutoffs').addClass("hide");
  $('#aminos').addClass("hide");
  // Todo
  console.log('displaying plots');
  $('#graph').highcharts({
    chart: {
      type: 'line'
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

function update_graph(state) {
  console.log(state.plotted);
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
    console.log(state);
    display_visualization_skeleton(state);
    display_histograms(state);
  });
}


$(document).ready(function () {
  initialize();
});


},{"compute-add":1}]},{},[7]);
