import $ from "jQuery"
// an OOP...erpective

class MyNotes {
  constructor() {
    // alert("hello from js")
    this.events()
  }

  events() {
    $(".delete-note").on("click", this.deleteNote)
  }

  // Methods will go here
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
}

export default MyNotes
