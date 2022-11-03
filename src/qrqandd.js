import Vue from 'vue';
import QuickQr from "./QuickQr";

let appConfig = {
  el: '#app',
  components: {
    QuickQr
  },
  data() {
    return {
      //
    }
  }
}

new Vue(appConfig)
