<template>
  <div class="panel">
    <div class="main">
      <div class="left">
        <div class="info">
          <img class="avatar" src="../assets/img/avatar.jpeg" alt="">
          <div>
            <span class="nickname">{{ data.username }}</span>
          </div>
        </div>
        <div class="menu">
          <div :class="data.currentIndex == index ? 'active' : ''" v-for="(item, index) in data.menus" :key="index">
            <router-link @click="data.currentIndex = index" :to="item.path">
              <i class="iconfont icon" :class="item.icon"></i>{{ item.name }}
            </router-link>
          </div>
        </div>
      </div>
      <router-view class="view" v-slot="{ Component }">
        <transition name="scale-slide">
          <component @change="chooseMusic" :is="Component"></component>
        </transition>
      </router-view>
    </div>
    <div class="footer">
      <div class="left">
        <img v-if="data.currentMusic.cover" class="cover" :src="data.currentMusic.cover" alt="">
        <img v-else class="cover" src="../assets/img/music.png" alt="">
        <div>
          <span>{{ data.currentMusic.music_name }} -
            {{ data.currentMusic.author }}</span>
          <span>{{ data.currentMusic.describe }}</span>        
        </div>
      </div>
      <div class="right">
        <div class="leading"></div>
        <div class="control">
          <div class="function">
            <!-- 上一曲 -->
            <i class="iconfont icon-shangyishou" @click="checkMusic('pre')"></i>
            <i
              v-if="data.isPlaying"
              @click="pause()"
              class="iconfont icon-07zanting click"
            ></i>
            <i
              v-else
              @click="play()"
              class="iconfont icon-shipinbofangshibofang click"
            ></i>
            <!-- 下一曲 -->
            <i class="iconfont icon-xiayishou" @click="checkMusic('next')"></i>
            <!-- 循环播放 -->
            <i
              @click="loop()"
              class="iconfont icon-repeat"
              :class="data.loop ? 'click' : ''"
            ></i>
          </div>
          <div class="progress-bar">
            <span>{{ format(data.currentTime) }}</span>
            <div ref="line" class="line" @click="skip($event)">
              <div class="progress" :style="`width: ${data.width}px;`"></div>
            </div>
            <span>{{ format(data.duration) }}</span>
          </div>
        </div>
        <div class="other">

        </div>
      </div>
    </div>
    <audio ref="audio" :src="data.currentMusic.src"></audio>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, toRaw, } from 'vue';
import { invoke } from "@tauri-apps/api";

// ref
const audio = ref()

const data = reactive({
  currentIndex: 0,
  menus: [
    {
      icon: "icon-shouyetianchong",
      name: "音乐台",
      path: "/",
    },
    {
      icon: "icon-paixingbang",
      name: "排行榜",
      path: "/rankingList",
    },
    {
      icon: "icon-boshiweb_bofangliang",
      name: "MV",
      path: "/musicVideo",
    },
    {
      icon: "icon-24gf-headphones",
      name: "个人电台",
      path: "/personalStation",
    },
    {
      icon: "icon-xiai",
      name: "我喜欢",
      path: "/ilike",
    },
  ],
  width: 0,
  duration: 0,
  currentTime: 0,
  isPlaying: false,
  loop: false,
  currentMusic: {},
  playTimer: null,
  username: "",
  playList: [], // 播放列表，播放过的歌曲
})

onMounted(() => {
  invoke && invoke("get_username").then((username) => {
    data.username = username
    console.warn('$---', username);
  });
});

onUnmounted(() => {
  clear();
});

// 切换歌曲
const chooseMusic = (music) => {
  data.currentMusic = toRaw(music)
  // 暂停播放
  pause()
  // 重置时间
  data.currentTime = 0
  data.duration = 0
  data.width = 0
  audio.value.addEventListener('canplay', () => {
    play()
  })
  // 添加到播放记录
  addPlayHistory()
}

const addPlayHistory = () => {
  // 存放到播放列表, 看之前是否有该条记录
  let musicExist = data.playList.find((item) => item.src === data.currentMusic.src)
  if (!musicExist) {
    data.playList.push(data.currentMusic)
  }
}

// 上一曲、下一曲
const checkMusic = (type) => {
  if (data.playList.length < 2) return
  // 查找当前播放曲目的下标
  let index = -1;
  let maxLength = data.playList.length - 1
  for (let i=maxLength; i>=0; i--) {
    if (data.playList[i].src === data.currentMusic.src) {
      index = i
      break;
    }
  }
  if (type === 'pre') {
    index = index - 1 < 0 ? 0 : index - 1
  } else if (type === 'next') {
    index = (index + 1) > maxLength ? maxLength : index + 1
  }
  
  chooseMusic(data.playList[index])
}

// ========== util ==========
// 清除计时器
const clear = () => {
  if (data.playTimer) {
    clearInterval(data.playTimer)
  }
}

// 格式化时间
const format = (duration) => {
  let m = parseInt((duration / 60) % 60)
  m = m < 10 ? `0${m}` : m
  let s = parseInt(duration % 60)
  s = s < 10 ? `0${s}` : s
  return m + ':' + s
}

// ========== progress  ==========
const skip = (e) => {
  data.width = e.offsetX
  data.currentTime = audio.value.currentTime = (data.width / 400) * data.duration
}

// ========== 播放器  ==========
// 播放
const play = () => {
  if (!data.currentMusic.src || !audio.value.duration) {
    alert('请先选择一首歌曲')
    return
  }
  data.duration = audio.value.duration
  data.isPlaying = true
  audio.value.play()
  // 处理计时器
  clear()
  data.playTimer = setInterval(() => {
    data.currentTime = audio.value.currentTime
    data.width = (data.currentTime / data.duration) * 400
    if (audio.value.ended || data.currentTime >= data.duration) {
      clear()
      data.isPlaying = false
    }
  }, 1000)
}

// 暂停
const pause = () => {
  audio.value.pause()
  data.isPlaying = false
  clear()
}

// loop
const loop = () => {
  data.loop = !data.loop
  audio.value.loop = data.loop
} 
</script>

<style lang="less" scoped>
  @left-width:  260px;
  .panel {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }

  .cover {
    width: 50px;
    height: 50px;
    border-radius: 4px;
  }

  .main {
    display: flex;
    flex: 1;

    .left {
      width: @left-width;
      background: #1d1034;
      padding: 0 50px;
      flex-shrink: 0;

      .info {
        margin-top: 40px;
        display: flex;
        align-items: center;

        .nickname {
          font-size: 22px;
          color: #fff;
          margin-left: 10px;
        }
      }

      .menu {
        color: #a8a5ab;
        margin-top: 40px;
        font-size: 15px;
        font-family: SimHei;
        div {
          height: 52px;
          display: flex;
          align-items: center;

          a {
            text-decoration: none;
            color: #a8a5ab;
            .icon {
              margin-right: 20px;
            }
          }
          .mv {
            font-family: "微软雅黑";
            font-size: 14px;
          }
        }

        .active {
          color: #fff;
          font-weight: bold;
          a {
            color: #fff;
          }
        }
      }
    }

    .view {
      width: 100%;
      height: 100%;
    }
  }

  .footer {
    height: 80px;
    background-color: #1e1e37;
    display: flex;
    align-items: center;

    .left {
      width: @left-width;
      height: 100%;
      display: flex;
      font-family: SimHei;
      background: #211c3e;
      flex-shrink: 0;
      position: relative;
      padding: 0 20px;
      align-items: center;
      div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        margin-left: 20px;
        span {
          width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:first-of-type {
            color: #fff;
          }

          &:last-of-type {
            margin-top: 6px;
            font-size: 12px;
            color: #8f8e99;
          }
        }
      }
    }

    .right {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      background: #1e1e37;
      .control {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        .function {
          i {
            font-size: 24px;
            margin: 0 20px;
            color: #8f8f9b;
          }
          .click {
            color: #d2d2d7;
          }
        }
        .progress-bar {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #a9a9ae;
          .line {
            width: 400px;
            height: 6px;
            background: #1c1c31;
            border-radius: 6px;
            margin: 0 10px;

            .progress {
              height: 100%;
              background: #1bc3d2;
              border-radius: 6px;
            }
          }
        }
      }
      .other {
         background: #2a2e6d;
      }
    }
  }

// animation
.scale-slide-enter-active,
.scale-slide-leave-active {
  position: absolute;
  width: calc(100% - @left-width);
  z-index: -1;
  transition: all 0.65s ease-out;
}

.scale-slide-enter-from {
  // left: -100%;
  top: 100%;
}
.scale-slide-enter-to {
  // left: 260px;
  top: 0;
}
.scale-slide-leave-from {
  // left: 260px;
  // transform: scale(1);
  top: 0;
}
.scale-slide-leave-to {
  // left: 100%;
  // transform: scale(0.8);
  top: -100%;
}

</style>