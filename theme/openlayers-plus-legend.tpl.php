<?php
// $Id$
/**
 * @param $layer_id The layer's id
 * @param $layer layer array
 * @param $legend an array of legend items
 */
?>
<div class='legend legend-count-<?php print count($legend) ?> clearfix' id='openlayers-legend-<?php print $layer_id ?>'>
  <?php if (!empty($layer['title'])): ?>
    <h2 class='legend-title'><?php print check_plain($layer['title']) ?></h2>
  <?php endif; ?>
  <?php foreach ($legend as $key => $item): ?>
    <div class='legend-item clearfix'>
      <span class='swatch' style='background-color:<?php print check_plain($item['color']) ?>'></span>
      <?php print check_plain($item['title']) ?>
    </div>
  <?php endforeach; ?>
</div>
