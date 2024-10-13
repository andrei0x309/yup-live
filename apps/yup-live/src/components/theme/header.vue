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
      <ActivityIcon class="text-red-700 w-6 h-6" />
    </div>
    <h3 class="menu-title">Main Pages</h3>
    <ul>
      <li>
        <p
          v-if="canDoPost"
          :key="`l${isLoggedIn}`"
          class="post-btn cursor-pointer menu-pill w-full"
          @click="
            doOpenPostModal();
            toggleSidebar();
          "
        >
          <CrossPostIcon class="inline w-3 mr-2" />New Post
        </p>
        <router-link
          v-else-if="isLoggedIn"
          class="post-btn menu-pill w-full"
          style="display: flex; line-height: 2rem"
          :to="{
            path: `/profile/${store.userData.account}/settings?show-connect=true`,
            query: { showConnect: 'true' },
          }"
        >
          <ConnectPlatformIcon class="inline w-3 mr-1 mt-1" />Link Social
        </router-link>

        <router-link class="menu-pill" to="/feeds" @click="toggleSidebar()">
          <FeedsIcon class="inline w-3 mr-2" /> Feeds
        </router-link>
        <router-link class="menu-pill" to="/claim" @click="toggleSidebar()">
          <GetCoinIcon class="inline w-5 mr-2" /> Rewards
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
          class="hidden logo md:inline-flex items-center text-black-800 text-xl md:text-3xl font-bold gap-2.5"
          aria-label="logo"
        >
          <h1 class="inline gradient-text">YUP</h1>
          <ActivityIcon class="text-red-700 w-6 h-6" />
        </router-link>
        <!-- logo - end -->

        <!-- nav - start -->
        <nav v-if="!noAccess" class="hidden lg:flex gap-6 text-[0.8rem]">
          <template v-if="isLoggedIn">
            <button
              v-if="canDoPost"
              :key="`l${isLoggedIn}`"
              class="post-btn"
              @click="doOpenPostModal"
            >
              <CrossPostIcon class="inline w-6 mr-2" />New Post
            </button>
            <router-link
              v-else
              class="post-btn"
              style="display: flex; line-height: 2rem"
              :to="{
                path: `/profile/${store.userData.account}/settings?show-connect=true`,
                query: { showConnect: 'true' },
              }"
            >
              <ConnectPlatformIcon class="inline w-6 mr-1 mt-1" />Link Social
            </router-link>
          </template>
          <router-link
            class="text-gray-800 dark:text-gray-200 hover:text-yellow-500 active:text-yellow-700 font-semibold transition duration-100 flex items-center"
            to="/feeds"
          >
            <FeedsIcon class="inline w-4 mr-2" />Feeds
          </router-link>
          <router-link
            style="line-height: 1.7rem"
            class="text-gray-800 dark:text-gray-200 hover:text-yellow-500 active:text-yellow-700 font-semibold transition duration-100"
            to="/claim"
          >
            <GetCoinIcon class="inline w-6 mr-2" />Rewards
          </router-link>
          <router-link
            style="line-height: 1.7rem"
            class="text-gray-800 dark:text-gray-200 hover:text-yellow-500 active:text-yellow-700 font-semibold transition duration-100"
            to="/search"
          >
            <SearchIcon class="inline w-6 mr-2" />Search
          </router-link>
          <o-dropdown
            v-model="menuDropDownLinks"
            aria-role="list"
            style="line-height: 1.7rem"
          >
            <template #trigger>
              <o-button style="background-color: transparent">
                <span class="dr-menu inline-flex items-center font-semibold gap-1"
                  >{{ menuDropDownLinks.text }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-yellow-400"
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
                v-if="
                  menu.text !== menuDropDownLinks.text &&
                  (menu.text !== 'Home Page' || $router.currentRoute.value.path !== '/')
                "
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
        <div v-if="!noAccess" class="flex flex-row">
          <ConnectButton />

          <!-- buttons - start -->
        </div>

        <button
          v-if="!noAccess"
          type="button"
          class="sm:inline-flex lg:hidden items-center text-sm md:text-base font-semibold rounded-lg gap-2 px-2.5 py-2 headerMenuBtn mr-2"
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
    <CrossPost
      :openModal="openPostModalState"
      :platforms="PLATFORMS"
      @success="postSent"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import ConnectButton from "@/components/content/connect/connectBtn.vue";
import GetCoinIcon from "icons/src/getCoin.vue";
import ActivityIcon from "icons/src/active.vue";
import FeedsIcon from "icons/src/feeds.vue";
import SearchIcon from "icons/src/search.vue";
import { useRouter } from "vue-router";
import { useMainStore, openPostModal } from "@/store/main";
import { canPost } from "shared/src/utils/requests/crossPost";
import CrossPost from "@/components/content/post/crossPost.vue";
import CrossPostIcon from "icons/src/crossPost.vue";
import ConnectPlatformIcon from "icons/src/connect.vue";
import { PLATFORMS } from "shared/src/utils/requests/web3-posting";

export default defineComponent({
  name: "HeaderTemplate",
  components: {
    GetCoinIcon,
    FeedsIcon,
    ConnectButton,
    SearchIcon,
    CrossPost,
    CrossPostIcon,
    ConnectPlatformIcon,
    ActivityIcon,
  },
  props: {
    noAccess: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const sidebarOpen = ref(false);
    const store = useMainStore();
    const openPostModalState = ref(store.openPostModal);

    const canDoPost = ref(canPost(store));
    const router = useRouter();
    const isLoggedIn = ref(store.isLoggedIn);

    store.$subscribe(() => {
      canDoPost.value = canPost(store);
      isLoggedIn.value = store.isLoggedIn;
    });

    const linksFs = [
      {
        text: "Home Page",
        path: "/",
      },
      {
        text: "Claim Content Rewards",
        path: "/claim",
      },
      {
        text: "Emissions",
        path: "/emissions",
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

    const postSent = () => {
      // openPostModal.value = false;
      // router.push(`/profile/${store.userData.account}/feed`);
    };

    const doOpenPostModal = () => {
      openPostModal(store, undefined, PLATFORMS);
    };

    return {
      menuDropDownLinks,
      sidebarOpen,
      toggleSidebar,
      props,
      postSent,
      doOpenPostModal,
      canDoPost,
      store,
      isLoggedIn,
      PLATFORMS,
      router,
      openPostModalState,
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
    -90deg,
    #ca4246 0.666%,
    #ca4246 45.666%,
    #f18f43 40.333%,
    #f18f43 60%,
    #829641 66.666%,
    #829641 75.333%,
    #3b7a57 83.333%
  );
  font-size: 1.3rem;

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

.post-btn {
  background-color: #8383832a;
  height: 2rem;
  width: 6.4rem;
  border-radius: 0.5rem;
  transition: 0.3s;
}

.post-btn:hover {
  background-color: #8383834a;
}
</style>
