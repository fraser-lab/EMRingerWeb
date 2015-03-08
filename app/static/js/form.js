var state; 

function initialize() {

  state = {
    uploaders: {}
  }

  // disable the submit button
  disableButton($("#triggerUpload"))

  // initialize the uploaders
  var $modelUploader = initializeUploader('#modelUploader', ['pdb','ent'], 20000000, 'qq-template-model')
  var $mapUploader = initializeUploader('#mapUploader', ['map','mrc','ccp4'], 100000000, 'qq-template-map')

  $('#triggerUpload').click(function() {
    $modelUploader.fineUploader('uploadStoredFiles');
    $mapUploader.fineUploader('uploadStoredFiles');
  });

}

$(document).ready(function(){
  initialize()
});



function initializeUploader(div, allowedExtensions, sizeLimit, template) {
  $(div).click(function() {
    $(div+'Error').empty()
  })
  state.uploaders[div] = {}
  return $(div).fineUploader({
    request: {
      endpoint: '/upload'
    },
    chunked:true,
    template: template,
    classes: {
      success: 'alert alert-success',
      fail: 'alert alert-error'
    },
    multiple: false,
    validation: {
      allowedExtensions: allowedExtensions,
      sizeLimit: sizeLimit // 20 MB = 100 * 1024 * 1024 bytes
    },
    autoUpload: false,
    showMessage: function(message) {
      // Using Bootstrap's classes
      $(div+'Error').empty()
      $(div+'Error').append('<div class="alert alert-danger"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' + message + '</div>');
    }
  }).on('statusChange', function(_,_,_,status) {
    state.uploaders[div].status = status
    if (readyToUpload()) enableButton($("#triggerUpload"))
  }).on('complete', function(_,name,res,xhr) {
    state.uploaders[div].status = 'upload successful' 
    state.uploaders[div].uuid = xhr.form.qquuid
    console.log(state.uploaders)
    if (uploadsCompleted()) {
      console.log(getJobRequestJson())
      // post the job request to the server
      $.post({
        type:'POST'
        , url: '/start_job'
        , dataType: 'json'
        , data: getJobRequestJson() // {map: uuid, model: uuid}
        , success: function() {
          console.log('server took the job!')
        }

      })
    }
  })
}

function getJobRequestJson() {
  return { 'model': state.uploaders['#modelUploader'].uuid
        , 'map': state.uploaders['#mapUploader'].uuid
      }
}

function readyToUpload() { return checkStatusOfUploaders('submitted')}

function uploadsCompleted() { return checkStatusOfUploaders('upload successful')}

function checkStatusOfUploaders(status) {
  if (_.filter(state.uploaders, function(uploader) {
    if (uploader.status === status) return uploader 
  }).length == 2) { return true }
  return false
}


function disableButton($div) {$div.addClass('disabled'); }
function enableButton($div) {$div.removeClass('disabled'); }

