import $ from "jQuery"

class Search {
  // 1.) describe objectevery class needs a constructor! 🤗
  constructor() {
    // what executes whenever you instantiate an object
    this.resultsDiv = $("#search-overlay__results")
    this.openButton = $(".js-search-trigger")
    this.closeButton = $(".search-overlay__close")
    this.searchOverlay = $(".search-overlay")
    this.searchField = $("#search-term")
    // call event listeners on load
    this.events()
    // track w/o using the DOM for performance
    this.isOverlayOpen = false
    this.isSpinnerVisible = false
    this.previousValue
    this.typingTimer
  }
  // 2.) describe events - connect the dots
  events() {
    this.openButton.on("click", this.openOverlay.bind(this))
    this.closeButton.on("click", this.closeOverlay.bind(this))
    $(document).on("keydown", this.keyPressDispatcher.bind(this))
    this.searchField.on("keyup", this.typingLogic.bind(this))
  }

  // 3.) methods - our stock of actions
  typingLogic() {
    if (this.searchField.val() != this.previousValue) {
      clearTimeout(this.typingTimer) // reset timer with each keydown
      if (this.searchField.val()) {
        if (!this.isSpinnerVisible) {
          this.resultsDiv.html("<div class='spinner-loader'></div>")
          this.isSpinnerVisible = true
        }
        this.typingTimer = setTimeout(this.getResults.bind(this), 2000)
      } else {
        this.resultsDiv.html("")
        this.isSpinnerVisible = false
      }
    }
    this.previousValue = this.searchField.val()
  }

  getResults(e) {
    // this.resultsDiv.html("imagine content")
    // this.isSpinnerVisible = false
    $.getJSON(universityData.root_url + "/wp-json/wp/v2/posts?search=" + this.searchField.val(), posts => {
      // alert(posts[0].title.rendered)
      this.resultsDiv.html(`
        <h2 class="search-overlay__section-title">General Information</h2>
        ${posts.length ? '<ul class="link-list min-list">' : "<p>No general information matches that search.</p>"}
          ${posts.map(item => `<li><a href="${item.link}">${item.title.rendered}</a></li>`).join("")}
        ${posts.length ? "</ul>" : ""}
      `)
      this.isSpinnerVisible = false
    })
  }

  keyPressDispatcher(e) {
    // console.log(e.keyCode)
    if (e.keyCode === 83 && !this.isOverlayOpen && !$("input, textarea").is(":focus")) {
      this.openOverlay()
    }
    if (e.keyCode === 27 && this.isOverlayOpen) {
      this.closeOverlay()
    }
  }

  openOverlay() {
    this.searchOverlay.addClass("search-overlay--active")
    $("body").addClass("body-no-scroll")
    // console.log("opening...")
    this.isOverlayOpen = true
  }

  closeOverlay() {
    this.searchOverlay.removeClass("search-overlay--active")
    $("body").removeClass("body-no-scroll")
    // console.log("closing...")
    this.isOverlayOpen = false
  }
}

export default Search
