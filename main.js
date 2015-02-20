(function(){

    function load_config(callback){
        var config={};
        $.getJSON("config.json", function(json) {
            config=json;

            config.params=load_params();

            //If tiles_path in params, overrides tiles_path in config.json
            if (config.params.tiles_path) config.tiles_path = config.params.tiles_path;

            if (typeof callback==='function') callback(config);
        });
    }

    function load_metadata(config,callback){
        config.template={};
        $.getJSON(config.tiles_path+"/metadata.json", function(json) {

            //config.json title key overrides mbtiles title
            config.title = config.title || json.name;

            document.title=config.title;

            // Overrides config.json data if present in metadata.json and there are no params
            if (!config.params || !config.params.coords){
                if (json.center) {
                    var p = json.center.split(',');
                    config.view.zoom=parseInt(p[2]);
                    config.view.center.lat=parseFloat(p[1]);
                    config.view.center.lon=parseFloat(p[0]);
                }

                if (json.bounds) {
                    var b=json.bounds.split(',');
                    config.view.bounds=[[parseFloat(b[1]),parseFloat(b[0])],[parseFloat(b[3]),parseFloat(b[2])]];
                }

            } else if (config.params.coords){
                config.view.zoom=config.params.coords.z;
                config.view.center.lat=config.params.coords.lat;
                config.view.center.lon=config.params.coords.lon;
            }

            if (json.minzoom) {
                config.view.min_zoom=parseInt(json.minzoom);
            }

            if (json.maxzoom) {
                config.view.max_zoom=parseInt(json.maxzoom);
            }

            var metadata_template=json.template;
            config.template.location = (metadata_template.match("{{#__location__}}(.*){{/__location__}}"))? metadata_template.match("{{#__location__}}(.*){{/__location__}}")[1] : '';
            config.template.teaser = (metadata_template.match("{{#__teaser__}}(.*){{/__teaser__}}"))? metadata_template.match("{{#__teaser__}}(.*){{/__teaser__}}")[1] : '' ;
            config.template.full = (metadata_template.match("{{#__full__}}(.*){{/__full__}}"))? metadata_template.match("{{#__full__}}(.*){{/__full__}}")[1] : '';

            if (config.use_mbtiles_legend && json.legend) $(".legend").html(json.legend);

            if (typeof callback==='function') callback(config);
        });
    }

    $(document).ready(function() {
        load_config(function(config){
            load_metadata(config,function(extended_config){
                var app=new MapClass(extended_config);
            });
        });
    });

})();
