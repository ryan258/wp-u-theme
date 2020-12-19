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
    $.getJSON(universityData.root_url + "/wp-json/university/v1/search?term=" + this.searchField.val(), results => {
      this.resultsDiv.html(`
        <div class="row">
          <div class="one-third">
            <h2 class="search-overlay__section-title">General Information</h2>
            ${results.generalInfo.length ? '<ul class="link-list min-list">' : "<p>No general information matches that search.</p>"}
              ${results.generalInfo.map(item => `<li><a href="${item.permalink}">${item.title}</a>${item.postType == "post" ? ` by ${item.authorName}` : ""}</li>`).join("")}
            ${results.generalInfo.length ? "</ul>" : ""}
          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Programs</h2>
            ${results.programs.length ? '<ul class="link-list min-list">' : `<p>No programs match that search. <a href="${universityData.root_url}/programs">View Programs</a> 👻</p>`}
              ${results.programs.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join("")}
            ${results.programs.length ? "</ul>" : ""}
            <h2 class="search-overlay__section-title">Professors</h2>

          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Campuses</h2>
            ${results.campuses.length ? '<ul class="link-list min-list">' : `<p>No campuses match that search. <a href="${universityData.root_url}/campuses">View Campuses</a></p>`}
              ${results.campuses.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join("")}
            ${results.campuses.length ? "</ul>" : ""}

            <h2 class="search-overlay__section-title">Events</h2>

          </div>
        </div>
      `)
      this.isSpinnerVisible = false
    })
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
