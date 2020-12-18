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
  // WP will automatically convert our data from PHP to JSON
  // so we can just focus on writing custom queries 🤗
  $professors = new WP_Query(array(
    'post_type' => 'professor'
  ));

  //define data that we want
  $professorResults  = array();
  // loop and push data to our empty array
  while ($professors->have_posts()) {
    // get the data ready and accessible
    $professors->the_post();
    // get what we want
    // array_push(arrayToAddTo, whatToAddToThatArray);
    array_push($professorResults, array(
      'title' => get_the_title(),
      'permalink' => get_the_permalink(),
    ));
  }

  // return the data we'd otherwise be looping through
  // return $professors->posts;
  return $professorResults;
}