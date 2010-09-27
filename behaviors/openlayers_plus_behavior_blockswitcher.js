/**
 * Implementation of Drupal behavior.
 */
Drupal.behaviors.openlayers_plus_behavior_blockswitcher = function(context) {
  Drupal.OpenLayersPlusBlockswitcher.attach(context);
};

/**
 * Blockswitcher is **NOT** an OpenLayers control.
 */
Drupal.OpenLayersPlusBlockswitcher = {};
Drupal.OpenLayersPlusBlockswitcher.layerStates = [];

/**
 * Initializes the blockswitcher and attaches to DOM elements.
 */
Drupal.OpenLayersPlusBlockswitcher.attach = function(context) {
  var data = $(context).data('openlayers');
  if (data && data.map.behaviors.openlayers_plus_behavior_blockswitcher) {
    this.map = data.openlayers;
    this.overlay_style = (data.map.behaviors.openlayers_plus_behavior_blockswitcher.map.overlay_style) ? 
      data.map.behaviors.openlayers_plus_behavior_blockswitcher.map.overlay_style : 'checkbox';
    

    // If behavior has requested display inside of map, respect it.
    if (data.map.behaviors.openlayers_plus_behavior_blockswitcher.map.enabled == true) {
      var block = $(data.map.behaviors.openlayers_plus_behavior_blockswitcher.block);
      block.addClass(data.map.behaviors.openlayers_plus_behavior_blockswitcher.map.position);
      $('.block-title', block).click(function() {
        $(this).parents('div.block').toggleClass('expanded');
        $(this).siblings('div.block-content').toggle();
      });

      $(context).append(block);

      if (data.map.behaviors.openlayers_plus_behavior_blockswitcher.map.open == true) {
        $('.block-title', block).click();
      }
    }

    this.blockswitcher = $('div.openlayers-blockswitcher');

    // Don't propagate click events to the map
    // this doesn't catch events that are below the layer list
    $('div.openlayers-blockswitcher').mousedown(function(evt) {
      OpenLayers.Event.stop(evt);
    });

    data.openlayers.events.on({
      "addlayer": this.redraw,
      "changelayer": this.redraw,
      "removelayer": this.redraw,
      "changebaselayer": this.redraw,
      scope: this
    });

    this.redraw();
  }
};

/**
 * Checks if the layer state has changed since the last redraw() call.
 *
 * Returns:
 * {Boolean} The layer state changed since the last redraw() call.
 */
Drupal.OpenLayersPlusBlockswitcher.needsRedraw = function() {
  if ( !this.layerStates.length || (this.map.layers.length != this.layerStates.length) ) {
    return true;
  }
  for (var i=0, len=this.layerStates.length; i<len; i++) {
    var layerState = this.layerStates[i];
    var layer = this.map.layers[i];
    if ( (layerState.name != layer.name) || (layerState.inRange != layer.inRange) || (layerState.id != layer.id) || (layerState.visibility != layer.visibility) ) {
      return true;
    }
  }
  return false;
};

/**
 * Redraws the blockswitcher to reflect the current state of layers.
 */
Drupal.OpenLayersPlusBlockswitcher.redraw = function() {
  if (this.needsRedraw()) {
    // Clear out previous layers
    $('.layers.base .layers-content div', this.blockswitcher).remove();
    $('.layers.data .layers-content div', this.blockswitcher).remove();
    $('.layers.base', this.blockswitcher).hide();
    $('.layers.data', this.blockswitcher).hide();

    // Save state -- for checking layer if the map state changed.
    // We save this before redrawing, because in the process of redrawing
    // we will trigger more visibility changes, and we want to not redraw
    // and enter an infinite loop.
    var len = this.map.layers.length;
    this.layerStates = new Array(len);
    for (var i = 0; i < len; i++) {
      var layerState = this.map.layers[i];
      this.layerStates[i] = {'name': layerState.name, 'visibility': layerState.visibility, 'inRange': layerState.inRange, 'id': layerState.id};
    }

    var layers = this.map.layers.slice();
    for (i = 0, len = layers.length; i < len; i++) {
      var layer = layers[i];
      var baseLayer = layer.isBaseLayer;
      if (layer.displayInLayerSwitcher) {
        // Only check a baselayer if it is *the* baselayer, check data layers if they are visible
        var checked = baseLayer ? (layer === this.map.baseLayer) : layer.getVisibility();

        // Create input element
        var inputType = (baseLayer) ? "radio" : this.overlay_style;
        
        var inputElem = $('.factory .'+ inputType, this.blockswitcher).clone();

        // Append to container
        var container = baseLayer ? $('.layers.base', this.blockswitcher) : $('.layers.data', this.blockswitcher);
        container.show();
        $('.layers-content', container).append(inputElem);

        // Set label text
        $('label', inputElem).append((layer.title !== undefined) ? layer.title : layer.name);

        // Add states and click handler
        if (baseLayer) {
          $(inputElem)
            .click(function() { Drupal.OpenLayersPlusBlockswitcher.layerClick(this); })
            .data('layer', layer);
          if (checked) {
            $(inputElem).addClass('activated');
          }
        }
        else {
          if (this.overlay_style == 'checkbox') {
            $('input', inputElem)
              .click(function() { Drupal.OpenLayersPlusBlockswitcher.layerClick(this); })
              .data('layer', layer)
              .attr('disabled', !baseLayer && !layer.inRange)
              .attr('checked', checked);
          }
          else if(this.overlay_style == 'radio') {
            $(inputElem)
              .click(function() { Drupal.OpenLayersPlusBlockswitcher.layerClick(this); })
              .data('layer', layer)
              .attr('disabled', !layer.inRange);
            if (checked) {
              $(inputElem).addClass('activated');
            }
          }
          // Set key styles
          if (layer.styleMap) {
            css = this.styleMapToCSS(layer.styleMap);
            $('span.key', inputElem).css(css);
          }
        }
      }
    }
  }
};

/**
 * Click handler that activates or deactivates a layer.
 */
Drupal.OpenLayersPlusBlockswitcher.layerClick = function(element) {
  var layer = $(element).data('layer');
  if (layer.isBaseLayer) {
    $('.layers.base .layers-content .activated').removeClass('activated');
    $(element).addClass('activated');
    layer.map.setBaseLayer(layer);
  }
  else if (this.overlay_style == 'radio') {
    $('.layers.data .layers-content .activated').removeClass('activated');
    $.each(this.map.getLayersBy('isBaseLayer', false),
      function() {
        if(this.CLASS_NAME !== 'OpenLayers.Layer.Vector.RootContainer' &&
           this.displayInLayerSwitcher) {
          this.setVisibility(false);
        }
      }
    );
    layer.setVisibility(true);
    $(element).addClass('activated');
  }
  else {
    layer.setVisibility($(element).is(':checked'));
  }
};

/**
  * Parameters:
  * styleMap {OpenLayers.StyleMap}
  *
  * Returns:
  * {Object} An object with css properties and values that can be applied to an element
  *
  */
Drupal.OpenLayersPlusBlockswitcher.styleMapToCSS = function (styleMap) {
  css = {};
  default_style = styleMap.styles['default'].defaultStyle;
  if (default_style.fillColor === 'transparent' && typeof default_style.externalGraphic != 'undefined') {
    css['background-image'] = 'url('+default_style.externalGraphic+')';
    css['background-repeat'] = 'no-repeat';
    css['background-color'] = 'transparent';
    css.width = default_style.pointRadius * 2;
    css.height = default_style.pointRadius * 2;
  }
  else {
    css['background-color'] = default_style.fillColor;
  }
  if (default_style.strokeWidth > 0) {
    css['border-color'] = default_style.strokeColor;
  }
  return css;
};
