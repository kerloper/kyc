import {createFetch, useStorage} from "@vueuse/core";
import {useToast} from "vue-toastification";

const toast = useToast()
import router from "@/router/index.js";


export default function (baseUrl, url, options, fetchOptions) {

    const utn = useStorage("utn", '');
    const useMyFetch = createFetch({
        baseUrl: baseUrl,

        fetchOptions: {
            mode: 'cors',
        },
        options: {
            ...options,
            async beforeFetch({options}) {
                // if (getCookie('utn')) {
                //     options.headers.token = getCookie('utn')
                // }
                // options.headers['Content-Type'] = 'application/json'

                if (utn?.value) {
                    options.headers['Authorization'] = `Bearer ${utn?.value ?? ''}`
                }


                return {options}
            },
            afterFetch(ctx) {
                return ctx
            },

            onFetchError(ctx) {
                console.log(ctx)
                const status = ctx.response?.status
                if (ctx.data && ctx.data.error) {
                    ctx.error = ctx.data.error// Modifies the error
                }
                toast.error(ctx.error, {
                    timeout: 10000
                })
                if (status === 401) {
                    // setCurrentUser(null);
                    // eraseCookie('utn');
                    // eraseCookie('uName');
                    // eraseCookie('uEmail');
                }

                return ctx
            },
        },

    })
    return useMyFetch(url, options, fetchOptions)

}