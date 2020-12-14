<?php

get_header(); ?>

<div class="page-banner">
  <div class="page-banner__bg-image" style="background-image: url(<?php echo get_theme_file_uri('/images/ocean.jpg'); ?>);"></div>
  <div class="page-banner__content container container--narrow">
    <!-- Get page title the_archive_title(); -->
    <h1 class="page-banner__title">👻 Past Events</h1>
    <div class="page-banner__intro">
      <p>See what happened in the 🏠izzy!</p>
    </div>
  </div>  
</div>

<div class="container container--narrow page-section">
  <?php
    $today = date('Ymd');
    // define the view
    $pastEvents = new WP_Query(array(
      'paged' => get_query_var('paged', 1),
      'post_type' => 'event',
      'meta_key' => 'event_date',
      'orderby' => 'meta_value_num',
      'order' => 'ASC',
      'meta_query' => array(
        array(
          'key' => 'event_date',
          'compare' => '<',
          'value' => $today,
          'type' => 'numeric'
        ),
      ),
    ));
    // loop through all posts
    while($pastEvents->have_posts()) {
      $pastEvents->the_post(); 
      // use the file template-parts/content-event.php
      get_template_part('template-parts/content', 'event');
    } wp_reset_postdata(); // runs clean for our queries
    
    echo paginate_links(array(
      'total' => $pastEvents->max_num_pages
    ));
  ?>
</div>

<?php get_footer(); ?>