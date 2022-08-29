<template>
<div id="nexus6p">
	<div class="profile">
		<div class="profile-top">
			<div class="profile-bg">
			</div>
			<div class="profile-mask">
			</div>
			<div class="post-details">
				<InfoIcon :color="color" class="w-16" style="opacity: 0.6"/>
				<div class="personal-details">
					<div>Post Info:</div>
				</div>
			</div>
		</div>
		<div class="profile-bottom">
			<div class="profile-container contact-info open">
			   <p v-for="info of postInfo" :key="info.name">
			   <b>{{info.name}}:</b> <span v-html="info.value" ></span>
			   </p>
			</div>
		</div>
		<!-- <div class="menu">

			<div class="menu-item" menu-data="profile-map"><i class="glyphicon glyphicon-map-marker"></i></div>
			<div class="menu-item" menu-data="contact-info"><i class="glyphicon glyphicon-earphone"></i></div>
			<div class="menu-item" menu-data="events"><i class="glyphicon glyphicon-calendar"></i></div>
			<div class="menu-item" menu-data="portfolio"><i class="glyphicon glyphicon-folder-open"></i></div>
			<i id="menu-icon" class="glyphicon glyphicon-menu-hamburger"></i>
		</div> -->
	</div>
</div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, PropType } from 'vue'
import InfoIcon from '../icons/infoIcon.vue'
import type { NameValue } from '@/types/common'

export default defineComponent({
  name: 'PostInfo',
  components: {
	InfoIcon
  },
  props: {
	postInfo: {
      type: Array as PropType<Array<NameValue>>,
      default: () => [{
        name: '',
        value: '',
      }],
	},
	color: {
	  required: false,
	  type: String,
	  default: '#020201',
	},
  },
  setup() {
    const isError = ref(false)
    const isLoading = ref(true)

    const onError = () => {
      isError.value = true
    }

    const onLoad = () => {
      isLoading.value = false
    }

    onMounted(() => {
      // nothing
    })

    return {
      onError,
      onLoad,
      isLoading,
      isError,
    }
  }
})
</script>

<style lang="scss">

html {
  --post-info-card-top-bg-from1: #c98d0b;
  --post-info-card-top-bg-from2: #cba655;
  --post-info-card-bottom-bg: #ffffff61;
  
}

html[class='dark'] {
  --post-info-card-top-bg-from1: #1d55ab;
  --post-info-card-top-bg-from2: #1d55ab;
  --post-info-card-bottom-bg: #2626263b;
}


#nexus6p {
    width: 18rem;
    height: 30rem;
    position: relative;
    margin: 2.5rem;
}

.profile{
	width:100%;
	height: 100%;
}

.profile-top{
	position:relative;
	width: 100%;
	height: 13rem;
	display:block;
}

.profile-bg{
	position: absolute;
    width: 100%;
    height: 100%;
    display: block;
    -webkit-clip-path: polygon(0% 0%, 0% 80%, 100% 100%, 100% 0%);
    clip-path: polygon(0% 0%, 0% 80%, 100% 100%, 100% 0%);
    background: radial-gradient(ellipse at bottom, var(--post-info-card-top-bg-from1) 0%, rgba(10, 28, 56, 0.15) 100%);
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
}

.profile-mask {
    position: absolute;
    width: 100%;
    height: 92%;
    background: radial-gradient(ellipse at bottom, var(--post-info-card-top-bg-from2) 0%, rgba(10, 28, 56, 0.15) 100%);
    -webkit-clip-path: polygon(0% 0%, 0% 80%, 100% 100%, 100% 0%);
    clip-path: polygon(0% 0%, 0% 80%, 100% 100%, 100% 0%);
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
}

.post-details{
	z-index: 1;
	width: 100%;
	position: absolute;
	top:30%;
	left:0;
	padding: 10px 0;
   //background: rgba(50,50,50, 0.7);
	& *{
		display:inline-block;
		vertical-align: top;
	}
	& img{
		border:2px solid white;
		width:20%;
		border-radius: 50%;
		position: relative;
    left: 5%;
	}
}

.personal-details {
    margin-left: 2rem;
    padding-top: 1rem;
}

.profile-bottom{
	text-align: left;
	font-size: 0.88rem;
	margin-top: -4rem;
	
	p {
		padding: 0.5rem;
	}
}

.profile-bottom .profile-container{
    height: 20rem;
    padding: 4rem 1rem 1rem 1rem;
	background-color: var(--post-info-card-bottom-bg);
	border-radius: 0.5rem;
}


</style>