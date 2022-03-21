<template>
  <div class="bg-color token-metrics w-full">
    <div>
      <span class="section-title">YUP price</span>
      <template v-if="!dataGecko">
        <o-skeleton :animated="true"></o-skeleton>
        <span class=""><o-skeleton :animated="true"></o-skeleton></span>
      </template>
      <template v-else>
        <h2>
          {{`$${(dataGecko as any).market_data.current_price.usd?.toFixed(2)} `}}
        </h2>
        <sup :class="`p-1 font-06 ${(dataGecko as any).market_data.price_change_24h < 0 ? 'price-red' : 'price-green' }`">
          {{ Math.abs((dataGecko as any).market_data.price_change_24h * 100).toFixed(2) }}%
        </sup>
        <span
          class="block font-088 faded-darker mt-2"
          >{{`Mcap: $${numeral((dataGecko as any).market_data.market_cap.usd.toFixed(0))}`}}</span
        >
      </template>
    </div>
    <!-- SUPPLY DATA IS practically LOREM IPSUM token contract should implement supply -->
    <div>
      <span class="section-title">Supply</span>
      <template v-if="!dataSupply">
        <o-skeleton :animated="true"></o-skeleton>
        <span class=""><o-skeleton :animated="true"></o-skeleton></span>
      </template>
      <template v-else>
        <h2>
          {{`${numeral((dataSupply as any).YUP.supply?.split('.')[0])} YUP`}}
        </h2>
        <span class="block font-088 faded-darker mt-2">{{`/${numeral((dataSupply as any).YUP.max_supply?.split('.')[0])} YUP`}}</span>
      </template>
    </div>
    <div>
      <span class="section-title">Total Votes</span>
      <template v-if="!dataActionCount">
        <o-skeleton :animated="true"></o-skeleton>
        <span class=""><o-skeleton :animated="true"></o-skeleton></span>
      </template>
      <template v-else>
        <h2>
          {{ `${dataActionCount} ` }}
        </h2>
        <span class="block font-088 faded-darker mt-2">&nbsp;</span>
      </template>
    </div>
    <div>
      <span class="section-title">Daily distribution</span>
      <template v-if="!dataEmissions || !dataGecko">
        <o-skeleton :animated="true"></o-skeleton>
        <span class=""><o-skeleton :animated="true"></o-skeleton></span>
      </template>
      <template v-else>
        <h2>
          {{ `${dataEmissions} YUP` }}
        </h2>
        <span
          class="block font-088 faded-darker mt-2"
          >{{`$${numeral( ((dataEmissions as number) * (dataGecko as any).market_data.current_price.usd).toFixed(0) )}`}}</span
        >
      </template>
    </div>
  </div>
</template>

<script lang="ts">
// import { useRoute, useRouter } from 'vue-router'
import {
  onMounted,
  // inject,
  ref,
  //   reactive,
  //   computed,
  onUnmounted,
  defineComponent,
  Ref
} from 'vue'

export default defineComponent({
  name: 'TokenMetrics',
  components: {},
  setup() {
    const dataEmissions: Ref<unknown> = ref(null)
    const dataSupply: Ref<unknown> = ref(null)
    const dataGecko: Ref<unknown> = ref(null)
    const dataActionCount: Ref<unknown> = ref(null)

    const currentDayEmission = async () => {
      const today = new Date()
      if (today.getFullYear() > 2024 && today.getMonth() > 8 && today.getDate() > 21) {
        return 10000
      }
      const yearData = await import(/* @vite-ignore */ `/emissions/years/${today.getFullYear()}.js`)
      const dateString = `${today.getFullYear()}-${('0' + String(today.getMonth())).slice(-2)}-${('0' + String(today.getDate())).slice(-2)}`
      return yearData.data[dateString]
    }

    const getSupply = async () => {
      const req = await fetch('https://api.eosn.io/v1/chain/get_currency_stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          code: 'token.yup',
          symbol: 'YUP'
        })
      })
      if (!req.ok) {
        throw new Error(`Request failed with status ${req.status}`)
      }
      const data = await req.json()
      return data
    }
    const getGeckoData = async () => {
      const req = await fetch(' https://api.coingecko.com/api/v3/coins/yup')
      if (!req.ok) {
        throw new Error(`Request failed with status ${req.status}`)
      }
      const data = await req.json()
      return data
    }

    const getActionsCount = async () => {
      const req = await fetch('https://api.yup.io/metrics/total-votes')
      if (!req.ok) {
        throw new Error(`Request failed with status ${req.status}`)
      }
      const data = await req.json()
      return data
    }
    const numeral = (s: string) => {
      return s.replace(/(^|[^\w.])(\d{4,})/g, (_$0: string, $1: string, $2: string) => {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,')
      })
    }
    // const showAlertError = (title, message) => {
    //   alertHidden.value = false;
    //   alertTitle.value = title;
    //   alertMessage.value = message;
    //   alertType.value = "error";
    // };

    // const showAlertSuccess = (title, message) => {
    //   alertHidden.value = false;
    //   alertTitle.value = title;
    //   alertMessage.value = message;
    //   alertType.value = "success";
    // };

    onMounted(async () => {
      // do nothing
      currentDayEmission().then((emission) => {
        dataEmissions.value = emission
        console.log('emission', emission)
      })
      getSupply().then((supply) => {
        dataSupply.value = supply
        console.log('supply', supply)
      })
      getGeckoData().then((gecko) => {
        dataGecko.value = gecko
        console.log('geko', gecko)
      })
      getActionsCount().then((actionCount) => {
        dataActionCount.value = actionCount
        console.log('actionCount', actionCount)
      })
    })

    onUnmounted(() => {
      // do nothing
    })

    return {
      numeral,
      dataEmissions,
      dataSupply,
      dataGecko,
      dataActionCount
    }
  }
})
</script>

<style lang="scss">
.token-metrics {
  padding: 1rem;
  margin-top: 2rem;
  min-height: 7.4rem;
  color: #1b1b1b;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  display: grid;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  box-shadow: 0.2rem 0.5rem 0rem;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  h2 {
    display: inline-block;
  }
}

.font-06 {
  font-size: 0.65rem;
}

.font-088 {
  font-size: 0.88rem;
}

.price-green {
  color: #1bc5bd;
}

.price-red {
  color: #ff5252;
}

.faded-darker {
  color: var(--color-text-faded2);
}

.section-title {
  color: var(--color-text-faded);
  font-size: 0.9rem;
  display: block;
}

.o-sklt__item {
  background-size: 400% 100%;
  height: 1.3rem;
  border-radius: 4rem;
}

html[class='dark'] .o-sklt__item {
  background: linear-gradient(90deg, var(--headerColor1) 25%, var(--headerColor3) 50%, var(--bg-panel) 75%);
}

html[class='dark'] .o-sklt__item--animated {
  background-size: 400% 100%;
}

html[class='dark'] .token-metrics {
  color: ghostwhite;
  box-shadow: 0.2rem 0.5rem 0rem #1b1b1b;
}
</style>
