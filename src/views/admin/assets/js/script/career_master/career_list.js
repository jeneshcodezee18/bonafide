$("#addJob").on("click", function () {
  window.location.href = BASE_URL + "admin_master/career_jobs/addEdit";
});

let editor;

DecoupledEditor.create(document.querySelector("#kt_description"), {
  toolbar: [
    "heading",
    "|",
    "fontFamily",
    "fontSize",
    "fontColor",
    "fontBackgroundColor",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "alignment",
    "|",
    "link",
    "bulletedList",
    "numberedList",
    "|",
    "insertTable",
    "|",
    "blockQuote",
    "|",
    "undo",
    "redo",
    "|",
    "imageUpload",
    "mediaEmbed",
    "|",
    "selectAll",
  ],
  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      {
        model: "heading1",
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
      {
        model: "heading4",
        view: "h4",
        title: "Heading 4",
        class: "ck-heading_heading4",
      },
      {
        model: "heading5",
        view: "h5",
        title: "Heading 5",
        class: "ck-heading_heading5",
      },
      {
        model: "heading6",
        view: "h6",
        title: "Heading 6",
        class: "ck-heading_heading6",
      },
    ],
  },
  fontSize: {
    options: [10, 12, 14, "default", 18, 20, 22],
    supportAllValues: true,
  },
  menuBar: {
    isVisible: true,
  },
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableProperties",
    ],
  },
  image: {
    toolbar: [
      "imageTextAlternative",
      "imageStyle:full",
      "imageStyle:side",
      "linkImage",
      "imageResize",
    ],
    styles: ["full", "side", "alignLeft", "alignCenter", "alignRight"],
  },
  mediaEmbed: {
    previewsInData: true,
  },
  codeBlock: {
    languages: [
      { language: "plaintext", label: "Plain text" },
      { language: "html", label: "HTML" },
      { language: "css", label: "CSS" },
      { language: "javascript", label: "JavaScript" },
      // Add other languages as needed
    ],
  },
})
  .then((newEditor) => {
    editor = newEditor;
    const toolbarContainer = document.querySelector("#toolbar-container");
    toolbarContainer.appendChild(editor.ui.view.toolbar.element);

    const menuBarContainer = document.querySelector("#editor-menu-bar");
    if (editor.ui.view.menuBarView) {
      menuBarContainer.appendChild(editor.ui.view.menuBarView.element);
    }
    // Custom image upload adapter
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
  })
  .catch((error) => {
    console.error(error);
  });

$("#job_form").on("submit", function (e) {
  e.preventDefault();
  const editorContentHTML1 = editor.getData();
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
        url: BASE_URL + "admin_master/career_jobs/add",
        headers: {
          authorization: token ? `Bearer ${token}` : "",
        },
        data: {
          career_jobsid: $("#Id").val(),
          title: $("#title").val(),
          job_code: $("#job_code").val(),
          url: $("#url").val(),
          image: $("#image").val(),
          short_description: $("#short_description").val(),
          description: editorContentHTML1,
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
            formElement.reset(); // <-- Reset the form
            if (editor) editor.setData("");
            pagination(start);
          }
        },
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      console.log("User clicked on No, return");
    }
  });
});

function view(id) {
  jQuery.ajax({
    type: "POST",
    url: BASE_URL + "admin_master/career_jobs/view",
    data: {
      id: id,
    },
    success: function (response) {
      if (response.err == 0) {
        var data = response.data;
        $("#Id").val(data._id);
        $("#title").val(data.title);
        $("#job_code").val(data.job_code);
        $("#url").val(data.url);
        $("#image").val(data.image);
        $("#short_description").val(data.short_description);
        editor.setData(data.description);
      }
    },
  });
}

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
        url: BASE_URL + "admin_master/career_jobs/delete",
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
    url: `${BASE_URL}admin_master/career_jobs/list/${start}/${limit}`,
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
    error: function (xhr, status, error) {},
  });
}

function html(list) {
  console.log("list: ", list);
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
        htmlData += `<td>${list[i].title}</td>`;
        htmlData += `<td>${list[i].job_code}</td>`;
        htmlData += `<td>${list[i].description}</td>`;
        htmlData +=
          "<td>" + new Date(list[i].createddate).toLocaleDateString() + "</td>";
        htmlData +=
          `<td><a href="` +
          BASE_URL +
          `admin_master/career_jobs/addEdit?career_jobsid=${list[i].career_jobsid}" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="black"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="black"></path></svg></span></a>`;
        htmlData += `<a href="javascript:;" onclick="remove('${list[i].career_jobsid}');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="black"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="black"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="black"></path></svg></span></a>`;
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
  const jobId = urlParams.get("career_jobsid");
  if (jobId) {
    // Call the view API to get job data
    $.ajax({
      type: "POST",
      url: BASE_URL + "admin_master/career_jobs/view",
      data: { id: jobId },
      success: function (response) {
        if (response.err == 0) {
          var data = response.data;
          console.log("data: ", data);
          $("#image_preview").attr("src", data.image).show();
          $("#Id").val(data.career_jobsid || "");
          $("#title").val(data.title || "");
          $("#job_code").val(data.job_code || "");
          $("#url").val(data.url || "");
          $("#image").val(data.image || "");
          $("#short_description").val(data.short_description || "");
          if (typeof editor !== "undefined" && data.description) {
            editor.setData(data.description);
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
  console.log("oldImagePath: ", oldImagePath);
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
