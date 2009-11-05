<div class='legend clear-block' id='openlayers-legend-<?php print $layer ?>'>
  <?php foreach ($legend as $key => $item): ?>
    <div class='legend-item clear-block'>
      <span class='swatch' style='background-color:<?php print $item['color'] ?>'></span>
      <?php print $item['title'] ?>
    </div>
  <?php endforeach; ?>
</div>
