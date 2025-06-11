/* global jQuery,  BASE_URL */

jQuery(document).ready(function ($) {

  
  let token = localStorage.getItem("TOKEN");
    $.ajax({
      type: "GET",
      url: BASE_URL + "admin/dashboard/count",
       headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
      data: {},
      success: function (response) {
        if (response.err !== 2) {
          const Data = response.data;
          $("#totalAppointments").text(Data.totalAppointments);
          $("#todayAppointments").text(Data.todayAppointments);
          $("#yesterdayUser").text(Data.yesterdayUser);
        }
      },
    });
  });
  