<template>
  <CardGrid>
    <template #title>
      Featured
      <ProseA :href="directory">
        {{ title }}
      </ProseA>
    </template>
    <template #root>
      <Ellipsis/>
    </template>

    <Card v-for="item in featured" :icon="item.featured_icon ?? ''">
      <template #title>
        <template v-if="item._empty ?? true">
          {{ item.title }}
        </template>
        <template v-else>
          <ProseA :href="item._path">
            {{ item.title }}
          </ProseA>
        </template>
        <template v-if="item.github">
          &nbsp;
          <a :href="item.github" target="_blank">
            <Icon name="bxl:github"/>
          </a>
        </template>
      </template>
      <template #description>
        {{ item.featured_description }}
      </template>
    </Card>
  </CardGrid>
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
    directory: {
      type: String,
      default: 'apps'
    },
    title: {
      type: String,
      default: 'Apps & Tools'
    }
  },
  async setup(props) {
    let items, list, featured;
    [items, list] = await Promise.all([
      queryContent()
          .where({type: props.type})
          .sort({ title: 1, active: -1, _empty: 1 })
          .only(['_path', '_id', '_draft', '_empty', 'title', 'description', 'type', 'platform', 'active', 'github', 'featured', 'featured_description', 'featured_icon'])
          .find(),

      queryContent(props.directory, '_list')
          .findOne()
    ]);

    list = collect(list.body ?? [])
      .map((row) => {
        row._entryType = 'file'
        return row;
      });

    items = collect(items ?? [])
      .map((row) => {
        row._entryType = 'list'
        return row;
      });

    featured = collect([list, items])
      .flatten(1)
      .where('featured')
      .sortBy('featured');

    return {
      featured
    }
  }
};
</script>
