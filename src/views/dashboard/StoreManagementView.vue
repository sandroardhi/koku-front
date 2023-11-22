<script setup>
import Container from '../../components/dashboard/Container.vue'
import { onMounted, ref } from 'vue';
import axios from 'axios';

const isLoading = ref(false)
const user = JSON.parse(localStorage.getItem('user'))
const kantin = ref({});

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  },
  baseURL: 'http://localhost:8000'
}

const fetchProfileKantin = async () => {
  isLoading.value = true
  const {data} = await axios.get(`/api/kantin/profile/${user.id}`, config)
  kantin.value = data
  isLoading.value = false
}

onMounted(() => {
  fetchProfileKantin()
})
</script>

<template>
  <Container title="Store Management">
    {{ kantin }}
  </Container>
</template>