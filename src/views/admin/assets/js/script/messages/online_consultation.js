var limit = 10;
var start = 1;
let paginationStart = 1;

//digit pagination called
function pagination(start) {
    let token = localStorage.getItem("TOKEN");

    paginationStart = ((start - 1) * limit) + 1
    const search = $("#search").val();
      jQuery.ajax({
          type: "POST",
          url: `${BASE_URL}admin/messages/online_consultation/list/${start}/${limit}`,
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
                  html(data.list || []);
              }
          },
          error: function (xhr, status, error) {
          }
      });
  }
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
          htmlData += "<td>" + new Date(list[i].consultation_date).toLocaleDateString()+ "</td>";
          htmlData += "<td>" + list[i].patient_message + "</td>";
          htmlData += "</td>";
          htmlData += "</tr>";
        }
      }
    }
  }

jQuery(document).ready(function ($) {
  pagination(start);
});