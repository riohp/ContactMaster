<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Referrals Table</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Name</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Phone Number</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Call Date</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="referral in referrals" :key="referral.referralId">
              <td>{{ referral.name }}</td>
              <td>{{ referral.phoneNumber }}</td>
              <td>{{ formatDate(referral.callDate) }}</td>
              <td>{{ referral.status }}</td>
              <td>{{ referral.notes }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api.js';

const referrals = ref([]);

const fetchReferrals = async () => {
  try {
    const response = await api.getReferrals();
    referrals.value = response.data.data;
  } catch (error) {
    console.error('Error fetching referrals:', error);
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(() => {
  fetchReferrals();
});
</script>
