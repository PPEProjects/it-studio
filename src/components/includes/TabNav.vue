<template>
  <a-menu
    v-model:selectedKeys="selectedKeys1"
    theme="dark"
    mode="horizontal"
    :style="{ lineHeight: '64px' }"
  >
    <a-menu-item v-for="item in tabs" :key="item.key">
      {{ item.tab }}
    </a-menu-item>
  </a-menu>
</template>

<script lang="ts" setup>
const props = defineProps<{
  tabs: {
    key: string
    tab: string
  }[]
}>()

const router = useRouter()

const selectedKeys1 = ref<string[]>([''])

const setTab = () => {
  const tab = router.currentRoute.value.query.tab
  if (tab) {
    if (props.tabs.find((item) => item.key === tab)) {
      selectedKeys1.value = [tab as string]
    } else {
      selectedKeys1.value = [props.tabs[0].key]
    }
  } else {
    selectedKeys1.value = [props.tabs[0].key]
  }
}
setTab()

watch(
    selectedKeys1,
    () => {
      router.replace({
        query: {
          tab: selectedKeys1.value[0]
        }
      })
    },
    { immediate: true }
)
</script>

<style scoped></style>
