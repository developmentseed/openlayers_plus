<?php

class openlayers_plus_behavior_tooltips extends openlayers_behavior {
  /**
   * Override of options_init().
   */
  function options_init() {
    return array('positioned' => FALSE);
  }

  /**
   * Override of options_form().
   */
  function options_form() {
    $form = parent::options_form();
    $form['positioned'] = array(
      '#type' => 'checkbox',
      '#title' => t('Position tooltip over feature'),
      '#default_value' => $this->options['positioned'],
    );
    return $form;
  }

  /**
   * Render.
   */
  function render(&$map) {
    drupal_add_js(drupal_get_path('module', 'openlayers_plus')
      . '/behaviors/openlayers_plus_behavior_tooltips.js');
    return $this->options;
  }
}
