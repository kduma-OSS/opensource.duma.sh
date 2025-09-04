<template>

  <UPageSection :description="description" :links="[
    {
      label: 'View All',
      to: link,
      color: 'neutral',
      variant: 'subtle',
      trailingIcon: 'i-lucide-arrow-right'
    }
  ]">
    <template #title>
      Featured
      <ProseA :href="link">
        {{ title }}
      </ProseA>
    </template>
    <template #body>
      <ProseCardGroup>
        <ProseCard v-for="item in featured" :icon="item.featured_icon ?? ''" :to="item.path ?? item.github ?? ''" :target="item.path ? '' : '_blank'">
          <template #title>
            {{item.title}}
            <Icon name="bxl:github" v-if="!item.path && item.github"/>
          </template>
          {{item.featured_description ?? item.description}}
        </ProseCard>
      </ProseCardGroup>
    </template>
  </UPageSection>
</template>

<script>

import {collect} from "collect.js";

export default {
  name: "ProjectsFeatured",
  props: {
    type: {
      type: String,
      default: 'app'
    },
    link: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Apps & Tools'
    },
    description: {
      type: String,
      default: ''
    }
  },
  async setup(props) {
    let items, list, featured;
    [items, list] = await Promise.all([
      queryCollection('docs')
          .where('type', '=', props.type)
          .order('active', 'DESC')
          .order('title', 'ASC')
          .select('path', 'id', 'title', 'description', 'type', 'platform', 'active', 'github', 'featured', 'list_title', 'system', 'system_url', 'featured_description', 'featured_icon')
          .all(),

      queryCollection('data')
          .where('type', '=', props.type)
          .order('active', 'DESC')
          .order('title', 'ASC')
          .select('id', 'title', 'description', 'type', 'platform', 'active', 'github', 'featured', 'list_title', 'system', 'system_url', 'featured_description', 'featured_icon')
          .all(),
    ]);

    list = collect(list ?? [])
        .map((row) => {
          row._type = 'list'
          return row;
        });

    items = collect(items ?? [])
        .map((row) => {
          row._type = 'file'
          return row;
        });

    featured = collect([list, items])
      .flatten(1)
      .map((row) => {
        if(row.list_title)
          row.title = row.list_title;

        return row;
      })
      .where('featured')
      .sortBy('featured');

    return {
      featured
    }
  }
};
</script>
