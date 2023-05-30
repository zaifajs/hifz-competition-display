import { createStore } from 'vuex'
import Papa from 'papaparse'

export default createStore({
  state: {
    csvData: []
  },
  mutations: {
    setCSVData(state, data) {
      state.csvData = data;
    }
  },
  actions: {
    async fetchCSVData({ commit }) {
      const response = await fetch('data.csv');
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value);
      const parsed = Papa.parse(csv, { header: true });
      commit('setCSVData', parsed.data);
    }
  }
})
