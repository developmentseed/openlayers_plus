/**
 * Implementation of Drupal behavior.
 */
Drupal.behaviors.openlayers_plus_behavior_tooltips = function(context) {
  Drupal.OpenLayersTooltips.attach(context);
};

Drupal.OpenLayersTooltips = {};

Drupal.OpenLayersTooltips.attach = function(context) {
  var data = $(context).data('openlayers');
  if (data && data.map.behaviors.openlayers_plus_behavior_tooltips) {
    // Options
    var select_method = 'select';
    if (data.map.behaviors.openlayers_plus_behavior_tooltips.positioned) {
      select_method = 'positionedSelect';
    }
    // Collect vector layers
    var vector_layers = [];
    for (var key in data.openlayers.layers) {
      var layer = data.openlayers.layers[key];
      if (layer.isVector === true) {
        vector_layers.push(layer);
      }
    }
    // Add control
    var control = new OpenLayers.Control.SelectFeature(vector_layers, {
      activeByDefault: true,
      highlightOnly: false,
      onSelect: Drupal.OpenLayersTooltips.select,
      onUnselect: Drupal.OpenLayersTooltips.unselect,
      multiple: false,
      hover: true,
      callbacks: {
        'click': Drupal.OpenLayersTooltips.click,
        'over': Drupal.OpenLayersTooltips[select_method],
        'out': Drupal.OpenLayersTooltips.unselect
      }
    });
    data.openlayers.addControl(control);
    control.activate();
  }
};

Drupal.OpenLayersTooltips.click = function(feature) {
  var html = '';
  if (feature.attributes.name) {
    html += feature.attributes.name;
  }
  if (feature.attributes.description) {
    html += feature.attributes.description;
  }
  // @TODO: Make this a behavior option and allow interaction with other
  // behaviors like the MN story popup.
  var link;
  if ($(html).is('a')) {
    link = $(html);
  }
  else if ($(html).children('a').size() > 0) {
    link = $(html).children('a')[0];
  }
  if (link) {
    var href = $(link).attr('href');
    if (Drupal.OpenLayersPermalink && Drupal.OpenLayersPermalink.addQuery) {
      href = Drupal.OpenLayersPermalink.addQuery(href);
    }
    window.location = href;
    return false;
  }
  return;
};

Drupal.OpenLayersTooltips.getToolTip = function(feature) {
  var text = "<div class='openlayers-tooltip'>";
  if (feature.attributes.name) {
    text += "<div class='openlayers-tooltip-name'>" + feature.attributes.name + "</div>";
  }
  if (feature.attributes.description) {
    text += "<div class='openlayers-tooltip-description'>" + feature.attributes.description + "</div>";
  }
  text += "</div>";
  return $(text);
}

Drupal.OpenLayersTooltips.select = function(feature) {
  var tooltip = Drupal.OpenLayersTooltips.getToolTip(feature);
  $(feature.layer.map.div).append(tooltip);
};

Drupal.OpenLayersTooltips.positionedSelect = function(feature) {
  var tooltip = Drupal.OpenLayersTooltips.getToolTip(feature);
  var point  = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);
  var offset = feature.layer.getViewPortPxFromLonLat(point);
  $(tooltip).css({zIndex: '1000', position: 'absolute', left: offset.x, top: offset.y});
  $(feature.layer.map.div).css({position:'relative'}).append(tooltip);
};

Drupal.OpenLayersTooltips.unselect = function(feature) {
  $(feature.layer.map.div).children('div.openlayers-tooltip').fadeOut('fast', function() { $(this).remove(); });
};
