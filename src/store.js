import { createStore } from 'vuex'

export default createStore({
  state: {
    profiles: [],
    loading: false,
    error: null
  },
  mutations: {
    setProfiles(state, data) {
      state.profiles = data;
    },
    setLoading(state, isLoading) {
      state.loading = isLoading;
    },
    setError(state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchProfiles({ commit }) {
      commit('setLoading', true);
      commit('setError', null);

      try {
        const sheetId = import.meta.env.VITE_SHEET_ID;
        const range = import.meta.env.VITE_SHEET_RANGE;
        const apiKey = import.meta.env.VITE_SHEET_API_KEY;

        if (!sheetId || !range || !apiKey) {
          throw new Error('Missing required environment variables');
        }

        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch profiles: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.values || !Array.isArray(data.values)) {
          throw new Error('Invalid data format received from API');
        }

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
      } catch (error) {
        console.error('Error fetching profiles:', error);
        commit('setError', error.message || 'An error occurred while fetching profiles');
      } finally {
        commit('setLoading', false);
      }
    }
  },
})
