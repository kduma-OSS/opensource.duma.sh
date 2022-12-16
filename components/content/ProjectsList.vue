<template>
<!--  <textarea rows="25" style="width: 100%">{{ deprecated }}</textarea>-->
  <ProseUl>
    <ProseLi v-for="(items, platform) in active">
      Platform
      &nbsp;
      <Badge>{{ platform }}</Badge>
      <ProseUl>
        <ProseLi v-for="item in items">
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
        </ProseLi>
      </ProseUl>
    </ProseLi>
  </ProseUl>
  <template v-if="deprecated">
    <ProseH2 id="deprecated">Deprecated</ProseH2>
    <ProseUl>
      <ProseLi v-for="item in deprecated">
        <template v-if="item._empty ?? true">
          {{ item.title }}
        </template>
        <template v-else>
          <ProseA :href="item._path">
            {{ item.title }}
          </ProseA>
        </template>
        &nbsp;
        <Badge :type="(item.active == 1) ? 'info' : 'danger'">{{ item.platform }}</Badge>
        <template v-if="item.github">
          &nbsp;
          <a :href="item.github" target="_blank">
            <Icon name="bxl:github"/>
          </a>
        </template>
      </ProseLi>
    </ProseUl>
  </template>
</template>

<script>

import {collect} from "collect.js";

export default {
  name: "ProjectsList",
  props: {
    type: {
      type: String,
      default: 'app'
    },
    directory: {
      type: String,
      default: 'apps'
    }
  },
  async setup(props) {
    let items, list, unified;
    [items, list] = await Promise.all([
      queryContent()
          .where({type: props.type})
          .sort({ title: 1, active: -1, _empty: 1 })
          .only(['_path', '_id', '_draft', '_empty', 'title', 'description', 'type', 'platform', 'active', 'github', 'featured', 'list_title'])
          .find(),

      queryContent(props.directory, '_list')
          .find()
    ]);

    list = collect(list.length ? list[0].body : [])
      .map((row) => {
        row._entryType = 'list'
        return row;
      });

    items = collect(items ?? [])
      .map((row) => {
        row._entryType = 'file'
        return row;
      });

    unified = collect([list, items])
      .flatten(1)
      .map((row) => {
        if(row.list_title)
          row.title = row.list_title;

        return row;
      })
      .sortBy('title')
      .groupBy((item, key) => (item.active == '1' || item.active == true || item.active == undefined) ? 'active' : 'deprecated');


    let active = unified.get('active', collect()).groupBy('platform').sortKeysDesc().all();
    let deprecated = unified.get('deprecated', collect()).all();

    return {
      active, deprecated
    }
  }
};
</script>
