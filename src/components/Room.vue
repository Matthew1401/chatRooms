<template>
    <div class="room" @click="enterToRoom">
        {{ room.id }}
        <div class="name">
            {{ room.name }}
        </div>
    </div>
</template>

<script setup>

    const { room } = defineProps(['room'])
    const emits = defineEmits(['enterToRoom'])

    const enterToRoom = () => {
        emits('enterToRoom', room)
    }

</script>

<style scoped>
    .room {
        margin-left: 40px;
        margin-right: 40px;
        background-color: #5e064f;
        width: 250px;
        height: 250px;
        border-radius: 15px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 7em;
        cursor: pointer;
    }

    .room:hover {
        transform: translateY(-3px);
    }

    .name {
        position: absolute;
        font-size: 0.15em;
        color: #FFFFFF;
        bottom: 5px;
        text-shadow:
            0 0 5px rgba(255, 255, 255, .7),
            0 0 15px rgba(255, 255, 255, .7);
    }

    @media only screen and (max-width: 1200px) {
        .room {
            width: 200px;
            height: 200px;
            margin-left: 20px;
            margin-right: 20px;
            margin-top: 0;
            margin-bottom: 20px;
        }
    }

</style>