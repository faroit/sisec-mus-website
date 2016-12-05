import Vue from 'vue'
import { EventEmitter } from 'events'
import { Promise } from 'es6-promise'
import * as d3dsv from 'd3-dsv'

const cache = Object.create(null)
const store = new EventEmitter()

export default store

store.getData = function(url) {
  return new Promise((resolve, reject) => {
    if (cache[url]) {
      resolve(cache[url])
    } else {
      Vue.http.get(url).then(

        // SUCCESS
        function (response) {
          const type = response.headers["content-type"]

          if (url.endsWith('csv') || type.includes("text/csv")) {
            var parsed = d3dsv.csvParse(response.data)
          }

          else if (type.includes("application/json")) {
            var parsed = response.data;
          }

          else {
            console.log("error decoding " + url)
            reject();
          }

          const config = cache[url] = parsed;
          resolve(config);
        }.bind(this),

        // ERROR
        function (response) {
          console.log("error loading " + url)
          reject();
        }.bind(this)
      )
    }
  })
}
