$("#addDiscountCoupon").on("click", function () {
  window.location.href = BASE_URL + "admin_master/coupon_master/add_filter";
});
function fetchAllPublisherDropdownAndPopulateDropdown() {
  jQuery.ajax({
    type: "POST",
    url: `${BASE_URL}admin_master/all_publisher/list`,
    success: function (response) {
      if (response.err == 0) {
        const allPublisher = response.data;
        populateAllPublisherDropdownDropdown(allPublisher);
      } else {
      }
    },
    error: function (xhr, status, error) {},
  });
}

function populateAllPublisherDropdownDropdown(publisher) {
  let dropdownOptions = '<option value="">Select</option>';
  publisher.forEach((publisher) => {
    dropdownOptions += `<option value="${publisher.publisher_name}">${publisher.publisher_name}</option>`;
  });
  $("#allPublisherDropdown").html(dropdownOptions);
  $("#allPublisherDropdown").html(dropdownOptions);
}

function fetchMainCategoryDropdownAndPopulateDropdown() {
  jQuery.ajax({
    type: "POST",
    url: `${BASE_URL}admin_master/all_category/list`,
    success: function (response) {
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

function fetchAllRegionDropdownAndPopulateDropdown() {
  jQuery.ajax({
    type: "POST",
    url: `${BASE_URL}admin_master/all_region/list`,
    success: function (response) {
      if (response.err == 0) {
        const allRegion = response.data;
        populateAllRegionDropdownDropdown(allRegion);
      } else {
      }
    },
    error: function (xhr, status, error) {},
  });
}

function populateAllRegionDropdownDropdown(region) {
  let dropdownOptions = '<option value="">Select</option>';
  region.forEach((region) => {
    dropdownOptions += `<option value="${region.region_id}">${region.region_name}</option>`;
  });
  $("#allRegionDropdown").html(dropdownOptions);
  $("#allRegionDropdown").html(dropdownOptions);
}

function fetchAllCountriesDropdownAndPopulateDropdown() {
  jQuery.ajax({
    type: "POST",
    url: `${BASE_URL}admin_master/all_country/list`,
    success: function (response) {
      if (response.err == 0) {
        const allCountry = response.data;
        populateAllCountriesDropdownDropdown(allCountry);
      } else {
      }
    },
    error: function (xhr, status, error) {},
  });
}

function populateAllCountriesDropdownDropdown(country) {
  let dropdownOptions = '<option value="">Select</option>';
  country.forEach((country) => {
    dropdownOptions += `<option value="${country.id}">${country.name}</option>`;
  });
  $("#allCountryDropdown").html(dropdownOptions);
  $("#allCountryDropdown").html(dropdownOptions);
}

$("#coupon_form").on("submit", function (e) {
  e.preventDefault();
  var formElement = this;
  Swal.fire({
    text: "Are you sure you want to submit?",
    icon: "warning",
    showCancelButton: true,
    buttonsStyling: false,
    confirmButtonText: "Yes, Submit!",
    cancelButtonText: "No, return",
    customClass: {
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-light",
    },
  }).then(function (result) {
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        url: BASE_URL + "admin_master/discount_coupon/add",
        data: {
          id: $("#Id").val(),
          category_name: $("#mainCategoryDropdown").val(),
          publisher_name: $("#allPublisherDropdown").val(),
          region_id: $("#allRegionDropdown").val(),
          country_id: $("#allCountryDropdown").val(),
          coupon_name: $("#coupon_name").val(),
          product_code_from: $("#product_code_from").val(),
          product_code_to: $("#product_code_to").val(),
          single_user_amount_from: $("#single_user_amount_from").val(),
          single_user_amount_to: $("#single_user_amount_to").val(),
          product_code: $("#product_code").val(),
          license: $("#license").val(),
          type: $("input[name='type']:checked").val(),
          coupon_type: $("#coupon_type").val(),
          value: $("#value").val(),
          limit_value: $("#limit_value").val(),
          product_date_start: $("#product_date_start").val(), // <-- Fix here
          product_date_end: $("#product_date_end").val(), // <-- Fix here
          show_hide: $("#show_hide").val(),
          expire_date: $("#expire_date").val(),
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
            window.location.href =
              BASE_URL + "admin_master/coupon_master/manage";
          }
        },
      });
    }
  });
});

function remove(id) {
  Swal.fire({
    text: "Are you sure you want to delete?",
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
      $.ajax({
        type: "POST",
        url: BASE_URL + "admin_master/discount_coupon/delete",
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
  $.ajax({
    type: "POST",
    url: `${BASE_URL}admin_master/discount_coupon/list/${start}/${limit}`,
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
    htmlData += `<tr><td colspan="10"><span class="fw-bold d-block fs-7">No data found!</span></td></tr>`;
    $(".table-data").html(htmlData);
  } else {
    for (let i = 0; i <= list?.length; i++) {
      if (i == list?.length) {
        $(".table-data").html(htmlData);
      } else {
        htmlData += "<tr>";
        htmlData += `<td>${paginationStart + i}</td>`;
        htmlData += `<td>${list[i].coupon_name || ""}</td>`;
        htmlData += `<td>${list[i].type || ""}</td>`;
        htmlData += `<td>${list[i].publisher_name || ""}</td>`;
        htmlData += `<td>${list[i].category_name || ""}</td>`;
        htmlData += `<td>${list[i].product_code || ""}</td>`;
        htmlData += `<td>${list[i].license || ""}</td>`;
        htmlData += `<td>${
          list[i].product_date_start
            ? new Date(list[i].product_date_start).toLocaleDateString()
            : ""
        }</td>`;
        htmlData += `<td>${
          list[i].product_date_end
            ? new Date(list[i].product_date_end).toLocaleDateString()
            : ""
        }</td>`;
        htmlData += `<td>${list[i].value || ""}</td>`;
        htmlData += `<td>${list[i].limit_value || ""}</td>`;
        htmlData += `<td>${
          list[i].createddate
            ? new Date(list[i].createddate).toLocaleDateString()
            : ""
        }</td>`;
        htmlData += `<td>${
          list[i].expire_date
            ? new Date(list[i].expire_date).toLocaleDateString()
            : ""
        }</td>`;
        htmlData +=
          `<td><a href="` +
          BASE_URL +
          `admin_master/coupon_master/add_filter?id=${list[i].couponid}" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="black"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="black"></path></svg></span></a>`;
        htmlData += `<a href="javascript:;" onclick="remove('${list[i].couponid}');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="black"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="black"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="black"></path></svg></span></a>`;
        htmlData += "</tr>";
      }
    }
  }
}

jQuery(document).ready(function ($) {
  fetchAllPublisherDropdownAndPopulateDropdown();
  fetchMainCategoryDropdownAndPopulateDropdown();
  fetchAllRegionDropdownAndPopulateDropdown();
  fetchAllCountriesDropdownAndPopulateDropdown();
  pagination(start);
});

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const couponid = urlParams.get("id");
  if (couponid) {
    $.ajax({
      type: "POST",
      url: BASE_URL + "admin_master/discount_coupon/view",
      data: { id: couponid },
      success: function (response) {
        if (response.err == 0) {
          let data = response.data;
          console.log("data: ", data);

          // Helper to format date as yyyy-mm-dd or empty
          function formatDate(dateStr) {
            const d = new Date(dateStr);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${y}-${m}-${day}`;
          }

          $("#couponid").val(data.couponid);
          $("#coupon_name").val(data.coupon_name);
          $("#allPublisherDropdown").val(data.publisher_name);
          $("#mainCategoryDropdown").val(data.category_name);
          $("#product_code_from").val(data.product_code_from);
          $("#product_code_to").val(data.product_code_to);
          $("#single_user_amount_from").val(data.single_user_amount_from);
          $("#single_user_amount_to").val(data.single_user_amount_to);
          $("#product_code").val(data.product_code);
          $("#license").val(data.license);
          // Set radio for type
          if (data.type) {
            $(`input[name='type'][value='${data.type}']`).prop("checked", true);
          }
          $("#coupon_type").val(data.coupon_type);
          $("#value").val(data.value);
          $("#limit_value").val(data.limit_value);
          $("#product_date_start").val(formatDate(data.product_date_start));
          $("#product_date_end").val(formatDate(data.product_date_end));
          $("#show_hide").val(data.show_hide);
          $("#allRegionDropdown").val(data.region_id);
          $("#allCountryDropdown").val(data.country_id);
          $("#expire_date").val(formatDate(data.expire_date));
        }
      },
    });
  }
});
