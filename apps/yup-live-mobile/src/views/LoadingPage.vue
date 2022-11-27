<template>
  <ion-page>
    <ion-content :fullscreen="true">
        <ion-loading
        :is-open="loading"
        message="Please wait..."
        :duration="5000"
      >
      </ion-loading>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonLoading, IonPage, onIonViewDidLeave } from "@ionic/vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "LoadingPage",
  components: {
    IonContent,
    IonPage,
    IonLoading
  },
  setup() {
    const loading = ref(true);
    onIonViewDidLeave(() => {
        loading.value = false
    })
    return {
    loading
  }
  }
});
</script>
