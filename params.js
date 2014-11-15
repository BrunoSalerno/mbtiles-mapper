/*
 Taken from http://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
 weltraumpirat answer
 */

function getSearchParameters() {
  var prmstr = decodeURIComponent(window.location.search.substr(1));
  return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
  var params = {};
  var prmarr = prmstr.split("&");
  for ( var i = 0; i < prmarr.length; i++) {
    var tmparr = prmarr[i].split("=");

    if (tmparr[0]=='coords'){
        var splitted=tmparr[1].split(",");
        params[tmparr[0]] = {lat:splitted[0],lon:splitted[1],z:splitted[2]};
    } else{
        params[tmparr[0]] = tmparr[1];
    }

  }
  return params;
}

function load_params(){
  var params = getSearchParameters();
  var params_values={};

  for (var key in params){
    switch (key){
        case 'tiles':
            params_values.tiles_path=params[key];
            break;
        case 'coords':
            var lat=parseFloat(params[key].lat);
            var lon=parseFloat(params[key].lon);
            var z=parseInt(params[key].z);
            params_values.coords={lat:lat,lon:lon,z:z};
            break;
    }
  }
  return params_values;
}

function save_params(params,center,zoom){
    var url=location.pathname+'?';
    if (params.tiles_path)url=url+'tiles='+params.tiles_path;
    url=url+'&coords='+center.lat+','+center.lng+','+zoom;
    return url;
}