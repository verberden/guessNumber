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
        if (data.status) {
          window.location = data.location;
        } else {

          $('#result-new-modal').find('.alert-danger')
          .removeClass('d-none')
          .empty()
          .append(data.message);
        }
      },
    });
  });
})