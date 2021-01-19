import $ from "jQuery"
// an OOP...erpective

class MyNotes {
  constructor() {
    // alert("hello from js")
    this.events()
  }

  events() {
    $(".delete-note").on("click", this.deleteNote)
    // make sure we bind there to the class and not the thing that was clicked
    $(".edit-note").on("click", this.editNote.bind(this))
    $(".update-note").on("click", this.updateNote.bind(this))
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
    // alert("ok deleted")
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
}

export default MyNotes
