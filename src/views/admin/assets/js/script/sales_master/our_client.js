$("#addOurClient").on("click", function () {
  window.location.href = BASE_URL + "admin_master/home_page/our_client_addEdit";
});

function fetchMainCategoryDropdownAndPopulateDropdown() {
  jQuery.ajax({
    type: "POST",
    url: `${BASE_URL}admin_master/category/list`,
    success: function (response) {
        console.log("category-list-response: ", response);
      if (response.err == 0) {
        const serviceParent = response.data;
        populateMainCategoryDropdownDropdown(serviceParent);
      } else {
      }
    },
    error: function (xhr, status, error) {},
  });
}

function populateMainCategoryDropdownDropdown(category) {
  let dropdownOptions = '<option value="">Select</option>';
  category.forEach((category) => {
    dropdownOptions += `<option value="${category.categoryid}">${category.categoryname}</option>`;
  });
  $("#mainCategoryDropdown").html(dropdownOptions);
  $("#mainCategoryDropdown").html(dropdownOptions);
}

// When main category changes, fetch sub-categories
$("#mainCategoryDropdown").on("change", function () {
  const categoryId = $(this).val();
  if (categoryId) {
    $.ajax({
      type: "POST",
      url: BASE_URL + "admin_master/subcategory/list",
      data: { categoryid: categoryId },
      success: function (response) {
        if (response.err == 0 && response.data.length > 0) {
          let options = '<option value="">Select</option>';
          response.data.forEach(function (sub) {
            options += `<option value="${sub.categoryid}">${sub.categoryname}</option>`;
          });
          $("#subCategoryDropdown").html(options);
        } else {
          $("#subCategoryDropdown").html('<option value="">No sub-categories</option>');
        }
      },
      error: function () {
        $("#subCategoryDropdown").html('<option value="">Error loading sub-categories</option>');
      }
    });
  } else {
    $("#subCategoryDropdown").html('<option value="">Select main category first</option>');
  }
});

$("#our_client_form").on("submit", function (e) {
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
        url: BASE_URL + "admin_master/our_client/add",
        data: {
          client_masterid: $("#Id").val(),
          image: $("#image").val(),
          categoryid: $("#mainCategoryDropdown").val(),
          sabcategoryid: $("#subCategoryDropdown").val(),
          link: $("#link").val(),
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
            formElement.reset();
            window.location.href = BASE_URL + "admin_master/home_page/our_client_list";
          }
        },
      });
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
        url: BASE_URL + "admin_master/our_client/delete",
        data: { id: id },
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
            pagination(start);
          }
        },
      });
    }
  });
}

const start = 1;
const limit = 10;

function pagination(start) {
  paginationStart = (start - 1) * limit + 1;
  jQuery.ajax({
    type: "POST",
    url: `${BASE_URL}admin_master/our_client/list/${start}/${limit}`,
    data: { start: start, limit: limit },
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
    htmlData += `<tr><td colspan="8"><span class="fw-bold d-block fs-7">No data found!</span></td></tr>`;
    $(".table-data").html(htmlData);
  } else {
    for (let i = 0; i <= list?.length; i++) {
      if (i == list?.length) {
        $(".table-data").html(htmlData);
      } else {
        htmlData += "<tr>";
        htmlData += `<td>${paginationStart + i}</td>`;
        htmlData += `<td><img src="${list[i].image}" alt="Image" width="50" height="50"></td>`;
        htmlData += `<td>${list[i].categoryid || ""}</td>`;
        htmlData += `<td>${list[i].link || ""}</td>`;
        htmlData +=
          "<td>" + new Date(list[i].createddate).toLocaleDateString() + "</td>";
        htmlData +=
          `<td><a href="` +
          BASE_URL +
          `admin_master/home_page/our_client_addEdit?client_masterid=${list[i].client_masterid}" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">✏️</a>`;
        htmlData += `<a href="javascript:;" onclick="remove('${list[i].client_masterid}');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">🗑️</a>`;
        htmlData += "</td>";
        htmlData += "</tr>";
      }
    }
  }
}

jQuery(document).ready(function ($) {
  fetchMainCategoryDropdownAndPopulateDropdown();
  pagination(start);
});

$(document).ready(function () {
  // Get client_masterid from query string
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get("client_masterid");
  if (clientId) {
    $.ajax({
      type: "POST",
      url: BASE_URL + "admin_master/our_client/view",
      data: { client_masterid: clientId },
      success: function (response) {
        if (response.err == 0) {
          var data = response.data;
          console.log("data: ", data);
          $("#image_preview").attr("src", data.image).show();
          $("#Id").val(data.client_masterid || "");
          $("#image").val(data.image || "");
          $("#postion").val(data.postion || "");
          $("#mainCategoryDropdown").val(data.categoryid || "");
          $("#link").val(data.link || "");
          if (data.categoryid) {
            $.ajax({
              type: "POST",
              url: BASE_URL + "admin_master/subcategory/list",
              data: { categoryid: data.categoryid },
              success: function (subResponse) {
                if (subResponse.err == 0 && subResponse.data.length > 0) {
                  let options = '<option value="">Select</option>';
                  subResponse.data.forEach(function (sub) {
                    options += `<option value="${sub.categoryid}">${sub.categoryname}</option>`;
                  });
                  $("#subCategoryDropdown").html(options);
                  $("#subCategoryDropdown").val(data.sabcategoryid || "");
                } else {
                  $("#subCategoryDropdown").html('<option value="">No sub-categories</option>');
                }
              },
              error: function () {
                $("#subCategoryDropdown").html('<option value="">Error loading sub-categories</option>');
              }
            });
          } else {
            $("#subCategoryDropdown").html('<option value="">Select main category first</option>');
          }
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
