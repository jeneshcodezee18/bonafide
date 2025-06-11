const start = 1;
const limit = 10;
let paginationStart = 1;
pagination(start) ;

function pagination(start) {
    let token = localStorage.getItem("TOKEN");
    const search = $("#search").val();
  
    paginationStart = ((start - 1) * limit) + 1
    jQuery.ajax({
      type: "POST",
      url: `${BASE_URL}admin/master/doctors_team/list/${start}/${limit}`,
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
      data: {
        start: start,
        limit: limit,
        search: search,
      },
      success: function (response) {
        if (response.err == 0) {
          const data = response.data;
          $(".pagination").html(data.html);
          $(".pagination-text").html(data.text);
          html(data.list);
        }
      },
      error: function (xhr, status, error) {
      },
    });
  }

function html(list) {
    let htmlData = "";
    for (let i = 0; i < list.length; i++) {
        htmlData += "<tr>";
        htmlData += `<td>${paginationStart+i}</td>`;
        htmlData += '<td><img src="' + (list[i].dr_image) + '" alt="Image" width="50" height="50"></td>';
        htmlData += `<td>${list[i].dr_name}</td>`; 
        htmlData += `<td>${list[i].dr_degree}</td>`;
        htmlData += "<td>" + new Date(list[i].createdAt).toLocaleDateString() + "</td>";
 
        htmlData += `<td><a href="javascript:;" onclick="view('${list[i]._id}');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="black"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="black"></path></svg></span></a>`;
        htmlData += `<a href="javascript:;" onclick="remove('${list[i]._id}');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="black"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="black"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="black"></path></svg></span></a>`;
        htmlData += "</td>";
        htmlData += "</tr>";
    }
    $(".table-data").html(htmlData);
}

function searchCategory() {
  pagination(start);
}

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
  pagination(start); // Initial pagination

});

function add_record(){;
    Reset();
    $("#edit-modal").modal("show");
    $("#edit_doctors_team").trigger("reset");
    $(".popup-title").html("<h2>Add Doctors Team</h2>");
}

const imageInput = $('#dr_image1');
    imageInput.on('change', function (e) {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const file_field = "dr_image"
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
            // console.log('File uploaded:', imagePath);
            if (file_field === 'dr_image') {
                $('#image_preview').attr('src', imagePath).show();
            }
            $('#' + file_field).val(imagePath);
        },
        error: function (error) {
            console.error('Upload error:', error);
        },
    });
}

function createUrlFriendlyTitle(title) {
  // Replace spaces with hyphens and remove special characters
  return title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
}

$("#edit_doctors_team").on("submit", function (e) {
    e.preventDefault();
    const doctorUniqueName = createUrlFriendlyTitle($("#dr_name").val())
    var formElement = this;
    Swal.fire({
      text: "Are you sure you would like to Add?",
      icon: "warning",
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonText: "Yes, Add!",
      cancelButtonText: "No, return",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-light",
      },
    }).then(function (result) {
      if (result.isConfirmed) {
        let token = localStorage.getItem("TOKEN");
        jQuery.ajax({
          type: "POST",
          url: BASE_URL + "admin/master/doctors_team/add",
          headers: {
            authorization: token ? `Bearer ${token}` : "",
          },
          data: {
            id: $("#Id").val(),
            dr_image: $("#dr_image").val(),
            dr_name: $("#dr_name").val(),
            dr_degree: $("#dr_degree").val(),
            dr_specialist: $("#dr_specialist").val(),
            doctor_about_detail: $("#doctor_about_detail").val(),
            doctor_expertise_detail: $("#doctor_expertise_detail").val(),
            doctorUniqueName: doctorUniqueName,
          }, // Set the content type to JSON
          success: function (response) {
            $(".indicator-progress").hide();
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
              $("#edit-modal").modal("hide");
              pagination(start);
            }
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Handle cancel button click here
        console.log("User clicked on No, return");
      }
    });
  });

  function view(id) { 
    let token = localStorage.getItem("TOKEN");
    jQuery.ajax({
      type: "POST",
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
      url: BASE_URL + "admin/master/doctors_team/view",
      data: {
        id: id,
      },
      success: function (response) {
        if (response.err == 0) {
          var data = response.data;
          $("#Id").val(data._id);
          $("#dr_image").val(data.dr_image);
          $("#dr_name").val(data.dr_name);        
          $("#dr_degree").val(data.dr_degree);        
          $('#image_preview').attr('src', data.dr_image).show();
          $("#dr_specialist").val(data.dr_specialist);        
          $("#doctor_about_detail").val(data.doctor_about_detail);        
          $("#doctor_expertise_detail").val(data.doctor_expertise_detail);        
          $(".popup-title").html("<h2>Edit Doctors Team</h2>");
          $("#edit-modal").modal("show");
        }
      },
    });
  }

  function remove(id){
    
    Swal.fire({
      text: "Are you sure you would like to Delete?",
      icon: "warning",
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonText: "Yes, Delete!",
      cancelButtonText: "No, return",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-light",
      },
    }).then(function (result) {
      if (result.isConfirmed) {
        let token = localStorage.getItem("TOKEN");
         // Check if user clicked "Yes, Delete!"
        jQuery.ajax({
          type: "POST",
          headers: {
            authorization: token ? `Bearer ${token}` : "",
          },
          url: BASE_URL + "admin/master/doctors_team/delete",
          data: { 
            id: id,
          },
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
                text: response.msg, // This should only be "User Deleted Successfully" if the deletion was successful
                icon: "success",
                buttonsStyling: !1,
                confirmButtonText: "Ok Got it!",
                customClass: {
                  confirmButton: "btn btn-primary",
                },
              });
              $("#edit-modal").modal("hide")
              pagination(start);
            }
          },
        });
      } else {
        console.log("Deletion canceled");
      }
    });
  }

  function Reset() {
    $("#Id").val("");
    $("#dr_image").val("");
    $("#dr_name").val("");
    $("#dr_degree").val("");
    $("#dr_specialist").val("");
    $("#doctor_about_detail").val("");
    $("#doctor_expertise_detail").val("");
    $("#image_preview").attr("src", "/assets/media/svg/avatars/blank.svg");
}   

