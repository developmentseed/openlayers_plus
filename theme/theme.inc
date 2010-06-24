<?php

/**
 * Preprocessor for theme('openlayers_plus_blockswitcher').
 */
function template_preprocess_openlayers_plus_blockswitcher(&$vars) {
  drupal_add_css(drupal_get_path('module', 'openlayers_plus') . '/theme/openlayers_plus.css');
}

/**
 * Preprocessor for theme('openlayers_plus_legend').
 */
function template_preprocess_openlayers_plus_legend(&$vars) {
  drupal_add_css(drupal_get_path('module', 'openlayers_plus') . '/theme/openlayers_plus.css');
}

/**
 * Preprocessor for theme('openlayers_plus_legend').
 */
function template_preprocess_openlayers_plus_blocktoggle(&$vars) {
  drupal_add_css(drupal_get_path('module', 'openlayers_plus') . '/theme/openlayers_plus.css');
  $vars['points'] = t('Points');
  $vars['shading'] = t('Shading');
}
