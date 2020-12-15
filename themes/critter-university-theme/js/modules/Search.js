import $ from "jQuery"

class Search {
  // 1.) describe objectevery class needs a constructor! 🤗
  constructor() {
    // what executes whenever you instantiate an object
    this.openButton = $(".js-search-trigger")
    this.closeButton = $(".search-overlay__close")
    this.searchOverlay = $(".search-overlay")
    // call event listeners on load
    this.events()
    // track w/o using the DOM for performance
    this.isOverlayOpen = false
  }
  // 2.) describe events - connect the dots
  events() {
    this.openButton.on("click", this.openOverlay.bind(this))
    this.closeButton.on("click", this.closeOverlay.bind(this))
    $(document).on("keydown", this.keyPressDispatcher.bind(this))
  }

  // 3.) methods - our stock of actions
  keyPressDispatcher(e) {
    // console.log(e.keyCode)
    if (e.keyCode === 83 && !this.isOverlayOpen) {
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
