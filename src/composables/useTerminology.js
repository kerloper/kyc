// useTerminology.js
import { ref, computed } from 'vue';
import API from "@/services/API.js";

export function useTerminology(terminologyId) {
    // Reactive state
    const options = ref(null);
    const isLoading = ref(false);

    // Fetch terminology data
    const fetchTerminology = async () => {
        isLoading.value = true;
        try {
            const response = await API.fetchTerminology({ terminologyId });
            options.value = response?.data?.value?.data??[];
        } catch (error) {
            console.error('Error fetching terminology:', error);
        } finally {
            isLoading.value = false;
        }
    };

    // Return the state and methods
    return {
        options,
        isLoading,
        fetchTerminology,
    };
}