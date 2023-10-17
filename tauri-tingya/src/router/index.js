import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import Index from '../views/index.vue'
import Bandstand from '../components/Bandstand.vue'
import RankingList from '../components/RankingList.vue'
import MusicVideo from '../components/MusicVideo.vue'
import Ilike from '../components/Ilike.vue'
import PersonalStation from '../components/PersonalStation.vue'

const routes = [
  {
    path: '/',
    component: Index,
    children: [
      {
        path: '/',
        component: Bandstand,
      },
      {
        path: '/rankingList',
        component: RankingList,
      },
      {
          path: '/musicVideo',
          component: MusicVideo,
      },
      {
          path: '/personalStation',
          component: PersonalStation,
      },
      {
          path: '/ilike',
          component: Ilike,
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router