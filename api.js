//default variables
var ALERT_ZIP = "Ooops! Invalid ZIP";
var map;
var infoWindow;
var pos;
var pag_now = 1;
var resul_lenght;
var resul_p_pag = 3;
var countryWithAlcohol = Array("Massachusetts", "South Carolina", "West Virginia", "Arkansas", "Pennsylvania");
var markers = [];
var Geolocat = false;
var pos = {
    lat: 40,
    lng: -105
}

jQuery(document).ready(function($) {

    //trigger seach on 'enter'
    jQuery(".in-zip input[type=\"text\"]").focus();
    jQuery(document).keyup(function(e) {
        if(e.keyCode == 13) {
            e.preventDefault();
            jQuery("#subbutton").trigger("click");
        }
    });

    //prevent form action
    document.getElementById('where-to-buy-form').addEventListener('submit', function(e) {
        e.preventDefault();
    }, false);


    jQuery("#subbutton").click(function(event) {
        event.preventDefault();
        //setup form option variables
        var dZip = jQuery(".pcl-zip").val();
        var dradius = jQuery(".pcl-radius option:selected").val();
        jQuery('.loading-overlay').show();
        jQuery('#invalidZip').hide();
        deleteMarkers();

        if (Geolocat) { //geolocation browser dialogue result
            if (!isZIP(dZip)) {
                getMyLocation(true, resul_p_pag, dradius);
            } else {
                searchForZip(dZip, dradius);
            }
        } else {
            if (isZIP(dZip)) {
                searchForZip(dZip, dradius);
                console.log('ZIP');
            } else {
                alert99(ALERT_ZIP);
                console.log('no ZIP');
            }
        }
    });
    //page through results
    jQuery(".dir-left").click(function() {
        var pag_actual = jQuery(".results div[class*=\"res-page\"][dta-actv=\"true\"]").attr("dta-page");
        display_page(--pag_now);
        var ds = jQuery("div.res-page" + pag_now).children().length;
        jQuery(".res-header").text((((pag_now * resul_p_pag) - resul_p_pag) + 1) + "-" + ((((pag_now * resul_p_pag) - resul_p_pag)) + ds) + " of " + resul_lenght + " Results");

    });
    jQuery(".dir-right").click(function() {
        var pag_actual = jQuery(".results div[class*=\"res-page\"][dta-actv=\"true\"]").attr("dta-page");
        display_page(++pag_now);
        var ds = jQuery("div.res-page" + pag_now).children().length;
        jQuery(".res-header").text((((pag_now * resul_p_pag) - resul_p_pag) + 1) + "-" + ((((pag_now * resul_p_pag) - resul_p_pag)) + ds) + " of " + resul_lenght + " Results");
    });

    jQuery("#invalidZip .kill").click(function(){
        jQuery("#invalidZip").hide();
    })
});

function searchForZip(dZip, dradius) {
    var localizate_ZIP = "https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:" + dZip + "&key=****google_maps_api_key****";
    var jqxhr = jQuery.getJSON(localizate_ZIP, function(data) {
            console.log(data);
            if (data.status == "OK") {
                pos = data.results[0].geometry.location;
                map.setCenter(pos);
                // infoWindow.setPosition(pos);
                make_query_product(resul_p_pag, dradius);
            } else if (data.status == "ZERO_RESULTS") {
                alert99("No results found, try another location.");
            }
        })
        .done(function() {

        })
        .fail(function() {

        })
        .always(function() {

        });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 30,
            lng: -90
        },
        zoom: 8
    });
    infoWindow = new google.maps.InfoWindow({
        map: map
    });
    getMyLocation(false);
    // Try HTML5 geolocation.

}

function getMyLocation(sub_sinc, resul_p_pag, dradius) {
    console.log('get my location fired');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log('geo true');
            Geolocat = true;
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log(pos);
            infoWindow.open(map);
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
            if (sub_sinc) {
                make_query_product(resul_p_pag, dradius);

            }
            console.log(1);
            // jQuery(".loading-overlay").hide();
        }, function(e) {
            if (e.code == 1) {
                Geolocat = false;
            }
            handleLocationError(true, infoWindow, map.getCenter());
            console.log(2);
        });
    } else {
        console.log('geo false');
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    jQuery(".loading-overlay").hide();
    /*
    infoWindow.setPosition(pos);
  
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    */
}

function addMarker(place, i) {
    var myLatlng = new google.maps.LatLng(place.latitude, place.longitude);

    var pinColor = "FEF102";
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
    var marker = new google.maps.Marker({
        map: map,
        position: myLatlng,
        id: i,
        //icon: pinImage
        //label:""+i,
        icon: {
            url: 'https://mt.google.com/vt/icon/name=icons/onion/SHARED-mymaps-pin-container-bg_4x.png,icons/onion/SHARED-mymaps-pin-container_4x.png,icons/onion/1899-blank-shape_pin_4x.png&highlight=ff000000,601B08,ff000000&scale=2.0',
            anchor: new google.maps.Point(30, 30),
            scaledSize: new google.maps.Size(30, 30)
        }
    });

    var activeIcon = {
        url: 'https://mt.google.com/vt/icon/name=icons/onion/SHARED-mymaps-pin-container-bg_4x.png,icons/onion/SHARED-mymaps-pin-container_4x.png,icons/onion/1899-blank-shape_pin_4x.png&highlight=ff000000,000000,ff000000&scale=2.0',
        anchor: new google.maps.Point(30, 30),
        scaledSize: new google.maps.Size(30, 30)
    }

    attachClickEvent(marker,infoWindow,place,i);

    // google.maps.event.addListener(marker, 'click', 
    //     function() {
    //         infoWindow.setContent('<div class="info-ubic">\
    //         <h5>' + (i + 1) + ' - ' + place.name + '</h5>\
    //         <div class="info-ubic-d">\
    //           <p>' + place.address + ', <span>' + place.city + '</span></p>\
    //           <p class="link-result"><a target="_blank" class="btn" href="' + get_Link(pos.lat, pos.lng, place.latitude, place.longitude) + '">DIRECTIONS</a></p>\
    //         </div>\
    //       </div>');
    //         infoWindow.open(map, marker);
    //         map.panTo(myLatlng);
    //     }
    // );
    markers.push(marker); 
}

//zoom to map pin when clicked on
function attachClickEvent(marker, infowindow, place, i){
    marker.addListener('click', function() {
        infoWindow.setContent('<div class="info-ubic">\
            <h5>' + place.name + '</h5>\
            <div class="info-ubic-d">\
              <p>' + place.address + ', <span>' + place.city + '</span></p>\
              <p class="link-result maroon-text"><a target="_blank" class="small-button" href="' + get_Link(pos.lat, pos.lng, place.latitude, place.longitude) + '">DIRECTIONS</a></p>\
            </div>\
          </div>');
        infoWindow.open(map, marker);
        console.log({lat: parseFloat(place.latitude),lng: parseFloat(place.longitude)});
        map.panTo({lat: parseFloat(place.latitude),lng: parseFloat(place.longitude)});
        map.setZoom(15);
    })
}

function get_Link(x1, y1, x2, y2) {
    return "https://www.google.com.co/maps/dir/" + x1 + "," + y1 + "/" + x2 + "," + y2 + "/?hl=en";
}

function isZIP(text) {
    return /\d+$/.test(text) && (text.length == 5);
}

//Make API call to get product results from database
function make_query_product(nresult, radi) {
    // jQuery(".loading-overlay").show();
    var req_url = "https://api.sazerac.com/where_to_buy/api/products/****product_code****.json?lat=" + pos.lat + "&amp;lng=" + pos.lng + "&amp;token=*****token_removed*****&amp;within="+ radi;
    var jqxhr = jQuery.getJSON(req_url, function(data) {
            var isCountryWithAlcohol = isCountryWithoutAlcohol();
            jQuery(".results div[class*=\"res-page\"]").remove();
            jQuery(".res-header").text("");
            infoWindow.close();

            if (isCountryWithAlcohol == undefined) {
                if(data != null){
                    for (var i = 0; i < data.data.locations.length; i++) {
                        console.log('marker');
                        addMarker(data.data.locations[i], i);
                    }
                    map.setZoom(10);
                    print_Results(data.data.locations, jQuery(".results"), nresult);
                }else{
                    alert99("No results found, try another location.");
                }
            } else {
                alert99(isCountryWithAlcohol);
                infoWindow.open(map);
                infoWindow.setContent(isCountryWithAlcohol);
                jQuery(".dir-right, .dir-left").hide();

            }

        })
        .done(function() {
            console.log("second success");
            jQuery(".loading-overlay").hide();
        })
        .fail(function(e) {
            console.log("error");
            console.log(e);
        })
        .always(function() {
            console.log("complete");
        });

}

function print_Results(array, elem, nresult) {
    console.log('print results');
    last = false;
    break = 0;
    locId = 0;
    var page = 1;
    if (array.length > 0) {
        while (!last) {
            elem.prepend("<div class=\"col-sm-12 res-page" + page + "\" dta-page=\"" + page + "\"></div>");
            for (var i = break;
                (i < break + nresult) && !last; i++) {
                jQuery(".res-page" + page).append('<div class="info-result" data-lng="' + array[i].longitude + '" data-lat="' + array[i].latitude + '" data-id="' + locId + '" >\
              <p class=\"info-rtitle\">' + array[i].name + '</p>\
              <p class=\"info-rubication\">' + array[i].address + '</p>\
              <p class=\"info-state\">' + array[i].city + ', ' + array[i].state  + ', ' + array[i].zip_code + '</p></div>');
                if (i >= (array.length - 1)) {
                    last = true;
                    // jQuery(".dir-cont").show("slow");
                    resul_lenght = i + 1;
                    display_page(1, page);
                }
                locId++;
            }
            break += nresult;
            if (!last) {
                page++;
            }
        }
        var ds = jQuery("div.res-page" + pag_now).children().length;
        jQuery(".res-header").text((((pag_now * nresult) - nresult) + 1) + "-" + ((((pag_now * nresult) - nresult)) + ds) + " of " + resul_lenght + " Results");
        recenterToLocation(markers);
    } else {
        alert99("No results found, try another location.");
    }

}

function display_page(posi) {
    n_pages = Math.ceil(resul_lenght / resul_p_pag);
    if (posi == 1) {
        jQuery(".dir-left").hide();
        jQuery(".dir-right").show();
    } else if (posi == n_pages){
        jQuery(".dir-left").show();
        jQuery(".dir-right").hide();  
    } else if (posi < n_pages) {
        jQuery(".dir-left").show();
        jQuery(".dir-right").show();         
    }
    if (posi <= 0) {
        posi = 1;
    } else if (posi > Math.ceil(resul_lenght / resul_p_pag)) {
        posi = Math.ceil(resul_lenght / resul_p_pag);
    }
    if(resul_lenght==1){ jQuery(".dir-right").hide(); }
    jQuery(".results div[class*=\"res-page\"]").hide();
    jQuery(".results div.res-page" + posi).show();
    jQuery(".results div.res-page" + posi).attr({
        "dta-actv": "true"
    });
    pag_now = posi;

}

function getMaxZoom(latlgt) {
    var maxZoomService = new google.maps.MaxZoomService();
    maxZoomService.getMaxZoomAtLatLng(latlgt, function(response) {
        if (response.status !== google.maps.MaxZoomStatus.OK) {
            return -1;
        } else {
            return response.zoom;
        }
    });
}

function isCountryWithoutAlcohol() {
    var req_url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + pos.lat + "," + pos.lng + "&key=****maps_api_key****&location_type=APPROXIMATE&result_type=administrative_area_level_1";
    var country;
    jQuery.ajax({
        url: req_url,
        dataType: 'json',
        async: false,
        timeout: 60000,
        success: function(data) {
            console.log(data);
            if (data.status == "ZERO_RESULTS") {
                console.log("ZERO_RESULTS");
            } else if (data.status == "OK") {
                for (var i = countryWithAlcohol.length - 1; i >= 0; i--) {
                    if (countryWithAlcohol[i] == data.results[0].address_components[0].long_name) {
                        country = "Information not available for " + data.results[0].address_components[0].long_name;
                        break;
                    }
                }
            }
        },
        error: function(e, t) {
            alert(t);
        }
    });
    return country;
}

function recenterToLocation(array){
    jQuery(".info-result").click(function(){
        var search_marker = jQuery(this).data('id');
        var location = array[search_marker];
        console.log(location);
        if(array[search_marker]){
            console.log('exists');
            google.maps.event.trigger(array[search_marker], 'click');
        } else {
            console.log('doesn\'t exists');
        }
    });
}



// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function alert99(txt) {
    
    jQuery(".loading-overlay").hide();
    jQuery("#invalidZip").show();
    jQuery("#invalidZip").children('h3').text(txt);
    console.log('alert 99');
}
