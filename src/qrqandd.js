import { createApp } from 'vue/dist/vue.esm-bundler';
import VueQrcode from '@chenfengyuan/vue-qrcode';

const app = createApp({
  data () {
    return {
      value: null,
      tag: 'canvas',
      options: {
        width: 1024,
      }
    }
  }
})

app.component(VueQrcode.name, VueQrcode)

app.mount('#app');