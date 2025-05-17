<template>
  <section>
    <div class="signature-container p-4   rounded-box">

      <div
          ref="signaturePad"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @touchstart="startDrawing"
          @touchmove="draw"
          @touchend="stopDrawing"
          class="signature-pad border border-gray-300 rounded-lg p-4 h-36 flex items-center justify-center"
          :style="{ 'background-color': canvasBackground }"
      ></div>
    </div>
    <div class="flex ps-4 justify-between items-center mb-4">
      <div class="flex gap-2">
        <button @click="clearSignature" class="btn btn-outline btn-sm" type="button">
          Clear
        </button>
        <!--        <button @click="saveSignature" class="btn btn-primary btn-sm">-->
        <!--          Save-->
        <!--        </button>-->

      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, onMounted} from 'vue';

const signaturePad = ref(null);
const isDrawing = ref(false);
const lastX = ref(0);
const lastY = ref(0);
const ctx = ref(null);
const signatureDataUrl = ref(null);
const penColor = ref('#000000');
const canvasBackground = ref('#ffffff');

const colorOptions = [
  '#000000',
  '#ff0000',
  '#0000ff',
  '#008000',
  '#800080',
  '#ffa500',
];

const togglePenColor = () => {
  const currentIndex = colorOptions.indexOf(penColor.value);
  const nextIndex = (currentIndex + 1) % colorOptions.length;
  penColor.value = colorOptions[nextIndex];
};

const setBackground = (color) => {
  canvasBackground.value = color;
  clearSignature();
};

onMounted(() => {
  const canvas = document.createElement('canvas');
  signaturePad.value.appendChild(canvas);
  canvas.width = signaturePad.value.offsetWidth;
  canvas.height = signaturePad.value.offsetHeight;
  ctx.value = canvas.getContext('2d');

  // Handle window resize
  window.addEventListener('resize', () => {
    const dataUrl = canvas.toDataURL();
    canvas.width = signaturePad.value.offsetWidth;
    canvas.height = signaturePad.value.offsetHeight;
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      ctx.value.drawImage(img, 0, 0);
    };
  });
});

const startDrawing = (e) => {
  isDrawing.value = true;
  const rect = signaturePad.value.getBoundingClientRect();
  const clientX = e.clientX || e.touches[0].clientX;
  const clientY = e.clientY || e.touches[0].clientY;

  lastX.value = clientX - rect.left;
  lastY.value = clientY - rect.top;
};

const draw = (e) => {
  if (!isDrawing.value) return;
  e.preventDefault();

  const rect = signaturePad.value.getBoundingClientRect();
  const canvas = signaturePad.value.querySelector('canvas');
  const clientX = e.clientX || e.touches[0].clientX;
  const clientY = e.clientY || e.touches[0].clientY;

  const currentX = clientX - rect.left;
  const currentY = clientY - rect.top;

  ctx.value.beginPath();
  ctx.value.moveTo(lastX.value, lastY.value);
  ctx.value.lineTo(currentX, currentY);
  ctx.value.strokeStyle = penColor.value;
  ctx.value.lineWidth = 2;
  ctx.value.lineCap = 'round';
  ctx.value.stroke();

  lastX.value = currentX;
  lastY.value = currentY;
};

const stopDrawing = () => {
  isDrawing.value = false;
  updateSignatureDataUrl();
};

const clearSignature = () => {
  const canvas = signaturePad.value.querySelector('canvas');
  ctx.value.clearRect(0, 0, canvas.width, canvas.height);
  signatureDataUrl.value = null;
};

const updateSignatureDataUrl = () => {
  const canvas = signaturePad.value.querySelector('canvas');
  signatureDataUrl.value = canvas.toDataURL('image/png');
};

const saveSignature = () => {
  if (!signatureDataUrl.value) {
    alert('Please create a signature first');
    return;
  }

  updateSignatureDataUrl();
  const link = document.createElement('a');
  link.href = signatureDataUrl.value;
  link.download = 'signature.png';
  link.click();
};
</script>

<style scoped>
.signature-pad {
  touch-action: none; /* Prevent scrolling on touch devices */
}
</style>