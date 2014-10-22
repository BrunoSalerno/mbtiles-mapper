function replace_attributes(str,data) {
  var matches=str.match(/{{{(.*?)}}}/g);

  if (!matches) return str;

  for (var i=0;i<matches.length;i++){
    var attribute=matches[i].match(/{{{(.*?)}}}/)[1];
    if (data) str=str.replace(matches[i],data[attribute]);
  };

  return str;
}

function load_config(callback){
	$.getJSON("config.json", function(json) {
		config=json;
    tiles_from_params=load_params().tiles_path;
    if (tiles_from_params) config.tiles_path = tiles_from_params;
		if (typeof callback==='function') callback();
	});
}

function load_metadata(callback){
  $.getJSON(config.tiles_path+"/metadata.json", function(json) {
    document.title=json.name;

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

    if (json.minzoom) {
      config.view.min_zoom=parseInt(json.minzoom);
    }

    if (json.maxzoom) {
      config.view.max_zoom=parseInt(json.maxzoom);
    }

    var metadata_template=json.template;
    template.location = metadata_template.match("{{#__location__}}(.*){{/__location__}}")[1];
    template.teaser = metadata_template.match("{{#__teaser__}}(.*){{/__teaser__}}")[1];
    template.full = metadata_template.match("{{#__full__}}(.*){{/__full__}}")[1];

    if (config.use_mbtiles_legend && json.legend) $(".legend").html(json.legend);

    if (typeof callback==='function') callback();
  });
}

function mouseover_handler(e) {
  if (!$(".full").is(":visible")) $(".teaser").html(replace_attributes(template.teaser, e.data)).show();
}

function mouseout_handler(e) {
  $(".teaser").hide().empty();
}

function click_handler(e) {
  if (!template.full) {
    window.open(replace_attributes(template.location, e.data));
  } else {
    $(".teaser").hide().empty();
    $(".full").html(replace_attributes(template.full, e.data)).show().unbind().click(function(){
      $(".full").hide();
    });
  }
}

function init() {
  var baselayer=L.tileLayer(config.baselayer_path);

  var tile=L.tileLayer(config.tiles_path + '/{z}/{x}/{y}.png', {
    maxZoom: 16,
    tms: false
  });

  var utfgrid = new L.UtfGrid(config.tiles_path + '/{z}/{x}/{y}.grid.json',{
    useJsonP: false
  });

  var map = L.map('map')
  .addLayer(baselayer)
  .addLayer(tile)
  .addLayer(utfgrid);

  if (!config.view.bounds){
    map.setView([config.view.center.lat, config.view.center.lon], config.view.zoom)
  } else {
    map.fitBounds(config.view.bounds);
  }

  map.minZoom=config.view.min_zoom;
  map.maxZoom=config.view.max_zoom;

  utfgrid.on('mouseover', mouseover_handler);
  utfgrid.on('mouseout',mouseout_handler);
  utfgrid.on('click',click_handler);
}

var config={};
var template={};

$(document).ready(function() {
	load_config(function(){
		load_metadata(function(){
			init();
		});
	});
});
