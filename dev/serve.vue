<script>
import Vue from 'vue';
import QuickQr from '@/quick-qr.vue';
import 'bootstrap/dist/css/bootstrap.css';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    QuickQr
  }
});
</script>

<template>
  <div id="app" class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-xl-4">
        <!-- background-color=#0000 makes the background transparent -->
        <quick-qr
          background-color="#0000"
          foreground-color="#000"
          :value="{ type: 'url', url: 'https://makeqrcode.dev' }"
          tag="canvas"
          image="https://picsum.photos/200/300"
          show-form
        ></quick-qr>
      </div>
    </div>
  </div>
</template>
