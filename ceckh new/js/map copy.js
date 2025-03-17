// Define colors for each layer (from your legend) - Global Scope
var layerColors = {
    "Alkylphenols and Alkylphenol Ethoxylates": "#F07857", // #F07857
    "Alkylphenols and Alkylphenol Ethoxylates (area)": "#F07857", // #F07857
    "Heavy Metals": "#F5C26B", // #F5C26B
    "Heavy Metals (area)": "#F5C26B", // #F5C26B
    "Microbial": "#4FB06D", // #4FB06D
    "Microbial (area)": "#4FB06D", // #4FB06D
    "Microplastics": "#F07857", // #F07857
    "Microplastics (area)": "#F07857", // #F07857
    "Nanomaterials": "#EBB8DD", // #EBB8DD
    "Nanomaterials (area)": "#EBB8DD", // #EBB8DD
    "Pesticides": "#53BDA5", // #53BDA5
    "Pesticides (area)": "#53BDA5", // #53BDA5
    "Pharmaceuticals and Personal Care Products": "#D49137", // #D49137
    "Pharmaceuticals and Personal Care Products (area)": "#D49137", // #D49137
    "Polybrominated Diphenyl Ethers": "#BF2C34", // #BF2C34
    "Polybrominated Diphenyl Ethers (area)": "#BF2C34", // #BF2C34
    "Polycyclic Aromatic Hydrocarbon": "#5C62D6", // #5C62D6
    "Polycyclic Aromatic Hydrocarbon (area)": "#5C62D6", // #5C62D6
    "Polyfluoroalkyl Compounds": "#253342", // #253342
    "Polyfluoroalkyl Compounds (area)": "#253342", // #253342
};

// Dictionary to hold GeoJSON layers
var geojsonLayers = {};

// Function to apply margins based on sidebar visibility
function applyMargins() {
    var leftToggler = $(".mini-submenu-left");
    var rightToggler = $(".mini-submenu-right");
    if (leftToggler.is(":visible")) {
        $("#map .leaflet-control-zoom")
            .css("margin-left", 0)
            .removeClass("zoom-top-opened-sidebar")
            .addClass("zoom-top-collapsed");
    } else {
        $("#map .leaflet-control-zoom")
            .css("margin-left", $(".sidebar-left").width())
            .removeClass("zoom-top-opened-sidebar")
            .removeClass("zoom-top-collapsed");
    }
    if (rightToggler.is(":visible")) {
        $("#map .leaflet-control-attribution")
            .css("margin-right", 0)
            .removeClass("zoom-top-opened-sidebar")
            .addClass("zoom-top-collapsed");
    } else {
        $("#map .leaflet-control-attribution")
            .css("margin-right", $(".sidebar-right").width())
            .removeClass("zoom-top-opened-sidebar")
            .removeClass("zoom-top-collapsed");
    }
}

// Function to check if the layout is constrained
function isConstrained() {
    return $("div.mid").width() == $(window).width();
}

// Function to apply the initial UI state
function applyInitialUIState() {
    /*     if (isConstrained()) {
            $(".sidebar-left .sidebar-body").fadeOut('slide');
            $(".sidebar-right .sidebar-body").fadeOut('slide');
            $('.mini-submenu-left').fadeIn();
            $('.mini-submenu-right').fadeIn();
        } */

    $(".sidebar-left .sidebar-body").hide();
    $(".sidebar-right .sidebar-body").hide();
    $('.mini-submenu-left').show();
    $('.mini-submenu-right').show();

}

// Map Initialization
function initializeMap() {
    console.log("Initializing map..."); // Debugging
    var map = L.map('map', {
        center: [-28.6, 25],
        crs: L.CRS.EPSG3857,
        zoom: 6,
        zoomControl: false,
        preferCanvas: true,
        attributionControl: false
    });
    return map;
}

// Sidebar Toggle Functions
function setupSidebarToggles() {
    $('.sidebar-left .slide-submenu').on('click', function () {
        var thisEl = $(this);
        thisEl.closest('.sidebar-body').fadeOut('slide', function () {
            $('.mini-submenu-left').fadeIn();
            applyMargins();
        });
    });

    $('.mini-submenu-left').on('click', function () {
        var thisEl = $(this);
        $('.sidebar-left .sidebar-body').toggle('slide');
        thisEl.hide();
        applyMargins();
    });

    $('.sidebar-right .slide-submenu').on('click', function () {
        var thisEl = $(this);
        thisEl.closest('.sidebar-body').fadeOut('slide', function () {
            $('.mini-submenu-right').fadeIn();
            applyMargins();
        });
    });

    $('.mini-submenu-right').on('click', function () {
        var thisEl = $(this);
        $('.sidebar-right .sidebar-body').toggle('slide');
        thisEl.hide();
        applyMargins();
    });
}

// Function to handle tab switching
function openlegend(evt, legendName) {
    // Hide all tab content
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the "active" class from all tab buttons
    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab content and add the "active" class to the button
    document.getElementById(legendName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Set the first tab as active by default when the page loads
document.addEventListener("DOMContentLoaded", function () {
    // Ensure the tab buttons and content exist
    if (document.querySelector(".tablinks") && document.querySelector(".tabcontent")) {
        document.querySelector(".tablinks").click();
    }
});

// Main Function
$(function () {

    // Initialize the map
    var map = initializeMap();
    setupSidebarToggles();
    $(window).on("resize", applyMargins);

    // Define Base Layers
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var esriLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // Add Esri World Imagery as the default base layer
    esriLayer.addTo(map);

    // Initialize OverlappingMarkerSpiderfier
    var oms = new OverlappingMarkerSpiderfier(map, { keepSpiderfied: true });

    // Create checkboxes sequentially and add layers to the map
    // Create checkboxes sequentially and pass `oms` and `geojsonLayers`
    createCheckboxesSequentially(oms, geojsonLayers);

    // Event Listeners for Base Layer Links
    $('a[data-layer="osm"]').on('click', function (e) {
        e.preventDefault();
        if (!map.hasLayer(osmLayer)) {
            map.removeLayer(esriLayer); // Remove Esri layer
            map.addLayer(osmLayer); // Add OpenStreetMap layer
        }
    });

    $('a[data-layer="esri"]').on('click', function (e) {
        e.preventDefault();
        if (!map.hasLayer(esriLayer)) {
            map.removeLayer(osmLayer); // Remove OpenStreetMap layer
            map.addLayer(esriLayer); // Add Esri layer
        }
    });

    // Add custom zoom control to bottom right
    L.control.zoom({
        position: 'bottomright' // Position the zoom control at the bottom right
    }).addTo(map);

    //Legend
    var legendDiv = document.getElementById("legend");

    
    // Add layers to the legend - points
    for (var contaminant in layerColors) {
        let fillColor = layerColors[contaminant];
        let isArea = contaminant.includes("(area)");
        let category = contaminant.replace(" (area)", ""); // Remove "(area)" for categorization

        let categoryMap = {
            "Alkylphenols and Alkylphenol Ethoxylates": "organiccontaminants",
            "Chlorinated Paraffins": "organiccontaminants",
            "Current use Pesticides": "organiccontaminants",
            "Pharmaceuticals and Personal Care Products": "organiccontaminants",
            "Polybrominated Diphenyl Ethers": "organiccontaminants",
            "Polycyclic Aromatic Hydrocarbon": "organiccontaminants",
            "Polyfluoroalkyl Compounds": "organiccontaminants",
            "Heavy Metals": "inorganiccontaminants",
            "Microplastics": "particulatecontaminants",
            "Nanomaterials": "particulatecontaminants",
            "Microbial": "biologicalcontaminants"
        };
    
        let listId = categoryMap[category] ? `${categoryMap[category]}${isArea ? 'areas' : 'pnts'}list` : null;
        
        if (listId) {
            document.getElementById(listId).innerHTML += `
                <i style="display: inline-block; width: 10px; height: 10px; border-radius: ${isArea ? '2%' : '50%'}; margin-right: 5px; background: ${fillColor}"></i>
                <span>${contaminant}</span><br>`;
        }
    }


        
    applyInitialUIState();
    applyMargins();
});


function fetchAndAddGeoJSON(layerName, url, color, oms, geojsonLayers) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                var layerGroup = L.layerGroup();

                L.geoJSON(data, {
                    pointToLayer: function (feature, latlng) {
                        var marker = L.marker(latlng, {
                            icon: L.icon({
                                iconUrl: `./images/${layerName.replace(/ /g, '').toLowerCase()}.png`,
                                shadowUrl: './images/marker-shadow.png',
                                iconSize: [10, 10],
                                iconAnchor: [2, 10],
                                popupAnchor: [1, -4],
                                shadowSize: [20, 20],
                            })
                        });

                        oms.addMarker(marker); // Use the passed `oms` variable
                        marker.bindPopup(`
                            <b>${feature.properties.samp_site || "No Site Name"}</b><br>
                            <br><b>${"concentration:  "}</b>
                            ${feature.properties.concent_det_samp_unit || "No concentration"}
                            <br><b>${"contaminate:  "}</b>
                            ${feature.properties.contam_name || "No CEC Name Provided"}
                            <br><b>${"feature at sample site:  "}</b>
                            ${feature.properties.feat_samp_site || "No Sample Site Description"}
                            <br><b>${"point coordinates"}</b>
                            <br>${feature.properties.point_lat + "(lat) / " + feature.properties.point_long + "(long)" || "No BR Lat/Long"}`);
                        layerGroup.addLayer(marker);
                        return marker;
                    },
                    style: function (feature) {
                        return {
                            fillColor: color,
                            fillOpacity: 0.3,
                            color: "#fff",
                            weight: 0.5,
                            dashArray: "3",
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
                            layer.bindPopup(`
                                <b>${feature.properties.samp_site || "No Site Name"}</b><br>
                                <br><b>${"concentration:  "}</b>
                                ${feature.properties.concent_det_samp_unit || "No concentration"}
                                <br><b>${"contaminate:  "}</b>
                                ${feature.properties.contam_name || "No CEC Name Provided"}
                                <br><b>${"feature at sample site:  "}</b>
                                ${feature.properties.feat_samp_site || "No Sample Site Description"}
                                <br><b>${"area top left coords & bottom right coords"}</b>
                                <br>${feature.properties.area_br_lat + "(br lat) / " + feature.properties.area_br_lon + "(br long)" || "No BR Lat/Long"}<br>${feature.properties.area_tl_lat + "(tl lat) / " + feature.properties.area_tl_lon + "(tl long)" || "No TL Lat/Long"}`);
                        }
                    }
                }).addTo(layerGroup);

                geojsonLayers[layerName] = layerGroup; // Use the passed `geojsonLayers` variable
                createCheckbox(layerName); // Add the checkbox
                resolve(); // Resolve the promise
            })
            .catch(error => {
                console.error("Error fetching GeoJSON data:", error);
                reject(error);
            });
    });
}

async function createCheckboxesSequentially(oms, geojsonLayers) {
    // Get all layer names and sort them alphabetically
    var layerNames = Object.keys(layerColors).sort();

    // Loop through each layer name and fetch/add GeoJSON data sequentially
    for (const layerName of layerNames) {
        try {
            await fetchAndAddGeoJSON(
                layerName,
                `https://www.ceckh.agric.za/geoserver/wrc/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=wrc:${encodeURIComponent(layerName)}&outputFormat=application/json`,
                layerColors[layerName],
                oms, // Pass the `oms` variable
                geojsonLayers // Pass the `geojsonLayers` variable
            );
            console.log(`Layer and checkbox added for: ${layerName}`);
        } catch (error) {
            console.error(`Failed to add layer and checkbox for: ${layerName}`, error);
        }
    }
}


// Function to create a checkbox for a layer
function createCheckbox(layerName) {
    var layerControlDiv = document.getElementById('layerControl');
    if (!layerControlDiv) {
        console.error("layerControl div not found!");
        return;
    }

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = layerName;
    checkbox.addEventListener('change', function () {
        toggleLayer(layerName, this.checked);
    });

    let label = document.createElement('label');
    label.htmlFor = layerName;
    label.appendChild(document.createTextNode(layerName));

    layerControlDiv.appendChild(checkbox);
    layerControlDiv.appendChild(label);
    layerControlDiv.appendChild(document.createElement('br'));
}

// Function to toggle layer visibility
function toggleLayer(layerName, isChecked) {
    if (isChecked) {
        if (geojsonLayers[layerName]) {
            geojsonLayers[layerName].addTo(map); // Add layer to map
        }
    } else {
        if (geojsonLayers[layerName]) {
            map.removeLayer(geojsonLayers[layerName]); // Remove layer from map
        }
    }
}

/* --------------------------------------------------------------------------------*/

