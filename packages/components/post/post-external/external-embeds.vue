<template>
  <component
    v-for="comEm of compEms"
    :is="comEm.component"
    :source="comEm.source"
    :type="comEm.type"
    :linkPreview="comEm.linkPreview"
    :key="comEm.source"
  />
</template>

<script lang="ts">
import { onBeforeMount, defineComponent, ShallowRef, PropType, shallowRef } from "vue";
import BtnSpinner from "icons/src/btnSpinner.vue";
import type { Embed, linkPreviewTypeEx } from "shared/src/types/post";

export default defineComponent({
  name: "ExternalEmbeds",
  components: { BtnSpinner },
  props: {
    embeds: {
      required: true,
      type: Array as PropType<Embed[]>,
    },
  },
  setup(props) {
    type EmbedComp = {
      component: ReturnType<typeof defineComponent>;
      source: string;
      type?: String;
      linkPreview?: linkPreviewTypeEx;
    };
    const compEms = shallowRef([]) as ShallowRef<EmbedComp[]>;
    const socialEmbed = import("components/post/post-external/social-web3-emebed.vue");
    const embedsProms = {
      youtube: import("components/post/post-external/youtube-embed.vue"),
      spotify: import("components/post/post-external/spotify-embed.vue"),
      twitter: socialEmbed,
      farcaster: socialEmbed,
      lens: socialEmbed,
    } as Record<string, Promise<typeof import("*.vue")>>;

    const embedsComp = {} as Record<string, ReturnType<typeof defineComponent>>;

    onBeforeMount(async () => {
      if (!props.embeds || !Array.isArray(props.embeds)) return;
      const localCompEms = [] as EmbedComp[];

      for (const em of props.embeds) {
        if (embedsComp[em.type]) {
          localCompEms.push({
            component: embedsComp[em.type],
            source: em.url,
            type: em.type,
            linkPreview: em.linkPreview,
          });
          continue;
        }

        embedsComp[em.type] = (await embedsProms[em.type]).default;
        localCompEms.push({
          component: embedsComp[em.type],
          source: em.url,
          type: em.type,
          linkPreview: em.linkPreview,
        });
      }
      if (localCompEms.length) compEms.value = localCompEms;
    });

    return {
      compEms,
    };
  },
});
</script>
