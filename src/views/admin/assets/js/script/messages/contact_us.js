var limit = 10;
var start = 1;
var levelFilterId;
let paginationStart = 1;

//digit pagination called
function pagination(start) {
    let token = localStorage.getItem("TOKEN");
    levelFilterId = $("#contact_city").val();

    paginationStart = ((start - 1) * limit) + 1
    const search = $("#search").val();
      jQuery.ajax({
          type: "POST",
          url: `${BASE_URL}admin/messages/contact_us/list/${start}/${limit}`,
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

$("#contact_city").change(function (e) {
    levelFilterId = $(this).val();
    pagination(start);
});
function html(list) {
    let htmlData = "";
    
    for (let i = 0; i < list.length; i++) {

      htmlData += "<tr>";
      htmlData += `<td>${paginationStart+i}</td>`;
      htmlData += "<td>" + list[i].contact_name + "</td>";
      htmlData += "<td>" + list[i].contact_email + "</td>";
      htmlData += "<td>" + list[i].contact_city + "</td>";
      htmlData += "<td>" + list[i].contact_phone_no + "</td>";
      htmlData += "<td>" + list[i].contact_message + "</td>";
    //   htmlData += `<a href="javascript:;" onclick="remove('${list[i]._id}');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="black"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="black"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="black"></path></svg></span></a>`;
      htmlData += "</td>";
      htmlData += "</tr>";
    }
    $(".table-data").html(htmlData);
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
