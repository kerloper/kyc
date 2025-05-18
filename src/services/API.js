import {baseUrl} from "@/constants/config";
import useMyFetch from "@/composables/my-fetch.js";

export default {

    // Portal Section
    login(payload) {
        return useMyFetch(baseUrl, "user/authentication/login", {}).json().post(payload)
    },
    requestEmailOtp(payload) {
        return useMyFetch(baseUrl, "user/authentication/email/request", {}).json().post(payload)
    },
    verifyEmailOtp(payload) {
        return useMyFetch(baseUrl, "user/authentication/email/verify", {}).json().post(payload)
    },

}
