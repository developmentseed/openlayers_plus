<?php

class openlayers_plus_behavior_blockswitcher extends openlayers_behavior {
  /**
   * Override of options_init().
   */
  function options_init() {
    $options = parent::options_init();
    $options['map'] = array(
      'enabled' => FALSE,
      'open' => TRUE,
      'overlay_style' => 'checkbox',
      'position' => 'se');
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
      '#title' => t('Show blockswitcher in map'),
      '#default_value' => $this->options['map']['enabled'],
    );
    $form['map']['open'] = array(
      '#type' => 'checkbox',
      '#title' => t('Show blockswitcher open when the map loads'),
      '#default_value' => $this->options['map']['open'],
    );
    $form['map']['overlay_style'] = array(
      '#type' => 'select',
      '#title' => t('Show overlay layers as checkboxes or radio buttons'),
      '#options' => array(
        'checkbox' => t('Checkboxes'),
        'radio' => t('Radio Buttons')),
      '#default_value' => $this->options['map']['overlay_style'],
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
      .'/behaviors/openlayers_plus_behavior_blockswitcher.js');
    if ($this->options['map']['enabled']) {
      $block = (object) module_invoke('openlayers_plus',
        'block',
        'view',
        'blockswitcher');
      $block->module = 'openlayers_plus';
      $block->delta = 'blockswitcher';
      $this->options['block'] = theme('block', $block);
    }
    return $this->options;
  }
}
