<script setup lang="ts">
import { computed } from 'vue';
import {
  buildRootStyle,
  markViewBox,
  renderMarkChildren,
  type BrandMarkSharedProps,
} from '@kolektiv/brand-core';

defineOptions({ name: 'BrandMark', inheritAttrs: false });

const props = defineProps<BrandMarkSharedProps>();

const rootStyle = computed(() =>
  buildRootStyle({
    colors: props.colors,
    color: props.color,
    style: props.style,
  }),
);

const inner = computed(() =>
  renderMarkChildren({ parts: props.parts, variant: props.variant, title: props.title }),
);
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="markViewBox"
    fill="none"
    width="100%"
    :style="rootStyle"
    :role="title ? 'img' : undefined"
    :aria-label="title || undefined"
    :aria-hidden="title ? undefined : true"
    v-bind="$attrs"
    v-html="inner"
  />
</template>
