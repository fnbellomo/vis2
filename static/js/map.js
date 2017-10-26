/*
  General configuration values
*/
var origin_lat = -36
var origin_lon = -38

var tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
var attribution = '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'

var innerHTML_empty = `
<div class="info-box">
  <h4 class="info-title">Informacion de las Provincias en la que trabajamos</h4>
  <div class="info-text">
    <br />Aca tiene que ir un texto explicando el trabajo que han realizado usteds.
    <br />Hace click sobre alguna
  </div><!--/info-text -->

  <div id="info-graph">
    <svg id="bar_plot"></svg>
  </div><!--/info-graph -->

  <div id="box-imgs">
  </div>

</div><!--/info-box -->
`;

var imgs_html = `
<div class="row justify-content-center box">
  <div class="col-8">
    <div id="lightgallery">
      <a href="static/imgs/Misiones Habilidades Laborales4.jpg">
          <img src="static/imgs/Misiones Habilidades Laborales4_thumb.jpg" />
      </a>
      <a href="static/imgs/Misiones Lib Expresion 2.jpg">
          <img src="static/imgs/Misiones Lib Expresion 2_thumb.jpg" />
      </a>
    </div>
  </div>
</div>
`;


/*
  Styles
*/
function getColor(d) {
    return d == "Jujuy"        ? '#66c2a5' :
           d == "Santa Fe"     ? '#fc8d62' :
           d == "Misiones"     ? '#8da0cb' :
           d == "Tucuman"      ? '#e78ac3' :
           d == "Salta"        ? '#a6d854' :
                                 '#ffd92f';
}

function defaultStyle(feature) {
  return {
      color: "#2262CC",
      weight: 3,
      opacity: 0.6,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.name),
      className: 'enableProvince'
  }
}

var disabledStyle = {
    color: "grey",
    weight: 0,
    opacity: 0,
    fillOpacity: 0.1,
    fillColor: "#2262CC",
    className: 'disabledProvince'
}

var highlightStyle = {
    color: '#2262CC',
    weight: 5,
    opacity: 0.6,
    fillOpacity: 0.65,
    fillColor: '#2262CC'
};

// Initialice the map
var map = L.map('map').setView([origin_lat, origin_lon], 5)
// Div info
var info = L.control()

// Add the tile
L.tileLayer(tileUrl, {
    attribution: attribution,
    maxZoom: 18
}).addTo(map)

// Load the provinces
var provincesLayer = new L.GeoJSON.AJAX("./data/provincias.geojson", {
    style: setStyle,
    onEachFeature: onEachFeature
})

/*
  Info div methods
*/
info.onAdd = function ( map ) {
    // create a div with a class "info"
    this._div = L.DomUtil.create( 'div', 'container info' )
    this.setBlank()
    return this._div
}

info.setBlank = function () {
    this._div.innerHTML = innerHTML_empty
}

info.update = function ( e ) {
    // Method that we will use to update the control based on feature properties passed
    var properties = e.target.feature.properties

    //info._div.innerHTML = innerHTML_fill

    if ( properties.isEnabled ) {
      // remove
      div = document.getElementsByClassName('info-text')[0]
      div.innerHTML = ''

      // add the imgs
      div = document.getElementById('box-imgs')
      div.innerHTML = imgs_html

      // plot the bar
      plot(data[properties.name])

      // add the efect
      box = document.getElementsByClassName('box')[0]
      box.className += ' in'

      lightGallery(document.getElementById('lightgallery'));
    }
}

// Add to map
provincesLayer.addTo( map )
info.addTo( map )

/*

 */
function setStyle ( feature ) {
    // Set the style
    if ( feature.properties.isEnabled ) {
	     return defaultStyle(feature)
    }
    else {
	     return disabledStyle
    }
}

function onEachFeature ( feature, layer ) {
    // Set the event over each province
    layer.on({
	mouseover: highlightFeature,
	mouseout: resetHighlight,
	click: info.update
    });
}

function highlightFeature( e ) {
    // When the mouse put over a province, change the style
    var layer = e.target
    var properties = e.target.feature.properties

    if ( properties.isEnabled ) {
	layer.setStyle( highlightStyle )
    }
}

function resetHighlight( e ) {
    // When the mouse go out a provice, reset the style
    provincesLayer.resetStyle( e.target )
}
