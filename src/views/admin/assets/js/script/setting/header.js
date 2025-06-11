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

                    $('#header_logo').val(value);
                    $('#image_preview').attr('src', value).show();
                } else {
                    $('input[name="' + key + '"]').val(value);
                    $('textarea[name="' + key + '"]').val(value);
                }
            });
        }
    });

    const formData = new FormData();

    const imageInput = $('#header_logo1');
    imageInput.on('change', function (e) {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const file_field = "header_logo"
            handleFileUpload(selectedFile, file_field);
        }
    });


    function handleFileUpload(selectedFile, file_field) {
        const formData = new FormData();
        formData.append('file', selectedFile);;

        $.ajax({
            url: BASE_URL + 'admin/upload',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                const imagePath = response.filePath;
                
                if (file_field === 'header_logo') {
                    $('#image_preview').attr('src', imagePath).show();
                } 
                $('#' + file_field).val(imagePath);
            },
            error: function (error) {

                console.error('Upload error:', error);
            },
        });
    }

    $('#header_details_form').on('submit', function (e) {
        e.preventDefault();
        var formElement = this; // Capture the form element

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
                const serializedFormData = $(formElement).serialize(); // Use the captured formElement
                $.each(serializedFormData.split('&'), function (index, field) {
                    const keyValue = field.split('=');
                    formData[keyValue[0]] = decodeURIComponent(keyValue[1].replace(/\+/g, ' '));
                });
                let token = localStorage.getItem("TOKEN");
                jQuery.ajax({
                    headers: {
                        authorization: token ? `Bearer ${token}` : "",
                      },
                    type: "POST",
                    url: BASE_URL + "admin/insertFormData",
                    data: JSON.stringify(formData),
                    contentType: "application/json", // Set the content type to JSON
                    success: function (response) {
                        if (response.err == 1) {
                            Swal.fire({
                                text: response.msg,
                                icon: "error",
                                buttonsStyling: !1,
                                confirmButtonText: "Ok Got it!",
                                customClass: {
                                    confirmButton: "btn btn-primary",
                                },
                            });
                        } else {
                            Swal.fire({
                                text: response.msg,
                                icon: "success",
                                buttonsStyling: !1,
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



