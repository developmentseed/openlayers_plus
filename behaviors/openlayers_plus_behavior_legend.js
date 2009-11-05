/**
 * Implementation of Drupal behavior.
 */
Drupal.behaviors.openlayers_plus_behavior_legend = function(context) {
  Drupal.OpenLayersPlusLegend.attach(context);
};

Drupal.OpenLayersPlusLegend = {};

Drupal.OpenLayersPlusLegend.attach = function(context) {
  var data = $(context).data('openlayers');
  if (data && data.map.behaviors.openlayers_plus_behavior_legend) {
    var layer, i;
    for (i in data.openlayers.layers) {
      layer = data.openlayers.layers[i];
      if (data.map.behaviors.openlayers_plus_behavior_legend[layer.name]) {
        if (!$('div.openlayers-legends', context).size()) {
          $(context).append("<div class='openlayers-legends'></div>");
        }
        layer.events.register('visibilitychanged', layer, Drupal.OpenLayersPlusLegend.setLegend);
      }
    }
  }
};

Drupal.OpenLayersPlusLegend.setLegend = function(layer) {
  var name = layer.object.name;
  var map = $(layer.object.map.div);
  var data = map.data('openlayers');
  var legend = data.map.behaviors.openlayers_plus_behavior_legend[name];
  var legends = $('div.openlayers-legends', map);
  if (layer.object.visibility && !$('#openlayers-legend-'+ name, legends).size()) {
    legends.append(legend);
  }
  else if (!layer.object.visibility) {
    $('#openlayers-legend-'+name, legends).remove();
  }
};
