import { createApp } from 'vue/dist/vue.esm-bundler';
import VueQrcode from '@chenfengyuan/vue-qrcode';

const app = createApp({
  data () {
    return {
      value: document.location.toString(),
      tag: 'img',
      options: {
        width: 1024,
      }
    }
  },
  methods: {
    download () {
      const element = document.createElement("a");

      if ('svg' === this.tag) {
        const svg = document.querySelector('#qrcode svg').outerHTML
        const blob = new Blob([svg.toString()])
        element.download = "qrcode.svg"
        element.href = window.URL.createObjectURL(blob)
      } else if ('img' === this.tag) {
        const img = document.querySelector('#qrcode img')
        const byteString = atob(img.src.split(',')[1]);
        const mimeString = img.src.split(',')[0].split(':')[1].split(';')[0]
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], {type: mimeString})
        element.download = "qrcode.png"
        element.href = window.URL.createObjectURL(blob)
      }

      element.click();
      element.remove();
    }
  }
})

app.component(VueQrcode.name, VueQrcode)

app.mount('#app');