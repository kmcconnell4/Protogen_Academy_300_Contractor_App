import { createRouter, createWebHistory } from 'vue-router'
import JobsView from '../views/JobsView.vue'
import OrdersView from '../views/OrdersView.vue'
import QuotesView from '../views/QuotesView.vue'
import InspectionsView from '../views/InspectionsView.vue'
import DocumentsView from '../views/DocumentsView.vue'
import VideosView from '../views/VideosView.vue'

const routes = [
  { path: '/', redirect: '/jobs' },
  { path: '/jobs', component: JobsView },
  { path: '/orders', component: OrdersView },
  { path: '/quotes', component: QuotesView },
  { path: '/inspections', component: InspectionsView },
  { path: '/documents', component: DocumentsView },
  { path: '/videos', component: VideosView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
