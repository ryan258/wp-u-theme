<?php

require get_theme_file_path('/inc/search-route.php');

function university_custom_rest() {
  // register_rest_field(postTypeToCustomize, nameNewField, arrayOfHowToManageThisField)
  // whatever callback fn returns will used as the value in nameNewField
  register_rest_field('post', 'authorName', array(
    'get_callback' => function() {
      return get_the_author();
    }
  ));
  // you can register as many new rest fields as you want here
  // register_rest_field('', '', array());
}
// add_action(eventNameToHookOnTo, functionToRunAsResponseToEvent)
add_action('rest_api_init', 'university_custom_rest');

function pageBanner($args = NULL) {
  if (!$args['title']) {
    $args['title'] = get_the_title();
  }

  if (!$args['subtitle']) {
    $args['subtitle'] = get_field('page_banner_subtitle');
  }

  if (!$args['photo']) {
    if (get_field('page_banner_background_image') AND !is_archive() AND !is_home() ) {
      $args['photo'] = get_field('page_banner_background_image')['sizes']['pageBanner'];
    } else {
      $args['photo'] = get_theme_file_uri('/images/ocean.jpg');
    }
  }
  ?>
  <div class="page-banner">
    <div class="page-banner__bg-image" style="background-image: url(<?php echo $args['photo']; ?>);"></div>
    <div class="page-banner__content container container--narrow">
      <!-- Get page title -->
      <h1 class="page-banner__title"><?php echo $args['title'] ?></h1>
      <div class="page-banner__intro">
        <p><?php echo $args['subtitle']; ?></p>
      </div>
    </div>  
  </div>
  <?php
}

function university_files() {
  
  wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
  wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
  wp_enqueue_script('googleMap', '//maps.googleapis.com/maps/api/js?key=AIzaSyDCmEipVZcj1NQUrDeb4ljtffUzbiqmJfc', NULL, '1.0', true);
  
  // wp_enqueue_style('university_main_styles', get_stylesheet_uri());
  if (strstr($_SERVER['SERVER_NAME'], 'critter-university.local')) {
    wp_enqueue_script('main-university-js', 'http://localhost:3000/bundled.js', NULL, '1.0', true);
  } else {
    // where we upload public assets
    wp_enqueue_script('our-vendors-js', get_theme_file_uri('/bundled-assets/vendors~scripts.8c97d901916ad616a264.js'), NULL, '1.0', true);
    wp_enqueue_script('main-university-js', get_theme_file_uri('/bundled-assets/scripts.8f756196d1cb9b154478.js'), NULL, '1.0', true);
    wp_enqueue_style('our-main-styles', get_theme_file_uri('/bundled-assets/styles.8f756196d1cb9b154478.css'));
  }

  // set a dynamic root url to take the form of whatever environment it sits in
  // then puts it in the source of the web page
  // args($nameOfMainJS, $varName, $assocArrayOfAvailableDataInJS)
  wp_localize_script('main-university-js', 'universityData', array(
    // set var for the url of current WP installation
    'root_url' => get_site_url()
    // we can build all sorts of properties in here
  ));
}

// Load our CSS & JS files
add_action('wp_enqueue_scripts', 'university_files');


// Implement dynamic page titles
function university_features() {
  // add a feature to the theme (which feature)
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_image_size('professorLandscape', 400, 260, true);
  add_image_size('professorPortrait', 480, 650, true);
  add_image_size('pageBanner', 1500, 350, true);
}

add_action('after_setup_theme', 'university_features');

// alter the query 
function university_adjust_queries($query) {
  // alter the query for the program archive
  if (!is_admin() AND is_post_type_archive('campus') AND $query->is_main_query()) {
    $query->set('posts_per_page', -1);
  }
  // alter the query for the program archive
  if (!is_admin() AND is_post_type_archive('program') AND $query->is_main_query()) {
    $query->set('orderby', 'title');
    $query->set('order', 'ASC');
    $query->set('posts_per_page', -1);
  }
  // alter the query for the events archive
  if (!is_admin() AND is_post_type_archive('event') AND $query->is_main_query()) {
    $today = date('Ymd');
    $query->set('meta_key', 'event_date');
    $query->set('orderby', 'meta_value_num');
    $query->set('order', 'ASC');
    $query->set('meta_query', array(
      array(
        'key' => 'event_date',
        'compare' => '>=',
        'value' => $today,
        'type' => 'numeric'
      ),
    ));
  }
}

// (pre_get_posts) right before WP sends it's query to the DB
add_action('pre_get_posts', 'university_adjust_queries');

function universityMapKey($api) {
  $api['key'] = 'AIzaSyDCmEipVZcj1NQUrDeb4ljtffUzbiqmJfc';
  return $api;
}

add_filter('acf/fields/google_map/api', 'universityMapKey');