`openlayers_plus` is a collection of behaviors that work with 
[the Drupal OpenLayers module](http://drupal.org/project/openlayers),
version 2 and up. This module requires the OpenLayers module, but not 
vice versa.

This provides the following functionality:

* BlockSwitcher: a clone of [LayerSwitcher](http://dev.openlayers.org/docs/files/OpenLayers/Control/LayerSwitcher-js.html), with better themability and positioning via the Drupal block system.
* BlockToggle: a version of BlockSwitcher that toggles between two different layers only. Useful for situations in which layers represent the same data in slightly different ways.
* Legend: a block in a corner of a map that provides information on layers.
* Permalink: a version of [Permalink](http://dev.openlayers.org/docs/files/OpenLayers/Control/Permalink-js.html) optimized to persist layers between pages with different layer setups and without explicitly using the control.
* Popup: an interaction with point-based, clustered maps that allows clicking on points that results in scanning between items.
* Tooltip: an interaction with point-based maps that results in following links on hover.
* Scale Points: dynamic styling, changing point radii based on a certain value

This module does not provide thorough theming or accessory images: it's the 
responsibility of the site builder to tune styling.
