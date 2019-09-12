<template>
  <div>
    <shop-rakuten v-if="mall === 'rakuten'" />
    <shop-yahoo v-if="mall === 'yahoo'" />
  </div>
</template>

<script>
import ShopRakuten from '@/views/shops/components/Rakuten'
import ShopYahoo from '@/views/shops/components/Yahoo'

export default {
  name: 'ShopsTabMall',
  components: { ShopYahoo, ShopRakuten },
  props: {
    mall: {
      type: String,
      required: true
    }
  }
}
</script>
