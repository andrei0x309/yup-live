<template>
  <o-sidebar
    v-model:open="sidebarOpen"
    :fullheight="true"
    :fullwidth="false"
    :overlay="false"
    :right="true"
    contentClass="sidebar"
  >
    <o-button
      style="
        width: 2rem;
        position: absolute;
        right: 1rem;
        top: 1rem;
        padding-right: 0.5rem;
        background-color: #1f2937;
      "
      icon-left="times"
      label="X"
      @click="sidebarOpen = false"
    />
    <div class="mx-auto">
      YUP
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-10 inline"
        viewBox="0 0 27.015619 12.00781"
      >
        <path
          id="live-1"
          fill="#f04545"
          d="M 0,6.0039 C 0,5.60937 0.0391,5.21875 0.11328,4.83203 0.19138,4.44531 0.30469,4.07031 0.45703,3.70312 0.60547,3.33984 0.79297,2.99609 1.01172,2.66797 1.23047,2.33984 1.48047,2.03515 1.75781,1.75781 2.03516,1.47656 2.33984,1.23047 2.66797,1.01172 2.99609,0.79297 3.33984,0.60547 3.70703,0.45703 4.07031,0.30469 4.44531,0.1914 4.83203,0.11328 5.21875,0.03518 5.60937,0 6.00391,0 h 15.00781 c 0.39453,0 0.78515,0.0352 1.17187,0.11328 0.38672,0.0781 0.76172,0.19141 1.125,0.34375 0.36719,0.14844 0.71094,0.33594 1.03907,0.55469 0.32812,0.21875 0.63281,0.46484 0.91015,0.74609 0.27735,0.27734 0.52735,0.58203 0.7461,0.91016 0.21875,0.32812 0.40625,0.67187 0.55468,1.03515 0.15235,0.36719 0.26563,0.74219 0.34375,1.12891 0.0742,0.38672 0.11328,0.77734 0.11328,1.17187 0,0.39063 -0.0391,0.78125 -0.11328,1.16797 -0.0781,0.38672 -0.1914,0.76172 -0.34375,1.12891 -0.14843,0.36328 -0.33593,0.71094 -0.55468,1.03516 -0.21875,0.32812 -0.46875,0.63281 -0.7461,0.91015 -0.27734,0.28125 -0.58203,0.52735 -0.91015,0.7461 -0.32813,0.22265 -0.67188,0.40625 -1.03907,0.55859 -0.36328,0.14844 -0.73828,0.26172 -1.125,0.33984 -0.38672,0.0781 -0.77734,0.11719 -1.17187,0.11719 H 6.00391 c -0.39454,0 -0.78516,-0.0391 -1.17188,-0.11719 -0.38672,-0.0781 -0.76172,-0.1914 -1.125,-0.33984 C 3.33984,11.39844 2.99609,11.21484 2.66797,10.99609 2.33984,10.77344 2.03516,10.52734 1.75781,10.24609 1.48047,9.96875 1.23047,9.66406 1.01172,9.33594 0.79297,9.01172 0.60547,8.66406 0.45703,8.30078 0.30469,7.93359 0.19141,7.55859 0.11328,7.17187 0.03908,6.78515 0,6.39453 0,6.0039 Z m 0,0"
        />
        <path
          id="live-2"
          fill="#fff"
          d="m 8.8538666,9.0041491 h -3.4375 v -6.203125 h 1.203125 v 5.140625 h 2.0625 z m 0,0"
        />
        <path
          id="live-3"
          fill="#fff"
          d="M 10.966965,9.0041491 H 9.7638397 v -6.203125 h 1.2031253 z m 0,0"
        />
        <path
          id="live-4"
          fill="#fff"
          d="m 17.635117,2.8010241 -2.3125,6.234375 h -1.21875 l -2.265625,-6.09375 1.25,-0.203125 1.671875,4.75 1.609375,-4.6875 z m 0,0"
        />
        <path
          id="live-5"
          fill="#fff"
          d="m 22.175171,9.0041491 h -3.703125 v -6.203125 h 3.609375 v 1 h -2.421875 v 1.484375 h 1.859375 l 0.171875,1 h -2.03125 v 1.71875 h 2.515625 z m 0,0"
        />
      </svg>
    </div>
    <h3 class="menu-title">Main Pages</h3>
    <ul>
      <li>
        <router-link class="menu-pill" to="/feeds" @click="toggleSidebar()">
          <FeedsIcon class="inline w-3 mr-2" /> Feeds
        </router-link>
        <router-link class="menu-pill" to="/staking" @click="toggleSidebar()">
          <StakeIcon class="inline w-5 mr-2" /> Staking
        </router-link>
      </li>
    </ul>

    <h3 class="menu-title">YUP Pages</h3>

    <ul>
      <li v-for="(menu, index) in menuDropDownLinks.links" :key="index">
        <router-link
          class="menu-pill"
          :to="(menu.path as unknown as string)"
          @click="toggleSidebar()"
        >
          {{ menu.text }}
        </router-link>
      </li>
    </ul>
  </o-sidebar>
  <div class="bg-color hero">
    <div class="max-w-screen-2xl px-2 md:px-4 lg:px-8 mx-auto">
      <header class="flex justify-between items-center py-4">
        <!-- logo - start -->
        <router-link
          to="/"
          class="logo inline-flex items-center text-black-800 text-xl md:text-3xl font-bold gap-2.5"
          aria-label="logo"
        >
          <h1 class="inline gradient-text">YUP</h1>
          <svg
            class="w-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 27.015619 12.00781"
          >
            <use xlink:href="#live-1"></use>
            <use xlink:href="#live-2"></use>
            <use xlink:href="#live-3"></use>
            <use xlink:href="#live-4"></use>
            <use xlink:href="#live-5"></use>
          </svg>
        </router-link>
        <!-- logo - end -->

        <!-- nav - start -->
        <nav class="hidden lg:flex gap-6 text-[0.8rem]">
          <router-link
            class="text-gray-800 dark:text-gray-200 hover:text-yellow-500 active:text-yellow-700 font-semibold transition duration-100 flex items-center"
            to="/feeds"
            ><FeedsIcon class="inline w-4 mr-2" />Feeds
          </router-link>
          <router-link
            class="text-gray-800 dark:text-gray-200 hover:text-yellow-500 active:text-yellow-700 font-semibold transition duration-100"
            to="/staking"
            ><StakeIcon class="inline w-6 mr-2" />Staking
          </router-link>
          <router-link
            class="text-gray-800 dark:text-gray-200 hover:text-yellow-500 active:text-yellow-700 font-semibold transition duration-100"
            to="/search"
            ><SearchIcon class="inline w-6 mr-2" />Search
          </router-link>
          <o-dropdown v-model="menuDropDownLinks" aria-role="list">
            <template #trigger>
              <o-button style="background-color: transparent">
                <span class="dr-menu inline-flex items-center font-semibold gap-1"
                  >{{ menuDropDownLinks.text }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-yellow-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    style="display: inline"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </o-button>
            </template>

            <router-link
              v-for="(menu, index) in menuDropDownLinks.links"
              :key="index"
              class="menu-link"
              :to="(menu.path as unknown as string)"
            >
              <o-dropdown-item
                v-if="menu.text !== menuDropDownLinks.text"
                :value="menu"
                aria-role="listitem"
                class="gap-1 p-1 hover:text-gray-700 hover:dark:text-gray-200 dark:text-gray-300"
              >
                <div class="media">
                  <div class="media-content">
                    {{ menu.text }}
                  </div>
                </div>
              </o-dropdown-item>
            </router-link>
          </o-dropdown>
        </nav>
        <!-- nav - end -->
        <div class="flex flex-row">
          <ConnectButton />

          <!-- buttons - start -->
        </div>

        <button
          type="button"
          class="sm:inline-flex lg:hidden items-center text-sm md:text-base font-semibold rounded-lg gap-2 px-2.5 py-2 headerMenuBtn"
          @click="toggleSidebar()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 inline"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>

          Menu
        </button>
        <!-- buttons - end -->
      </header>
      <!-- menu - end -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import ConnectButton from "@/components/content/connect/connectBtn.vue";
import StakeIcon from "icons/src/stake.vue";
import FeedsIcon from "icons/src/feeds.vue";
import SearchIcon from "icons/src/search.vue";

export default defineComponent({
  name: "HeaderTemplate",
  components: {
    StakeIcon,
    FeedsIcon,
    ConnectButton,
    SearchIcon,
  },
  setup(props) {
    const sidebarOpen = ref(false);

    const linksFs = [
      {
        text: "Yup Social Posts",
        path: "/",
      },
      {
        text: "Check web3 Social",
        path: "/web3-social",
      },
      {
        text: "Yup Raw Influence",
        path: "/raw-influence",
      },
      {
        text: "Check Yup Score",
        path: "/score",
      },
      {
        text: "Emissions",
        path: "/emissions",
      },
      {
        text: "Meetings",
        path: "/meetings",
      },
    ];

    const menuDropDownLinks = ref({
      links: linksFs,
      text: "YUP",
    });

    watch(menuDropDownLinks, () => {
      menuDropDownLinks.value.links = linksFs;
    });

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
    };

    onMounted(() => {
      // do nothing.
    });

    return {
      menuDropDownLinks,
      sidebarOpen,
      toggleSidebar,
      props,
    };
  },
});
</script>

<style lang="scss">
.switch-icon {
  font-size: 1.3rem;
}

.media {
  align-items: flex-start;
  display: flex;
  text-align: left;
}
.media-content {
  flex-basis: auto;
  flex-grow: 1;
  flex-shrink: 1;
  text-align: left;
  overflow-y: hidden;
  overflow-x: auto;
  color: #363636;
  text-shadow: 1px 0px 1px #222;
}

html[class="dark"] .media-content {
  color: gainsboro;
}

html[class="dark"] .dr-menu {
  color: #cecece;
  text-shadow: #080808 0px 1px 4px;
}

.dr-menu {
  color: #434343;
  text-shadow: #939393 0px 1px 4px;
}

.media-left {
  margin-right: 1rem;
  flex-basis: auto;
  flex-grow: 0;
  flex-shrink: 0;
}
nav .o-drop__menu {
  background: var(--glass-menu-bg);
}

.o-drop__menu--active {
  box-shadow: 0.03rem 0.1rem 0.2rem;
  margin-top: 0.5rem;
  padding: 0.2rem 1.6rem 0.1rem 0.4rem;
  background: var(--glassBg);
  box-shadow: 0 8px 32px 0 var(--glassShadow);
  color: var(--glassText);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  min-width: 8.5rem;
}
.hero {
  max-height: 4rem;
  width: 100vw;
  position: fixed;
  z-index: 10;
}

.sidebar {
  background: linear-gradient(180deg, #14171a 0%, #36354a 61.98%, #2c2c3d 100%);
  min-width: 18rem;
  padding-top: 2rem;
  color: white;
  padding-left: 1rem;
  padding-right: 1rem;
}

.menu-link {
  & > div > div {
    position: relative;
  }

  & > div > div::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--headerColor1);
    transform-origin: bottom right;
    transform: scaleX(0);
    transition: transform 0.5s ease;
  }

  & > div > div:hover::before {
    transform-origin: bottom left;
    transform: scaleX(1);
  }
}

.menu-pill {
  background-color: rgba(221, 221, 221, 0.068);
  border: none;
  color: #ffd664;
  padding: 0.2em 5.2rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 0.1rem 0.2rem;
  cursor: pointer;
  border-radius: 10rem;
  width: 100%;
  &:hover {
    border: 1px solid rgb(207, 175, 30);
  }
}
.menu-title {
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  color: #b9b9b9;
  border: 1;
  border-bottom: 1;
  border-bottom: 1px solid #13131378;
}

.gradient-text {
  background-color: #ca4246;
  background-image: linear-gradient(
    45deg,
    #ca4246 16.666%,
    #e16541 16.666%,
    #e16541 33.333%,
    #f18f43 33.333%,
    #f18f43 50%,
    #8b9862 50%,
    #8b9862 66.666%,
    #476098 66.666%,
    #476098 83.333%,
    #a7489b 83.333%
  );

  background-size: 100%;
  background-repeat: repeat;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbow-text-simple-animation-rev 0.75s ease forwards;
}

.gradient-text:hover {
  animation: rainbow-text-simple-animation 0.5s ease-in forwards;
}

@keyframes rainbow-text-simple-animation-rev {
  0% {
    background-size: 650%;
  }
  40% {
    background-size: 650%;
  }
  100% {
    background-size: 100%;
  }
}

@keyframes rainbow-text-simple-animation {
  0% {
    background-size: 100%;
  }
  80% {
    background-size: 650%;
  }
  100% {
    background-size: 650%;
  }
}

h1 {
  font-weight: normal;
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 0;
  display: block;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
}

.headerMenuBtn {
  background: #222;
  color: aliceblue;
  border: 1px solid #ffffff24;
}

.logo {
  box-shadow: inset -1px -1px 3rem 2px var(--logoBg);
  padding: 0rem 0.4rem;
  border-radius: 0.3rem;
}
</style>
