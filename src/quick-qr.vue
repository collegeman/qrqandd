<template>
  <div
    :class="[
      '--quick-qr',
      {
        'card': ui === 'card',
      }
    ]"
  >
    <div :class="{
      'card-body': ui === 'card'
    }">
      <div class="d-flex justify-content-center">
        <vue-qrcode
          v-if="'svg' === configTag"
          :options="options"
          :value="qRCodeData"
          tag="svg"
        ></vue-qrcode>
        <vue-qrcode
          v-if="'img' === configTag"
          :options="options"
          :value="qRCodeData"
          tag="img"
        ></vue-qrcode>
        <vue-qrcode
          v-if="'canvas' === configTag"
          :key="canvasRefreshToken"
          :options="options"
          :value="qRCodeData"
          tag="canvas"
          @ready="onReady"
        ></vue-qrcode>
      </div>
      <div v-if="showForm">
        <div class="form-group">
          <label for="value-type">
            QR Code Type
          </label>
          <select
            id="value-type"
            v-model="config.type"
            class="form-control"
          >
            <option value="url">URL</option>
            <option value="vcard">VCard</option>
          </select>
        </div>
        <div v-if="config.type === 'url'" class="form-group">
          <label for="value">
            QR Code Value
          </label>
          <input
            id="value"
            v-model="config.url"
            class="form-control"
            type="text"
          >
        </div>
        <div v-if="config.type === 'vcard'">
          <div class="form-group">
            <label for="name">
              Name
            </label>
            <input
              id="name"
              v-model="config.name"
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
              v-model="config.email"
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
              v-model="config.phone"
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
              v-model="config.website"
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
              v-model="config.job_title"
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
              v-model="config.company"
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
            v-model="configTag"
            class="form-control"
          >
            <option value="img">PNG</option>
            <!-- <option value="svg">SVG</option> -->
            <option value="canvas">Canvas</option>
          </select>
        </div>
        <div class="form-group">
          <label for="foreground-color">
            Foreground Color (Hex)
          </label>
          <select
            id="foreground-color"
            v-model="hasFgColor"
            class="form-control"
          >
            <option :value="0">Black</option>
            <option :value="1">Other Color</option>
          </select>
          <chrome
            v-if="hasFgColor"
            v-model="fgColor"
            :disable-alpha="true"
            class="mx-auto mt-4 mb-2"
          />
        </div>
        <div class="form-group">
          <label for="background-color">
            Background Color (Hex)
          </label>
          <select
            id="background-color"
            v-model="hasBgColor"
            class="form-control"
          >
            <option :value="0">Transparent</option>
            <option :value="1">A Color</option>
          </select>
          <chrome
            v-if="hasBgColor"
            v-model="bgColor"
            :disable-alpha="true"
            class="mx-auto mt-4 mb-2"
          />
        </div>
        <div v-if="configTag === 'canvas'">
          <div class="form-group">
            <label for="image">
              Inset Image
            </label>
            <select
              id="image"
              v-model="hasImage"
              class="form-control"
            >
              <option :value="0">None</option>
              <option :value="1">A URL to an Image</option>
            </select>
          </div>
          <div
            v-if="hasImage"
            class="form-group"
          >
            <label for="image-url">
              Image URL
            </label>
            <input id="image-url" v-model="imageUrl" class="form-control" type="text"/>
          </div>
        </div>
      </div>
      <button
        v-if="showForm || showDownloadButton"
        class="btn btn-block btn-dark"
        @click.prevent="download"
      >
        Download
      </button>
    </div>
  </div>
</template>

<style scoped>
.--quick-qr canvas,
.--quick-qr svg,
.--quick-qr img {
  display: block;
  max-width: 100% !important;
  height: auto !important;
}
</style>

<script>
  import {Chrome} from 'vue-color';
  import VueQrcode from '@chenfengyuan/vue-qrcode'

  export default /*#__PURE__*/{
    name: 'quick-qr',
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
          return [
            'img',
            // 'svg',
            'canvas',
          ].includes(value)
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
      },
      showDownloadButton: {
        type: Boolean,
        default: false,
      },
      ui: {
        type: [String, Boolean],
        default: false,
      }
    },
    data() {
      return {
        vcard: {},
        hasImage: 0,
        hasBgColor: 0,
        hasFgColor: 0,
        imageUrl: '',
        bgColor: {
          hex: '#0000'
        },
        fgColor: {
          hex: '#000'
        },
        canvasRefreshToken: Math.random(),
        configTag: this.tag,
        config: {
          type: null,
          url: null,
          name: null,
          email: null,
          job_title: null,
          company: null,
          website: null,
          phone: null
        }
      }
    },
    components: {
      VueQrcode,
      Chrome
    },

    computed: {
      qRCodeData() {
        if (this.config.type === 'url') {
          return this.config.url
        } else {
          return this.generateVCardData()
        }
      },
      options() {
        return {
          width: this.width,
          color: {
            dark: this.fgColor.hex,
            light: this.bgColor.hex,
          }
        }
      },
    },

    mounted() {
      if (this.foregroundColor !== '#000') {
        this.hasFgColor = 1
      }

      this.fgColor.hex = this.foregroundColor

      if (this.backgroundColor !== '#0000') {
        this.hasBgColor = 1
      }

      this.bgColor.hex = this.backgroundColor
      this.config = this.value

      if (this.image) {
        this.imageUrl = this.image
        this.hasImage = 1
      }

    },

    updated() {
      if (this.configTag === 'canvas' && this.imageUrl) {
        setTimeout(() => {
          this.onReady()
        }, 100)
      }
    },

    watch: {
      imageUrl(newURL, oldURL) {
        if (newURL && this.configTag === 'canvas') {
          this.refreshTokenForCanvas()
        }
      },
      hasImage() {
        if (this.configTag === 'canvas') {
          this.refreshTokenForCanvas()
        }
      },
      hasBgColor(value) {
        if (value === 0) {
          this.bgColor.hex = '#0000'
        }
      },
      hasFgColor(value) {
        if (value === 0) {
          this.fgColor.hex = '#000'
        }
      },
    },

    methods: {
      download() {
        const element = document.createElement("a")
        if ('svg' === this.configTag) {
          const svg = this.$el.querySelector('svg').outerHTML
          const blob = new Blob([svg.toString()])
          element.download = "qrcode.svg"
          element.href = window.URL.createObjectURL(blob)
        } else if ('img' === this.configTag) {
          const img = this.$el.querySelector('img')
          const byteString = atob(img.src.split(',')[1])
          const mimeString = img.src.split(',')[0].split(':')[1].split(';')[0]
          const ab = new ArrayBuffer(byteString.length)
          const ia = new Uint8Array(ab)
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
          }
          const blob = new Blob([ab], {type: mimeString})
          element.download = "qrcode.png"
          element.href = window.URL.createObjectURL(blob)
        } else if ('canvas' === this.configTag) {
          let canvas = this.$el.querySelector('canvas')
          element.crossorigin = 'anonymous'
          element.href = canvas.toDataURL("image/png")
          element.download = 'qrcode.png'
        }

        element.click()
        element.remove()
      },

      refreshTokenForCanvas() {
        this.canvasRefreshToken = Math.random()
      },

      onReady() {
        if (!this.imageUrl) {
          return false
        }
        let canvas = this.$el.querySelector('canvas')
        const context = canvas.getContext('2d')
        const image = new Image()
        image.crossOrigin = 'Anonymous'
        image.src = this.imageUrl

        if (this.hasImage) {
          image.onload = () => {
            const coverage = 0.15
            const width = Math.round(canvas.width * coverage)
            const x = (canvas.width - width) / 2
            this.drawImage(context, image, x, x, width, width)
          }
        }
      },

      drawImage(context, image, x, y, width, height, radius = 4) {
        context.shadowOffsetX = 0
        context.shadowOffsetY = 2
        context.shadowBlur = 4
        context.shadowColor = '#00000040'
        context.lineWidth = 50
        context.beginPath()
        context.moveTo(x + radius, y)
        context.arcTo(x + width, y, x + width, y + height, radius)
        context.arcTo(x + width, y + height, x, y + height, radius)
        context.arcTo(x, y + height, x, y, radius)
        context.arcTo(x, y, x + width, y, radius)
        context.closePath()
        context.strokeStyle = '#fff'
        context.stroke()
        context.clip()
        context.fillStyle = '#fff'
        context.fillRect(x, x, width, height)
        context.drawImage(image, x, x, width, height)
      },

      generateVCardData() {
        let vcard = []

        vcard.push("BEGIN:VCARD")

        vcard.push("VERSION:4.0")
        vcard.push("N:" + this.config.name)
        vcard.push("FN:" + this.config.name)
        vcard.push("EMAIL:" + this.config.email)
        vcard.push("ORG:" + this.config.company)
        vcard.push("TITLE:" + this.config.job_title)
        if (this.config.website) {
          vcard.push("URL:" + this.config.website)
        }

        if (this.config.phone) {
          vcard.push("TEL:" + this.config.phone)
        }
        vcard.push("END:VCARD")

        return vcard.join("\n")
      }
    }
  }
</script>

