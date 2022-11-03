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
        name: 'Seth Atam',
        company: 'c21 redwood',
        title: 'Web Developer',
        email: 'sethatam@c21redwood.com',
        phone: '(123) 456 1234',
      },
      image: 'https://picsum.photos/200/300',
      backgroundImage: '#0000',
      foregroundImage: '#000'
    }
  }
}

new Vue(appConfig)
