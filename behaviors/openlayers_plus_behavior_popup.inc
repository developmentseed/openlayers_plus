<?php

class openlayers_plus_behavior_popup extends openlayers_behavior {
  /**
   * Render.
   */
  function render(&$map) {
    drupal_add_js(drupal_get_path('module', 'openlayers_plus')
      . '/behaviors/openlayers_plus_behavior_popup.js');
    return $this->options;
  }
}
