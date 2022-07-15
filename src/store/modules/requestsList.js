const state = {
    requests: []

}
const getters = {
    requests(state, _, _2, rootGetters) {
        const coachId = rootGetters['auth/userId']
        return state.requests.filter(req => req.coachId === coachId)
    },
    hasRequests(_, getters) {
        return getters.requests && getters.requests.length > 0
    }
}
const mutations = {
    addRequest(state, payload) {
        state.requests.push(payload);
    },
    setRequests(state, payload) {
        state.requests = payload;
    }
}
const actions = {
    async contactCoach(context, payload) {
        const newRequest = {
            userEmail: payload.email,
            message: payload.message
        };
        const response = await fetch(`https://find-coach-83bbe-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`, {
            method: 'POST',
            body: JSON.stringify(newRequest)
        });

        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to send request.');
            throw error;
        }

        newRequest.id = responseData.name;
        newRequest.coachId = payload.coachId;

        context.commit('addRequest', newRequest);
    },
    async fetchRequests(context) {
        const coachId = context.rootGetters['auth/userId'];
        const response = await fetch(`https://find-coach-83bbe-default-rtdb.firebaseio.com/requests/${coachId}.json`);
        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to fetch requests.');
            throw error;
        }

        const requests = [];

        for (const key in responseData) {
            const request = {
                id: key,
                coachId: coachId,
                userEmail: responseData[key].userEmail,
                message: responseData[key].message
            };
            requests.push(request);
        }

        context.commit('setRequests', requests);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}