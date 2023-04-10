<template>
  <div class="w-full flex h-10 headBar">
    <GoToIcon class="ml-6 w-5 mx-3 rotateIco" @click="back" />
    <GoToIcon class="w-5 mx-3" @click="forward" />
    <RetryIcon class="w-5 mx-3" @click="reloadWindow" />
    <FullScreenIcon class="w-5 mx-3" @click="enterFullscreen" />
    <MinimizeIcon class="w-5 mt-2 mx-3" @click="exitFullscreen" />
    <DeleteIcon class="w-5 mx-3 ml-auto" @click="closeWindow" />
  </div>
</template>

<script lang="ts">
// import { defineComponent, ref, onMounted, watch } from "vue";
import { defineComponent } from "vue";
import GoToIcon from "icons/src/goTo.vue";
import FullScreenIcon from "icons/src/fullScreen.vue";
import MinimizeIcon from "icons/src/minimize.vue";
import DeleteIcon from "icons/src/delete.vue";
import RetryIcon from "icons/src/retry.vue";
import { useRouter } from "vue-router";
import { appWindow } from "@tauri-apps/api/window";

export default defineComponent({
  name: "HeadBar",
  components: {
    GoToIcon,
    FullScreenIcon,
    MinimizeIcon,
    DeleteIcon,
    RetryIcon,
  },
  setup() {
    const router = useRouter();
    const forward = () => {
        router.go(1);
    };
    
    const back = () => {
        router.go(-1);
    };

    const enterFullscreen = () => {
        appWindow.setFullscreen(true)
    }

    const exitFullscreen = () => {
        appWindow.setFullscreen(false)
    }

    const reloadWindow = () => {
        window.location.reload();
    }

    const closeWindow = () => {
        appWindow.close();
    }

    return {
        forward,
        back,
        enterFullscreen,
        exitFullscreen,
        reloadWindow,
        closeWindow
    };
  },
});
</script>

<style lang="scss" scoped>
.headBar {
    color: #dbdbdb;
    position: sticky;
    align-self: flex-start;
    top: 0;
    transition: 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
    background: linear-gradient(269deg, #161616, #181818), linear-gradient(5deg, #222, #202020);
.rotateIco{
    transform: rotate(180deg);

    &:hover {
        transform: rotate(180deg) scale(1.2);
    }
}
 
svg {
    fill: antiquewhite;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
        fill: #fff;
        transform: scale(1.2);
    }
}

}
</style>
