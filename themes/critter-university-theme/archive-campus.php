<?php

get_header(); 

pageBanner(array(
  'title' => 'Our Campuses',
  'subtitle' => 'There is a place for everyone.'
));

?>
<div class="container container--narrow page-section">
  <div class="acf-map">
  <?php
    // loop through all posts
    while(have_posts()) {
      the_post(); 
      $mapLocation = get_field('map_location')
      ?>
      <div class="marker" data-lat="<?php echo $mapLocation['lat']; ?>" data-lng="<?php echo $mapLocation['lng']; ?>"></div>
    <?php } wp_reset_postdata(); // runs clean for our queries
    echo paginate_links();
  ?>
  </div>
</div>

<?php get_footer(); ?>