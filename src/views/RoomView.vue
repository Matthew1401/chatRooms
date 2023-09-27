<template>
    <main>
        <div class="data">
            <div class="move" style="width: 320px; height: 125px;"></div>
            <p>hello</p>
        </div>
        <div class="menu"></div>
    </main>
</template>

<style scoped>
    main {
        position: relative;
        color: #FFFF;
    }

    .data {
        position: absolute;
        top: 0;
        width: 100%;
        height: 125px;
        background-color: black;
        border-bottom: 2px solid rgb(165, 16, 110);
        display: flex;
    }

    .menu {
        position: absolute;
        left: 0;
        width: 300px;
        height: 100%;
        background-color: black;
        border-right: 2px solid rgb(165, 16, 110);
        border-top-right-radius: 50px;
    }

    p {
        color: #FFFF;
    }

</style>