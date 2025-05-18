import {baseUrl} from "@/constants/config";
import useMyFetch from "@/composables/my-fetch.js";

export default {

    // Portal Section
    login(payload) {
        const options = {
            method: 'post',
        }
        return useMyFetch(baseUrl, "user/authentication/login", options).json().post(payload)
    },

}
