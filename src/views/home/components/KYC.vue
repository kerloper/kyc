<script setup>
import {ref, reactive, watch} from 'vue';
import kycLogo from "@/assets/static/kyc-logo.png";
import Signature from "@/components/Signature.vue";
import SignatureLight from "@/components/SignatureLight.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useAuthStore} from "@/stores/auth.js";
import {useRouter} from "vue-router";

// --- Reactive Form Data ---
const form = reactive({
  // A. Client Information
  fullName: {
    first: '',
    last: '',
  },
  nationality: '',
  gender: '',
  dateOfBirth: '',
  identificationType: '',
  otherIdentificationType: '',
  identificationNumber: '',
  issueDate: '',
  issuePlace: '',
  idFile: null,

  // B. Contact Information
  address: {
    street: '',
    building: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  },
  phone: {
    areaCode: '',
    number: '',
  },
  email: '',

  // C. Occupation and Source of Funds
  occupation: '',
  employer: '',
  employerAddress: {
    street: '',
    street2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  },
  natureOfBusiness: '',
  monthlyIncome: '',
  sourceOfFunds: [], // Will store selected checkbox values
  otherSourceOfFunds: '',

  // D. Transaction Details
  transactionRole: '',
  propertyType: '',
  propertyAddress: {
    street: '',
    building: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  },
  transactionType: '',
  transactionValue: '',
  paymentMethod: '',
  otherPaymentMethod: '',

  // E. Politically Exposed Persons (PEPs) and Sanctions
  isPEP: null, // Using null for initial state, can be true/false
  PEPDetails: 'Not Applicable',
  isSanctioned: null, // Using null for initial state, can be true/false

  // F. Beneficial Ownership (For Developers/Companies)
  companyName: '',
  companyRegistrationNumber: '',
  ownershipStructure: '',

  // G. Declaration and Consent
  applicantName: {
    first: '',
    last: '',
  },
  signatureDate: '',
  // You might want to add a field for signature data if using a signature pad library
  // signatureData: null,
});

// --- Countries List ---
// In a real application, you might fetch this from an API
const countries = ref([
  'United Arab Emirates', 'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
  'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo, Democratic Republic of the', 'Congo, Republic of the', 'Costa Rica', "Cote d'Ivoire", 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
  'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
  'Jamaica', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
  'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway',
  'Oman',
  'Pakistan', 'Palau', 'Palestine State', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar',
  'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
  'Yemen',
  'Zambia', 'Zimbabwe'
]);


// --- Watchers for Conditional Logic ---
watch(() => form.identificationType, (newValue) => {
  if (newValue !== 'other') {
    form.otherIdentificationType = '';
  }
});

watch(() => form.sourceOfFunds, (newValue) => {
  if (!newValue.includes('other')) {
    form.otherSourceOfFunds = '';
  }
});

watch(() => form.paymentMethod, (newValue) => {
  if (newValue !== 'other') {
    form.otherPaymentMethod = '';
  }
});

watch(() => form.isPEP, (newValue) => {
  if (newValue === false || newValue === null) {
    form.PEPDetails = 'Not Applicable';
  } else if (newValue === true && form.PEPDetails === 'Not Applicable') {
    form.PEPDetails = ''; // Clear for user input if they switch to Yes
  }
});


// --- Methods ---
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // You might want to add validation for file type and size here
    form.idFile = file;
    console.log('File selected:', file.name);
  } else {
    form.idFile = null;
  }
};

const submitForm = () => {
  // Basic validation check (all required fields are marked with * in your HTML)
  // This is a very basic check; for production, use a library like Vuelidate or implement more robust checks.

  // Log form data for now. In a real app, you'd send this to a server.
  console.log('Form submitted:', JSON.parse(JSON.stringify(form)));

  // Example: Create FormData if you need to send the file
  const formData = new FormData();
  for (const key in form) {
    if (key === 'idFile' && form.idFile) {
      formData.append(key, form.idFile, form.idFile.name);
    } else if (typeof form[key] === 'object' && form[key] !== null && !Array.isArray(form[key])) {
      // Handle nested objects like fullName, address, etc.
      for (const subKey in form[key]) {
        formData.append(`${key}.${subKey}`, form[key][subKey]);
      }
    } else if (Array.isArray(form[key])) {
      form[key].forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else {
      formData.append(key, form[key]);
    }
  }

  console.log('FormData to be sent:');
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  alert('Form submitted! Check the console for the form data.');
  // TODO: Implement actual form submission to a backend API
  // Example:
  // fetch('/api/submit-kyc', {
  //   method: 'POST',
  //   body: formData, // Use formData if sending files
  // })
  // .then(response => response.json())
  // .then(data => console.log('Success:', data))
  // .catch((error) => console.error('Error:', error));
};

// Placeholder for signature pad functionality
const clearSignature = () => {
  // TODO: Implement signature clearing logic if using a signature pad
  console.log('Signature cleared (placeholder)');
  // form.signatureData = null; // Example
};


const authStore = useAuthStore()
const router = useRouter()
async function logout() {
  authStore.clearToken()
  await router.push('/login')
}

</script>
<template>
  <div class="min-h-screen body">

    <div class="max-w-4xl mx-auto flex flex-row rounded-lg shadow-md overflow-hidden">
      <div class="w-full">
        <img class="h-24 " :src="kycLogo" alt=""/>
      </div>
      <div class="mt-auto pb-7 w-32">
        <div class="btn mt-auto bg-gradient-to-r from-yellow-800 via-yellow-500 to-yellow-700 flex flex-row gap-2" @click="logout">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"/>
            </svg>
          </div>
          <div>
            Logout
          </div>
        </div>
      </div>
    </div>
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Header with Logo -->
      <div class="flex items-center p-6 bg-white border-b border-gray-200">

        <div>
          <div class="text-2xl font-bold text-gray-600">KYC Form for Real Estate Transactions</div>
          <p class="text-gray-600">(Buyer/Seller/Developer) In compliance with UAE Anti-Money Laundering Regulations</p>
        </div>
      </div>


      <form @submit.prevent="submitForm" class="p-6 space-y-8">
        <!-- A. Client Information -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-purple-800 border-b pb-2">A. Client Information</h2>

          <!-- Full Name -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700 font-medium mb-2">1. Full Name <span
                  class="text-red-500">*</span></label>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <input type="text" v-model="form.fullName.first" required
                         class="input   w-full"
                         placeholder="First Name"/>
                </div>
                <div>
                  <input type="text" v-model="form.fullName.last" required
                         class="input input-bordered w-full"
                         placeholder="Last Name"/>
                </div>
              </div>
            </div>

            <!-- Nationality -->
            <div>
              <label class="block text-gray-700 font-medium mb-2">2. Nationality <span
                  class="text-red-500">*</span></label>
              <select v-model="form.nationality" required class="select select-bordered w-full">
                <option value="">Please Select</option>
                <option v-for="country in countries" :value="country">{{ country }}</option>
              </select>
            </div>
          </div>

          <!-- Gender -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">3. Gender <span class="text-red-500">*</span></label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input type="radio" v-model="form.gender" value="Male" required class="radio radio-primary"/>
                <span class="ml-2">Male</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.gender" value="Female" required class="radio radio-primary"/>
                <span class="ml-2">Female</span>
              </label>
            </div>
          </div>

          <!-- Date of Birth -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700 font-medium mb-2">4. Date of Birth <span
                  class="text-red-500">*</span></label>
              <input type="date" v-model="form.dateOfBirth" required
                     class="input input-bordered w-full"/>
            </div>

            <!-- Identification Type -->
            <div>
              <label class="block text-gray-700 font-medium mb-2">5. Identification Type <span
                  class="text-red-500">*</span></label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="radio" v-model="form.identificationType" value="Passport" required
                         class="radio radio-primary"/>
                  <span class="ml-2">Passport</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="form.identificationType" value="National ID" required
                         class="radio radio-primary"/>
                  <span class="ml-2">National ID</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="form.identificationType" value="other" required
                         class="radio radio-primary"/>
                  <span class="ml-2">Other</span>
                  <input v-if="form.identificationType === 'other'" type="text" v-model="form.otherIdentificationType"
                         class="input input-bordered input-sm ml-2 w-48"
                         placeholder="Please specify"/>
                </label>
              </div>
            </div>
          </div>

          <!-- Identification Details -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-gray-700 font-medium mb-2">6. Identification Number <span
                  class="text-red-500">*</span></label>
              <input type="text" v-model="form.identificationNumber" required
                     class="input input-bordered w-full"/>
            </div>
            <div>
              <label class="block text-gray-700 font-medium mb-2">7. Date of Issue <span
                  class="text-red-500">*</span></label>
              <input type="date" v-model="form.issueDate" required
                     class="input input-bordered w-full"/>
            </div>
            <div>
              <label class="block text-gray-700 font-medium mb-2">8. Place of Issue <span class="text-red-500">*</span></label>
              <input type="text" v-model="form.issuePlace" required
                     class="input input-bordered w-full"/>
            </div>
          </div>

          <!-- Upload ID -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Upload ID File (.jpeg, .pdf) <span class="text-red-500">*</span></label>
            <input type="file" @change="handleFileUpload" accept=".jpeg,.jpg,.pdf" required
                   class="file-input file-input-bordered w-full"/>
          </div>
        </div>

        <!-- B. Contact Information -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-purple-800 border-b pb-2">B. Contact Information</h2>

          <!-- Permanent/Residential Address -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">1. Permanent/Residential Address <span
                class="text-red-500">*</span></label>
            <div class="space-y-4">
              <input type="text" v-model="form.address.street" required
                     class="input input-bordered w-full"
                     placeholder="Street Address"/>
              <input type="text" v-model="form.address.building"
                     class="input input-bordered w-full"
                     placeholder="Building Name"/>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" v-model="form.address.city" required
                       class="input input-bordered w-full"
                       placeholder="City"/>
                <input type="text" v-model="form.address.state" required
                       class="input input-bordered w-full"
                       placeholder="State / Province / Emirate"/>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" v-model="form.address.postalCode" required
                       class="input input-bordered w-full"
                       placeholder="Postal / Zip Code"/>
                <select v-model="form.address.country" required class="select select-bordered w-full">
                  <option value="">Select Country</option>
                  <option v-for="country in countries" :value="country">{{ country }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Phone and Email -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700 font-medium mb-2">2. Phone Number <span
                  class="text-red-500">*</span></label>
              <div class="flex">
                <input type="text" v-model="form.phone.areaCode" required
                       class="input input-bordered w-20"
                       placeholder="+000"/>
                <input type="text" v-model="form.phone.number" required
                       class="input input-bordered flex-grow ml-2"
                       placeholder="Phone Number"/>
              </div>
            </div>
            <div>
              <label class="block text-gray-700 font-medium mb-2">3. Email Address <span
                  class="text-red-500">*</span></label>
              <input type="email" v-model="form.email" required
                     class="input input-bordered w-full"
                     placeholder="example@gmail.com"/>
              <p class="text-sm text-gray-500 mt-1">Please ensure to enter your correct email address.</p>
            </div>
          </div>
        </div>

        <!-- C. Occupation and Source of Funds -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-purple-800 border-b pb-2">C. Occupation and Source of Funds</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700 font-medium mb-2">1. Occupation/ Profession <span
                  class="text-red-500">*</span></label>
              <input type="text" v-model="form.occupation" required
                     class="input input-bordered w-full"/>
            </div>
            <div>
              <label class="block text-gray-700 font-medium mb-2">2. Employer/ Business Name <span class="text-red-500">*</span></label>
              <input type="text" v-model="form.employer" required
                     class="input input-bordered w-full"/>
            </div>
          </div>

          <!-- Employer Address -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">3. Employer Address/ Business Address <span
                class="text-red-500">*</span></label>
            <div class="space-y-4">
              <input type="text" v-model="form.employerAddress.street" required
                     class="input input-bordered w-full"
                     placeholder="Street Address"/>
              <input type="text" v-model="form.employerAddress.street2"
                     class="input input-bordered w-full"
                     placeholder="Street Address Line 2"/>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" v-model="form.employerAddress.city" required
                       class="input input-bordered w-full"
                       placeholder="City"/>
                <input type="text" v-model="form.employerAddress.state" required
                       class="input input-bordered w-full"
                       placeholder="State / Province / Emirate"/>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" v-model="form.employerAddress.postalCode" required
                       class="input input-bordered w-full"
                       placeholder="Postal / Zip Code"/>
                <select v-model="form.employerAddress.country" required class="select select-bordered w-full">
                  <option value="">Select Country</option>
                  <option v-for="country in countries" :value="country">{{ country }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700 font-medium mb-2">4. Nature of Business <span
                  class="text-red-500">*</span></label>
              <input type="text" v-model="form.natureOfBusiness" required
                     class="input input-bordered w-full"/>
            </div>
            <div>
              <label class="block text-gray-700 font-medium mb-2">5. Monthly Income/ Revenue <span class="text-red-500">*</span></label>
              <input type="text" v-model="form.monthlyIncome" required
                     class="input input-bordered w-full"
                     placeholder="AED/ $100,000"/>
              <p class="text-sm text-gray-500 mt-1">Enter the amount with the currency sign. (AED/ $100,000)</p>
            </div>
          </div>

          <!-- Source of Funds -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">6. Source of Funds <span
                class="text-red-500">*</span></label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label class="flex items-center">
                <input type="checkbox" v-model="form.sourceOfFunds" value="Personal savings" required
                       class="checkbox checkbox-primary"/>
                <span class="ml-2">Personal savings</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" v-model="form.sourceOfFunds" value="Employment income" required
                       class="checkbox checkbox-primary"/>
                <span class="ml-2">Employment income</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" v-model="form.sourceOfFunds" value="Business ownership" required
                       class="checkbox checkbox-primary"/>
                <span class="ml-2">Business ownership</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" v-model="form.sourceOfFunds" value="Investments" required
                       class="checkbox checkbox-primary"/>
                <span class="ml-2">Investments</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" v-model="form.sourceOfFunds" value="Share sales" required
                       class="checkbox checkbox-primary"/>
                <span class="ml-2">Share sales</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" v-model="form.sourceOfFunds" value="Property sales" required
                       class="checkbox checkbox-primary"/>
                <span class="ml-2">Property sales</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" v-model="form.sourceOfFunds" value="Gambling winnings" required
                       class="checkbox checkbox-primary"/>
                <span class="ml-2">Gambling winnings</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" v-model="form.sourceOfFunds" value="Inheritance and gifts" required
                       class="checkbox checkbox-primary"/>
                <span class="ml-2">Inheritance and gifts</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" v-model="form.sourceOfFunds" value="Compensation from legal rulings" required
                       class="checkbox checkbox-primary"/>
                <span class="ml-2">Compensation from legal rulings</span>
              </label>
              <div class="flex items-center">
                <input type="checkbox" v-model="form.sourceOfFunds" value="other" required
                       class="checkbox checkbox-primary"/>
                <span class="ml-2">Other (specify)</span>
                <input v-if="form.sourceOfFunds.includes('other')" type="text" v-model="form.otherSourceOfFunds"
                       class="input input-bordered input-sm ml-2 w-48"
                       placeholder="Please specify"/>
              </div>
            </div>
          </div>
        </div>

        <!-- D. Transaction Details -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-purple-800 border-b pb-2">D. Transaction Details</h2>

          <!-- Role in Transaction -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">1. Role in the Transaction <span
                class="text-red-500">*</span></label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label class="flex items-center">
                <input type="radio" v-model="form.transactionRole" value="Buyer" required class="radio radio-primary"/>
                <span class="ml-2">Buyer</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.transactionRole" value="Seller" required class="radio radio-primary"/>
                <span class="ml-2">Seller</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.transactionRole" value="Developer" required
                       class="radio radio-primary"/>
                <span class="ml-2">Developer</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.transactionRole" value="Agent/ Representative (if applicable)"
                       required class="radio radio-primary"/>
                <span class="ml-2">Agent/ Representative (if applicable)</span>
              </label>
            </div>
          </div>

          <!-- Property Type and Address -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700 font-medium mb-2">2. Property Type <span
                  class="text-red-500">*</span></label>
              <input type="text" v-model="form.propertyType" required
                     class="input input-bordered w-full"
                     placeholder="Apartment, Villa, Land, Etc."/>
              <p class="text-sm text-gray-500 mt-1">(Apartment, Villa, Land, Etc.)</p>
            </div>
          </div>

          <!-- Property Address -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">3. Property Address <span class="text-red-500">*</span></label>
            <div class="space-y-4">
              <input type="text" v-model="form.propertyAddress.street" required
                     class="input input-bordered w-full"
                     placeholder="Street Address"/>
              <input type="text" v-model="form.propertyAddress.building"
                     class="input input-bordered w-full"
                     placeholder="Building Name"/>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" v-model="form.propertyAddress.city" required
                       class="input input-bordered w-full"
                       placeholder="City"/>
                <input type="text" v-model="form.propertyAddress.state" required
                       class="input input-bordered w-full"
                       placeholder="State / Province / Emirate"/>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" v-model="form.propertyAddress.postalCode" required
                       class="input input-bordered w-full"
                       placeholder="Postal / Zip Code"/>
                <select v-model="form.propertyAddress.country" required class="select select-bordered w-full">
                  <option value="">Select Country</option>
                  <option v-for="country in countries" :value="country">{{ country }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Transaction Type and Value -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700 font-medium mb-2">4. Transaction Type <span
                  class="text-red-500">*</span></label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="radio" v-model="form.transactionType" value="Purchase" required
                         class="radio radio-primary"/>
                  <span class="ml-2">Purchase</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="form.transactionType" value="Sale" required class="radio radio-primary"/>
                  <span class="ml-2">Sale</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="form.transactionType" value="Lease" required
                         class="radio radio-primary"/>
                  <span class="ml-2">Lease</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="form.transactionType" value="Development/ Investment" required
                         class="radio radio-primary"/>
                  <span class="ml-2">Development/ Investment</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-gray-700 font-medium mb-2">5. Transaction Value <span
                  class="text-red-500">*</span></label>
              <input type="text" v-model="form.transactionValue" required
                     class="input input-bordered w-full"
                     placeholder="AED/ $1,000,000.00"/>
              <p class="text-sm text-gray-500 mt-1">Exact amount including currency sign. (AED/ $1,000,000.00)</p>
            </div>
          </div>

          <!-- Payment Method -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">6. Payment Method <span
                class="text-red-500">*</span></label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label class="flex items-center">
                <input type="radio" v-model="form.paymentMethod" value="Bank Transfer" required
                       class="radio radio-primary"/>
                <span class="ml-2">Bank Transfer</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.paymentMethod" value="Cash" required class="radio radio-primary"/>
                <span class="ml-2">Cash</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.paymentMethod" value="Cheque" required class="radio radio-primary"/>
                <span class="ml-2">Cheque</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.paymentMethod" value="Mortgage Financing" required
                       class="radio radio-primary"/>
                <span class="ml-2">Mortgage Financing</span>
              </label>
              <div class="flex items-center">
                <input type="radio" v-model="form.paymentMethod" value="other" required class="radio radio-primary"/>
                <span class="ml-2">Other (specify)</span>
                <input v-if="form.paymentMethod === 'other'" type="text" v-model="form.otherPaymentMethod"
                       class="input input-bordered input-sm ml-2 w-48"
                       placeholder="Please specify"/>
              </div>
            </div>
          </div>
        </div>

        <!-- E. Politically Exposed Persons (PEPs) and Sanctions -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-purple-800 border-b pb-2">E. Politically Exposed Persons (PEPs) and
            Sanctions</h2>

          <!-- PEP Question -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">1. Are you, or any immediate family member, a
              Politically Exposed Person (PEP)? <span class="text-red-500">*</span></label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input type="radio" v-model="form.isPEP" :value="true" required class="radio radio-primary"/>
                <span class="ml-2">Yes</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.isPEP" :value="false" required class="radio radio-primary"/>
                <span class="ml-2">No</span>
              </label>
            </div>
            <div v-if="form.isPEP" class="mt-4">
              <label class="block text-gray-700 font-medium mb-2">If Yes, please specify the relationship and position
                held: <span class="text-red-500">*</span></label>
              <input type="text" v-model="form.PEPDetails" required
                     class="input input-bordered w-full"/>
            </div>
            <div v-else class="mt-4">
              <input type="text" v-model="form.PEPDetails" value="Not Applicable" readonly
                     class="input input-bordered w-full bg-gray-100"/>
            </div>
          </div>

          <!-- Sanctions Question -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">2. Are you, or any immediate family member, listed on
              any international sanctions list? <span class="text-red-500">*</span></label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input type="radio" v-model="form.isSanctioned" :value="true" required class="radio radio-primary"/>
                <span class="ml-2">Yes</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.isSanctioned" :value="false" required class="radio radio-primary"/>
                <span class="ml-2">No</span>
              </label>
            </div>
          </div>
        </div>

        <!-- F. Beneficial Ownership (For Developers/Companies) -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-purple-800 border-b pb-2">F. Beneficial Ownership (For
            Developers/Companies)</h2>

          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="font-medium mb-4">If you represent a company or development project, please provide details of
              ultimate beneficial owners:</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-gray-700 font-medium mb-2">1. Company Name <span class="text-red-500">*</span></label>
                <input type="text" v-model="form.companyName" required
                       class="input input-bordered w-full"/>
                <p v-if="!form.companyName" class="text-sm text-gray-500 mt-1">If No, write Not Applicable.</p>
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">2. Company Registration Number <span
                    class="text-red-500">*</span></label>
                <input type="text" v-model="form.companyRegistrationNumber" required
                       class="input input-bordered w-full"/>
                <p v-if="!form.companyRegistrationNumber" class="text-sm text-gray-500 mt-1">If No, write Not
                  Applicable.</p>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-gray-700 font-medium mb-2">3. Ownership Structure <span
                  class="text-red-500">*</span></label>
              <input type="text" v-model="form.ownershipStructure" required
                     class="input input-bordered w-full"/>
              <p v-if="!form.ownershipStructure" class="text-sm text-gray-500 mt-1">If No, write Not Applicable.</p>
            </div>
          </div>
        </div>

        <!-- G. Declaration and Consent -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-purple-800 border-b pb-2">G. Declaration and Consent</h2>

          <div class="bg-gray-50 p-4 rounded-lg">
            <ul class="list-disc pl-5 space-y-2">
              <li class="text-justify">I hereby declare that the information provided above is true, accurate, and
                complete to the best of my knowledge.
              </li>
              <li class="text-justify">I understand that the real estate company will perform a verification process as
                required by UAE AML regulations.
              </li>
              <li class="text-justify">I consent to the collection and processing of my personal data as part of the due
                diligence process in accordance with UAE data protection laws and AML/CTF regulations.
              </li>
              <li class="text-justify">I acknowledge that the real estate company is obligated to report suspicious
                transactions or activities to the UAE Financial Intelligence Unit (FIU) if deemed necessary.
              </li>
              <li class="text-justify">I confirm that any information is found incorrect and/or incomplete that leads a
                violation of regulations may initiate legal actions, and I accept that I am the responsible party for
                any and all charges, penalties and violations.
              </li>
            </ul>
          </div>

          <!-- Applicant Signature -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700 font-medium mb-2">Name of the Applicant <span
                  class="text-red-500">*</span></label>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <input type="text" v-model="form.applicantName.first" required
                         class="input input-bordered w-full"
                         placeholder="First Name"/>
                </div>
                <div>
                  <input type="text" v-model="form.applicantName.last" required
                         class="input input-bordered w-full"
                         placeholder="Last Name"/>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">Signature of the Applicant <span class="text-red-500">*</span></label>

              <SignatureLight/>
            </div>
          </div>

          <!-- Date Signed -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700 font-medium mb-2">Date Signed <span
                  class="text-red-500">*</span></label>
              <input type="date" v-model="form.signatureDate" required
                     class="input input-bordered w-full"/>
            </div>
          </div>
        </div>

        <!-- Important Notes -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <h3 class="font-bold text-blue-800 mb-2">Important Notes:</h3>
          <p class="mb-2"><strong>1. Data Protection Policy:</strong> All personal and business data provided in this
            form will be handled in accordance with applicable privacy and data protection laws in the UAE.</p>
          <p><strong>2. Additional Documents If Required by Compliance:</strong> Clients may be required to submit
            supporting documents, such as proof of identity/proof of address/business documents etc.</p>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center pt-6">
          <button type="submit" class="btn  btn-black px-8">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>
