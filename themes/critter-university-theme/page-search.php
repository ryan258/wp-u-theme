<?php
  get_header();
  while(have_posts()) {
    the_post(); 
    pageBanner(array(
      // 'title' => 'I am the titliest title!',
      // 'subtitle' => 'Hi, this is the subtitle.',
      // 'photo' => 'https://image.shutterstock.com/z/stock-vector-rick-and-morty-cartoon-portal-gun-background-abstract-green-and-yellow-colors-vortex-vector-1552796555.jpg'
    ));
?>    

    <div class="container container--narrow page-section">

      
      
      <?php 
        $theParentID = wp_get_post_parent_id(get_the_ID());
        if ($theParentID) { ?>
          <div class="metabox metabox--position-up metabox--with-home-link">
            <p><a class="metabox__blog-home-link" href="<?php echo get_permalink($theParentID); ?>"><i class="fa fa-home" aria-hidden="true"></i> Back to <?php echo get_the_title($theParentID); ?></a> <span class="metabox__main"><?php the_title(); ?></span></p>
          </div>
        <?php }
      ?>

      <?php 
      $testArray = get_pages(array(
        'child_of' => get_the_ID()
      ));

      if ($theParentID or $testArray) { ?>
      <div class="page-links">
        <h2 class="page-links__title"><a href="<?php echo get_permalink($theParentID); ?>"><?php echo get_the_title($theParentID); ?></a></h2>
        <ul class="min-list">
          <?php
            if ($theParentID) {
              $findChildrenOf = $theParentID;
            } else {
              $findChildrenOf = get_the_ID();
            }
            wp_list_pages(array(
              'title_li' => NULL,
              'child_of' => $findChildrenOf,
              'sort_column' => 'menu_order'
            ));
          ?>
        </ul>
      </div>
      <?php } ?>

      <div class="generic-content">
        <?php get_search_form(); ?>
      </div>

    </div>
    
  <?php }
  get_footer();
?>

