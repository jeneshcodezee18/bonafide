function showForgotPasswordPopup() {
  $(".popup-title").html("<h2>Change Password</h2>");
  $("#forgotPasswordPopup").modal("show");
  $("#oldPassword").val("");
  $("#newPassword").val("");
  $("#confirmPassword").val("");
}

$(document).ready(function () {
  $(document).ready(function () {
  $("#forgotPasswordPopup form").submit(function (e) {
    e.preventDefault();
    const oldPassword = $("#oldPassword").val();
    const newPassword = $("#newPassword").val();
    const confirmPassword = $("#confirmPassword").val();
    let token = localStorage.getItem("TOKEN");

    if (oldPassword && newPassword && confirmPassword) {
      if (newPassword === confirmPassword) {
        // Show confirmation before changing password
        Swal.fire({
          title: 'Are you sure?',
          text: "Do you really want to change your password?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, change it!'
        }).then(function (result) {
          if (result.isConfirmed) {
            $.ajax({
              type: "POST",
              url: BASE_URL + "admin_master/change_password",
              data: {
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword,
              },
              success: function (response) {
                if (response.err == 1) {
                  Swal.fire({
                    text: response.msg,
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok got it",
                    customClass: {
                      confirmButton: "btn btn-primary",
                    },
                  });
                } else {
                  Swal.fire({
                    text: response.msg,
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Ok got it",
                    customClass: {
                      confirmButton: "btn btn-primary",
                    },
                  });
                  $("#forgotPasswordPopup").modal("hide");
                }
              },
            });
          }
        });
      } else {
        Swal.fire({
          text: "Password and confirm password must be same",
          icon: "warning",
          buttonsStyling: false,
          confirmButtonText: "Ok got it",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      }
    } else {
      Swal.fire({
        text: "Please enter all fields",
        icon: "warning",
        buttonsStyling: false,
        confirmButtonText: "Ok got it",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      });
    }
  });
});

  // Hide the forgot password popup modal on cancel
  $("#cancelForgotPassword").click(function () {
    $("#forgotPasswordPopup").modal("hide");
  });

});

jQuery(document).ready(function ($) {
  jQuery.ajax({
    type: "GET",
    url: BASE_URL + "admin_master/login_check",
    data: {},
    success: function (response) {
      if (response.status !== 200 && response.err !== 0) {
        window.location = BASE_URL + "admin_master";
      }
    },
  });
});


$('#sign_out').on('click', function () {
  // Display a confirmation dialog using SweetAlert
  Swal.fire({
    title: 'Confirm Sign Out',
    text: 'Are you sure you want to sign out?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Sign Out'
  }).then(function (result) {
    if (result.isConfirmed) {
      $.ajax({
        type: 'GET',
        url: BASE_URL + "admin_master/logout",
        data: {},
        success: function (response) {
          $(".indicator-progress").hide();

          if (response.err == 1) {
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
            // Remove token and redirect to admin login
            localStorage.removeItem("TOKEN");
            window.location.href = BASE_URL + "admin_master";
          }
        },
        error: function (xhr, status, error) {
          $(".indicator-progress").hide();
          console.log("Error:", error);
        },
      });
      
    }
  });
});


