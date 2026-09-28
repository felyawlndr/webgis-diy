console.log("WebGIS Kependudukan DIY");

let namaWilayah = "Bantul";
let jumlahPenduduk = 1000000;
console.log(namaWilayah);
console.log(jumlahPenduduk);

let wilayahDIY = [
  "Bantul",
  "Gunungkidul",
  "Kulon Progo",
  "Sleman",
  "Kota Yogyakarta",
];
console.log(wilayahDIY);

let dataBantul = {
  nama: "Bantul",
  jumlahPenduduk: 1000000,
  luas: 506.85,
};
console.log(dataBantul);

function tampilkanPesan() {
  console.log("Selamat datang di WebGIS Kependudukan DIY");
}
tampilkanPesan();

let myTombol = document.getElementById("btn-peta");
myTombol.addEventListener("click", function () {
  let myStatus = document.getElementById("status");
  myStatus.textContent = "Peta akan ditampilkan pada area peta.";
  myStatus.style.color = "green";
  myStatus.style.backgroundColor = "white";
});

let map = L.map("map").setView([-7.9157667, 110.4022123], 10);
let geojsonData = null;
let wilayahLayer = null;
let selectedLayer = null;

let openTopoMap = L.tileLayer("https://tile.opentopomap.org/{z}/{x}/{y}.png", {
  attribution:
    "Map data &copy; OpenStreetMap contributors, SRTM | Map style &copy;OpenTopoMap",
}).addTo(map);

let openStreetMap = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      "Map data &copy; OpenStreetMap contributors, SRTM | Map style &copy;OpenTopoMap",
  },
).addTo(map);

fetch("data/diy-demografi.geojson")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    geojsonData = data;
    wilayahLayer = L.geoJSON(data, {
      style: function (feature) {
        return {
          color: feature.properties.stroke,
          fillColor: feature.properties.fill,
          weight: 3,
          fillOpacity: 0.8,
          opacity: 0.7,
        };
      },
      onEachFeature: function (feature, layer) {
        let popupContent = `
    <div class="popup-content">

        <div
            class="popup-header"
            style="border-left-color: ${feature.properties.fill};"
        >
            <h3>${feature.properties.nama}</h3>
            <span>Informasi Wilayah</span>
        </div>

        <div class="popup-item">
            <span class="popup-label">Jumlah Penduduk</span>
            <strong>${feature.properties.jumlah_penduduk} jiwa</strong>
        </div>

        <div class="popup-item">
            <span class="popup-label">Luas Wilayah</span>
            <strong>${feature.properties.luas_wilayah_km2} km²</strong>
        </div>

        <div class="popup-item">
            <span class="popup-label">Kepadatan Penduduk</span>
            <strong>${feature.properties.kepadatan} jiwa/km²</strong>
        </div>

    </div>
`;

        layer.bindPopup(popupContent);
      },
    }).addTo(map);

    geojsonData.features.forEach(function (feature) {
      let option = document.createElement("option");
      option.value = feature.properties.nama;
      option.textContent = feature.properties.nama;
      wilayahSelect.appendChild(option);
    });

    wilayahSelect.addEventListener("change", function () {
      let selectedName = wilayahSelect.value;

      if (selectedLayer) {
        map.removeLayer(selectedLayer);
      }
      if (selectedName === "") {
        return;
      }

      let selectedFeature = geojsonData.features.find(function (feature) {
        return feature.properties.nama === selectedName;
      });

      if (selectedLayer) {
        map.removeLayer(selectedLayer);
      }

      selectedLayer = L.geoJSON(selectedFeature, {
        style: function (feature) {
          return {
            color: feature.properties.stroke,
            fillColor: feature.properties.fill,
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          };
        },
        onEachFeature: function (feature, layer) {
          let popupContent = ` 
            <div class="popup-content"> 
                <div 
                    class="popup-header" 
                    style="border-left-color: ${feature.properties.fill};" 
                > 
                    <h3>${feature.properties.nama}</h3> 
                    <span>Informasi Wilayah</span> 
                </div> 
 
                <div class="popup-item"> 
                    <span class="popup-label"> 
                        Jumlah Penduduk 
                    </span> 
 
                    <strong> 
                        ${feature.properties.jumlah_penduduk} jiwa 
                    </strong> 
                </div> 
 
                <div class="popup-item"> 
                    <span class="popup-label"> 
                        Luas Wilayah 
                    </span> 
 
                    <strong> 
                        ${feature.properties.luas_wilayah_km2} km² 
                    </strong> 
                </div> 
 
                <div class="popup-item"> 
                    <span class="popup-label"> 
                        Kepadatan Penduduk 
                    </span> 
 
                    <strong> 
                        ${feature.properties.kepadatan} jiwa/km² 
                    </strong> 
                </div> 

            </div> 
            
        `;
          layer.bindPopup(popupContent);
        },
      }).addTo(map);

      map.fitBounds(selectedLayer.getBounds());

      console.log("Wilayah yang dipilih " + selectedName);
      console.log(selectedFeature);
    });

    let baseMaps = {
      OpenTopoMap: openTopoMap,
      OpenStreetMap: openStreetMap,
    };

    let overlays = {
      "Wilayah Kabupaten/Kota": wilayahLayer,
    };

    L.control.layers(baseMaps, overlays).addTo(map);
  });

let tombolPeta = document.getElementById("btn-peta");
let mapElement = document.getElementById("map");
let mapPlaceholder = document.getElementById("map-placeholder");
let wilayahSelect = document.getElementById("wilayah-select");
let mapLegend = document.querySelector(".map-legend"); 

