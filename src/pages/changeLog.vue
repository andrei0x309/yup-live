<template>
  <div class="page lg:max-width-90 md:max-width-60 sm:max-width-30 py-2 mx-auto">
    <div class="bg-color page-log w-full mb-4">
      <h1
        class="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl m-8 text-[#d7a73cd1]"
        style="text-shadow: 2px 2px 2px var(--glass-menu-bg)"
      >
        Changelog
      </h1>
      
      <section v-for="change of subsetChanges" :id="change.date" :key="change.date" :aria-labelledby="change.date" class="md:flex">
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
            <h3>{{ change.title}}</h3>
            <div v-html="change.html" ></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChangeLog",
  components: {
    // DangLoader,
  },
  setup() {

    const changes = [
        {
        date: '',
        title: '',
        html: `
        `
    }].reverse()

    const subsetChanges = changes.slice(0,10)

    return {
      subsetChanges

    };
  },
});
</script>

<style lang="scss">
.page-log {
  min-height: calc(100vh - 2rem);
  text-align: justify;

}
</style>
