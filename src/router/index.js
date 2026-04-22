import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/jobs',
    name: 'jobs',
    component: () => import('@/views/JobsView.vue'),
  },
  {
    path: '/jobs/:id',
    name: 'job-detail',
    component: () => import('@/views/JobDetailView.vue'),
  },
  {
    path: '/catalog',
    name: 'catalog',
    component: () => import('@/views/ProductCatalogView.vue'),
  },
  {
    path: '/documents',
    name: 'documents',
    component: () => import('@/views/DocumentLibraryView.vue'),
  },
  {
    path: '/videos',
    name: 'videos',
    component: () => import('@/views/VideosView.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
