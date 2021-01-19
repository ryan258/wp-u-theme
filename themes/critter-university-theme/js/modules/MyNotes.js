import $ from "jQuery"
// an OOP...erpective

class MyNotes {
  constructor() {
    // alert("hello from js")
    this.events()
  }

  events() {
    // make sure we bind these to the class and not the thing that was clicked
    // apply event handlers to any future rendered children
    $("#my-notes").on("click", ".delete-note", this.deleteNote)
    $("#my-notes").on("click", ".edit-note", this.editNote.bind(this))
    $("#my-notes").on("click", ".update-note", this.updateNote.bind(this))
    $(".submit-note").on("click", this.createNote.bind(this))
  }

  // Methods will go here
  editNote(e) {
    const thisNote = $(e.target).parents("li")
    if (thisNote.data("state") == "editable") {
      // make read only
      this.makeNoteReadOnly(thisNote)
    } else {
      // make editable
      this.makeNoteEditable(thisNote)
    }
  }

  makeNoteEditable(thisNote) {
    thisNote.find(".edit-note").html('<i class="fa fa-times" aria-hidden="true"></i> Cancel')
    thisNote.find(".note-title-field, .note-body-field").removeAttr("readonly").addClass("note-active-field")
    thisNote.find(".update-note").addClass("update-note--visible")
    thisNote.data("state", "editable")
  }

  makeNoteReadOnly(thisNote) {
    thisNote.find(".edit-note").html('<i class="fa fa-pencil" aria-hidden="true"></i> Edit')
    thisNote.find(".note-title-field, .note-body-field").attr("readonly", "readonly").removeClass("note-active-field")
    thisNote.find(".update-note").removeClass("update-note--visible")
    thisNote.data("state", "cancel")
  }

  deleteNote(e) {
    // alert("ok deleted")
    const thisNote = $(e.target).parents("li")
    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader("X-WP-Nonce", universityData.nonce)
      },
      url: universityData.root_url + "/wp-json/wp/v2/note/" + thisNote.data("id"),
      type: "DELETE",
      success: (response) => {
        thisNote.slideUp()
        if (response.userNoteCount < 5) {
          $(".note-limit-message").removeClass("active")
        }
        console.log("congrats!")
        console.log(response)
      },
      error: (response) => {
        console.log("beep error...!")
        console.log(response)
      }
    })
  }

  updateNote(e) {
    // alert("ok updated")
    const thisNote = $(e.target).parents("li")
    const ourUpdatedPost = {
      title: thisNote.find(".note-title-field").val(),
      content: thisNote.find(".note-body-field").val()
    }

    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader("X-WP-Nonce", universityData.nonce)
      },
      url: universityData.root_url + "/wp-json/wp/v2/note/" + thisNote.data("id"),
      type: "POST",
      data: ourUpdatedPost,
      success: (response) => {
        this.makeNoteReadOnly(thisNote)
        console.log("congrats!")
        console.log(response)
      },
      error: (response) => {
        console.log("beep error...!")
        console.log(response)
      }
    })
  }

  createNote(e) {
    // alert("ok created")
    const ourNewPost = {
      title: $(".new-note-title").val(),
      content: $(".new-note-body").val(),
      status: "publish"
    }

    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader("X-WP-Nonce", universityData.nonce)
      },
      // create a post of the type note by POSTing to this url
      url: universityData.root_url + "/wp-json/wp/v2/note/",
      type: "POST",
      data: ourNewPost,
      success: (response) => {
        $(".new-note-title, .new-note-body").val("")
        // add item to /my-notes on the fly
        $(`
        <li data-id="${response.id}">
            <input readonly class="note-title-field" type="text" value="${response.title.raw}">
            <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
            <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
            <textarea readonly class="note-body-field" name="" id="" cols="30" rows="10">${response.content.raw}</textarea>
            <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
          </li>
        `)
          .prependTo("#my-notes")
          .hide()
          .slideDown()

        console.log("congrats, new post created!")
        console.log(response)
      },
      error: (response) => {
        if (response.responseText === "You have reached your note limit!") {
          $(".note-limit-message").addClass("active")
        }
        console.log("beep error...!")
        console.log(response)
      }
    })
  }
}

export default MyNotes
