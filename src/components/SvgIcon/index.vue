<template>
    <svg class="svg-icon" aria-hidden="true">
        <use :xlink:href="iconName" />
    </svg>
</template>

<script>
export default {
    name: "svgIcon",
    props: {
        iconClass: {
            type: String,
            required: true,
        },
    },
    computed: {
        iconName() {
            return `#icon-${this.iconClass}`;
        },
    },
};
</script>

<style scoped>
.svg-icon {
    width: 0.32rem;
    height: 0.32rem;
}
</style>
