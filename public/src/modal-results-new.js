$(document).ready(function modalCheckResults() {

  $('#form-new-result').on('submit', function submitHandler(e) {
    e.preventDefault();
    var actionUrl = e.currentTarget.action;

     $.ajax({
      type: 'POST',
      url: actionUrl,
      dataType: 'json',
      data: $(this).serialize(),
      success: function onSuccess(data) {
        window.location = data.location;
      },
    });
  });
})