<?php

class openlayers_plus_behavior_tooltips extends openlayers_behavior {
  function options_init() { return array(); }

  /**
   * Render.
   */
  function render(&$map) {
    drupal_add_js(drupal_get_path('module', 'openlayers_plus') .'/behaviors/openlayers_plus_behavior_tooltips.js');
    return $this->options;
  }
}
