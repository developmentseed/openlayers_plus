<?php

class openlayers_plus_behavior_permalink extends openlayers_behavior {
  function options_init() { return array(); }

  function render(&$map) {
    drupal_add_js(drupal_get_path('module', 'openlayers_plus') .'/behaviors/openlayers_plus_behavior_permalink.js');
    return $this->options;
  }
}