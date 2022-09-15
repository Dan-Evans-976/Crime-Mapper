import { createApp } from 'vue'
import App from './App.vue'

import 'leaflet';

import './assets/main.scss'
// import "leaflet/dist/leaflet.css";

import "leaflet.markercluster/dist/leaflet.markercluster-src";
// import "leaflet.markercluster/dist/MarkerCluster.css";

createApp(App).mount('#app')
