<template>
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
        &nbsp;
        <Badge :type="(item.active ?? true) ? 'info' : 'danger'">{{ item.platform }}</Badge>
        <template v-if="item.github">
          &nbsp;
          <a :href="item.github" target="_blank">
            <Icon name="bxl:github"/>
          </a>
        </template>
      </ProseLi>
      <ProseLi v-for="item in list.body">
        {{ item.title }}
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

<!--    <textarea rows="25" style="width: 100%">{{ list }}</textarea>-->

</template>

<script>

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
    let items, list;
    [items, list] = await Promise.all([
      queryContent(props.directory)
          .where({type: props.type})
          .sort({ title: 1, active: -1, _empty: 1 })
          .only(['_path', '_id', '_draft', '_empty', 'title', 'description', 'type', 'platform', 'active', 'github'])
          .find(),

      queryContent(props.directory, '_list')
          .findOne()
    ]);

    return {
      items, list
    }
  }
};
</script>
