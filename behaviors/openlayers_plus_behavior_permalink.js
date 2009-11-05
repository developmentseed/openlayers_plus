/**
 * Implementation of Drupal behavior.
 */
Drupal.behaviors.openlayers_plus_behavior_permalink = function(context) {
  Drupal.OpenLayersPermalink.attach(context);
};

Drupal.OpenLayersPermalink = {};

Drupal.OpenLayersPermalink.attach = function(context) {
  var data = $(context).data('openlayers');
  if (data && data.map.behaviors.openlayers_plus_behavior_permalink) {
    // Doctor link hrefs.
    $('#canvas a:not(.processed-permalink)').each(function() {
      $(this).addClass('processed-permalink');
      $(this).click(function() {
        var href = $(this).attr('href');
        if (href.indexOf('#') === -1) {
          href = Drupal.OpenLayersPermalink.addQuery(href);
          $(this).attr('href', href);
        }
      });
    });
    // Doctor form submission.
    $('form:not(.processed-permalink)').each(function() {
      $(this).addClass('processed-permalink');
      $(this).submit(function() {
        var action = $(this).attr('action');
        action = Drupal.OpenLayersPermalink.addQuery(action, '?');
        $(this).attr('action', action);
      });
    });
    // Add control
    var control = new OpenLayers.Control.PermalinkPlus();
    data.openlayers.addControl(control);
    control.activate();
  }
};

Drupal.OpenLayersPermalink.addQuery = function(href, delimiter) {
  delimiter = delimiter ? delimiter : '#';
  var processed = false;
  $('div.openlayers-map').each(function() {
    if (!processed) {
      var data = $(this).data('openlayers');
      if (data.openlayers) {
        // If there is a permalink control present, attempt to persist layer settings when clicking through.
        for (var i in data.openlayers.controls) {
          if (data.openlayers.controls[i].CLASS_NAME == 'OpenLayers.Control.PermalinkPlus') {
            var params = OpenLayers.Util.getParameterString(data.openlayers.controls[i].createParams());
            params = params.split('&');
            var url = href.split(delimiter);
            for (var key in params) {
              if (params[key].split('=')[0] == 'layers' || params[key].split('=')[0] == 'baseLayers' ) {
                if (url[1]) {
                  url[1] += '&' + params[key];
                }
                else {
                  url[1] = params[key];
                }
              }
            }
            href = url.join(delimiter);
          }
        }
      }
    }
  });
  return href;
};

OpenLayers.Control.ArgParserPlus = OpenLayers.Class(OpenLayers.Control.ArgParser, {
  /**
   * Alternative to OpenLayers.Utils.getParameters() that uses the URL hash.
   */
  getParameters: function() {
    // Parse out parameters portion of url string
    var paramsString = window.location.hash.substring(1);

    var parameters = {};
    var pairs = paramsString.split(/[&;]/);
    for(var i=0, len=pairs.length; i<len; ++i) {
      var keyValue = pairs[i].split('=');
      if (keyValue[0]) {
        var key = decodeURIComponent(keyValue[0]);
        var value = keyValue[1] || ''; //empty string if no value

        //decode individual values
        value = value.split(",");
        for(var j=0, jlen=value.length; j<jlen; j++) {
          value[j] = decodeURIComponent(value[j]);
        }

        //if there's only one value, do not return as array
        if (value.length == 1) {
          value = value[0];
        }

        parameters[key] = value;
      }
    }
    return parameters;
  },

  /**
    * Override of SetMap.
    */
  setMap: function(map) {
    OpenLayers.Control.prototype.setMap.apply(this, arguments);

    // Make sure we dont already have an arg parser attached
    for(var i=0, len=this.map.controls.length; i<len; i++) {
      var control = this.map.controls[i];
      if ( (control != this) &&
        (control.CLASS_NAME == "OpenLayers.Control.ArgParser") ) {

        // If a second argparser is added to the map, then we
        // override the displayProjection to be the one added to the
        // map.
        if (control.displayProjection != this.displayProjection) {
          this.displayProjection = control.displayProjection;
        }

        break;
      }
    }
    if (i == this.map.controls.length) {
      var args = this.getParameters();
      // Be careful to set layer first, to not trigger unnecessary layer loads
      if (args.layers) {
        this.layers = typeof(args.layers) === 'string' ? this.layers = [args.layers] : args.layers;
      }
      if (args.baseLayers) {
        this.baseLayers = typeof(args.baseLayers) === 'string' ? this.baseLayers = [args.baseLayers] : args.baseLayers;
      }
      if (this.layers || this.baseLayers) {
        // when we add a new layer, set its visibility
        this.map.events.register('addlayer', this,
                                  this.configureLayers);
        this.configureLayers();
      }
      if (args.lat && args.lon) {
        this.center = new OpenLayers.LonLat(parseFloat(args.lon),
                                            parseFloat(args.lat));
        if (args.zoom) {
          this.zoom = parseInt(args.zoom, 10);
        }

        // when we add a new baselayer to see when we can set the center
        this.map.events.register('changebaselayer', this,
                                  this.setCenter);
        this.setCenter();
      }
    }
  },

  /**
   * Override of configureLayers().
   */
  configureLayers: function() {
    this.map.events.unregister('addlayer', this, this.configureLayers);

    var hasLayers = false;
    var argLayers = {};

    var i, j, name, layer;
    if (this.layers) {
      // Iterate over layers and filter arg layers down to ones that exist.
      for (i in this.layers) {
        name = this.layers[i];
        for (j in this.map.layers) {
          layer = this.map.layers[j];
          if (!layer.isBaseLayer && layer.name === name) {
            argLayers[name] = 1;
            hasLayers = true;
          }
        }
      }
      // If any query layers exist, disable default layer settings and enable layers.
      if (hasLayers) {
        for (j in this.map.layers) {
          layer = this.map.layers[j];
          if (!layer.isBaseLayer) {
            layer.setVisibility(layer.name in argLayers);
          }
        }
      }
    }

    // Iterate over baseLayers. We can safely set the baselayer and bail without
    // additional logic since there is only one base layer.
    if (this.baseLayers) {
      for (i in this.baseLayers) {
        name = this.baseLayers[i];
        for (j in this.map.layers) {
          layer = this.map.layers[j];
          if (layer.name === name) {
            this.map.setBaseLayer(layer);
            break;
          }
        }
      }
    }
  },
  CLASS_NAME: "OpenLayers.Control.ArgParserPlus"
});

OpenLayers.Control.PermalinkPlus = OpenLayers.Class(OpenLayers.Control.Permalink, {
  argParserClass: OpenLayers.Control.ArgParserPlus,

  /**
   * Override of updateLink().
   */
  updateLink: function() {
    var href = this.base;
    if (href.indexOf('#') != -1) {
      href = href.substring( 0, href.indexOf('#') );
    }
    href += '#' + OpenLayers.Util.getParameterString(this.createParams());
    this.element.href = href;
  },

  /**
   * Override of createParams(). Generates smarter layer/baselayer query string.
   */
  createParams: function(center, zoom, layers) {
    center = center || this.map.getCenter();

    var params = {};

    // If there's still no center, map is not initialized yet.
    // Break out of this function, and simply return the params from the
    // base link.
    if (center) {

      //zoom
      params.zoom = zoom || this.map.getZoom();

      //lon,lat
      var lat = center.lat;
      var lon = center.lon;

      if (this.displayProjection) {
        var mapPosition = OpenLayers.Projection.transform(
          { x: lon, y: lat },
          this.map.getProjectionObject(),
          this.displayProjection );
        lon = mapPosition.x;
        lat = mapPosition.y;
      }
      params.lat = Math.round(lat*100000)/100000;
      params.lon = Math.round(lon*100000)/100000;

      // Handle layers & baselayers separately.
      params.layers = [];
      params.baseLayers = [];

      layers = layers || this.map.layers;
      for (var i in layers) {
        var layer = layers[i];
        if (layer.isBaseLayer) {
          if (layer == this.map.baseLayer) {
            params.baseLayers.push(layer.name);
          }
        }
        else if (layer.getVisibility() && layer.displayInLayerSwitcher) {
          params.layers.push(layer.name);
        }
      }
    }
    return params;
  },

  CLASS_NAME: "OpenLayers.Control.PermalinkPlus"
});
