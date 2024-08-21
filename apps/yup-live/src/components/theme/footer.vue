<template>
  <div
    v-if="!disabledFooter"
    class="bg-color dark:text-white pt-4 sm:pt-10 lg:pt-12 mt-2"
  >
    <footer class="max-w-screen-2xl px-4 md:px-8 mx-auto">
      <div
        class="footer-content flex flex-col md:flex-row justify-between items-center border-t border-b gap-4 py-6 border-gray-400 dark:border-gray-200"
      >
        <!-- nav - start -->
        <nav
          class="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 md:gap-6"
        >
          <a
            href="https://app.yup.io"
            class="text-gray-600 dark:text-gray-300 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
            >YUP APP</a
          >
          <a
            href="https://docs.yup.io"
            class="text-gray-600 dark:text-gray-300 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
            >YUP Docs</a
          >
          <a
            href="https://yup-live.pages.dev/"
            class="text-gray-600 dark:text-gray-300 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
            >YUP Live</a
          >
          <a
            href="https://forum.yup.io"
            class="text-gray-600 dark:text-gray-300 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
            >YUP Forum</a
          >
          <o-dropdown v-model="menuDropDownBuyYUP" aria-role="list">
            <template #trigger>
              <o-button style="background-color: transparent">
                <span class="dr-menu inline-flex items-center font-semibold gap-1">
                  {{ menuDropDownBuyYUP.text }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 dark:text-yellow-200 text-yellow-400"
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

            <a
              v-for="(menu, index) in menuDropDownBuyYUP.links"
              :key="index"
              class="menu-link"
              :href="(menu.href as unknown as string)"
            >
              <o-dropdown-item
                :value="menu"
                aria-role="listitem"
                class="gap-1 p-1 hover:text-gray-700 hover:dark:text-gray-200 dark:text-gray-300"
              >
                <div class="media">
                  <div class="media-content">
                    <component :is="(buyIcons as Record<string,unknown> )[menu.icon]" />
                    {{ menu.text }}
                  </div>
                </div>
              </o-dropdown-item>
            </a>
          </o-dropdown>
        </nav>
        <!-- nav - end -->

        <!-- social - start -->
        <div class="flex gap-4">
          <div
            class="flex flex-col items-center sm:flex-row sm:justify-center lg:justify-start gap-2.5 -ml-8"
          >
            <button
              id="theme-switch"
              class="ml-5 w-16 h-6 rounded-full flex items-center transition duration-300 focus:outline-none shadow"
              :style="`${
                themeDark
                  ? 'background-color: #363636;opacity: 0.6;'
                  : 'background-color: #363636a1;opacity: 0.6;'
              }`"
            >
              <div
                id="svg-theme-switch"
                :class="`
                border border-gray-400 dark:border-white
                w-8
                h-8
                relative
                rounded-full
                transition
                duration-500
                transform
                switch-icon
                ${
                  themeDark
                    ? `
                translate-x-full`
                    : `
                -translate-x-2`
                } 
                text-white`"
                @click="themeSwitch"
                v-html="themeSwitchIcon"
              ></div>
            </button>
          </div>
          <a
            href="https://www.instagram.com/yup.io_/"
            target="_blank"
            class="text-gray-400 hover:text-gray-500 active:text-gray-600 transition duration-100"
            aria-label="YUP on Instagram"
          >
            <svg
              class="w-5 h-5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
              />
            </svg>
          </a>

          <a
            href="https://twitter.com/yup_io"
            target="_blank"
            class="text-gray-400 hover:text-gray-500 active:text-gray-600 transition duration-100"
            aria-label="YUP on Twitter"
          >
            <svg
              class="w-5 h-5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
              />
            </svg>
          </a>
          <a
            href="https://github.com/Yup-io"
            target="_blank"
            class="text-gray-400 hover:text-gray-500 active:text-gray-600 transition duration-100"
            aria-label="YUP on Github"
          >
            <svg
              class="w-5 h-5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
          </a>
        </div>
        <!-- social - end -->
      </div>

      <div
        class="text-gray-600 dark:text-gray-300 text-sm text-center pt-8"
        style="display: flex; justify-content: center; align-items: center"
      >
        <p v-if="isTeamMember()" class="mr-2">
          <router-link to="/team-panel">
            <TeamIcon class="inline w-4 mx-1" />Team Panel
          </router-link>
        </p>
        <p class="mr-2">
          <router-link to="/change-log">
            <ClockIcon class="inline w-4 -mt-1 mx-1" />Change Log
          </router-link>
        </p>
        <p class="mr-2">
          <a target="_blank" href="https://www.coingecko.com/en/coins/yup" rel="nofollow"
            ><CoinGeckoIcon class="-mt-1 mx-1" />YUP on CoinGecko
          </a>
        </p>
      </div>
      <div
        class="text-gray-600 dark:text-gray-300 text-sm text-center pb-8"
        style="display: flex; justify-content: center; align-items: center"
      >
        <p>
          <a
            title="Install yup live mobile"
            href="https://play.google.com/store/apps/details?id=gf.info.yup&hl=en&gl=US"
            _target="blank"
          >
            <PlayStoreIcon class="w-36 mx-auto p-4"
          /></a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { getThemeMode } from "../../utils";
import { useMainStore } from "../../store/main";
import { useRoute } from "vue-router";
import CoinGeckoIcon from "icons/src/coinGecko.vue";
import ClockIcon from "icons/src/clock.vue";
import PlayStoreIcon from "icons/src/playStore.vue";
import UniSwapIcon from "icons/src/uniSwap.vue";
import QuickSwapIcon from "icons/src/quickSwap.vue";
import TeamIcon from "icons/src/team-icon.vue";

const ADMIN_IDS = [
  "kabessaxxxxx",
  "yupdev1-fed1b14f535d",
  "vern-e42334e165d0",
  "jackmcdermott",
  "wurstbrotxxx",
  "testxxxxxxxo",
  "andreix155xx",
];

export default defineComponent({
  name: "FooterTemplate",
  components: {
    CoinGeckoIcon,
    ClockIcon,
    PlayStoreIcon,
    UniSwapIcon,
    QuickSwapIcon,
    TeamIcon,
  },
  setup() {
    const isSwitchingTheme = ref(false);
    const buyIcons = {
      uniswap: UniSwapIcon,
      quickswap: QuickSwapIcon,
    };

    const linksBuyYup = [
      {
        text: "Buy on Uniswap",
        href:
          "https://app.uniswap.org/explore/tokens/base/0x01ccf4941298a0b5ac4714c0e1799a2df8387048?exactField=input&exactAmount=0.007&inputCurrency=ETH&chain=base&theme=dark",
        icon: "uniswap",
      },
    ];

    const menuDropDownBuyYUP = ref({
      links: linksBuyYup,
      text: "Buy YUP",
    });

    const isDarkTheme = () => store.theme === "dark";
    const route = useRoute();

    const store = useMainStore();
    store.theme = getThemeMode();

    const themeDark = ref(isDarkTheme());
    const darkIcon = `🌙`;

    const lightIcon = `🔆`;
    const themeSwitchIcon = ref(isDarkTheme() ? darkIcon : lightIcon);
    const disabledPaths = ["/profile", "/notifications", "/collection"];
    const isDisabled = (paths: string[], currentPath: string) =>
      paths.some((path: string) => currentPath.startsWith(path));
    const disabledFooter = ref(isDisabled(disabledPaths, route.path));

    const isTeamMember = () => {
      return store?.userData?.account && ADMIN_IDS.includes(store?.userData?.account);
    };

    watch(
      () => route.path,
      (newPath) => {
        disabledFooter.value = isDisabled(disabledPaths, newPath);
      }
    );

    const themeSwitch = async () => {
      if (!isSwitchingTheme.value) {
        const isDarkmode = document.documentElement.classList.contains("dark");
        isSwitchingTheme.value = true;
        if (isDarkmode) {
          themeDark.value = false;
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
          themeSwitchIcon.value = lightIcon;
          localStorage.setItem("theme", "light");
          store.theme = "light";
        } else {
          themeDark.value = true;
          document.documentElement.classList.remove("light");
          document.documentElement.classList.add("dark");
          themeSwitchIcon.value = darkIcon;
          localStorage.setItem("theme", "dark");
          store.theme = "dark";
        }
        isSwitchingTheme.value = false;
      }
    };

    return {
      themeDark,
      themeSwitchIcon,
      themeSwitch,
      disabledFooter,
      buyIcons,
      menuDropDownBuyYUP,
      isTeamMember,
    };
  },
});
</script>

<style lang="scss"></style>
