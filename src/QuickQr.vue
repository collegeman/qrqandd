<template>
  <form
    id="qrqandd"
    class="card"
  >
    <div class="card-body">
      <div class="form-group">
        <div id="qrcode" class="d-flex justify-content-center" v-if="shouldDisplayQRCode">
          <vue-qrcode
            v-if="'svg' === tag"
            :value="qRCodeData"
            tag="svg"
            :options="options"
          ></vue-qrcode>
          <vue-qrcode
            v-if="'img' === tag"
            :value="qRCodeData"
            tag="img"
            :options="options"
          ></vue-qrcode>
          <vue-qrcode
            id="canvas-qr-code"
            v-if="'canvas' === tag"
            :value="qRCodeData"
            tag="canvas"
            :options="options"
            :key="canvasRefreshToken"
            @ready="onReady"
          ></vue-qrcode>
        </div>
      </div>
      <div class="form-group">
        <label for="tag">
          QR Code Type
        </label>
        <select
          id="type"
          v-model="type"
          class="form-control"
        >
          <option value="url">URL</option>
          <option value="vcard">VCard</option>
        </select>
      </div>
      <div class="form-group" v-if="type === 'url'">
        <label for="value">
          QR Code Value
        </label>
        <input
          id="value"
          class="form-control"
          type="text"
          v-model="value"
        >
      </div>
      <div v-if="type === 'vcard'">
        <div class="form-group">
          <label for="name">
            Name
          </label>
          <input
            id="name"
            class="form-control"
            type="text"
            v-model="vcard.name"
          >
        </div>
        <div class="form-group">
          <label for="email">
            Email
          </label>
          <input
            id="email"
            class="form-control"
            type="email"
            v-model="vcard.email"
          >
        </div>
        <div class="form-group">
          <label for="phone">
            Phone
          </label>
          <input
            id="phone"
            class="form-control"
            type="text"
            v-model="vcard.phone"
          >
        </div>
        <div class="form-group">
          <label for="website">
            Website
          </label>
          <input
            id="website"
            class="form-control"
            type="text"
            v-model="vcard.website"
          >
        </div>
        <div class="form-group">
          <label for="job-title">
            Job Title
          </label>
          <input
            id="job-title"
            class="form-control"
            type="text"
            v-model="vcard.job_title"
          >
        </div>
        <div class="form-group">
          <label for="company">
            Company
          </label>
          <input
            id="company"
            class="form-control"
            type="text"
            v-model="vcard.company"
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
        <label for="color.dark">
          Foreground Color (Hex)
        </label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">#</span>
          </div>
          <input
            id="color.dark"
            class="form-control"
            type="text"
            v-model="color.dark"
          >
        </div>
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
          v-model="colors"
          class="mx-auto mt-4 mb-2"
          :disable-alpha="true"
          v-if="hasBgColor == 1"
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
            <option value="0">Image</option>
            <option value="1">A URL to an Image</option>
          </select>
        </div>
        <div class="form-group" v-if="hasImage">
          <label for="image-url">
            Image URL
          </label>
          <input class="form-control" id="image-url" type="text" v-model="imageUrl"/>
        </div>
      </div>
      <button
        class="btn btn-block btn-dark"
        @click.prevent="download"
      >
        Download
      </button>
    </div>
  </form>
</template>

<script>
  import VueQrcode from "@chenfengyuan/vue-qrcode";
  import { Chrome } from '@ckpack/vue-color';

  import { ColorPicker } from "vue3-colorpicker";
  import "vue3-colorpicker/style.css";

  export default {
    data() {
      return {
        value: document.location.toString(),
        color: {
          dark: '000',
          light: '0000',
        },
        width: 1024,
        type: 'url',
        tag: 'img',
        vcard: {},
        hasImage: 0,
        hasBgColor: 0,
        imageUrl: '',
        colors: {
          hex: '#CCCCCC'
        },
        canvasRefreshToken: Math.random(),
        canvas: {}
      }
    },
    components: {
      VueQrcode,
      ColorPicker,
      Chrome
    },
    computed: {
      qRCodeData() {
        if (this.type === 'url') {
          return this.value
        } else {
          return this.generateVCardData()
        }
      },
      options () {
        return {
          width: this.width,
          color: {
            dark: '#' + this.color.dark,
            light: this.bgColor,
          }
        }
      },
      bgColor () {
        if (this.hasBgColor) return this.colors.hex;
        return '#0000';
      },
      shouldDisplayQRCode () {
        return ((this.type === 'url' && this.value) || (this.type === 'vcard' && (this.vcard.name && this.vcard.phone)))
      }
    },
    watch: {
      imageUrl(newURL, oldURL) {
        if(newURL && this.tag === 'canvas') {
          this.refreshTokenForCanvas()
        }
      }
    },
    methods: {
      generateQRCode() {
        if (this.type === 'url') {
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

      onReady(canvas) {
        if(!this.imageUrl) return;
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
        return  "BEGIN:VCARD\n" +
          "VERSION:4.0\n" +
          "N:" + this.vcard.name + "\n" +
          "FN:" + this.vcard.name + "\n" +
          "EMAIL:" + this.vcard.email + "\n" +
          "ORG:" + this.vcard.company + "\n" +
          "TITLE:" + this.vcard.job_title + "\n" +
          "URL:" + "https://" + this.vcard.website + "\n" +
          "TEL:" + this.vcard.phone + "\n" +
          "END:VCARD";
      }
    }
  }
</script>
