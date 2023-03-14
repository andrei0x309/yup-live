<template>
  <div v-if="!mobile" class="flex gap-4">
    <o-tooltip
      v-model:active="showUp"
      :triggers="['hover']"
      :autoClose="true"
      :multiline="true"
    >
      <template #content> x{{ rating }} </template>
      <ThumbsUp
        :key="`${hasVote}-${lastVote}`"
        :class="`w-6 cursor-pointer inline-block mr-2 thumb ${doingVote ? 'blink' : ''}`"
        :isSolid="refHasVote && lastVote"
        @click="doVote(true)"
      />
      <span
        v-if="positiveWeightRef > 0"
        v-html="formatNumber(positiveWeightRef, 2)"
      ></span>
    </o-tooltip>
    <o-tooltip
      v-model:active="showDown"
      :triggers="['hover']"
      :autoClose="true"
      :multiline="true"
    >
      <template #content> x{{ rating }} </template>
      <ThumbsDown
        :key="`${hasVote}-${lastVote}`"
        :class="`w-6 cursor-pointer inline-block mr-2 thumb ${doingVote ? 'blink' : ''}`"
        :isSolid="refHasVote && !lastVote"
        @click="doVote(false)"
      />
      <span
        v-if="negativeWeightRef > 0"
        v-html="formatNumber(negativeWeightRef, 2)"
      ></span>
    </o-tooltip>
  </div>
  <div v-else class="flex gap-4">
    <div>
      <ThumbsUp
        :key="`${hasVote}-${lastVote}`"
        :class="`opacity-80 w-5 cursor-pointer inline-block mr-1 thumb ${
          doingVote ? 'blink' : ''
        }`"
        :isSolid="refHasVote && lastVote"
        @click="doVote(true)"
      />
      <span
        v-if="positiveWeightRef"
        class="opacity-80 mr-1 text-[0.85rem]"
        v-html="formatNumber(positiveWeightRef, 2)"
      ></span>
    </div>
    <div>
      <ThumbsDown
        :key="`${hasVote}-${lastVote}`"
        :class="`opacity-80 w-5 cursor-pointer inline-block mr-1 thumb ${
          doingVote ? 'blink' : ''
        }`"
        :isSolid="refHasVote && !lastVote"
        @click="doVote(false)"
      />
      <span
        v-if="negativeWeightRef"
        class="opacity-80 mr-1 text-[0.85rem]"
        v-html="formatNumber(negativeWeightRef, 2)"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref, PropType } from "vue";
import ThumbsUp from "icons/src/thumbsUp.vue";
import ThumbsDown from "icons/src/thumbsDown.vue";
import { formatNumber } from "shared/src/utils/misc";
// import { useMainStore, openConnectModal } from '@/store/main'
import { fetchWAuth } from "shared/src/utils/auth";
import type { Vote } from "shared/src/types/vote";
// import { stackAlertError, stackAlertSuccess, stackAlertWarning } from '@/store/alertStore'
import type { IVotingDeps } from "shared/src/types/vote";

export default defineComponent({
  name: "Voting",
  components: {
    ThumbsUp,
    ThumbsDown,
  },
  props: {
    postId: {
      type: String,
      required: true,
    },
    positiveWeight: {
      required: false,
      type: Number,
      default: 0,
    },
    negativeWeight: {
      required: false,
      type: Number,
      default: 0,
    },
    hasVote: {
      required: true,
      type: Promise as PropType<Promise<Vote[]>>,
    },
    deps: {
      required: true,
      type: Object as PropType<IVotingDeps>,
    },
    mobile: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:vote"],
  setup(props, ctx) {
    const positiveWeightRef = ref(props.positiveWeight);
    const negativeWeightRef = ref(props.negativeWeight);
    const store = props.deps.useMainStore();
    const isAuth = ref(store.isLoggedIn);
    const rating = ref(0);
    let timer: undefined | number | string = undefined;
    const doingVote = ref(false) as Ref<boolean>;
    const vote = (ref({}) as unknown) as Ref<Vote>;
    const refHasVote = ref(false) as Ref<boolean>;
    const lastVote = ref(false) as Ref<boolean>;
    const showUp = ref(false) as Ref<boolean>;
    const showDown = ref(false) as Ref<boolean>;

    store.$subscribe(() => {
      isAuth.value = store.isLoggedIn;
    });

    const executeVote = async () => {
      const body = {} as Record<string, unknown>;
      let voteid = "";
      if (refHasVote.value) {
        voteid = vote.value._id.voteid;
      } else {
        body.postid = props.postId;
      }
      body.rating = rating.value;
      body.voter = store.userData.account;
      if (lastVote.value) {
        body.like = true;
      } else {
        body.like = false;
      }
      const req = await fetchWAuth(
        store,
        `${props.deps.apiBase}/votes${voteid ? "/" + voteid : ""}`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
      if (req.ok) {
        props.deps.stackAlertSuccess && props.deps.stackAlertSuccess("Rating submitted!");
        return await req.json();
      } else {
        const err = await req.text();
        if (err.includes("limit")) {
          props.deps.stackAlertError("Rating limit reached!!!");
        } else if (err.includes("requests")) {
          props.deps.stackAlertError(
            "You have made too many request try again after 24h!"
          );
        } else if (err.toLocaleLowerCase().includes("unauthorized")) {
          props.deps.stackAlertError("Seems your auth token has expired re-login!!");
        } else {
          props.deps.stackAlertError(
            "Rating not submitted due to error try to re-login!"
          );
        }
        return null;
      }
    };

    const checkHidden = () => {
      showDown.value = false;
      showUp.value = false;
      if (rating.value > 0 && lastVote.value) {
        showUp.value = true;
      } else if (rating.value > 0 && !lastVote.value) {
        showDown.value = true;
      }
    };

    const doVote = (voteType: boolean) => {
      if (!isAuth.value) {
        props.deps.openConnectModal && props.deps.openConnectModal(store);
        return;
      }
      if (timer && !doingVote.value) {
        clearTimeout(timer);
      }
      if (!doingVote.value) {
        const lastRating = rating.value;
        let sameType = true;

        if (voteType !== lastVote.value) {
          rating.value = 0;
          sameType = false;
        }
        lastVote.value = voteType;

        if (lastVote.value && rating.value < 3) {
          rating.value += 1;
        } else if (!lastVote.value && rating.value < 2) {
          rating.value += 1;
        }
        checkHidden();
        if (rating.value === lastRating && refHasVote.value && sameType) {
          props.deps.stackAlertWarning &&
            props.deps.stackAlertWarning("You already gave maximum rating.");
          return;
        }
        timer = (setTimeout(async () => {
          const postiveWeight = positiveWeightRef.value;
          const negativeWeight = negativeWeightRef.value;
          if (refHasVote.value) {
            if (vote.value.like !== voteType) {
              if (vote.value.like) {
                positiveWeightRef.value -=
                  store.userData.weight * (rating.value + vote.value.rating - 1);
                negativeWeightRef.value += store.userData.weight * rating.value;
              } else {
                negativeWeightRef.value -=
                  store.userData.weight * (rating.value + vote.value.rating - 1);
                positiveWeightRef.value += store.userData.weight * rating.value;
              }
            } else {
              if (vote.value.like) {
                positiveWeightRef.value +=
                  store.userData.weight * (rating.value - vote.value.rating);
              } else {
                negativeWeightRef.value +=
                  store.userData.weight * (rating.value - vote.value.rating);
              }
            }
          } else {
            if (voteType) {
              positiveWeightRef.value += store.userData.weight * rating.value;
            } else {
              negativeWeightRef.value += store.userData.weight * rating.value;
            }
          }
          doingVote.value = true;
          let reqVote;
          try {
            reqVote = await executeVote();
          } catch {
            // ignore
          }

          if (reqVote) {
            vote.value = reqVote;
            ctx.emit("update:vote", Promise.resolve([reqVote]));
            refHasVote.value = true;
          } else {
            positiveWeightRef.value = postiveWeight;
            negativeWeightRef.value = negativeWeight;
            refHasVote.value = false;
          }
          doingVote.value = false;
        }, 500) as unknown) as number | string;
      }
    };

    onMounted(() => {
      if (props.postId) {
        console.log(props.hasVote, "dddd");
        props.hasVote.then((res) => {
          if (res.length > 0) {
            vote.value = res[0] as Vote;
            refHasVote.value = true;
            lastVote.value = vote.value?.like;
            rating.value = vote.value?.rating;
          }
          checkHidden();
          console.log(vote.value, refHasVote.value, lastVote.value);
        });
      }
    });

    return {
      positiveWeightRef,
      negativeWeightRef,
      doVote,
      refHasVote,
      lastVote,
      showUp,
      showDown,
      rating,
      formatNumber,
      doingVote,
    };
  },
});
</script>

<style scoped lang="scss">
.thumb:active {
  transform: rotate3d(1, 1, 1, 55deg);
  transition: all 0.1s;
}
</style>