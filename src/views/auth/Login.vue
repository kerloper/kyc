<script setup>
import {ref, computed, onBeforeUnmount, onMounted} from 'vue'
import {useAuthStore} from '@/stores/auth'
import {useRouter} from 'vue-router'
import API from "@/services/API.js";

const authStore = useAuthStore()
const router = useRouter()
const step = ref(1)
const email = ref('')
const otpDigits = ref(['', '', '', '', '', ''])
const error = ref('')
const isSubmitting = ref(false)
const resendCooldown = ref(0)
let cooldownInterval = null

// Computed property to show masked email
const maskedEmail = computed(() => {
  if (!email.value) return ''
  const [name, domain] = email.value.split('@')
  return `${name.substring(0, 2)}****@${domain}`
})

const handleEmailSubmit = async () => {
  if (!email.value) {
    error.value = 'Please enter your email address'
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Please enter a valid email address'
    return
  }

  error.value = ''
  isSubmitting.value = true

  try {
    // Simulate API call to send OTP
    // await new Promise(resolve => setTimeout(resolve, 1500))

    const {data} = await API.requestEmailOtp({email: email.value})
    console.log('OTP sent to:', email.value)

    // Move to OTP step
    step.value = 2
    // Start cooldown timer
    resendCooldown.value = 30
    startCooldownTimer()
  } catch (err) {
    error.value = 'Failed to send OTP. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const handleOtpInput = (index, event) => {
  const value = event.target.value

  // Only allow numeric input
  if (!/^\d*$/.test(value)) {
    event.target.value = ''
    otpDigits.value[index] = ''
    return
  }

  if (value && index < otpDigits.value.length - 1) {
    // Move focus to next input
    const nextInput = event.target.nextElementSibling
    if (nextInput) nextInput.focus()
  }

  // Update the OTP array
  otpDigits.value[index] = value
}

const handleOtpDelete = (index, event) => {
  if (event.target.value === '' && index > 0) {
    // Move focus to previous input on backspace
    const prevInput = event.target.previousElementSibling
    if (prevInput) prevInput.focus()
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  const pasteData = event.clipboardData.getData('text/plain').trim()

  if (/^\d+$/.test(pasteData) && pasteData.length === otpDigits.value.length) {
    // Split the pasted OTP into individual digits
    const digits = pasteData.split('')
    digits.forEach((digit, index) => {
      otpDigits.value[index] = digit
    })

    // Focus the last input
    const inputs = event.target.parentElement.querySelectorAll('input')
    if (inputs.length > 0) {
      inputs[inputs.length - 1].focus()
    }
  }
}

const handleOtpSubmit = async () => {
  const otp = otpDigits.value.join('')

  if (otp.length !== otpDigits.value.length) {
    error.value = 'Please enter the complete OTP code'
    return
  }

  error.value = ''
  isSubmitting.value = true

  try {
    // Simulate API call to verify OTP
    const {data} = await API.verifyEmailOtp({email: email.value, otp: otp})
    console.log('OTP verified for:', email.value)

    // On success, you would typically:
    // 1. Store the auth token
    // 2. Redirect to dashboard
    // alert('Login successful!') // Replace with actual redirect

    if (data?.value?.data?.access_token) {
      let token = data?.value?.data?.access_token;
      authStore.setToken(token)
      const redirectUrl = router.currentRoute.value.query.redirect || '/home'
      await router.push(redirectUrl)
    } else {
      error.value = 'Invalid OTP code. Please try again.'
      // Clear OTP on error
      otpDigits.value = otpDigits.value.map(() => '')
      isSubmitting.value = false
    }

  } catch (err) {
    error.value = 'Invalid OTP code. Please try again.'
    // Clear OTP on error
    otpDigits.value = otpDigits.value.map(() => '')
    // Focus first input
    const firstInput = document.querySelector('input[autofocus]')
    if (firstInput) firstInput.focus()
  } finally {
    isSubmitting.value = false
  }
}

const resendOtp = async () => {
  try {
    isSubmitting.value = true
    // Simulate API call to resend OTP
    const {data} = await API.requestEmailOtp({email: email.value})
    console.log('Resent OTP to:', email.value)

    // Reset cooldown
    resendCooldown.value = 30
    startCooldownTimer()
  } catch (err) {
    error.value = 'Failed to resend OTP. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const startCooldownTimer = () => {
  if (cooldownInterval) clearInterval(cooldownInterval)
  cooldownInterval = setInterval(() => {
    resendCooldown.value -= 1
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval)
    }
  }, 1000)
}

onBeforeUnmount(() => {
  if (cooldownInterval) clearInterval(cooldownInterval)
})

onMounted(() => {

})

</script>
<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-yellow-400/20">
        <!-- Gold gradient accent header -->
        <div class="bg-[#b59d82] h-2"></div>

        <div class="p-8">
          <!-- Logo/Title -->
          <div class="flex justify-center mb-8">
            <div class="text-center">
              <h1 class="text-2xl font-bold  text-white bg-[#b59d82] rounded-full px-4">
                Secure Access
              </h1>
              <p class="text-gray-400 mt-1" v-if="step === 1">Enter your email to continue</p>
              <p class="text-gray-400 mt-1" v-else>Enter the OTP sent to {{ maskedEmail }}</p>
            </div>
          </div>

          <!-- Step 1: Email Form -->
          <form @submit.prevent="handleEmailSubmit" class="space-y-6" v-if="step === 1">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                  v-model="email"
                  type="email"
                  required
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 text-white placeholder-gray-400 transition-all"
                  placeholder="your@email.com"
                  autocomplete="email"
              >
              <p v-if="error" class="mt-2 text-sm text-red-400">{{ error }}</p>
            </div>

            <button
                type="submit"
                class="w-full cursor-pointer bg-[#b59d82] hover:from-yellow-600 hover:to-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-md hover:shadow-yellow-500/20"
                :disabled="isSubmitting"
            >
              <span v-if="!isSubmitting">Send OTP</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            </button>
          </form>

          <!-- Step 2: OTP Form -->
          <form @submit.prevent="handleOtpSubmit" class="space-y-6" v-else>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Verification Code</label>
              <div class="flex space-x-3 justify-center">
                <input
                    v-for="(digit, index) in otpDigits"
                    :key="index"
                    v-model="otpDigits[index]"
                    @input="handleOtpInput(index, $event)"
                    @keydown.delete="handleOtpDelete(index, $event)"
                    @paste="handlePaste"
                    type="text"
                    maxlength="1"
                    class="w-12 h-12 text-center text-xl font-bold bg-gray-700 border border-gray-600 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 text-white transition-all"
                    autocomplete="off"
                    :autofocus="index === 0"
                >
              </div>
              <p v-if="error" class="mt-2 text-sm text-red-400">{{ error }}</p>
            </div>

            <button
                type="submit"
                class="w-full bg-[#b59d82] hover:from-yellow-600 hover:to-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-md hover:shadow-yellow-500/20"
                :disabled="isSubmitting"
            >
              <span v-if="!isSubmitting">Verify & Continue</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            </button>

            <div class="text-center text-sm text-gray-400">
              <p>Didn't receive code?
                <button
                    type="button"
                    @click="resendOtp"
                    class="text-yellow-400 hover:text-yellow-300 font-medium focus:outline-none"
                    :disabled="resendCooldown > 0"
                >
                  Resend {{ resendCooldown > 0 ? `(${resendCooldown}s)` : '' }}
                </button>
              </p>
              <button
                  type="button"
                  @click="step = 1"
                  class="mt-2 text-yellow-400 hover:text-yellow-300 text-xs font-medium focus:outline-none"
              >
                ← Change email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
