<template>
  <div ref="graphRef" class="d3-component flex justify-center lg:min-h-[40rem]  md:min-h-[40rem] sm:min-h-[40rem] w-full mr-8">
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3'

import { onMounted, ref, Ref } from 'vue'

   const props = defineProps({
    gradient: {
      required: true,
      type: Array
    },
    maxPoint: {
      required: true,
      type: Number
    },
    csv: {
      required: false,
      type: String,
      default: ''
    },
    chartData: {
      required: false,
      type: Array,
      default: () => []
    },
    svgWidth: {
      required: true,
      type: String
    },
    svgHeight: {
      required: true,
      type: String
    },
    my: {
      required: true,
      type: Number
    },
    mx: {
      required: true,
      type: Number
    }
  })
 
    const graphRef = ref(null) as unknown as Ref<HTMLElement>

    const mountGraph = async () => {
      if ((props.csv || props.chartData.length) && graphRef.value) {
        if (graphRef.value != null) {
          graphRef.value.innerHTML = ''
        }

        const width = Number(props.svgWidth)
        const height = Number(props.svgHeight) 

        const svg = d3
          .select(graphRef.value)
          .append('svg')
          .attr('width', '99%')
          .attr('height', '99%')
          .attr('viewBox', `0 0 ${width} ${height}`)
          .attr('preserveAspectRatio', 'xMidYMid meet')
          .append('g')
          .attr('transform', `translate(${props.mx},${props.my})`)

        let data: unknown
        if (props.csv) {
          data = await d3.csv(
            props.csv,

            (d: { date: unknown; value: unknown }) => {
              return {
                date: d3.timeParse('%Y-%m-%d')(d.date as string),
                value: d.value
              }
            }
          )
        } else {
          data = props.chartData
          data = (data as Array<{ date: Date; value: unknown }>).map((d: { date: unknown; value: unknown }) => {
            return {
              date: d3.timeParse('%Y-%m-%d')(d.date as string),
              value: d.value
            }
          })
        }

        const x = d3
          .scaleTime()
          .domain(d3.extent(data as never, (d: { date: string }) => d.date) as unknown as [Date, number])
          .range([0, width])
        const xAxis = svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))

        const y = d3
          .scaleLinear()
          // .domain([0, d3.max(data as never, (d: { value: number }) => +d.value)] as unknown as [number, number])
          .domain([0, props.maxPoint] as unknown as [number, number])
          .range([height, 0])
        svg.append('g').call(d3.axisLeft(y))

        svg
          .append('defs')
          .append('clipPath')
          .attr('id', 'clip')
          .append('rect')
          .attr('width', width)
          .attr('height', height)
          .attr('x', 0)
          .attr('y', 0)

        svg
          .append('linearGradient')
          .attr('id', 'area-gradient')
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', 0)
          .attr('y1', y(0))
          .attr('x2', 0)
          .attr('y2', y(props.maxPoint))
          .selectAll('stop')
          .data([
            { offset: '0%', color: props.gradient[0] },
            { offset: '30%', color: props.gradient[1] },
            { offset: '45%', color: props.gradient[2] },
            { offset: '55%', color: props.gradient[3] },
            { offset: '75%', color: props.gradient[4] },
            { offset: '100%', color: props.gradient[5] }
          ])
          .enter()
          .append('stop')
          .attr('offset', function (d) {
            return d.offset
          })
          .attr('stop-color', function (d: { color: string }) {
            return d.color
          } as unknown as string)

        let idleTimeout: ReturnType<typeof setTimeout> | null = null
        const idled = () => {
          idleTimeout = null
        }

        const updateChart = (event: { selection: unknown }) => {
          const extent = event.selection

          if (!extent) {
            if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350))
            x.domain([4, 8])
          } else {
            x.domain([x.invert((extent as unknown as number[])[0]), x.invert((extent as unknown as number[])[1])])
            area.select('.brush').call((brush as unknown as { move: () => void }).move)
          }

          xAxis.transition().duration(1000).call(d3.axisBottom(x))
          area
            .select('.myArea')
            .transition()
            .duration(1000)
            .attr('d', areaGenerator as unknown as () => string)
        }

        const brush = d3
          .brushX()
          .extent([
            [0, 0],
            [width, height]
          ])
          .on('end', updateChart)

        const area = svg.append('g').attr('clip-path', 'url(#clip)')

        const areaGenerator = d3
          .area()
          .x((d) => x((d as unknown as { date: Date }).date))
          .y0(y(0))
          .y1((d) => y((d as unknown as { value: number }).value))
        area
          .append('path')
          .datum(data)
          .attr('class', 'myArea')
          // .attr('fill', '#222')
          // .attr('fill-opacity', 0.3)
          .attr('stroke', '#333')
          .attr('stroke-width', 1)
          .attr('d', areaGenerator as unknown as () => string)

        area.append('g').attr('class', 'brush').call(brush)

        svg.on('dblclick', function () {
          x.domain(d3.extent(data as never, (d: { date: string }) => d.date) as unknown as [Date, number])
          xAxis.transition().call(d3.axisBottom(x))
          area
            .select('.myArea')
            .transition()
            .attr('d', areaGenerator as unknown as () => string)
        })
      }
    }

    onMounted(() => {
      mountGraph()
    })

</script>
