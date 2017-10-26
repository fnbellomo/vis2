/*
  General configuration values
*/
var origin_lat = -36
var origin_lon = -38

var tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
var attribution = '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'

var box_base = `
<div class="info-box">
  <h4 class="info-title">Informacion de las Provincias en la que trabajamos</h4>

  <div class="info-text in">
    <br />Aca tiene que ir un texto explicando el trabajo que han realizado usteds.
    <br />Hace click sobre alguna
  </div><!--/info-text -->

  <div id="box-imgs">
  </div><!--/box-imgs -->

</div><!--/info-box -->
`;

var html_media = `
<div class="container">
  <div class="row justify-content-center">
    <div class="col">
      <div id="lightgallery">
          <a href="static/imgs/Misiones Habilidades Laborales4.jpg">
            <img src="static/imgs/Misiones Habilidades Laborales4_thumb.jpg" class="img-thumbnail" style="max-width: 25%;" />
          </a>

          <a href="static/imgs/Misiones Lib Expresion 1.jpg">
            <img src="static/imgs/Misiones Lib Expresion 1_thumb.jpg" class="img-thumbnail" style="max-width: 25%;" />
          </a>

          <a href="static/imgs/Misiones Lib Expresion 2.jpg">
            <img src="static/imgs/Misiones Lib Expresion 2_thumb.jpg" class="img-thumbnail" style="max-width: 25%;" />
          </a>

          <a href="static/imgs/Misiones Taller TICs (1).jpg">
            <img src="static/imgs/Misiones Taller TICs (1)_thumb.jpg" class="img-thumbnail" style="max-width: 25%;" />
          </a>
      </div><!--/lightgallery -->
    </div><!--col -->
  </div><!--row -->
</div><!--/container -->
`;

var html_media = `
<div class="container">
  <div class="row justify-content-center">
    <div class="col-8">
      <div id="lightgallery">
        <div id="video-gallery">
          <a href="https://vimeo.com/240002168" data-poster="static/imgs/santa_fe_1_t.png" >
            <img src="static/imgs/santa_fe_1_t.png" class="img-thumbnail" style="max-width: 49%;" />
          </a>

          <a href="https://vimeo.com/239999840" data-poster="static/imgs/santa_fe_2_t.png">
            <img src="static/imgs/santa_fe_2_t.png" class="img-thumbnail" style="max-width: 49%;" />
          </a>
        </div>
        </div><!--/lightgallery -->
    </div><!--col -->
  </div><!--row -->
</div><!--/container -->
`

var html_media = `
<div class="container">
  <div class="row justify-content-center">
    <div class="col-8">

      <iframe src="https://player.vimeo.com/video/239996754?autoplay=1&byline=0" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

    </div><!--/col -->
  </div><!--/row -->
</div><!--/container -->
`


/*
  Styles
*/
function getColor(d) {
    return d == "Jujuy"        ? '#e6ab02' :
           d == "Santa Fe"     ? '#66a61e' :
           d == "Misiones"     ? '#e7298a' :
           d == "Tucuman"      ? '#7570b3' :
           d == "Salta"        ? '#d95f02' :
                                 '#1b9e77';
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
    this._div.innerHTML = box_base
    return this._div
}

info.update = function ( e ) {
    // Method that we will use to update the control based on feature properties passed
    var properties = e.target.feature.properties

    if ( properties.isEnabled ) {
      div = document.getElementsByClassName('info-text')[0]
      div.classList.remove('in')
      div.innerHTML = properties.html_texto
      div.className += ' in'

      // add the imgs
      div = document.getElementById('box-imgs')
      div.innerHTML = properties.html_media


      // add the efect
      //box = document.getElementsByClassName('box')[0]
      //box.className += ' in'

      lightGallery(document.getElementById('lightgallery'))
      lightGallery(document.getElementById('video-gallery'))


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
