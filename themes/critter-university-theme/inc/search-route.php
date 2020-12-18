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
function universitySearchResults($data) {
  // WP will automatically convert our data from PHP to JSON
  // so we can just focus on writing custom queries 🤗
  $mainQuery = new WP_Query(array(
    'post_type' => array(
      'post',
      'page',
      'professor',
      'program',
      'campus',
      'event'
    ),
    // 's' stands for search, special query prop, and rock a parameter
    // look in the data array for term, we own the naming scheme
    // wp-json/university/v1/search?term=dr
    // ALWAYS SANITIZE USER INPUT!
    's' => sanitize_text_field($data['term'])
  ));

  //define data that we want
  $results  = array(
    'generalInfo' => array(),
    'professors' => array(),
    'programs' => array(),
    'events' => array(),
    'campuses' => array()
  );
  // loop and push data to our empty array
  while ($mainQuery->have_posts()) {
    // get the data ready and accessible
    $mainQuery->the_post();
    // get what we want
    // array_push(arrayToAddTo, whatToAddToThatArray);
    if (get_post_type() == 'post' OR get_post_type() == 'page') {
      array_push($results['generalInfo'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
      ));
    }
    
    if (get_post_type() == 'professor') {
      array_push($results['professors'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
      ));
    }
    
    if (get_post_type() == 'program') {
      array_push($results['programs'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
      ));
    }
    
    if (get_post_type() == 'event') {
      array_push($results['events'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
      ));
    }
    
    if (get_post_type() == 'campus') {
      array_push($results['campuses'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
      ));
    }

  }

  // return the data we'd otherwise be looping through
  // return $professors->posts;
  return $results;
}