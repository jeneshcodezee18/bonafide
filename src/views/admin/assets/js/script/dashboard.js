/* global jQuery,  BASE_URL */

jQuery(document).ready(function ($) {

    $.ajax({
      type: "GET",
      url: BASE_URL + "admin/dashboard/count",
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
  