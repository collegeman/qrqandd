import Vue from 'vue';
import QuickQr from "./QuickQr";

let appConfig = {
  el: '#app',
  components: {
    QuickQr
  },
  data() {
    return {
      value: {
        type: 'url',
        url: document.location.href,
      },
      image: 'https://picsum.photos/200/300',
      backgroundImage: '#0000',
      foregroundImage: '#000'
    }
  }
}

new Vue(appConfig)
