<template>
  <div class="page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto">
    <div class="bg-color page-log w-full mb-4">
      <h1
        class="text-4xl font-extrabold tracking-tight sm:text-5xl m-8 text-[#ffc400ad]"
        style="text-shadow: 2px 2px 2px var(--glass-menu-bg)"
      >
        Changelog Yup Live Web/Android
      </h1>

      <section
        v-for="change of subsetChanges"
        :id="change.date"
        :key="change.date"
        :aria-labelledby="change.date"
        class="md:flex"
      >
        <h2
          id="2022-09-07-heading"
          class="pl-7 text-sm leading-6 text-slate-500 md:w-1/4 md:pl-0 md:pr-12 md:text-right"
        >
          {{ change.date }}
        </h2>
        <div class="relative pt-2 pl-7 md:w-3/4 md:pt-0 md:pl-12 pb-16">
          <div class="absolute bottom-0 left-0 w-px bg-slate-200 -top-3 md:top-2.5"></div>
          <div
            class="absolute -top-[1.0625rem] -left-1 h-[0.5625rem] w-[0.5625rem] rounded-full border-2 border-slate-300 bg-white md:top-[0.4375rem]"
          ></div>
          <div
            class="max-w-none prose-h3:mb-4 prose-h3:text-base prose-h3:leading-6 prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600"
          >
            <h3 class="font-weight-800 mb-4">{{ change.title }}</h3>
            <div>
              <ol>
                <li v-for="(c, i) of change.changes" :key="i">{{ c }}</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <CustomButton
        v-if="hasMore"
        :icon="AddIcon"
        text="Load More"
        class="mx-auto mt-4 mb-4"
        @click="loadMore"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CustomButton from "components/functional/customButton.vue";
import AddIcon from "icons/src/add.vue";
import { useHead } from "@unhead/vue";

import { changes } from "shared/src/utils/changeLog";
import { getStaticMetaFrame } from "shared/src/utils/frame";

const siteData = {
  title: `Yup Live ChangeLog`,
  description: `Sumary of changes to yup live, all code is open source and available on github`,
};

useHead({
  title: siteData.title,
  meta: [
    {
      name: "description",
      content: siteData.description,
    },
    {
      name: "og:image",
      content: `/share/yup-live-ogs/og-yup-live-changelog.png`,
    },
    ...getStaticMetaFrame(`/share/yup-live-ogs/og-yup-live-changelog.png`),
  ],
});

const subsetChanges = ref(changes.slice(0, 10));
const hasMore = ref(true);

const loadMore = () => {
  const len = subsetChanges.value.length;
  subsetChanges.value.push(...changes.slice(len, len + 10));
  if (len + 10 >= changes.length) {
    hasMore.value = false;
  }
};
</script>

<style scoped lang="scss">
.page-log {
  min-height: calc(100vh - 2rem);
  text-align: justify;
  max-width: 98%;
  margin-left: auto;
  margin-right: auto;
}
</style>
