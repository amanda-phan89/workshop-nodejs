(function ( $ ) {
  var AppDownload = (function(){
    var messages = {
      'empty_val': 'This field must not empty',
      'invalid_val': 'This field has invalid value'
    };
    var alertDanger = 'alert-danger';
    var msgBox = $('div#msgBox');
    var errMsg = [];

    function isValidForm(urlInput) {
      if (urlInput === '') {
        errMsg.push(messages.empty_val);
        return false;
      }

      var regexUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
      if (!regexUrl.test(urlInput)) {
        errMsg.push(messages.invalid_val);
        return false;
      }

      return true;
    }

    function showMessage() {
      var text = '';
      for (var index in errMsg) {
        text += '<li>' + errMsg[index] + '</li>';
      }
      msgBox.children('ul').html(text)
      msgBox.addClass(alertDanger).show();
    }

    function hideMessage() {
      errMsg = [];
      msgBox.children('ul').html('')
      msgBox.removeClass(alertDanger).hide();
    }

    function submitForm() {
      $('#downloadImg').submit(function(ev){
        hideMessage();
        var action = $(this).attr('action');
        var urlInput = $('input#url').val();
        var isValid = isValidForm(urlInput);

        if (!isValid) {
          ev.preventDefault();
          showMessage();
          return false;
        }
        $(".loader").fadeIn("slow");
      })
    }

    return {
      submitForm: submitForm
    }
  })()

  AppDownload.submitForm();

}( jQuery ));
