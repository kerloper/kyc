import {shallowRef} from 'vue';

export function useJWTDecoder() {
    const decodedJWT = shallowRef(null);
    const error = shallowRef(null);

    // Function to decode a JWT
    function decodeJWT(token) {
        try {
            // Split the token into its three parts
            const [header, payload, signature] = token.split('.');
            decodedJWT.value = JSON.parse(atob(payload));
            error.value = null; // Clear any previous errors
        } catch (err) {
            console.error('Failed to decode JWT:', err);
            error.value = err; // Set the error
            decodedJWT.value = null; // Clear the decoded payload
        }
    }

    return {
        decodedJWT,
        error,
        decodeJWT,
    };
}