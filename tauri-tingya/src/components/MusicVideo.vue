<!--
 * @Author: misterzhou
 * @Date: 2022-08-05 11:12:44
 * @LastEditTime: 2022-08-05 14:14:36
 * @LastEditors: misterzhou
 * @FilePath: /tauri-tingya/tauri-tingya/src/components/MusicVideo.vue
 * @Description: 
-->
<template>
  <div class="content">
    <ul>
      <li
        @click="change(item.id, index)"
        v-for="(item, index) in data.categories"
        :key="index"
        :class="{active: data.currentCategoryIndex == index}"
      >
        {{ item.name }}
      </li>
    </ul>
    <div class="list">
      <div v-for="(item, index) in data.mvList" :key="index">
        <img
          class="cover"
          :src="item.cover"
          alt=""
        />
        <span class="title">{{ item.title }}</span>
        <span class="author">{{ item.author }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
// import { fetch } from "@tauri-apps/api/http";

const data = reactive({
  mvList: [],
  categories: [],
  currentCategoryIndex: 0
})

const change = (_, index) => {
  data.currentCategoryIndex = index
}

onMounted(async () => {
  let res = await fetch('/api/get_categories');
  res = await res.json()
  data.categories = res

  let mvListRes = await fetch('/api/mv_list')
  mvListRes = await mvListRes.json()
  data.mvList = mvListRes
})
</script>


<style lang="less" scoped>
.content {
  background: #191927;
}

ul {
  list-style-type: none;
  margin: 40px;
  display: flex;
  font-size: 15px;
  li {
    padding: 0 14px;
    height: 28px;
    border-radius: 28px;
    line-height: 28px;
    cursor: pointer;
    color: #a8a5ab;

    &.active {
      background: #1bc3d2;
      font-weight: bold;
      color:#fff;
    }
  }
}

.list {
  margin: 40px;
  display: flex;
  flex-wrap: wrap;
  div {
    display: flex;
    flex-direction: column;
    width: 22%;
    margin-right: 4%;
    &:nth-child(4n) {
      margin-right: 0;
    };
    span {
      cursor: pointer;
      display: inline-block;
    }

    .title {
      width: 100%;
      font-size: 18px;
      line-height: 25px;
      margin-top: 12px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      color: #fff;
      font-weight: 400;
      &:hover {
        font-weight: 600;
      };
    }
    .author {
      font-size: 14px;
      font-family: "Microsoft YaHei", "Helvetica Neue", Helvetica, STHeiTi,
        sans-serif;
      color: #999;
      font-weight: 300;
      margin-top: 8px;
      margin-bottom: 26px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      &:hover {
        color: rgb(182, 182, 182);
      }
    }
  }
}

</style>