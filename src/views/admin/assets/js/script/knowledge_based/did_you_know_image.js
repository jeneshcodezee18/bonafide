$("#addDidYoyKnowImage").on("click", function () {
  window.location.href = BASE_URL + "admin_master/did_you_know/addEdit";
});

$("#did_you_know_image_form").on("submit", function (e) {
  e.preventDefault();
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
      jQuery.ajax({
        type: "POST",
        url: BASE_URL + "admin_master/did_you_know/add",
        data: {
          infographic_and_did_you_know_imagesid: $("#Id").val(),
          image: $("#image").val(),
          report_title: $("#report_title").val(),
          createddate: $("#createddate").val(),
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
            formElement.reset();
            window.location.href =
              BASE_URL + "admin_master/did_you_know/manage";
          }
        },
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      console.log("User clicked on No, return");
    }
  });
});

function remove(id) {
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
      jQuery.ajax({
        type: "POST",
        url: BASE_URL + "admin_master/did_you_know/delete",
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
    } else {
      console.log("Deletion canceled");
    }
  });
}

const start = 1;
const limit = 10;

function pagination(start) {
  paginationStart = (start - 1) * limit + 1;
  jQuery.ajax({
    type: "POST",
    url: `${BASE_URL}admin_master/did_you_know/list/${start}/${limit}`,
    data: {
      start: start,
      limit: limit,
    },
    success: function (response) {
      if (response.err == 0) {
        const data = response.data;
        $(".pagination").html(data.html);
        $(".pagination-text").html(data.text);
        html(data.list || []);
      }
    },
  });
}

function html(list) {
  let htmlData = "";
  if (list.length == 0) {
    htmlData += `<tr><td colspan="12"><span class="fw-bold d-block fs-7">No data found!</span></td></tr>`;
    $(".table-data").html(htmlData);
  } else {
    for (let i = 0; i <= list?.length; i++) {
      if (i == list?.length) {
        $(".table-data").html(htmlData);
      } else {
        htmlData += "<tr>";
        htmlData += `<td>${paginationStart + i}</td>`;
        htmlData +=
          '<td><img src="' +
          list[i].image +
          '" alt="Image" width="50" height="50"></td>';
        htmlData += `<td>${list[i].report_title}</td>`;
        htmlData +=
          "<td>" + new Date(list[i].createddate).toLocaleDateString() + "</td>";
        htmlData +=
          `<td><a href="` +
          BASE_URL +
          `admin_master/did_you_know/addEdit?infographic_and_did_you_know_imagesid=${list[i].infographic_and_did_you_know_imagesid}" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="black"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="black"></path></svg></span></a>`;
        htmlData += `<a href="javascript:;" onclick="remove('${list[i].infographic_and_did_you_know_imagesid}');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="black"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="black"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="black"></path></svg></span></a>`;
        htmlData += "</td>";
        htmlData += "</tr>";
      }
    }
  }
}

jQuery(document).ready(function ($) {
  pagination(start); // Initial pagination
});

$(document).ready(function () {
  // Get career_jobsid from query string
  const urlParams = new URLSearchParams(window.location.search);
  const didYouKnowId = urlParams.get("infographic_and_did_you_know_imagesid");
  if (didYouKnowId) {
    // Call the view API to get job data
    $.ajax({
      type: "POST",
      url: BASE_URL + "admin_master/did_you_know/view",
      data: { id: didYouKnowId },
      success: function (response) {
        if (response.err == 0) {
          var data = response.data;
          $("#image_preview").attr("src", data.image).show();
          $("#Id").val(data.infographic_and_did_you_know_imagesid || "");
          $("#image").val(data.image || "");
          $("#report_title").val(data.report_title || "");
          $("#createddate").val(new Date(new Date(data.createddate) - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0]);
        }
      },
    });
  }
});

const imageInput1 = $("#image1");
imageInput1.on("change", function (e) {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    const file_field = "image";
    handleFileUpload(selectedFile, file_field);
  }
});

function handleFileUpload(selectedFile, file_field) {
  const formData = new FormData();
  formData.append("file", selectedFile);

  const oldImagePath = $("#image").val();
  if (oldImagePath) {
    formData.append("oldImagePath", oldImagePath);
  }

  $.ajax({
    url: BASE_URL + "admin/upload",
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {
      const imagePath = response.filePath;
      if (file_field === "image") {
        $("#image_preview").attr("src", imagePath).show();
      }
      $("#" + file_field).val(imagePath);
    },
    error: function (error) {
      console.error("Upload error:", error);
    },
  });
}
