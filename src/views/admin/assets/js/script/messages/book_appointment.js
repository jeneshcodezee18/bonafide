var limit = 10;
var start = 1;
var levelFilterId;
let paginationStart = 1;

//digit pagination called
function pagination(start) {
    let token = localStorage.getItem("TOKEN");
    levelFilterId = $("#branch_city").val();

    paginationStart = ((start - 1) * limit) + 1
    const search = $("#search").val();
      jQuery.ajax({
          type: "POST",
          url: `${BASE_URL}admin/messages/book_appointment/list/${start}/${limit}`,
          headers: {
            authorization: token ? `Bearer ${token}` : "",
          },
          data: {
            start: start,
            limit: limit,
            search: search,
            Filter: levelFilterId,
  
          },
          success: function (response) {
              if (response.err == 0) {
                  const data = response.data;
                  $(".pagination").html(data.html);
                  $(".pagination-text").html(data.text);
                  html(data.list || []);
              }
          },
          error: function (xhr, status, error) {
              // console.log("status: ", status);
          }
      });
  }

$("#branch_city").change(function (e) {
    levelFilterId = $(this).val();
    pagination(start);
});
function html(list) {
    let htmlData = "";
    if (list.length == 0 ) {
      htmlData += `<tr><td colspan="12"><span class="fw-bold d-block fs-7">No data found!</span></td></tr>`;
      $(".table-data").html(htmlData);
  
    } else {
      for (let i = 0; i <= list?.length; i++) {
        if (i == list?.length) {
          $(".table-data").html(htmlData);
        } else {
          htmlData += "<tr>";
          htmlData += `<td>${paginationStart+i}</td>`;
          htmlData += "<td>" + list[i].patient_name + "</td>";
          htmlData += "<td>" + list[i].patient_phone_no + "</td>";
          htmlData += "<td>" + list[i].patient_city + "</td>";
          htmlData += "<td>" + list[i].branch_city + "</td>";
          htmlData += "<td>" + new Date(list[i].appointment_date).toLocaleDateString()+ "</td>";
          htmlData += "<td>" + list[i].patient_message + "</td>";
          htmlData += "</td>";
          htmlData += "</tr>";
        }
      }
    }
  }

jQuery(document).ready(function ($) {
  pagination(start);
  $(document).on("hide.bs.modal", "#edit-modal", function () {
    $("#Id").val("");
  });
});

function remove(id) {
  Swal.fire({
    text: "Are you sure you would like to delete?",
    icon: "warning",
    showCancelButton: true,
    buttonsStyling: false,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, return",
    customClass: {
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-light",
    },
  }).then(function (result) {
    if (result.value) {
      $.ajax({
        type: "POST",
        url: BASE_URL + "admin/setting/message/delete",
        data: {
          id: id,
        },
        success: function (response) {
          if (response.err == 1) {
            Swal.fire({
              text: response.msg,
              icon: "error",
              buttonsStyling: !1,
              confirmButtonText: "Ok, got it!",
              customClass: {
                confirmButton: "btn btn-primary",
              },
            });
          } else {
            Swal.fire({
              text: response.msg,
              icon: "success",
              buttonsStyling: !1,
              confirmButtonText: "Ok, got it!",
              customClass: {
                confirmButton: "btn btn-primary",
              },
            });
            start = 1;
            pagination(start);
          }
        },
      });
    }
  });
}
