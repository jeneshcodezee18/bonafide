function showForgotPasswordPopup() {
  $(".popup-title").html("<h2>Change Password</h2>");
  $("#forgotPasswordPopup").modal("show");
  $("#oldPassword").val("");
  $("#newPassword").val("");
  $("#confirmPassword").val("");
}

$(document).ready(function () {
  $("#forgotPasswordPopup form").submit(function (e) {
    e.preventDefault();
    var oldPassword = $("#oldPassword").val();
    var newPassword = $("#newPassword").val();
    var confirmPassword = $("#confirmPassword").val();
    let token = localStorage.getItem("TOKEN");
    if (oldPassword && newPassword && confirmPassword) {
      if (newPassword === confirmPassword) {
        $.ajax({
          type: "POST",
          url: BASE_URL + "admin/change_password",
          headers: {
            authorization: token ? `Bearer ${token}` : "",
          },
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

  // Hide the forgot password popup modal on cancel
  $("#cancelForgotPassword").click(function () {
    $("#forgotPasswordPopup").modal("hide");
  });

});
jQuery(document).ready(function ($) {
  let token = localStorage.getItem("TOKEN");
 
  jQuery.ajax({
    type: "GET",
    url: BASE_URL + "admin/login_check",
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
    data: {},
    success: function (response) {
      if (response.status !== 200 && response.err !== 0) {
        window.location = BASE_URL + "admin";
      }
    },
  });
});


document.getElementById('sign_out').addEventListener('click', function () {
  // Display a confirmation dialog using SweetAlert
  Swal.fire({
    title: 'Confirm Sign Out',
    text: 'Are you sure you want to sign out?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Sign Out'
  }).then((result) => {
    if (result.isConfirmed) {
      // User confirmed sign out, proceed with removal of TOKEN and redirection
      const token = localStorage.getItem("TOKEN");
      if (token) {
        $.ajax({
          type: 'POST',
          url: BASE_URL + "admin/logout",
          headers: {
            'Authorization': `Bearer ${token}`
          },
          data: { token: token },
          success: function (response) {
            $(".indicator-progress").hide();
            if (response.err == 1) {
              // console.log(response, "error");
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
              // Redirect to admin dashboard on successful login
              console.log("You have successfully logged out!");
              localStorage.setItem("TOKEN", token);

                  // If no specific redirect URL is provided, use a default dashboard URL
                  window.location.href = BASE_URL + "admin";
            }
          },
          error: function (xhr, status, error) {
            $(".indicator-progress").hide();
            console.log("Error:", error);
            // Handle error here
          },
        })
      } else {
        Swal.fire('Error', 'Token not found.', 'error');
      }
    }
  });
});


