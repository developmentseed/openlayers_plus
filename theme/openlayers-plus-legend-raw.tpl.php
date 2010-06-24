<?php
// $Id$
/**
 * @param $layer_id The layer's id
 * @param $layer layer array
 * @param $raw raw html for the legend
 */
?>
<div class='legend legend-count-<?php print count($legend) ?> clear-block' id='openlayers-legend-<?php print $layer_id ?>'>
  <?php print $raw; ?>
</div>
