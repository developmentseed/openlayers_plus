<?php

class openlayers_plus_behavior_legend extends openlayers_behavior {
  function options_init() { return array(); }

  /**
   * Render.
   */
  function render(&$map) {
    drupal_add_js(drupal_get_path('module', 'openlayers_plus') .'/behaviors/openlayers_plus_behavior_legend.js');
    $options = array();
    foreach ($map['layers'] as $layer => $layer_data) {
      if (isset($layer_data['options']['legend']) && is_array($layer_data['options']['legend'])) {
        $options[$layer] = theme('openlayers_plus_legend', $layer_data['options']['legend'], $layer_data, $layer);
      }
      elseif (isset($layer_data['options']['legend'])) {
        $options[$layer] = theme('openlayers_plus_legend_raw', $layer_data['options']['legend'], $layer_data, $layer);
      }
    }
    return $options;
  }
}
