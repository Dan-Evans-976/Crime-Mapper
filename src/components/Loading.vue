<template>
    <div class="background" v-if="active">
        <div class="info-holder">
            <div class="loading">
                Please Wait<span v-html="loadingDots"></span>
            </div>
            <div class="text">
                {{ loadingMessage }}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: [
            'active',
            'loadingMessage'
        ],
        data(){
            return {
            }
        },
        mounted(){
        }
    }
</script>

<style lang="scss">
    .background{
        z-index: 600;
        background-color: #000000a1;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        .info-holder{
            pointer-events: none;
            text-align: center;
            color: #ffffff;
            .loading{
                font-size: 32px;
                text-transform: uppercase;
                animation: text-pulse 500ms linear infinite alternate both;
            }
            .text{
                font-size: 28px;
                color: #cacaca;
            }
        }
    }

    @keyframes text-pulse {
        0% {
            color: #ffffff;
        }
        100% {
            color: #c0c0c0;
        }
    }

</style>