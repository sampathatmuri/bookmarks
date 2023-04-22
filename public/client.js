$(document).ready(function () {

    // Show Add bookmark form
    $("#addBookMarkForm").on("click", function (event) {
      event.preventDefault();
      $("#editBookmarkForm").hide();
      $("#addBookmarkForm").css("display", "inline-block").show();

    });

    // Submit add bookmark form
    $("#addBookmarkForm").submit(function (event) {
      event.preventDefault();
      var bookmarkName = $("#bookmarkName").val();
      var bookmarkUrl = $("#bookmarkUrl").val();
      $.ajax({
        type: "POST",
        url: "/api/bookmarks",
        data: { name: bookmarkName, url: bookmarkUrl },
        success: function (data) {
          $('#addBookmarkForm')[0].reset();
          $("#addBookmarkForm").hide();
        },
        error: function (err) {
          console.error("Error adding bookmark: ", err);
        },
      });
    });

    // filter bookmarks

    function generateBookmarkRow(bookmark) {
      return `
  <tr>
    <div>
    <td>
      <a href="${bookmark.url}" target="_blank">${bookmark.name}</a>
    </td>
    <td>
      <button class="button2 editButton" data-id="${bookmark.id}" data-name="${bookmark.name}" data-url="${bookmark.url}">
        Edit
      </button>
      <button class="button2 deleteButton" data-name="${bookmark.name}">
        Delete
      </button>
    </td>
    </div>
  </tr>
`;
    }

    function filterBookmarks(searchTerm) {
      $.ajax({
        type: "GET",
        url: "/api/bookmark/single/search",
        data: { term: searchTerm },
        success: function (filteredBookmarks) {
          var tableRows = "";
          filteredBookmarks.forEach(function (bookmark) {
            tableRows += generateBookmarkRow(bookmark);
          });
          $("#bookmarksTable").html(tableRows);
        },
        error: function (err) {
          console.error("Error filtering bookmarks: ", err);
        },
      });
    }



    $("#searchBox").on("input", function (event) {
      var searchTerm = event.target.value.trim();
      if (searchTerm.length >= 2) {
        filterBookmarks(searchTerm);
      }
      else {
        $("#bookmarksTable tbody").html("");
      }
    });

    // Show edit bookmark form
    $("#bookmarksTable").on("click", ".editButton", function (event) {
      $("#addBookmarkForm").hide();
      event.preventDefault();
      var bookmarkId = $(this).data("name");
      var bookmarkName = $(this).data("name");
      var bookmarkUrl = $(this).data("url");
      $("#editBookmarkId").val(bookmarkId);
      $("#editBookmarkName").val(bookmarkName);
      $("#editBookmarkUrl").val(bookmarkUrl);
      $("#editBookmarkForm").show();
    });

    // Submit edit bookmark form
    $("#editBookmarkForm").submit(function (event) {
      event.preventDefault();
      var bookmarkId = $("#editBookmarkId").val();
      var bookmarkName = $("#editBookmarkName").val();
      var bookmarkUrl = $("#editBookmarkUrl").val();
      $.ajax({
        type: "PUT",
        url: "/api/bookmarks/" + bookmarkId,
        data: { name: bookmarkName, url: bookmarkUrl },
        success: function (data) {
          $("#editBookmarkForm").hide();
          $("#searchBox").val("");
        },
        error: function (err) {
          console.error("Error updating bookmark: ", err);
        },
      });
    });
     // Delete bookmark
     $("#bookmarksTable").on("click", ".deleteButton", function (event) {
        event.preventDefault();
        var bookmarkName = $(this).data("name");
        $.ajax({
          type: "DELETE",
          url: "/api/bookmarks/" + bookmarkName,
          success: function (data) {
            $("#searchBox").val("");
            $("#bookmarksTable tbody").html("");

          },
          error: function (err) {
            console.error("Error deleting bookmark: ", err);
          },
        });
      });
  });