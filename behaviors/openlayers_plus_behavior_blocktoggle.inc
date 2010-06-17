<?php

class openlayers_plus_behavior_blocktoggle extends openlayers_behavior {
  /**
   * Override of options_init().
   */
  function options_init() {
    $options = parent::options_init();
    $options['map'] = array('enabled' => FALSE, 'position' => 'se');
    return $options;
  }

  /**
   * Override of options_form().
   */
  function options_form() {
    $form = parent::options_form();
    $form['map'] = array('#tree' => TRUE);
    $form['map']['enabled'] = array(
      '#type' => 'checkbox',
      '#title' => t('Show blocktoggle in map'),
      '#default_value' => $this->options['map']['enabled'],
    );

    $form['layer']['a'] = array(
      '#type' => 'select',
      '#options' => $this->map['layers'],
      '#description' => t('Select layer A'),
      '#default_value' => isset($this->options['layer']['a']) ? $this->options['layer']['a'] : NULL
    );

    $form['layer']['b'] = array(
      '#type' => 'select',
      '#options' => $this->map['layers'],
      '#description' => t('Select layer B'),
      '#default_value' => isset($this->options['layer']['b']) ? $this->options['layer']['b'] : NULL
    );

    $form['map']['position'] = array(
      '#type' => 'select',
      '#title' => t('Position'),
      '#options' => array(
        'ne' => t('Top right'), 
        'se' => t('Bottom right'), 
        'sw' => t('Bottom left'), 
        'nw' => t('Top left')),
      '#default_value' => $this->options['map']['position'],
    );
    return $form;
  }
  
  /**
   * Render.
   */
  function render(&$map) {
    drupal_add_js(drupal_get_path('module', 'openlayers_plus') 
      .'/behaviors/openlayers_plus_behavior_blocktoggle.js');
    if ($this->options['map']['enabled']) {
      $block = (object) module_invoke('openlayers_plus', 'block', 'view', 'blocktoggle');
      $block->module = 'openlayers_plus';
      $block->delta = 'blocktoggle';
      $this->options['block'] = theme('block', $block);
    }
    return $this->options;
  }
}
