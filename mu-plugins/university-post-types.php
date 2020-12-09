<?php 

// Define custom post types
// docs - https://developer.wordpress.org/reference/functions/register_post_type/
// Dashicons - https://developer.wordpress.org/resource/dashicons/#editor-customchar
function university_post_types() {
  register_post_type('event', array(
    'public' => true,
    'labels' => array(
      'name' => 'Events',
      'add_new_item' => 'Add New Event',
      'edit_item' => 'Edit Event',
      'all_items' => 'All Events',
      'singular_name' => 'Event'
    ),
    'menu_icon' => 'dashicons-calendar-alt'
  ));
}

// We're hooking on to the init event hook to create custom post types
add_action('init', 'university_post_types');