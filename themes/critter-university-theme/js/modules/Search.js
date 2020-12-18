import $ from "jQuery"

class Search {
  // 1.) describe object - every class needs a constructor! 🤗
  constructor() {
    // what executes whenever you instantiate an object
    this.addSearchHTML() // put elements into existance first
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
  // 2.) describe events - connect the dots - bind those class methods 👻
  events() {
    this.openButton.on("click", this.openOverlay.bind(this))
    this.closeButton.on("click", this.closeOverlay.bind(this))
    $(document).on("keydown", this.keyPressDispatcher.bind(this))
    this.searchField.on("keyup", this.typingLogic.bind(this))
  }

  // 3.) methods - our stock of actions
  typingLogic() {
    // if there is a change in the value of the search, reset timer & run again
    if (this.searchField.val() != this.previousValue) {
      clearTimeout(this.typingTimer) // reset timer with each keydown
      if (this.searchField.val()) {
        if (!this.isSpinnerVisible) {
          this.resultsDiv.html("<div class='spinner-loader'></div>")
          this.isSpinnerVisible = true
        }
        this.typingTimer = setTimeout(this.getResults.bind(this), 750)
      } else {
        this.resultsDiv.html("")
        this.isSpinnerVisible = false
      }
    }
    this.previousValue = this.searchField.val()
  }

  getResults(e) {
    $.when(
      // no need for callback in getJSON w/ when/then methods
      // here we'll use that root_url variable we set in the functions.php
      $.getJSON(universityData.root_url + "/wp-json/wp/v2/posts?search=" + this.searchField.val()),
      $.getJSON(universityData.root_url + "/wp-json/wp/v2/pages?search=" + this.searchField.val())
    ).then(
      // mash together the results of the calls
      (posts, pages) => {
        let combinedResults = posts[0].concat(pages[0]) // the mashup of posts and pages in a single array
        // render results to html
        this.resultsDiv.html(`
          <h2 class="search-overlay__section-title">General Information</h2>
          ${combinedResults.length ? '<ul class="link-list min-list">' : "<p>No general information matches that search.</p>"}
            ${combinedResults.map(item => `<li><a href="${item.link}">${item.title.rendered}</a>${item.type == "post" ? ` by ${item.authorName}` : ""}</li>`).join("")}
          ${combinedResults.length ? "</ul>" : ""}
        `)
        this.isSpinnerVisible = false
      },
      () => {
        // handle the error if getJSON doesn't work
        this.resultsDiv.html("<p>Unexpected error 👻; please try again 👍</p>")
      }
    )
  }

  // open close search window with keyboard shortcuts
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
    this.searchField.val("")
    setTimeout(() => this.searchField.focus(), 301)
    // console.log("opening...")
    this.isOverlayOpen = true
  }
  closeOverlay() {
    this.searchOverlay.removeClass("search-overlay--active")
    $("body").removeClass("body-no-scroll")
    // console.log("closing...")
    this.isOverlayOpen = false
  }
  // just render HTML for the search box
  addSearchHTML() {
    $("body").append(`
      <div class="search-overlay">
        <div class="search-overlay__top">
          <div class="container">
            <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
            <input type="text" id="search-term" class="search-term" placeholder="What are you looking for?" autocomplete="off">
            <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
          </div>
        </div>
        <div class="container">
          <div id="search-overlay__results"></div>
        </div>
      </div>
    `)
  }
}

export default Search
