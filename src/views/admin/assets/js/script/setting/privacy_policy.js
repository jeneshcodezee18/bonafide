jQuery(document).ready(function ($) {
    let token = localStorage.getItem("TOKEN");
    jQuery.ajax({
        type: "GET",
        url: BASE_URL + "admin/login_check",
        headers: {
            authorization: token ? `Bearer ${token}` : "",
        },
        success: function (response) {
            if (response.status !== 200 && response.err !== 0) {
                window.location = BASE_URL + "admin";
            }
        },
    });

    jQuery.ajax({
        headers: {
            authorization: token ? `Bearer ${token}` : "",
        },
        type: "GET",
        url: BASE_URL + "admin/retrieveFormData",
        success: function (response) {
            const data = response.data;
            data.forEach(function (item) {
                var key = item.key;
                var value = item.value;

                if (key === 'header_logo') {

                    $('#image_preview').attr('src', '').hide();
                }

                $('input[name="' + key + '"]').val(value);
                $('textarea[name="' + key + '"]').val(value);
            });
        }
    });

    // Form submission
    $('#privacy_policy_form').on('submit', function (e) {
        e.preventDefault();
        var formElement = this;

        Swal.fire({
            text: "Are you sure you would like to Update?",
            icon: "warning",
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: "Yes, Update!",
            cancelButtonText: "No, return",
            customClass: {
                confirmButton: "btn btn-primary",
                cancelButton: "btn btn-light",
            },
        }).then(function (result) {
            if (result.value) {
                const serializedFormData = $(formElement).serialize();

                let token = localStorage.getItem("TOKEN");
                jQuery.ajax({
                    headers: {
                        authorization: token ? `Bearer ${token}` : "",
                    },
                    type: "POST",
                    url: BASE_URL + "admin/insertFormData",
                    data: serializedFormData,
                    success: function (response) {
                        if (response.err == 1) {
                            Swal.fire({
                                text: response.msg,
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok Got it!",
                                customClass: {
                                    confirmButton: "btn btn-primary",
                                },
                            });
                        } else {
                            Swal.fire({
                                text: response.msg,
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "Ok Got it!",
                                customClass: {
                                    confirmButton: "btn btn-primary",
                                },
                            });
                        }
                    }
                });
            }
        })
    });
});
