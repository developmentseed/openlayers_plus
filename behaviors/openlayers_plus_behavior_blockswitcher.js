// var OpenLayersPlusBlockswitcher = {};
/**
 * Initializes the blockswitcher and attaches to DOM elements.
 */
var OpenLayersPlusBlockswitcher = function(opts, overlay_style) {
    if (opts == null) {
        return;
    }
    this.map = $(opts).data('map');
    this.overlay_style = overlay_style || 'radio';

    this.blockswitcher = $('div.openlayers-blockswitcher');
    // Don't propagate click events to the map
    // this doesn't catch events that are below the layer list
    $('div.openlayers-blockswitcher').mousedown(function(evt) {
        OpenLayers.Event.stop(evt);
    });

    this.needsRedraw = function() {
      if (!this.layerStates || !this.layerStates.length || (this.map.layers.length != this.layerStates.length)) {
        return true;
      }
      for (var i = 0, len = this.layerStates.length; i < len; i++) {
        var layerState = this.layerStates[i];
        var layer = this.map.layers[i];
        if ((layerState.name != layer.name) || (layerState.inRange != layer.inRange) || (layerState.id != layer.id) || (layerState.visibility != layer.visibility)) {
          return true;
        }
      }
      return false;
    };

    /**
     * Redraws the blockswitcher to reflect the current state of layers.
     */
    this.redraw = function() {
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
            var inputType = (baseLayer) ? 'radio' : this.overlay_style;

            var inputElem = $('.factory .' + inputType, this.blockswitcher).clone();

            // Append to container
            var container = baseLayer ? $('.layers.base', this.blockswitcher) : $('.layers.data', this.blockswitcher);
            container.show();
            $('.layers-content', container).append(inputElem);

            // Set label text
            $('label', inputElem).append((layer.title !== undefined) ? layer.title : layer.name);

            // Add states and click handler
            if (baseLayer) {
              $(inputElem)
                .click(function() { $(this).data('switcher').layerClick(this); })
                .data('switcher', this)
                .data('layer', layer);
              if (checked) {
                $(inputElem).addClass('activated');
              }
            }
            else {
              if (this.overlay_style == 'checkbox') {
                $('input', inputElem)
                  .click(function() { $(this).data('switcher').layerClick(this); })
                  .data('layer', layer)
                  .data('switcher', this)
                  .attr('disabled', !baseLayer && !layer.inRange)
                  .attr('checked', checked);
              }
              else if (this.overlay_style == 'radio') {
                $(inputElem)
                  .click(function() { $(this).data('switcher').layerClick(this); })
                  .data('layer', layer)
                  .data('switcher', this)
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
    this.layerClick = function(element) {
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
            if (this.CLASS_NAME !== 'OpenLayers.Layer.Vector.RootContainer' &&
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
    this.styleMapToCSS = function(styleMap) {
      css = {};
      default_style = styleMap.styles['default'].defaultStyle;
      if (default_style.fillColor === 'transparent' && typeof default_style.externalGraphic != 'undefined') {
        css['background-image'] = 'url(' + default_style.externalGraphic + ')';
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

    this.redraw();

    this.map.events.on({
        'addlayer': this.redraw,
        'changelayer': this.redraw,
        'removelayer': this.redraw,
        'changebaselayer': this.redraw,
        scope: this
    });
};
