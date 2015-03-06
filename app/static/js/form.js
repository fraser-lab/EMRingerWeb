$(document).ready(function(){
  console.log("Model Uploader Test");
  var modelUploader = $('#modelUploader').fineUploader({
    request: {
      endpoint: 'server/success.html'
    },
    chunked: false,
    template: 'qq-template-model',
    classes: {
      success: 'alert alert-success',
      fail: 'alert alert-error'
    },
    multiple: false,
    validation: {
      allowedExtensions: ['pdb','ent'],
      sizeLimit: 20000000 // 20 MB = 100 * 1024 * 1024 bytes
    },
    // autoUpload: true,
    showMessage: function(message) {
      // Using Bootstrap's classes
      $('#modelError').empty()
      $('#modelError').append('<div class="alert alert-danger"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' + message + '</div>');
    }
  });

  console.log("Map Uploader Test");
  var mapUploader = $('#mapUploader').fineUploader({
    request: {
      endpoint: 'server/success.html'
    },
    template: 'qq-template-map',
    multiple: false,
    validation: {
      allowedExtensions: ['map','mrc','ccp4'],
      sizeLimit: 100000000 // 100 MB = 100 * 1024 * 1024 bytes
    },
    autoUpload: false,
    showMessage: function(message) {
      // Using Bootstrap's classes
      $('#mapError').empty()
      $('#mapError').append('<div class="alert alert-danger"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' + message + '</div>');
    }
  });

  console.log("Map Uploader Test");
  $('#triggerUpload').click(function() {
    modelUploader.fineUploader('uploadStoredFiles');
    mapUploader.fineUploader('uploadStoredFiles');
  });

  $('#modelUploader').click(function() {
    $('#modelError').empty();
  });

  $('#mapUploader').click(function() {
    $('#mapError').empty();
  });

});