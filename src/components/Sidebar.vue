<template>
    <div class="sidebar-container">
        <div class="sidebar-item-container" :class="{'active' : activeButtons['zoomIn'], 'disabled' : disabledButtons['zoomIn']}" title="Zoom out" @click="click('zoomIn')">
            <div class="sidebar-item">
                <i class="fa-solid fa-magnifying-glass-plus" style="padding-right: 1px; font-size: 30px;"></i>
            </div>
        </div>
        <div class="sidebar-item-container" :class="{'active' : activeButtons['zoomOut'], 'disabled' : disabledButtons['zoomOut']}" title="Zoom in" @click="click('zoomOut')">
            <div class="sidebar-item">
                <i class="fa-solid fa-magnifying-glass-minus" style="padding-right: 1px; font-size: 30px;"></i>
            </div>
        </div>
        <div class="sidebar-item-container" :class="{'active' : activeButtons['selectPoint'], 'disabled' : disabledButtons['selectPoint']}" title="Select a point on the map" @click="click('selectPoint')">
            <div class="sidebar-item">
                <i class="fa-solid fa-map-location-dot" style="padding-right: 1px; font-size: 30px;"></i>
            </div>
        </div>
        <div v-if="hasGeolocation" class="sidebar-item-container" :class="{'active' : activeButtons['useLocation'], 'disabled' : disabledButtons['useLocation']}" title="Find crime data at your current location" @click="click('useLocation')">
            <div class="sidebar-item">
                <i class="fa-solid fa-location-arrow" style="padding-right: 1px; font-size: 30px;"></i>
            </div>
        </div>
        <div class="sidebar-item-container" :class="{'active' : activeButtons['clearMarkers'], 'disabled' : disabledButtons['clearMarkers']}" title="Clear all markers from the map" @click="click('clearMarkers')">
            <div class="sidebar-item">
                <i class="fa-solid fa-trash-can" style="padding-right: 1px; font-size: 30px;"></i>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props:[
            'activeButtons',
            'disabledButtons'
        ],
        data(){
            return {
                hasGeolocation: false
            }
        },
        methods: {
            click(name){
                this.$emit(name);
            }
        },
        mounted(){
            if (navigator.geolocation){
                this.hasGeolocation = true;
            }
        }
    }
</script>

<style lang="scss">

    $sidebar-item-size: 50px;
    $sidebar-label-size: 30px;

    .sidebar-container{
        z-index: 500;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        padding: 15px;

        
        .sidebar-item-container{
            
            transition: all 0.3s;
            display: flex;
            align-items: center;
            cursor: pointer;
            outline: 2px solid transparent;
            margin-top: 10px;

            &:first-child{
                margin-top: 0px;
            }
            
            &.active{
                margin-left: 5px;
                .sidebar-item{
                    outline: 2px solid #1200b8;
                    color: #1200b8;
                }
            }

            &.disabled{
                opacity: 0.6;
                pointer-events: none;
            }

            &:hover{
                margin-left: 5px;
            }

            .sidebar-item{
    
                width:$sidebar-item-size;
                height: $sidebar-item-size;
                border-radius: calc($sidebar-item-size / 2);
                background-color: #ffffff;
                color: #040029;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.75);
                position: relative;
    
                transition: all 0.3s;
            }
        }
    }
</style>