<template>
  <div class="page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto">
    <div
      :key="`${isMobile}-error`"
      :class="`main-error bg-color w-full ${isMobile ? 'flex-column' : ''}`"
    >
      <div>
        <div :class="`${isMobile ? 'm-14 error-fs-mobile' : 'm-20 error-fs-desktop'}`">
          <span>error&nbsp;code:&nbsp;{{ code }}</span>
          <span>{{ message }}</span>
        </div>
      </div>
      <svg
        :class="`crack ${isMobile ? 'm-4 crack-rotate svg-mobile' : 'm-16'}`"
        viewBox="0 0 200 600"
      >
        <polyline
          points="118.302698 8 59.5369448 66.7657528 186.487016 193.715824 14 366.202839 153.491505 505.694344 68.1413353 591.044514"
        ></polyline>
      </svg>
      <div>
        <div
          :class="`${isMobile ? 'm-4 error-fs-msg-mobile' : 'm-2 error-fs-msg-desktop'}`"
          style="font-size: 1.4rem"
        >
          <span>sorry&nbsp;about&nbsp;that!</span>
          <span>
            <a @click="goHome()">
              <b>return&nbsp;home?</b>
            </a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive, computed, onUnmounted } from "vue";
import { useHead } from "@unhead/vue";
import { getStaticMetaFrame } from "shared/src/utils/frame";

import { useRoute, useRouter } from "vue-router";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default defineComponent({
  name: "ErrorPage",
  components: {},
  setup() {
    const route = useRoute();
    const router = useRouter();
    // const grid = useGrid('tailwind')
    const isMobile = false;

    const internalErrors: { [key: string]: { code: string; message: string } } = {
      "403": {
        code: "403",
        message: "forbidden",
      },
      "404": {
        code: "404",
        message: "page not found",
      },
      "500": {
        code: "500",
        message: "internal server error",
      },
    };

    let code = route.params?.pathMatch?.[2] ?? "404";
    if (!code) code = "404";
    const message = internalErrors[code] ? internalErrors[code].message : "Unknown error";

    const siteData = reactive({
      title: `YUP Live - Error Code - ${code}`,
      description: `YUP Live - Error Code - ${code}`,
    });

    const goHome = () => {
      router.push({ path: "/" });
    };

    onMounted(async () => {
      // do nothing
    });

    onUnmounted(() => {
      // do nothing
    });

    useHead({
      title: computed(() => siteData.title).value,
      meta: [
        {
          name: "description",
          content: computed(() => siteData.description).value,
        },
        {
          name: "og:image",
          content: `${BASE_URL}/share/yup-live-ogs/og-yup-live-default.png`,
        },
        ...getStaticMetaFrame(`${BASE_URL}/share/yup-live-ogs/og-yup-live-default.png`),
      ],
    });

    return {
      goHome,
      message,
      code,
      isMobile,
    };
  },
});
</script>

<style scoped lang="scss">
$grey: #343434;
$red: #a8246d;
$green: #43cb9d;

$p: 12px;
$f: "brandon-grotesque", "Brandon Grotesque", "Source Sans Pro", "Segoe UI", Frutiger,
  "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", Arial, sans-serif;

$easeOutExpo: cubic-bezier(0.19, 1, 0.22, 1);

// *, *:before, *:after { box-sizing: border-box; }
// * { -webkit-tap-highlight-color: rgba(0,0,0,0); transform-style: preserve-3d; }
// *:focus { outline: none!important; }

::selection {
  background: none;
}

.main-error a {
  display: block;
  cursor: pointer;
  font-weight: 500;
  &:hover,
  &:focus {
    b {
      color: $red;
    }
  }
  &:active {
    b {
      color: $green;
    }
  }
}

svg {
  width: 10rem;
  height: auto;
}

.svg-mobile {
  width: 6rem;
  height: auto;
}

.crack {
  position: relative;
  z-index: 4;
  margin-left: -50px;
  polyline {
    fill: none;
    stroke: $red;
    stroke-width: 10px;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1649.099;
    stroke-dashoffset: 1649.099;
    animation: drawStroke 1500ms ease-out 500ms forwards;
  }
}

.main-error {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin-top: 5vh;
  > div {
    display: flex;
    align-items: center;
    align-content: center;
    position: relative;
    overflow: hidden;
    svg {
      position: relative;
      z-index: 1;
    }
    span {
      display: block;
      position: relative;
      z-index: 0;
      padding: 0 $p;
      line-height: 1.4;
    }
    &:first-child {
      text-align: right;
      z-index: 1;
      span {
        &:first-child {
          opacity: 0;
          transform: translateX(100%);
          animation: translateLeft 1000ms linear 1250ms forwards;
        }
        &:last-child {
          opacity: 0;
          transform: translateX(100%);
          animation: translateLeft 1000ms linear 1450ms forwards;
        }
      }
    }
    &:last-child {
      z-index: 0;
      margin-left: -50px;
      span {
        &:first-child {
          opacity: 0;
          transform: translateX(-100%);
          animation: translateRight 1000ms linear 1650ms forwards;
        }
        &:last-child {
          opacity: 0;
          transform: translateX(-100%);
          animation: translateRight 1000ms linear 1850ms forwards;
        }
      }
    }
  }
}

@keyframes drawStroke {
  0% {
    stroke-dashoffset: 1649.099;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes removeFill {
  0% {
    fill: rgba($grey, 1);
  }
  100% {
    fill: rgba($grey, 0);
  }
}

/* https://goo.gl/v323yz */
@keyframes translateLeft {
  0% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 150, 0, 0, 1);
    opacity: 1;
  }
  7.61% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 69.561, 0, 0, 1);
  }
  11.41% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 39.355, 0, 0, 1);
  }
  15.12% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 17.801, 0, 0, 1);
  }
  18.92% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 3.02, 0, 0, 1);
  }
  22.72% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -5.661, 0, 0, 1);
  }
  30.23% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -10.852, 0, 0, 1);
  }
  50.25% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -2.282, 0, 0, 1);
  }
  70.27% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0.519, 0, 0, 1);
  }
  100% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    opacity: 1;
  }
}

/* https://goo.gl/p1Hnde */
@keyframes translateRight {
  0% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -150, 0, 0, 1);
    opacity: 1;
  }
  7.61% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -69.561, 0, 0, 1);
  }
  11.41% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -39.355, 0, 0, 1);
  }
  15.12% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -17.801, 0, 0, 1);
  }
  18.92% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -3.02, 0, 0, 1);
  }
  22.72% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 5.661, 0, 0, 1);
  }
  30.23% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10.852, 0, 0, 1);
  }
  50.25% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2.282, 0, 0, 1);
  }
  70.27% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -0.519, 0, 0, 1);
  }
  100% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    opacity: 1;
  }
}

html[class="dark"] .main-error {
  color: ghostwhite;
  box-shadow: 0.2rem 0.5rem 0rem #1b1b1b;
}

.crack-rotate {
  transform: rotate(88deg);
}

.flex-column {
  flex-direction: column;
}

.error-fs-desktop {
  font-size: 2rem;
}

.error-fs-mobile {
  font-size: 1.2rem;
}

.error-fs-msg-desktop {
  font-size: 1.4rem;
}

.error-fs-msg-mobile {
  font-size: 1rem;
}
</style>
