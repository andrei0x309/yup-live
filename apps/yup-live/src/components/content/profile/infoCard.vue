<template>
  <section class="antialiased text-gray-200 mx-4 info-card hidden lg:block">
    <div class="flex flex-col justify-center h-full">
      <div class="pinfo w-full h-full overflow-x-hidden overflow-y-scroll max-w-2xl mx-auto shadow-lg rounded-sm">
        <header class="px-5 py-4">
          <div class="border-b font-semibold text-left mb-2 mr-2 pb-2 dimB">Account Bio</div>
          <div class="border-b mb-2 mt-2 p-4 underBio">{{ bio }}</div>
        </header>

        <div class="px-3 overflow-x-hidden">
          <table class="table-auto w-full">
            <thead class="text-xs font-semibold uppercase text-gray-400">
              <tr>
                <th class="pt-2">
                  <div class="font-semibold text-left">Field</div>
                </th>
                <th class="pt-2">
                  <div class="font-semibold text-left">Value</div>
                </th>
              </tr>
            </thead>

            <tbody class="text-sm">
              <tr v-for="field of fields" :key="field.name" class="border-b dimB">
                <td class="pt-2">
                  <div class="text-left font-medium">
                    {{ field.name }}
                  </div>
                </td>
                <td class="pt-2">
                  <div class="text-left font-medium font-semibold">
                    {{ field.value }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { onMounted, defineComponent, PropType } from 'vue'
import type { NameValue } from 'shared/dist/types/account'

export default defineComponent({
  name: 'ProfileInfoCard',
  props: {
    bio: {
      type: String,
      default: ''
    },
    fields: {
      type: Array as PropType<Array<NameValue>>,
      default: () => [
        {
          name: '',
          value: ''
        }
      ]
    }
  },
  setup() {
    onMounted(() => {
      // nothing
    })
  }
})
</script>

<style lang="scss">
html {
  --profile-info-card-bg: #c7bfb8eb;
  --profile-card-text: black;
}

html[class='dark'] {
  --profile-card-bg: #151515;
  --profile-info-card-text: #dadada;
}

.info-card {
  width: 60%;
  height: 31rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px 5px rgb(0 0 0 / 20%);
  font-size: 0.74rem;
  color: var(--profile-info-card-text);
  background: var(--profile-card-bg);

  .underBio {
    border-color: rgb(147 147 147 / 28%);
    box-shadow: 1px 2px 3px black;
  }
  .dimB {
    border-color: rgba(105, 105, 105, 0.726);
  }

  div div table {
    margin: 0;
  }
  .pinfo {
    @-moz-document url-prefix() {
      scrollbar-width: thin;
      scrollbar-color: #222 #444;
    }
  }

  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(68, 68, 68, 0.623);
  }
  ::-webkit-scrollbar-thumb {
    background: #252525;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #111;
  }
}
</style>
