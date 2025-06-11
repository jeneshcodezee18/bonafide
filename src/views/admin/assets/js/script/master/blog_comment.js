const start = 1;
const limit = 10;
let paginationStart = 1;
pagination(start) ;

function pagination(start) {
    let token = localStorage.getItem("TOKEN");

    const search = $("#search").val();
    const user_id = window.location.pathname.split('/')[4];
    paginationStart = ((start - 1) * limit) + 1
    jQuery.ajax({
      type: "POST",
      url: `${BASE_URL}admin/master/blog_comment/list/${user_id}/${start}/${limit}`,
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
      data: {
        start: start,
        limit: limit,
        search: search,
        user_id: user_id,
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
        console.error("Error fetching data:", error);
      },
    });
  }

function html(list) {
    let htmlData = "";
    for (let i = 0; i < list.length; i++) {
        htmlData += "<tr>";
        htmlData += `<td>${paginationStart+i}</td>`;
        htmlData += `<td>${list[i].user_name}</td>`;  
        htmlData += `<td>${list[i].user_email}</td>`;  
        htmlData += `<td>${list[i].user_message}</td>`;  
        htmlData += "<td>" + new Date(list[i].created_at).toLocaleDateString() + "</td>";
       
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