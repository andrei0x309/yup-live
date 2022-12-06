<template>
      <ion-page>
    <HeaderBar text="METRICS" :menu="true" />
    <ion-content :fullscreen="false" class="ion-padding mt-4">
  <div class="bg-color token-metrics w-full">
    <div class="box">
      <span class="section-title">YUP price</span>
      <template v-if="!dataGecko || !dataSupply">
        <ion-skeleton-text :animated="true"/>
        <span class=""><ion-skeleton-text :animated="true"/></span>
      </template>
      <template v-else>
        <h2>
          {{ `$${dataGecko.value.price}` }}
        </h2>
        <sup :class="`p-1 font-06 ${dataGecko.value.priceChangeRaw < 0 ? 'price-red' : 'price-green'}`">
          {{ dataGecko.value.priceChange }}%
        </sup>
        <span class="block font-088 faded-darker mt-2">{{ `Mcap: $${dataSupply.value.mcap}` }}</span>
      </template>
    </div>
    <div class="box">
      <span class="section-title">Supply</span>
      <template v-if="!dataSupply">
        <ion-skeleton-text :animated="true"/>
        <span class=""><ion-skeleton-text :animated="true"/></span>
      </template>
      <template v-else>
        <h2>
          {{ `${dataSupply.value.supply} YUP` }}
        </h2>
        <span class="block font-088 faded-darker mt-2">{{ `/ ${dataSupply.value.maxSupply} YUP` }}</span>
      </template>
    </div>
    <div class="box">
      <span class="section-title">Total Votes</span>
      <template v-if="!dataActionCount">
        <ion-skeleton-text :animated="true"/>
        <span class=""><ion-skeleton-text :animated="true"/></span>
      </template>
      <template v-else>
        <h2>
          {{ `${dataActionCount.value.actCount} ` }}
        </h2>
        <span class="block font-088 faded-darker mt-2">This month: {{ dataActionCount.value.actCountMonth }}</span>
      </template>
    </div>
    <div class="box">
      <span class="section-title">Daily distribution</span>
      <template v-if="!dataEmissions || !dataGecko">
        <ion-skeleton-text :animated="true"/>
        <span class=""><ion-skeleton-text :animated="true"/></span>
      </template>
      <template v-else>
        <h2>
          {{ `${dataEmissions.value.emissions} YUP` }}
        </h2>
        <span class="block font-088 faded-darker mt-2">{{ `$${dataEmissions.value.emissionsValue}` }}</span>
      </template>
    </div>
  </div>
  </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent, IonSkeletonText } from '@ionic/vue'
import HeaderBar from '@/components/template/header-bar.vue'
import {
  onMounted,
  // inject,
  ref,
  //   reactive,
  computed,
  onUnmounted,
  defineComponent,
  ComputedRef,
  Ref,
} from 'vue'

import { formatNumber } from 'shared/src/utils/misc'

export default defineComponent({
  name: 'TokenMetrics',
  components: {IonPage, IonContent, IonSkeletonText, HeaderBar },
  setup() {
    type GeckoData = Ref<ComputedRef<{ price: string; priceRaw: number; priceChangeRaw: number; priceChange: string }>>
    type DataEmissions = Ref<ComputedRef<{ emissions: string; emissionsValue: string }>>
    type DataActCount = Ref<ComputedRef<{ actCount: string; actCountMonth: string }>>
    type DataSupply = Ref<ComputedRef<{ supply: string; mcap: string; maxSupply: string }>>

    const dataEmissions: DataEmissions = ref(null) as unknown as DataEmissions
    const dataSupply: DataSupply = ref(null) as unknown as DataSupply
    const dataGecko: GeckoData = ref(null) as unknown as GeckoData
    const dataActionCount: DataActCount = ref(null) as unknown as DataActCount

    const currentDayEmission = async () => {
      const today = new Date()
      if (today.getFullYear() > 2024 && today.getMonth() > 8 && today.getDate() > 21) {
        return 10000
      }
      const yr = await Promise.all([import('@/res/years/2022'), import('@/res/years/2023'), import('@/res/years/2023')])
      const yearData = yr.reduce((pv, cv) => {
       return{ ...pv, ...cv.data }
      }, {}) as any
      const dateString = `${today.getFullYear()}-${('0' + String(today.getMonth() + 1)).slice(-2)}-${('0' + String(today.getDate())).slice(
        -2
      )}`
      const offsetContract = 5546
      return yearData[dateString] - offsetContract
    }

    const getSupply = async () => {
      const req = await fetch('https://api.yup.io/metrics/current-supply', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
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
      const req = fetch('https://api.yup.io/metrics/total-votes')
      const req2 = fetch('https://api.yup.io/metrics/total-votes/last-month')
      const [res, res2] = await Promise.all([req, req2])
      if (!res.ok || !res2.ok) {
        throw new Error(`One request failed with status ${res.status} |  ${res2.status}`)
      }
      const [data, data2] = await Promise.all([res.json(), res2.json()])
      return {
        total: data,
        lastMonth: data2
      }
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
        dataEmissions.value = computed(() => {
          return {
            emissions: formatNumber(emission, 0),
            emissionsValue: formatNumber(emission * dataGecko.value.value.priceRaw, 2)
          }
        })
      })
      const gKP = getGeckoData().then((gecko) => {
        dataGecko.value = computed(() => {
          return {
            price: formatNumber(gecko.market_data.current_price.usd, 2),
            priceRaw: gecko.market_data.current_price.usd,
            priceChangeRaw: gecko.market_data.current_price.usd_change_24h,
            priceChange: Math.abs(gecko.market_data.price_change_percentage_24h).toFixed(2)
          }
        })
      })
      getSupply().then((supply) => {
        gKP.then(() => {
          dataSupply.value = computed(() => {
            return {
              supply: formatNumber(supply.totalSupply, 0),
              maxSupply: formatNumber(supply.supplyWhenInfStop, 0),
              mcap: formatNumber(supply.totalSupply * dataGecko.value.value.priceRaw, 0)
            }
          })
        })
      })
      getActionsCount().then((actionCount) => {
        dataActionCount.value = computed(() => {
          return {
            actCount: formatNumber(actionCount.total, 0),
            actCountMonth: formatNumber(actionCount.lastMonth, 0)
          }
        })
      })
    })

    onUnmounted(() => {
      // do nothing
    })

    return {
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

  --priceGreen: #1bc5bd;
  --priceRed: #ff5252;

   margin-top: 10%;
    min-height: 7.4rem;
    color: #818181;
    font-size: 1.3rem;
    font-weight: bold;
    text-align: center;
    display: grid;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    box-shadow: 0 0 20rem rgb(219 219 219 / 28%);
    grid-template-columns: 1fr;

  h2 {
    display: inline-block;
  }

  .box {
    border: 1px solid #222;
    padding: 1rem;
  }

}

.font-06 {
  font-size: 0.75rem;
}

.font-088 {
  font-size: 0.88rem;
}

.price-green {
  color: var(--priceGreen);
}

.price-red {
  color: var(--priceRed);
}

.faded-darker {
  color: #ddddddab;
}

.section-title {
  color: #c3c3c3;
  font-size: 0.9rem;
  display: block;
}

ion-skeleton-text {
    --border-radius: 9999px;
    --background: linear-gradient(90deg, #222 25%, #555 50%, #888 75%);
  }


html[class='dark'] .o-sklt__item--animated {
  background-size: 400% 100%;
}

html[class='dark'] .token-metrics {
  color: ghostwhite;
  box-shadow: 0.2rem 0.5rem 0rem #1b1b1b;
}
</style>
