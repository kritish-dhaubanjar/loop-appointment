import { createRouter, createWebHistory } from 'vue-router'

import Book from '../views/BookView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Book
    }
  ]
})

export default router
