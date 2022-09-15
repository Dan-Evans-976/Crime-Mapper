<template>
    <div ref="map" class="map">
    </div>
    <Sidebar
        :active-buttons="activeButtons"
        :disabled-buttons="disabledButtons"
        @zoom-in="clickZoomIn()"
        @zoom-out="clickZoomOut()"
        @select-point="clickSelectPoint()"
        @clear-markers="clickClearMarkers()"
        @use-location="clickUseLocation()">
    </Sidebar>
    <Loading :active="appState == 'loading'" :loading-message="loadingMessage"></Loading>
</template>

<script>
    import axios from 'axios';
    import Sidebar from './Sidebar.vue';
    import Loading from './Loading.vue';

    export default {
    data() {
        return {
            appState: null,
            loadingMessage: null,
            mapInstance: null,
            crimeData: null,
            crimeMarkers: null,
            clusterGroup: null,
            activeButtons: {},
            disabledButtons: {},
        };
    },
    mounted() {
        // Create map
        this.mapInstance = L.map(this.$refs.map, {zoomControl: false}).setView([51.505, -0.09], 13);

        // Register map click event listener
        this.mapInstance.on('click', (event) => {
            this.mapClick(event);
        });

        this.mapInstance.on('zoomend', () => {
            if (this.mapInstance._zoom == this.mapInstance._layersMaxZoom){
                this.disabledButtons.zoomIn = true;
            }else {
                this.disabledButtons.zoomIn = false;
            }

            if (this.mapInstance._zoom == this.mapInstance._layersMinZoom){
                this.disabledButtons.zoomOut = true;
            }else {
                this.disabledButtons.zoomOut = false;
            }
        });

        // Setup marker cluster group
        this.clusterGroup = L.markerClusterGroup();

        // Setup map tile layer
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap"
        }).addTo(this.mapInstance);
    },
    methods: {
        clickZoomIn(){
            this.mapInstance.zoomIn();
        },
        clickZoomOut(){
            this.mapInstance.zoomOut();
        },
        clickSelectPoint(){
            if (this.appState == 'selectPoint'){
                this.alterAppState(null);
            }else if (this.appState != 'loading'){
                this.alterAppState('selectPoint');
            }
        },
        clickClearMarkers(){
            if (this.appState != 'loading'){
                this.clusterGroup.clearLayers();
                this.alterAppState(null);
            }
        },
        clickUseLocation(){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    let latLng = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.fetchData('point', latLng, latLng);
                });
            }
        },
        alterAppState(newState){
            if (newState == 'selectPoint'){
                this.appState = 'selectPoint';
                this.activeButtons = {selectPoint: true};
            }
            if (newState == null){
                this.appState = null;
                this.activeButtons = {};
            }
            if (newState == 'loading'){
                this.appState = 'loading';
                this.loadingMessage = 'Loading Results'
                this.activeButtons = {};
            }
        },
        mapClick(event) {
            if (this.appState == 'selectPoint'){
                this.fetchData("point", event.latlng);
            }
        },
        fetchData(fetchType, fetchData, jumpToPosition) {
            switch (fetchType) {
                case "point":
                    this.alterAppState('loading');
                    axios({
                        method: "get",
                        url: this.buildApiUrl(fetchData.lat, fetchData.lng)
                    })
                    .then((response) => {
                        let crimeData = response.data;
                        this.generateMarkers(crimeData);
                        this.alterAppState(null);
                        if (jumpToPosition){
                            this.mapInstance.setView(jumpToPosition);
                        }
                    });
                    break;
            }
        },
        buildApiUrl(lat, lng) {
            let url = "https://data.police.uk/api/crimes-street/all-crime?lat=";
            url += lat;
            url += "&lng=";
            url += lng;
            return url;
        },
        generateMarkers(crimeData) {
            this.clusterGroup.clearLayers();

            let crimeMarkers = [];
            crimeData.forEach(crime => {
                crimeMarkers.push(L.marker(this.crimeToLatLng(crime)));
            });
            this.clusterGroup.addLayers(crimeMarkers, {chunkedLoading: true});
            this.mapInstance.addLayer(this.clusterGroup);
        },
        crimeToLatLng(crime) {
            return [
                crime.location.latitude,
                crime.location.longitude
            ];
        }
    },
    components: { Sidebar, Loading }
}
</script>

<style lang="scss">
    .map{
        width: 100%;
        height: 100vh;
    }
</style>