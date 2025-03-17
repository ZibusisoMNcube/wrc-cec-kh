// Initialize the map
var map = initializeMap();

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
                console.log(`Layer group created for ${layerName}:`, layerGroup); // Debugging

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

                        oms.addMarker(marker);// Add marker to OverlappingMarkerSpiderfier

                        // Create popup content
                        const popupContent = `
                            <b>${feature.properties.samp_site || "No Site Name"}</b><br>
                            <br><b>${"concentration:  "}</b>
                            ${feature.properties.concent_det_samp_unit || "No concentration"}
                            <br><b>${"contaminate:  "}</b>
                            ${feature.properties.contam_name || "No CEC Name Provided"}
                            <br><b>${"feature at sample site:  "}</b>
                            ${feature.properties.feat_samp_site || "No Sample Site Description"}
                            <br><b>${"point coordinates"}</b>
                            <br>${feature.properties.point_lat + "(lat) / " + feature.properties.point_long + "(long)" || "No BR Lat/Long"}`;

                        // Bind popup to the marker
                        marker.bindPopup(popupContent);

                        // Create popup content
                        const infopaneContent = `
                            <div class="right-panel-title"><b>${feature.properties.samp_site || "No Site Name"}</b></div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Concentration</div>
                                <div class="col-7 value-column">${feature.properties.concent_det_samp || "No concentration"} ${feature.properties.concent_det_samp_unit || ""}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Contaminant</div>
                                <div class="col-7 value-column">${feature.properties.contam_name || "No CEC Name Provided"}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Feature at Sample Site</div>
                                <div class="col-7 value-column">${feature.properties.feat_samp_site || "No Sample Site Description"}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Point Coordinates</div>
                                <div class="col-7 value-column">${feature.properties.point_lat || "No Lat"} (lat) / ${feature.properties.point_long || "No Long"} (long)</div>
                            </div>
                            <!-- <div class="pane-row">
                                <div class="col-5 caption-column">Area Bottom-Right Coordinates</div>
                                <div class="col-7 value-column">${feature.properties.area_br_lat || "No BR Lat"} (lat) / ${feature.properties.area_br_lon || "No BR Lon"} (lon)</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Area Top-Left Coordinates</div>
                                <div class="col-7 value-column">${feature.properties.area_tl_lat || "No TL Lat"} (lat) / ${feature.properties.area_tl_lon || "No TL Lon"} (lon)</div>
                            </div> -->
                            <div class="pane-row">
                                <div class="col-5 caption-column">Boiling Point</div>
                                <div class="col-7 value-column">${feature.properties.boil_pnt || "No Boiling Point"} ${feature.properties.boil_pnt_unit || ""}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Chemical Abundance in Sample</div>
                                <div class="col-7 value-column">${feature.properties.chem_abund_sample || "No Data"}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Commonly Known As</div>
                                <div class="col-7 value-column">${feature.properties.comm_known_as || "No Data"}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Contaminant Type</div>
                                <div class="col-7 value-column">${feature.properties.contam_type || "No Data"}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Coordinate Notes</div>
                                <div class="col-7 value-column">${feature.properties.coord_notes || "No Data"}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Data Reference</div>
                                <div class="col-7 value-column"><a href="${feature.properties.data_ref || "#"}">${feature.properties.data_ref || "No Data"}</a></div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Density</div>
                                <div class="col-7 value-column">${feature.properties.density || "No Data"} ${feature.properties.density_unit || ""}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Formula</div>
                                <div class="col-7 value-column">${feature.properties.formula || "No Data"}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Instrument Used</div>
                                <div class="col-7 value-column">${feature.properties.instr_used || "No Data"}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">IUPAC Name</div>
                                <div class="col-7 value-column">${feature.properties.iupac_name || "No Data"}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">KH ID</div>
                                <div class="col-7 value-column">${feature.properties.kh_id || "No Data"}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Measurement Unit</div>
                                <div class="col-7 value-column">${feature.properties.measure_unit || "No Data"} (${feature.properties.measure_unit_full || "No Data"})</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Melting Point</div>
                                <div class="col-7 value-column">${feature.properties.melt_pnt || "No Data"} ${feature.properties.melt_pnt_unit || ""}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Metabolites</div>
                                <div class="col-7 value-column">${feature.properties.metabolites || "No Data"}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Molar Mass</div>
                                <div class="col-7 value-column">${feature.properties.molar_mass || "No Data"} ${feature.properties.molar_mass_unit || ""}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Reference Analysis Method</div>
                                <div class="col-7 value-column"><a href="${feature.properties.ref_analysis_meth || "#"}">${feature.properties.ref_analysis_meth || "No Data"}</a></div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Replicates Collected</div>
                                <div class="col-7 value-column">${feature.properties.replicates_collected || "No Data"}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Sample Collection Notes</div>
                                <div class="col-7 value-column">${feature.properties.sample_col_notes || "No Data"}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Solubility in Water</div>
                                <div class="col-7 value-column">${feature.properties.sol_water || "No Data"} ${feature.properties.sol_water_unit || ""}</div>
                            </div>
                            <div class="pane-row">
                                <div class="col-5 caption-column">Synonym</div>
                                <div class="col-7 value-column">${feature.properties.synonym || "No Data"}</div>
                            </div>
                            `;

                        // Bind popup to the marker
                        // marker.bindPopup(popupContent);

                        // // Add click event to write properties to the task pane
                        // marker.on('click', function () {
                        //     document.getElementById('infopane').innerHTML = popupContent; // Write properties to the task pane
                        // });

                        // Add click event to write properties to the task pane
                        marker.on('click', function () {
                            document.getElementById('infopane').innerHTML = infopaneContent; // Write properties to the task pane
                        });


                        layerGroup.addLayer(marker); // Add marker to the layer group
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

                            // Create popup content for polygons
                            const popupContent = `
                                <b>${feature.properties.samp_site || "No Site Name"}</b><br>
                                <br><b>${"concentration:  "}</b>
                                ${feature.properties.concent_det_samp_unit || "No concentration"}
                                <br><b>${"contaminate:  "}</b>
                                ${feature.properties.contam_name || "No CEC Name Provided"}
                                <br><b>${"feature at sample site:  "}</b>
                                ${feature.properties.feat_samp_site || "No Sample Site Description"}
                                <br><b>${"area top left coords & bottom right coords"}</b>
                                <br>${feature.properties.area_br_lat + "(br lat) / " + feature.properties.area_br_lon + "(br long)" || "No BR Lat/Long"}<br>${feature.properties.area_tl_lat + "(tl lat) / " + feature.properties.area_tl_lon + "(tl long)" || "No TL Lat/Long"}`;

                            // Bind popup to the polygon                         
                            layer.bindPopup(popupContent);


                            // Create popup content
                        const infopaneContent = `
                        <div class="right-panel-title"><b>${feature.properties.samp_site || "No Site Name"}</b></div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Concentration</div>
                            <div class="col-7 value-column">${feature.properties.concent_det_samp || "No concentration"} ${feature.properties.concent_det_samp_unit || ""}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Contaminant</div>
                            <div class="col-7 value-column">${feature.properties.contam_name || "No CEC Name Provided"}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Feature at Sample Site</div>
                            <div class="col-7 value-column">${feature.properties.feat_samp_site || "No Sample Site Description"}</div>
                        </div>
                        <!-- <div class="pane-row">
                            <div class="col-5 caption-column">Point Coordinates</div>
                            <div class="col-7 value-column">${feature.properties.point_lat || "No Lat"} (lat) / ${feature.properties.point_long || "No Long"} (long)</div>
                        </div> -->
                        <div class="pane-row">
                            <div class="col-5 caption-column">Area Bottom-Right Coordinates</div>
                            <div class="col-7 value-column">${feature.properties.area_br_lat || "No BR Lat"} (lat) / ${feature.properties.area_br_lon || "No BR Lon"} (lon)</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Area Top-Left Coordinates</div>
                            <div class="col-7 value-column">${feature.properties.area_tl_lat || "No TL Lat"} (lat) / ${feature.properties.area_tl_lon || "No TL Lon"} (lon)</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Boiling Point</div>
                            <div class="col-7 value-column">${feature.properties.boil_pnt || "No Boiling Point"} ${feature.properties.boil_pnt_unit || ""}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Chemical Abundance in Sample</div>
                            <div class="col-7 value-column">${feature.properties.chem_abund_sample || "No Data"}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Commonly Known As</div>
                            <div class="col-7 value-column">${feature.properties.comm_known_as || "No Data"}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Contaminant Type</div>
                            <div class="col-7 value-column">${feature.properties.contam_type || "No Data"}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Coordinate Notes</div>
                            <div class="col-7 value-column">${feature.properties.coord_notes || "No Data"}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Data Reference</div>
                            <div class="col-7 value-column"><a href="${feature.properties.data_ref || "#"}">${feature.properties.data_ref || "No Data"}</a></div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Density</div>
                            <div class="col-7 value-column">${feature.properties.density || "No Data"} ${feature.properties.density_unit || ""}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Formula</div>
                            <div class="col-7 value-column">${feature.properties.formula || "No Data"}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Instrument Used</div>
                            <div class="col-7 value-column">${feature.properties.instr_used || "No Data"}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">IUPAC Name</div>
                            <div class="col-7 value-column">${feature.properties.iupac_name || "No Data"}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">KH ID</div>
                            <div class="col-7 value-column">${feature.properties.kh_id || "No Data"}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Measurement Unit</div>
                            <div class="col-7 value-column">${feature.properties.measure_unit || "No Data"} (${feature.properties.measure_unit_full || "No Data"})</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Melting Point</div>
                            <div class="col-7 value-column">${feature.properties.melt_pnt || "No Data"} ${feature.properties.melt_pnt_unit || ""}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Metabolites</div>
                            <div class="col-7 value-column">${feature.properties.metabolites || "No Data"}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Molar Mass</div>
                            <div class="col-7 value-column">${feature.properties.molar_mass || "No Data"} ${feature.properties.molar_mass_unit || ""}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Reference Analysis Method</div>
                            <div class="col-7 value-column"><a href="${feature.properties.ref_analysis_meth || "#"}">${feature.properties.ref_analysis_meth || "No Data"}</a></div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Replicates Collected</div>
                            <div class="col-7 value-column">${feature.properties.replicates_collected || "No Data"}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Sample Collection Notes</div>
                            <div class="col-7 value-column">${feature.properties.sample_col_notes || "No Data"}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Solubility in Water</div>
                            <div class="col-7 value-column">${feature.properties.sol_water || "No Data"} ${feature.properties.sol_water_unit || ""}</div>
                        </div>
                        <div class="pane-row">
                            <div class="col-5 caption-column">Synonym</div>
                            <div class="col-7 value-column">${feature.properties.synonym || "No Data"}</div>
                        </div>
                        `;

                            // Add click event to write properties to the task pane
                            layer.on('click', function () {
                                document.getElementById('infopane').innerHTML = infopaneContent; // Write properties to the task pane
                            });

                        }
                    }
                }).addTo(layerGroup);

                geojsonLayers[layerName] = layerGroup; // Use the passed `geojsonLayers` variable
                console.log(`Layer group added to geojsonLayers for ${layerName}:`, geojsonLayers[layerName]); // Debugging
                createCheckbox(layerName); // Add the checkbox
                resolve(); // Resolve the promise
            })
            .catch(error => {
                console.error("Error fetching GeoJSON data for layer " + layerName + ":", error);
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

function toggleLayer(layerName, isChecked) {
    console.log(`Toggling layer ${layerName}:`, isChecked); // Debugging

    const layer = geojsonLayers[layerName];
    if (!layer) {
        console.error(`Layer not found in geojsonLayers: ${layerName}`);
        return;
    }

    if (!(layer instanceof L.LayerGroup)) {
        console.error(`Invalid layer object for ${layerName}:`, layer);
        return;
    }

    if (isChecked) {
        layer.addTo(map); // Add layer to map
        console.log(`Layer ${layerName} added to map`); // Debugging
    } else {
        map.removeLayer(layer); // Remove layer from map
        console.log(`Layer ${layerName} removed from map`); // Debugging
    }
}
