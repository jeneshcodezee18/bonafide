$("#addEmailTemplate").on("click", function () {
  window.location.href = BASE_URL + "admin_master/email_template/addEdit";
});

let editor;

DecoupledEditor.create(document.querySelector("#kt_email_body"), {
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

$("#email_template_form").on("submit", function (e) {
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
      jQuery.ajax({
        type: "POST",
        url: BASE_URL + "admin_master/email_template/add",
        data: {
          templateid: $("#Id").val(),
          subject: $("#subject").val(),
          from_email: $("#from_email").val(),
          reply_email: $("#reply_email").val(),
          email_body: editorContentHTML1,
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
              BASE_URL + "admin_master/email_template/manage";
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
        url: BASE_URL + "admin_master/email_template/delete",
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
    url: `${BASE_URL}admin_master/email_template/list/${start}/${limit}`,
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
    htmlData += `<tr><td colspan="7"><span class="fw-bold d-block fs-7">No data found!</span></td></tr>`;
    $(".table-data").html(htmlData);
  } else {
    for (let i = 0; i <= list?.length; i++) {
      if (i == list?.length) {
        $(".table-data").html(htmlData);
      } else {
        htmlData += "<tr>";
        htmlData += `<td>${paginationStart + i}</td>`;
        htmlData += `<td>${list[i].subject}</td>`;
        htmlData += `<td>${list[i].from_email}</td>`;
        htmlData += `<td>${list[i].reply_email}</td>`;
        htmlData +=
          `<td><a href="` +
          BASE_URL +
          `admin_master/email_template/addEdit?templateid=${list[i].templateid}" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">✏️</a>`;
        htmlData += `<a href="javascript:;" onclick="remove('${list[i].templateid}');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">🗑️</a>`;
        htmlData += "</td>";
        htmlData += "</tr>";
      }
    }
  }
}

jQuery(document).ready(function ($) {
  pagination(start);
});

$(document).ready(function () {
  // Get templateid from query string
  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get("templateid");
  if (templateId) {
    $.ajax({
      type: "POST",
      url: BASE_URL + "admin_master/email_template/view",
      data: { templateid: templateId },
      success: function (response) {
        if (response.err == 0) {
          var data = response.data;
          $("#Id").val(data.templateid || "");
          $("#subject").val(data.subject || "");
          $("#from_email").val(data.from_email || "");
          $("#reply_email").val(data.reply_email || "");
          if (typeof editor !== "undefined" && data.email_body) {
            editor.setData(data.email_body);
          }
        }
      },
    });
  }
});
