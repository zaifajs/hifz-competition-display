import { createStore } from 'vuex'

export default createStore({
  state: {
    profiles: []
  },
  mutations: {
    setProfiles(state, data) {
      state.profiles = data;
    }
  },
  actions: {
    async fetchProfiles({ commit }) {
      const sheetId = import.meta.env.VITE_SHEET_ID;
      const range = import.meta.env.VITE_SHEET_RANGE;
      const apiKey = import.meta.env.VITE_SHEET_API_KEY;
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`);
      const data = await response.json();
      const values = data.values
        .slice(1)
        .map((row) => {
          return {
            'SLOT_SCHEDULE': row[0],
            'CATEGORY': row[1],
            'FIRST_AND_LAST_NAME': row[2],
            'FIRST_NAME': row[3],
            'LAST_NAME': row[4],
            'FLAG': row[5],
            'PARTICIPANT_PHOTO': row[6],
            'CATEGORY_IMAGE': row[7],
            'FLAG_IMAGE': row[8],
            'AGE_ON_EVENT': row[9],
          };
        });
      commit('setProfiles', values);
    }
  },
})
