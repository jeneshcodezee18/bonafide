jQuery(document).ready(function ($) {
  jQuery.ajax({
    type: "GET",
    url: BASE_URL + "admin_master/login_check",
    data: {},
    success: function (response) {
      if (response.status === 200 && response.err === 0) {
        window.location = BASE_URL + "admin_master/adminHome";
      }
    },
  });

  

  $("#kt_sign_in_form").on("submit", function (e) {
    e.preventDefault();
    $(".indicator-progress").css("display", "contents");
    const username = $("#username").val();
    const password = $("#password").val();

    $.ajax({
      type: "POST",
      url: BASE_URL + "admin_master/login",
      data: {
        username: username,
        password: password,
      },
      success: function (response) {
        $(".indicator-progress").hide();
        if (response.err === 1) {
          Swal.fire({
            text: response.msg,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        } else {
          Swal.fire({
            text: "You have successfully logged in!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          })
          window.location.href = BASE_URL + "admin_master/adminHome"; 
        }
      },
      error: function (xhr, status, error) {
        $(".indicator-progress").hide();
        Swal.fire({
          text: "Wrong Credentials, Please try again.",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      },
    });
  });
});
