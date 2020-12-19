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
        'postType' => get_post_type(),
        'authorName' => get_the_author()
      ));
    }
    
    if (get_post_type() == 'professor') {
      array_push($results['professors'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        // 0 = current post, size
        'image' => get_the_post_thumbnail_url(0, 'professorLandscape'),
      ));
    }
    
    if (get_post_type() == 'program') {
      array_push($results['programs'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'id' => get_the_ID(),
      ));
    }
    
    if (get_post_type() == 'event') {
      $eventDate = new DateTime(get_field('event_date'));

      $description = null;
      if (has_excerpt()) {
        $description = get_the_excerpt();
      } else {
        $description = wp_trim_words(get_the_content(), 18);
      }

      array_push($results['events'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'month' => $eventDate->format('M'),
        'day' => $eventDate->format('d'),
        'description' => $description
      ));
    }
    
    if (get_post_type() == 'campus') {
      array_push($results['campuses'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
      ));
    }

  }

  if ($results['programs']) {
    $programsMetaQuery = array('relation' => 'OR');
  
    foreach ($results['programs'] as $item) {
      // array_push(arrayToAddOnTo, whatToAdd)
      array_push($programsMetaQuery, array(
        // name of ACF we want to look within (field's shortname)
        'key' => 'related_programs',
        // look for numbers that are disguised as strings
        'compare' => 'LIKE',
        'value' => '"' . $item['id'] . '"'
      ));
    }
  
    $programRelationshipQuery = new WP_Query(array(
      // what we're looking for
      'post_type' => 'professor',
      // search based on the value of a custom field
      // if the query doesn't match it will just leave filter post_type to get all professors, so we'll wrap all this logic in an if statement
      'meta_query' => $programsMetaQuery
    ));
  
    while($programRelationshipQuery->have_posts()) {
      $programRelationshipQuery->the_post();
  
      if (get_post_type() == 'professor') {
        array_push($results['professors'], array(
          'title' => get_the_title(),
          'permalink' => get_the_permalink(),
          // 0 = current post, size
          'image' => get_the_post_thumbnail_url(0, 'professorLandscape'),
        ));
      }
    }
  
    // SORT_REGULAR to play nicely with associative arrays, look within each sub items of an array to determine duplicate or not
    // array_value() - removes the key
    $results['professors'] = array_values(array_unique($results['professors'], SORT_REGULAR));
  }


  // return the data we'd otherwise be looping through
  // return $professors->posts;
  return $results;
}