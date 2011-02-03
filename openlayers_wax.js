/**
 * OpenLayers Wax machinery.
 *
 * Requirements:
 *
 * - OpenLayers
 * - Underscore.js
 */

var OpenLayersWax = {
    /**
     * Get a function by string name without using eval
     * @return {Function} the requested function.
     */
    get_function: function(head) {
          return _.reduce(head.split('.'), function(f, cl) {
            return f[cl];
          }, window);
    },

    /**
     * Instantiate JSON objects
     * @param {Object} a json object.
     * @return {Object} an instantiated OpenLayers or another type object.
     */
    reify: function(json_object) {
        try {
            if (json_object.hasOwnProperty('_type')) {
                var fn = OpenLayersWax.get_function(json_object._type);
                if (fn) {
                    var obj = new fn();
                    var waxed = OpenLayersWax.reify(json_object._value);
                    fn.apply(obj, waxed);
                    return obj;
                }
                else {
                    console && console.log(json_object._type + ' missing');
                    return [];
                }
            }
            else if (_.isString(json_object) ||
                    _.isNumber(json_object) || _.isBoolean(json_object)) {
                return json_object;
            }
            else {
                for (var i in json_object) {
                    if (json_object.hasOwnProperty(i)) {
                        json_object[i] = OpenLayersWax.reify(json_object[i]);
                    }
                }
                return json_object;
            }
        } catch (e) {
            console.log('Problem with: ' + JSON.stringify(json_object));
            console.log(e);
        }
    },

    /**
     * Instantiate a map on an element
     * @param {element} element to instantiate a map on.
     */
    bind: function() {
        var element = _(arguments).last();
        OpenLayersWax.getWax($(element).attr('src'), function(data) {
            data.map && $(element).data('map',
                new OpenLayers.Map(element, OpenLayersWax.reify(data.map)));
            var degrees = new OpenLayers.LonLat(0, 0);
            degrees.transform(
                new OpenLayers.Projection('EPSG:4326'),
                new OpenLayers.Projection('EPSG:900913'));
            $(element).data('map').setCenter(degrees, 1);
            data.externals && $(element).data(
                'externals',
                OpenLayersWax.reify(data.externals));
            $(element).trigger('openlayersWaxFinished');
        });
    },

    /**
     * Fetch JSON data from the server. Uses JSONP for cross domain
     * requests.
     *
     * Cross domain requests require the inclusion of jquery.jsonp-2.1.4.js.
     */
    getWax: function(url, callback) {
        if (url.match(/http/)) {
            $.jsonp({
                url: url,
                success: callback,
                error: function() {},
                callbackParameter: 'callback'
            });
        }
        else {
            $.getJSON(url, callback);
        }
    }
};
