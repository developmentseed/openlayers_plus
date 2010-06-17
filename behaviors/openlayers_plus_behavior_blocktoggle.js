/**
 * Implementation of Drupal behavior.
 */
Drupal.behaviors.openlayers_plus_behavior_blocktoggle = function(context) {
  Drupal.OpenLayersPlusBlocktoggle.attach(context);
};

/**
 * Blocktoggle is **NOT** an OpenLayers control.
 */
Drupal.OpenLayersPlusBlocktoggle = {};
Drupal.OpenLayersPlusBlocktoggle.layerStates = [];

/**
 * Initializes the blocktoggle and attaches to DOM elements.
 */
Drupal.OpenLayersPlusBlocktoggle.attach = function(context) {
  var data = $(context).data('openlayers');
  if (data && data.map.behaviors.openlayers_plus_behavior_blocktoggle) {
    this.map = data.openlayers;
    this.layer_a = this.map.getLayersBy('drupalID', 
      data.map.behaviors.openlayers_plus_behavior_blocktoggle.layer.a)[0]; 
    this.layer_b = this.map.getLayersBy('drupalID', 
      data.map.behaviors.openlayers_plus_behavior_blocktoggle.layer.b)[0]; 

    // If behavior has requested display inside of map, respect it.
    if (data.map.behaviors.openlayers_plus_behavior_blocktoggle.map.enabled == true) {
      var block = $(data.map.behaviors.openlayers_plus_behavior_blocktoggle.block);

      block.addClass(data.map.behaviors.openlayers_plus_behavior_blocktoggle.map.position);
      $(context).append(block);
    }

    this.blocktoggle = $('div.openlayers-blocktoggle');
    this.blocktoggle.data('layer_a', this.layer_a);
    this.blocktoggle.data('layer_b', this.layer_b);

    // Don't propagate click events to the map
    // this doesn't catch events that are below the layer list
    $('div.openlayers-blocktoggle *').mousedown(function(evt) {
      OpenLayers.Event.stop(evt);
    });

    $('div.openlayers-blocktoggle').toggle(
      function() {
        $(this).data('layer_a').setVisibility(false);
        $(this).data('layer_b').setVisibility(true);
        $(this).find('.openlayers-blocktoggle-a').removeClass('activated');
        $(this).find('.openlayers-blocktoggle-b').addClass('activated');
      },
      function() {
        $(this).data('layer_b').setVisibility(false);
        $(this).data('layer_a').setVisibility(true);
        $(this).find('.openlayers-blocktoggle-b').removeClass('activated');
        $(this).find('.openlayers-blocktoggle-a').addClass('activated');
      }
    );

    data.openlayers.events.on({
      "addlayer": this.redraw,
      "changelayer": this.redraw,
      "removelayer": this.redraw,
      "changebaselayer": this.redraw,
      scope: this
    });
  }
};

/**
 * Checks if the layer state has changed since the last redraw() call.
 *
 * Returns:
 * {Boolean} The layer state changed since the last redraw() call.
 */
Drupal.OpenLayersPlusBlocktoggle.needsRedraw = function() {
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
 * Redraws the blocktoggle to reflect the current state of layers.
 */
Drupal.OpenLayersPlusBlocktoggle.redraw = function() {
  if (this.needsRedraw()) {
    // Clear out previous layers
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
        // Append to container
        /*
        $(inputElem)
          .click(function() { Drupal.OpenLayersPlusBlocktoggle.layerClick(this); })
          .data('layer', layer)
          .attr('disabled', !layer.inRange);
        if (checked) {
          $(inputElem).addClass('activated');
        }
        */
        }
     }
  }
};
