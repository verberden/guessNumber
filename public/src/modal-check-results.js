$(document).ready(function modalCheckResults() {

  $('#form-check').on('submit', function submitHandler(e) {
    e.preventDefault();
    var actionUrl = e.currentTarget.action;
    $.ajax({
      type: 'POST',
      url: actionUrl,
      dataType: 'json',
      data: $(this).serialize(),
      success: function onSuccess(data) {
        if (data.result) {
          $('#check-results').val(data.result);
          $('#check-results').parents('.row').removeClass('d-none');
        }

        if (data.status === true) {
          $('#check-results').parents('.row').addClass('d-none');
          $('#result-new-modal').find('.alert-success')
            .removeClass('d-none')
            .empty()
            .append(data.message);
          $('#result-new-modal').modal('show');
        }
      },
    });
  });
})