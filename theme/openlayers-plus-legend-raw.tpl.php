<?php
// $Id$
/**
 * @param $layer_id The layer's id
 * @param $layer layer array
 * @param $raw raw html for the legend
 */
?>
<div class='legend legend-count-<?php print count($legend) ?> clear-block' id='openlayers-legend-<?php print $layer_id ?>'>
  <?php if (!empty($layer['title'])): ?>
    <h2 class='legend-title'><?php print check_plain($layer['title']) ?></h2>
  <?php endif; ?>
  <?php print $raw; ?>
</div>
