function getSearchParameters() {
  var prmstr = decodeURIComponent(window.location.search.substr(1));
  return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
  var params = {};
  var prmarr = prmstr.split("&");
  for ( var i = 0; i < prmarr.length; i++) {
    var tmparr = prmarr[i].split("=");
    params[tmparr[0]] = tmparr[1];
  }
  return params;
}


function load_params(){
  var params = getSearchParameters();
  return {tiles_path: ((params['tiles']) ? params['tiles'] : null)}
}