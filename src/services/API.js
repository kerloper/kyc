import {baseUrl, termUrl} from "@/constants/config";
import useMyFetch from "@/composables/my-fetch.js";

export default {

    // Portal Section
    login(payload) {
        const options = {
            method: 'post',
        }
        return useMyFetch(baseUrl, "user/authentication/login", options).json().post(payload)
    },
    portalView(payload) {
        return useMyFetch(baseUrl, `app/portal/${payload.portalId}`, {}).json().get()
    },
    OpenSession(payload) {
        return useMyFetch(baseUrl, `app/session`, {}).json().post(payload)
    },
    portalList() {
        return useMyFetch(baseUrl, `portal/list`, {immediate: false}).json().get()
    },
    fromTemplate(payload) {
        return useMyFetch(baseUrl, `entry/${payload.entryId}`, {}).json().get()
    },
    fetchTerminology(payload) {
        return useMyFetch(termUrl, `terms/${payload.terminologyId}?page=1&per_page=1000`, {}).json().get()
    },
    submitForm(payload, entryId) {
        return useMyFetch(baseUrl, `entry/${entryId}`, {}).json().post(payload)
    },
    updatePassword(payload,room) {
        return useMyFetch(baseUrl, `entry/room/${room}`, {}).json().post(payload)
    }
}
