
<template>
  <div class="content">
    <div class="banner"></div>
    <div class="music-list">
      <div class="title">
        <h3>新歌速递</h3>
        <span>更多</span>
      </div>
      <div class="list">
        <div @click="$emit('change', item)" v-for="(item, index) in data.musicList" :key="index">
          <img :src="item.cover" alt="">
          <div class="info">
            <span>{{ item.author }}</span>
            <span>{{ item.music_name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, defineEmits } from 'vue';
// import { fetch } from "@tauri-apps/api/http";

const data = reactive({
  musicList: []
})

onMounted(async () => {
  let res = await fetch("/api", {
    method: "GET",
    timeout: 30,
  })
  res = await res.json()
  data.musicList = res

  // fetch("/api", {
  //   method: "GET",
  //   timeout: 30,
  // }).then(res => res.json()).then((res) => {
  //   console.log('$---', res);
  // })
})

defineEmits(['change'])
</script>

<style lang="less" scoped>
  .content {
    background: #191927;
    color: #fff;
    padding: 40px;

    .banner {
      width: 100%;
      height: 140px;
      background: #1cc3d2;
      border-radius: 4px;
    }

    .music-list {
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 30px 0;
        span {
          font-size: 12px;
          color: #33b5c0;
        }
      }

      .list {
        display: flex;
        justify-content: space-between;
        div {
          .info {
            display: flex;
            flex-direction: column;
            font-size: 15px;
            margin-top: 30px;
            > span:last-of-type {
              font-family: "Microsoft YaHei", "Helvetica Neue", Helvetica, STHeiTi,sans-serif;
              font-size: 14px;
              color: #999;
              margin-top: 3px;
              font-weight: 300;
            }
          }
          img {
            width: 150px;
            height: 150px;
            border-radius: 4px;
          }
        }
      }
    }
  }
</style>