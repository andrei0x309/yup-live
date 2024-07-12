<template>
  <div class="bg-color table-list mb-4 mt-2 mx-auto w-[98%]">
    <ion-list
      v-for="sPost of scheduledPosts"
      :key="(sPost?._id as string)"
      :class="`${isScheduledLoading ? 'tableLoading' : ''}`"
      :loading="isScheduledLoading"
      class="mx-y"
      style="border-bottom: 1px solid #fcfcfc96"
    >
      <ion-item>
        <DateIcon />&nbsp;Created at:
        <div class="inline">
          {{ new Date(sPost.createdAt).toLocaleDateString() }} -
          {{ new Date(sPost.createdAt).toLocaleTimeString() }}
        </div>
      </ion-item>

      <ion-item>
        <DateIcon />&nbsp;Posting at:
        <div class="inline">
          {{ new Date(sPost?.scheduledUnixTime ?? Date.now() as number).toLocaleDateString() }}
          -
          {{ new Date(sPost?.scheduledUnixTime ?? Date.now() as number).toLocaleTimeString() }}
        </div>
      </ion-item>

      <ion-item v-if="sPost?.type">
        Type:&nbsp;<b>{{ sPost.type as string }}</b>
      </ion-item>

      <ion-item v-if="sPost.platforms">
        Platforms:&nbsp;<b>{{ sPost.platforms?.join(", ") }}</b>
      </ion-item>

      <ion-item>
        <ion-chip @click="() => cancelScheduledPost(sPost._id, sPost.type)"
          >Cancel</ion-chip
        >
      </ion-item>
    </ion-list>
    <div
      v-if="!scheduledPosts.length"
      class="text-center p-4 mt-8 text-[0.96rem] bg-stone-800"
    >
      You have no scheduled posts.
    </div>
  </div>
</template>

<script lang="ts">
import DateIcon from "icons/src/date.vue";
import { useMainStore } from "@/store/main";

import { IonList, IonItem, IonChip } from "@ionic/vue";
import {
  deleteScheduledTask,
  getScheduledPosts,
  getScheduledThreads,
} from "shared/src/utils/requests/web3-posting";
import type { IWeb3PostTask, IWeb3ThreadTask } from "shared/src/types/web3-posting";

import { onMounted, defineComponent, ref, onUnmounted, Ref } from "vue";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "SchedulePage",
  components: {
    DateIcon,
    IonList,
    IonItem,
    IonChip,
  },
  setup() {
    const store = useMainStore();
    const isScheduledLoading = ref(false);
    const scheduledPosts = ref([]) as Ref<
      Array<(IWeb3PostTask | IWeb3ThreadTask) & { type: string }>
    >;

    const loadSchedule = async () => {
      isScheduledLoading.value = true;
      try {
        const res = await Promise.all([
          getScheduledPosts({ store }),
          getScheduledThreads({ store }),
        ]);
        scheduledPosts.value = [
          ...res[0].map((p: Record<string, string>) => {
            p.type = "single post";
            return p;
          }),
          ...res[1].map((p: Record<string, string>) => {
            p.type = "thread";
            return p;
          }),
        ];
      } catch (error) {
        scheduledPosts.value = [];
        console.error(error);
      }
      isScheduledLoading.value = false;
    };

    const cancelScheduledPost = async (taskId: string, type: string) => {
      if (isScheduledLoading.value) return;
      isScheduledLoading.value = true;
      try {
        await deleteScheduledTask({
          store,
          taskId,
          isTread: type !== "single post",
        });
        scheduledPosts.value = scheduledPosts.value.filter((p) => p._id !== taskId);
      } catch (error) {
        console.error(error);
      }
      isScheduledLoading.value = false;
    };

    onMounted(async () => {
      loadSchedule();
    });

    onUnmounted(() => {
      // do nothing
    });

    return {
      isScheduledLoading,
      scheduledPosts,
      cancelScheduledPost,
    };
  },
});
</script>

<style lang="scss" scoped>
.tableLoading {
  animation: blink 1s linear infinite;
}

.pag {
  justify-self: end;
  margin-top: 0.6rem;
  width: 96vw;

  .btn {
    padding: 0.2rem 0.3rem;
    margin: 0.1rem;
    border-radius: 0.2rem;
    background-color: rgba(8, 8, 8, 0.6);
    border-top: 1px solid rgb(153 131 17 / 79%);
    border-bottom: 1px solid #a39d56;
  }
  .btn.active {
    box-shadow: inset 0 0 0.5rem 0.2rem rgb(189 154 14 / 27%);
  }

  .btn:hover {
    box-shadow: inset 0 0 0.5rem 0.2rem rgb(116 14 189 / 64%);
  }
}

.hr {
  background: #c98d0b;
  opacity: 0.6;
  margin-top: 0.5rem;
}
</style>
