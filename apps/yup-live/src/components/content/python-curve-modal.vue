<template>
  <div class="bg-color modal w-full mb-4">
    <div v-show="pyIsLoading">
      <h2 class="block">Loading Python Envoirment</h2>
      <PyLoader />
      <pre>
      <span v-for="line of loadingMsg" :key="`${line}-${Math.random()}`">
        {{line}}
      </span>
      </pre>
    </div>
    <div v-show="!pyIsLoading">
      <div id="plot"></div>
      <div ref="pyScriptContainer" class="py-script"></div>
    </div>
    <div id="test"></div>
  </div>
</template>

<script lang="ts">
import PyLoader from '@/components/content/py-loader.vue'

import {
  onMounted,
  defineComponent,
  // inject,
  ref,
  //   reactive,
  //   computed,
  onUnmounted
  // Ref
} from 'vue'

export default defineComponent({
  name: 'PyPlot',
  components: { PyLoader },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    class CappedArray extends Array {
      constructor(length = 8) {
        super(length)
        this.length = length
      }

      push(...args: unknown[]) {
        super.push(...args)
        if (this.length > 8) {
          this.shift()
        }
        return 0
      }
    }

    // const store = useMainStore()
    const pyScriptContainer = ref(null)
    const pyIsLoading = ref(true)
    const loadingMsg = ref(new CappedArray(8))

    const getPyEnv = () => {
      const el = window.document.createElement('py-env')
      el.innerHTML = `
        - numpy
        - matplotlib
      `
      return el
    }

    const hookConsole = () => {
      const stdlog = console.log.bind(console)
      console.log = function () {
        // eslint-disable-next-line prefer-rest-params
        loadingMsg.value.push(Array.from(arguments).join(' '))
        // eslint-disable-next-line prefer-rest-params
        stdlog.apply(console, arguments as unknown as unknown[])
      }
    }

    const getPyScript = () => {
      const customEl = window.customElements.get('py-script')
      if (customEl) {
        const el = new customEl()
        // @ts-expect-error - output does not exist
        el.output = 'plot'
        el.innerHTML = `
import matplotlib
from matplotlib import pyplot as plt
import numpy as np
from js import pyCallback, plotData

plotStrArr = np.fromstring(plotData, dtype=float, sep=',')

matplotlib.rcParams['axes.edgecolor'] = '#fff'
plt.rcParams.update({'text.color': "white", 'axes.labelcolor': "white"})

def gini(arr):
    count = arr.size
    coefficient = 2 / count
    indexes = np.arange(1, count + 1)
    weighted_sum = (indexes * arr).sum()
    total = arr.sum()
    constant = (count + 1) / count
    return coefficient * weighted_sum / total - constant


X_lorenz = plotStrArr.cumsum() / plotStrArr.sum()
X_lorenz = np.insert(X_lorenz, 0, 0) 
X_lorenz[0], X_lorenz[-1]
fig, ax = plt.subplots(figsize=[6,6])
## scatter plot of Lorenz curve
ax.scatter(np.arange(X_lorenz.size)/(X_lorenz.size-1), X_lorenz, 
            marker='*', color='white', s=100)
ax.plot([0,1], [0,1], color='orange')
ax.set_aspect('equal')
ax.set_title('Gini Index: {0}'.format(abs(gini(plotStrArr))))
ax.set_facecolor((0.26, 0.26, 0.26))

ax.tick_params(color='w', labelcolor='w')
for spine in ax.spines.values():
    spine.set_edgecolor('w')

fig.patch.set_facecolor('#222')

pyCallback()
fig
`
        return el
      }
      return document.createElement('py-script')
    }

    onMounted(async () => {
      hookConsole()
      const docHead = window.document.head
      docHead.appendChild(getPyEnv())
      // @ts-expect-error - possibly null
      window['pyCallback'] = () => {
        pyIsLoading.value = false
      }
      // @ts-expect-error - possibly null
      window.plotData = props.data.join(',')
      const pythonScript = window.document.createElement('script')
      pythonScript.src = 'https://pyscript.net/alpha/pyscript.js'
      pythonScript.defer = true
      pythonScript.onload = async () => {
        const pyScript = getPyScript()
        // @ts-expect-error - possibly null
        pyScriptContainer.value.appendChild(pyScript)
        // @ts-expect-error - evaluate does not exist
        pyScript.evaluate()
      }
      docHead.appendChild(pythonScript)
    })

    onUnmounted(() => {
      // do nothing
    })

    return { pyScriptContainer, pyIsLoading, loadingMsg }
  }
})
</script>

<style lang="scss">
.modal {
  padding: 1rem;
  margin-top: 0.2rem;
  min-height: 18rem;
  font-size: 0.96rem;
  font-weight: 200;
  text-align: center;
  display: grid;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-template-columns: 1fr;
  max-width: 90vw;
  margin: auto;
}
</style>
