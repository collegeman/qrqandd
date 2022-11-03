<template>
  <form
      id="qrqandd"
      class="card"
  >
    <div class="card-body">
      <div class="form-group">
        <div id="qrcode" class="d-flex justify-content-center">
          <vue-qrcode
              v-if="'svg' === tag"
              :options="options"
              :value="qRCodeData"
              tag="svg"
          ></vue-qrcode>
          <vue-qrcode
              v-if="'img' === tag"
              :options="options"
              :value="qRCodeData"
              tag="img"
          ></vue-qrcode>
          <vue-qrcode
              v-if="'canvas' === tag"
              id="canvas-qr-code"
              :key="canvasRefreshToken"
              :options="options"
              :value="qRCodeData"
              tag="canvas"
              @ready="onReady"
          ></vue-qrcode>
        </div>
      </div>
      <div v-if="showForm">
        <div class="form-group">
          <label for="tag">
            QR Code Type
          </label>
          <select
              id="type"
              v-model="normalizedValue.type"
              class="form-control"
          >
            <option value="url">URL</option>
            <option value="vcard">VCard</option>
          </select>
        </div>
        <div v-if="normalizedValue.type === 'url'" class="form-group">
          <label for="value">
            QR Code Value
          </label>
          <input
              id="value"
              v-model="normalizedValue.url"
              class="form-control"
              type="text"
          >
        </div>
        <div v-if="normalizedValue.type === 'vcard'">
          <div class="form-group">
            <label for="name">
              Name
            </label>
            <input
                id="name"
                v-model="normalizedValue.name"
                class="form-control"
                type="text"
            >
          </div>
          <div class="form-group">
            <label for="email">
              Email
            </label>
            <input
                id="email"
                v-model="normalizedValue.email"
                class="form-control"
                type="email"
            >
          </div>
          <div class="form-group">
            <label for="phone">
              Phone
            </label>
            <input
                id="phone"
                v-model="normalizedValue.phone"
                class="form-control"
                type="text"
            >
          </div>
          <div class="form-group">
            <label for="website">
              Website
            </label>
            <input
                id="website"
                v-model="normalizedValue.website"
                class="form-control"
                type="text"
            >
          </div>
          <div class="form-group">
            <label for="job-title">
              Job Title
            </label>
            <input
                id="job-title"
                v-model="normalizedValue.job_title"
                class="form-control"
                type="text"
            >
          </div>
          <div class="form-group">
            <label for="company">
              Company
            </label>
            <input
                id="company"
                v-model="normalizedValue.company"
                class="form-control"
                type="text"
            >
          </div>
        </div>
        <div class="form-group">
          <label for="tag">
            Image Type
          </label>
          <select
              id="tag"
              v-model="tag"
              class="form-control"
          >
            <option value="img">PNG</option>
            <option value="svg">SVG</option>
            <option value="canvas">Canvas</option>
          </select>
        </div>
        <div class="form-group">
          <label for="bg-color">
            Foreground Color (Hex)
          </label>
          <select
              id="foreground-color"
              v-model="hasFgColor"
              class="form-control"
          >
            <option value="0">Black</option>
            <option value="1">Other Color</option>
          </select>
          <chrome
              v-if="hasFgColor == 1"
              v-model="fColor"
              :disable-alpha="true"
              class="mx-auto mt-4 mb-2"
          />
        </div>
        <div class="form-group">
          <label for="bg-color">
            Background Color (Hex)
          </label>
          <select
              id="bg-color"
              v-model="hasBgColor"
              class="form-control"
          >
            <option value="0">Transparent</option>
            <option value="1">A Color</option>
          </select>
          <chrome
              v-if="hasBgColor == 1"
              v-model="bColor"
              :disable-alpha="true"
              class="mx-auto mt-4 mb-2"
          />
        </div>
        <div v-if="tag === 'canvas'">
          <div class="form-group">
            <label for="image">
              Inset Image
            </label>
            <select
                id="image"
                v-model="hasImage"
                class="form-control"
            >
              <option value="0">None</option>
              <option value="1">A URL to an Image</option>
            </select>
          </div>
          <div v-if="hasImage" class="form-group">
            <label for="image-url">
              Image URL
            </label>
            <input id="image-url" v-model="imageUrl" class="form-control" type="text"/>
          </div>
        </div>
      </div>
      <button
          v-if="showDownloadButton"
          class="btn btn-block btn-dark"
          @click.prevent="download"
      >
        Download
      </button>
    </div>
  </form>
</template>

<script>
import {Chrome} from 'vue-color';
import VueQrcode from '@chenfengyuan/vue-qrcode'

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    width: {
      type: Number,
      default: 1024
    },
    image: {
      type: String,
    },
    tag: {
      type: String,
      default: 'img',
      validator(value) {
        return ['img', 'svg', 'canvas'].includes(value)
      }
    },
    backgroundColor: {
      type: String,
      default: '#0000'
    },
    foregroundColor: {
      type: String,
      default: '#000'
    },
    showForm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      color: {
        dark: '000',
        light: '0000',
      },
      vcard: {},
      hasImage: 0,
      hasBgColor: 0,
      hasFgColor: 0,
      imageUrl: '',
      bColor: {
        hex: '#CCCCCC'
      },
      fColor: {
        hex: '#000'
      },
      canvasRefreshToken: Math.random(),
      showDownloadButton: true,
      normalizedValue: {}
    }
  },
  components: {
    VueQrcode,
    Chrome
  },

  computed: {
    qRCodeData() {
      if (this.normalizedValue.type === 'url') {
        return this.normalizedValue.url
      } else {
        return this.generateVCardData()
      }
    },
    options() {
      return {
        width: this.width,
        color: {
          dark: this.fColor.hex,
          light: this.bColor.hex,
        }
      }
    },
    bgColor() {
      if (this.hasBgColor) return this.backgroundColor;
      return '#0000';
    },
    fgColor() {
      if (this.hasFgColor) return this.foregroundColor;
      return '#000';
    }
  },

  mounted() {
    if (this.foregroundColor !== '#000') {
      this.hasFgColor = 1;
    }

    this.fColor.hex = this.foregroundColor

    if (this.backgroundColor !== '#0000') {
      this.hasBgColor = 1;
    }
    this.bColor.hex = this.backgroundColor
    this.normalizedValue = this.value

    if (this.image) {
      this.imageUrl = this.image
      this.hasImage = '1';
    }

  },

  updated() {
    if (this.tag === 'canvas' && this.imageUrl) {
      setTimeout(() => {
        this.onReady()
      }, 100)
    }
  },

  watch: {
    imageUrl(newURL, oldURL) {
      if (newURL && this.tag === 'canvas') {
        this.refreshTokenForCanvas()

      }
    },
    hasBgColor(value) {
      if (value == 0) {
        this.bColor.hex = '#0000'
      }
    },
    hasFgColor(value) {
      if (value == 0) {
        this.fColor.hex = '#000'
      }
    },
  },

  methods: {
    generateQRCode() {
      if (this.normalizedValue.type === 'url') {
        this.value = url
      } else {
        this.value = this.generateVCardData
      }
    },

    download() {
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
      } else if ('canvas' === this.tag) {
        let canvas = document.getElementById('canvas-qr-code');
        element.crossorigin = 'anonymous'
        element.href = canvas.toDataURL("image/png");
        element.download = 'qrcode.png'
      }

      element.click();
      element.remove();
    },

    refreshTokenForCanvas() {
      this.canvasRefreshToken = Math.random()
    },

    onReady() {
      if (!this.imageUrl) return;
      let canvas = document.getElementById('canvas-qr-code')
      const context = canvas.getContext('2d');
      const image = new Image();
      image.crossOrigin = 'Anonymous';
      image.src = this.imageUrl;

      image.onload = () => {
        const coverage = 0.15;
        const width = Math.round(canvas.width * coverage);
        const x = (canvas.width - width) / 2;

        this.drawImage(context, image, x, x, width, width);
      };
    },

    drawImage(context, image, x, y, width, height, radius = 4) {
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 2;
      context.shadowBlur = 4;
      context.shadowColor = '#00000040';
      context.lineWidth = 8;
      context.beginPath();
      context.moveTo(x + radius, y);
      context.arcTo(x + width, y, x + width, y + height, radius);
      context.arcTo(x + width, y + height, x, y + height, radius);
      context.arcTo(x, y + height, x, y, radius);
      context.arcTo(x, y, x + width, y, radius);
      context.closePath();
      context.strokeStyle = '#fff';
      context.stroke();
      context.clip();
      context.fillStyle = '#fff';
      context.fillRect(x, x, width, height);
      context.drawImage(image, x, x, width, height);
    },

    generateVCardData() {
      return "BEGIN:VCARD\n" +
          "VERSION:4.0\n" +
          "N:" + this.normalizedValue.name + "\n" +
          "FN:" + this.normalizedValue.name + "\n" +
          "EMAIL:" + this.normalizedValue.email + "\n" +
          "ORG:" + this.normalizedValue.company + "\n" +
          "TITLE:" + this.normalizedValue.job_title + "\n" +
          "URL:" + this.normalizedValue.website + "\n" +
          "TEL:" + this.normalizedValue.phone + "\n" +
          "END:VCARD";
    }
  }
}
</script>
