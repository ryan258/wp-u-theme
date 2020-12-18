<?php

add_action('rest_api_init', 'universityRegisterSearch');

function universityRegisterSearch() {

  // register_rest_route(nameSpace:ie 'wp/v2', route, arrayOfWhatHappensAtUrl);
  register_rest_route('university/v1', 'search', array(
    // methods here, think CRUD
    // 'methods' => 'GET', but a safer way to do it is with the following
    'methods' => WP_REST_SERVER::READABLE,
    // whatever this fn returns will be the data that is returned
    'callback' => 'universitySearchResults'
  ));
}

// create that callback function
function universitySearchResults() {
  return 'Congrats you have a working route!';
}