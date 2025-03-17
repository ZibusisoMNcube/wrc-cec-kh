# WRC-CEC-KH

## Water Research Commission - Contaminants of Emerging Concern Knowledge Hub

### Overview
The **WRC-CEC-KH** (Water Research Commission - Contaminants of Emerging Concern Knowledge Hub) is a web-based platform designed to provide information and resources related to contaminants of emerging concern (CEC). This knowledge hub includes interactive maps, educational content, and data visualization tools.

### Features
- **Web-based interface** using HTML, CSS, and JavaScript.
- **Interactive map** powered by [Leaflet.js](https://leafletjs.com/).
- **Resource library** with documents and references on CEC.
- **Data visualization** for exploring contaminant trends.
- **Responsive design** for optimal viewing on various devices.

### Project Structure
```
/ wrc-cec-kh
├── index.html         # Main landing page
├── about.html         # About page
├── contactus.html     # Contact Us page
├── login.html         # Login page
├── map.html           # Interactive map page
├── css/               # Stylesheets
│   ├── map.css        # Map-specific styles
│   ├── bootstrap.min.css # Bootstrap styles
│   ├── font-awesome.min.css # FontAwesome styles
├── js/                # JavaScript files
│   ├── bootstrap.min.js # Bootstrap functionality
│   ├── jquery-2.1.1.min.js # jQuery library
│   ├── map.js         # Leaflet map integration
│   ├── oms.min.js     # Overlapping Marker Spiderfier for clustering map markers
├── assets/            # Images, icons, and other resources
│   ├── NAME_ICON_FULL_500x150.png # Logo image
│   ├── favicon.ico    # Favicon
│   ├── close_icon.svg # Close button icon
│   ├── map_icons/     # Icons used in the interactive map
├── data/              # GeoJSON and other dataset files
└── README.md          # Project documentation
```

### Dependencies
The project uses the following libraries and frameworks:
- **Leaflet.js** (for interactive mapping)
- **Bootstrap** (for responsive UI)
- **jQuery** (for simplified DOM manipulation)
- **FontAwesome** (for icons)
- **Overlapping Marker Spiderfier (OMS)** (for managing marker clusters on the map)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/AgriculturalResearchCouncil/wrc-cec-kh.git
   ```
2. Open `index.html` in a web browser.

### Usage
- Navigate to the **interactive map** to explore contaminants by location.
- Browse the **resources** section for documents and reports.
- Use the **search** functionality to find specific contaminants or research papers.

### Contribution
If you’d like to contribute:
1. Fork the repository.
2. Create a new branch (`feature-branch`).
3. Commit your changes.
4. Submit a pull request.

### License
This project is licensed under the MIT License.

### Developers
This project is being developed by:
- **Zibusiso Ncube** (Senior Systems Developer)
- **Gert de Nysschen** (systems Developer)

Developers at **Agricultural Research Council** - [www.arc.agric.za](https://www.arc.agric.za)

### Contact
For questions or feedback, contact the Water Research Commission or visit the [official website](https://www.wrc.org.za/).

