<?php

get_header(); ?>

<div class="page-banner">
  <div class="page-banner__bg-image" style="background-image: url(<?php echo get_theme_file_uri('/images/ocean.jpg'); ?>);"></div>
  <div class="page-banner__content container container--narrow">
    <!-- Get page title the_archive_title(); -->
    <h1 class="page-banner__title">Time for Events 👻</h1>
    <div class="page-banner__intro">
      <p>See what's going on in the 🏠izzy!</p>
    </div>
  </div>  
</div>

<div class="container container--narrow page-section">
  <?php
    // loop through all posts
    while(have_posts()) {
      the_post(); 
      // use the file template-parts/content-event.php
      get_template_part('template-parts/content', 'event');  
    } wp_reset_postdata(); // runs clean for our queries
    echo paginate_links();
  ?>
  <hr class="section-break" />
  <p>Looking for past events? Check out our <a href="<?php echo site_url('/past-events'); ?>">past events archive!</a></p>
</div>

<?php get_footer(); ?>