function MapClass(config){

    function replace_attributes(str,data) {
      var matches=str.match(/{{{(.*?)}}}/g);

      if (!matches) return str;

      for (var i=0;i<matches.length;i++){
        var attribute=matches[i].match(/{{{(.*?)}}}/)[1];
        if (data) str=str.replace(matches[i],data[attribute]);
      }

      return str;
    }

    function mouseover_handler(e) {
      if (!$(".full").is(":visible")) $(".teaser").html(replace_attributes(config.template.teaser, e.data)).show();
    }

    function mouseout_handler(e) {
      $(".teaser").hide().empty();
    }

    function click_handler(e) {
      if (!config.template.full) {
        if (e && e.data) window.open(replace_attributes(config.template.location, e.data));
      } else {
        $(".teaser").hide().empty();
        $(".full").html(replace_attributes(config.template.full, e.data)).show().unbind().click(function(){
          $(".full").hide();
        });
      }
    }

    (function init() {
      var baselayer=L.tileLayer(config.baselayer_path);

      var tile=L.tileLayer(config.tiles_path + '/{z}/{x}/{y}.png', {
        maxZoom: 16,
        tms: false
      });

      var utfgrid = new L.UtfGrid(config.tiles_path + '/{z}/{x}/{y}.grid.json',{
        useJsonP: false
      });

      var options= {
        attributionControl:false
      }

      var map = new L.map('map',options)
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

      map.on('moveend',function(){
        history.pushState(config.title,document.title,save_params(config.params,map.getCenter(),map.getZoom()));
      });

      utfgrid.on('mouseover', mouseover_handler);
      utfgrid.on('mouseout',mouseout_handler);
      utfgrid.on('click',click_handler);
    })()

}