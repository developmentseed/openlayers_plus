Drupal.behaviors.openlayers_plus_behavior_popup = function(context) {
  var data = $(context).data('openlayers');
  if (data && data.map.behaviors.openlayers_plus_behavior_popup) {
    // Collect vector layers
    var vector_layers = [];
    for (var key in data.openlayers.layers) {
      var layer = data.openlayers.layers[key];
      if (layer.isVector === true) {
        vector_layers.push(layer);
      }
    }

    // Add control
    var control = new OpenLayers.Control.SelectFeature(
      vector_layers,
      {
        activeByDefault: true,
        highlightOnly: false,
        multiple: false,
        hover: false,
        callbacks: {
          'over': Drupal.openlayers_plus_behavior_popup.over,
          'out': Drupal.openlayers_plus_behavior_popup.out,
          'click': Drupal.openlayers_plus_behavior_popup.openPopup
        }
      }
    );
    data.openlayers.addControl(control);
    control.activate();
  }
  else if ($(context).is('.openlayers-popupbox')) {
    // Popup close
    $('a.popup-close', context).click(function() {
      $(this).parents('.openlayers-popupbox').fadeOut('fast', function() { $(this).remove(); });
      return false;
    });

    // Set initial pager state
    Drupal.openlayers_plus_behavior_popup.pager(context, 'set');

    // Next link
    $('ul.popup-links a.next', context).click(function() {
      var context = $(this).parents('.openlayers-popupbox');
      Drupal.openlayers_plus_behavior_popup.pager(context, 'next');
    });

    // Prev link
    $('ul.popup-links a.prev', context).click(function() {
      var context = $(this).parents('.openlayers-popupbox');
      Drupal.openlayers_plus_behavior_popup.pager(context, 'prev');
    });
  }
};

Drupal.openlayers_plus_behavior_popup = {

  // Pager actions
  'pager': function(context, op) {
    var active = $('li.openlayers-popupbox-active', context);
    var index = $('div.item-list > ul > li', context).index(active);
    var total = $('div.item-list > ul > li', context).size();

    switch (op) {
      case 'set':
        if (active.size() === 0) {
          index = 0;
          $('div.item-list > ul > li', context).hide();
          $('div.item-list > ul > li:first', context).addClass('openlayers-popupbox-active').show();
          $('ul.popup-links a.prev', context).addClass('disabled');
          if (total <= 1) {
            $('ul.popup-links', context).hide();
          }
        }
        else {
          if (index === 0) {
            $('ul.popup-links a.prev', context).addClass('disabled');
            $('ul.popup-links a.next', context).removeClass('disabled');
          }
          else if (index == (total - 1)) {
            $('ul.popup-links a.next', context).addClass('disabled');
            $('ul.popup-links a.prev', context).removeClass('disabled');
          }
          else {
            $('ul.popup-links a.next', context).removeClass('disabled');
            $('ul.popup-links a.prev', context).removeClass('disabled');
          }
        }
        var count = parseInt(index + 1, 10) + ' / ' + parseInt(total, 10);
        $('span.count', context).text(count);
        break;
      case 'next':
        if (index < (total - 1)) {
          active.removeClass('openlayers-popupbox-active').hide()
            .next('li').addClass('openlayers-popupbox-active').show();
          Drupal.openlayers_plus_behavior_popup.pager(context, 'set');
        }
        break;
      case 'prev':
        if (index > 0) {
          active.removeClass('openlayers-popupbox-active').hide()
            .prev('li').addClass('openlayers-popupbox-active').show();
          Drupal.openlayers_plus_behavior_popup.pager(context, 'set');
        }
        break;
    }
  },

  // Click state
  'openPopup': function(feature) {
    var context = $(feature.layer.map.div);

    // Initialize popup
    if (!$('.openlayers-popupbox', context).size()) {
      context.append("<div class='openlayers-popupbox popup'></div>");
    }
    else {
      $('.openlayers-popupbox:not(.popup)').addClass('popup');
    }

    // Hide the layer switcher if it's open.
    for (var key in context.data('openlayers').openlayers.controls) {
      if (context.data('openlayers').openlayers.controls[key].CLASS_NAME == "OpenLayers.Control.LayerSwitcherPlus") {
        context.data('openlayers').openlayers.controls[key].minimizeControl();
      }
    }

    var text;
    text = "<a href='#close' class='popup-close'>X</a>";
    text += "<h2 class='popup-title'>" + feature.attributes.name + "</h2>";
    text += "<div class='popup-content'>" + feature.attributes.description + "</div>";
    text += "<div class='popup-pager'><ul class='links popup-links'><li><a class='prev' href='#prev'>Prev</a></li><li><a class='next' href='#next'>Next</a></li></ul><span class='count'></span></div>";
    $('.openlayers-popupbox', context).html(text).show();
    Drupal.attachBehaviors($('.openlayers-popupbox', context));
  },

  // Callback for hover state
  // Only show tooltips on hover if the story popup is not open.
  'over': function(feature) {
    var context = $(feature.layer.map.div);
    if (!$('.openlayers-popupbox.popup', context).size()) {
      if (feature.attributes.name) {
        var text = "<div class='openlayers-popupbox'>";
        text += "<h2 class='popup-title'>" + feature.attributes.name + "</h2>";
        text += "<div class='popup-count'>" + parseInt(feature.attributes.count, 10) + "</div>";
        text += "</div>";
        context.append(text);
      }
    }
  },

  // Call back for out state.
  'out': function(feature) {
    var context = $(feature.layer.map.div);
    $('.openlayers-popupbox:not(.popup)', context).fadeOut('fast', function() { $(this).remove(); });
  }
};

