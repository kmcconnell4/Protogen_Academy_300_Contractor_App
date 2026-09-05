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
    path: '/jobs/new',
    name: 'create-job',
    component: () => import('@/views/CreateJobView.vue'),
  },
  {
    path: '/jobs/:id/quotes/new',
    name: 'create-quote',
    component: () => import('@/views/CreateQuoteView.vue'),
  },
  {
    path: '/jobs/:id',
    name: 'job-detail',
    component: () => import('@/views/JobDetailView.vue'),
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchView.vue'),
  },
  {
    path: '/catalog/:id',
    name: 'product-detail',
    component: () => import('@/views/ProductDetailView.vue'),
  },
  {
    path: '/library',
    name: 'library',
    component: () => import('@/views/LibraryView.vue'),
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
  {
    path: '/catalog',
    name: 'catalog',
    component: () => import('@/views/CatalogView.vue'),
  },
  {
    path: '/documents',
    name: 'documents',
    component: () => import('@/views/DocumentsView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
