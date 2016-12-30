<template>
  <div class="hero-body">
    <section class="section" v-for="record in json">
       <div>
         <h1 class="title is-1">
           <span>{{record.short}}</span>
           <span class="tag is-dark" v-if="record.is_supervised">
              Is Supervised</i>
            </span>
            <span class="tag is-info" v-if="record.uses_augmentation">
               Uses Data Augmentation</i>
             </span>
          </h1>
         <h2 class="subtitle">
           <strong>{{record.authors}}</strong>, {{record.affiliation}}
         </h2>
         <div class="content">
           <p>{{record.description}}</p>
           <blockquote>
             References:
             <ul v-for="ref in record.references">
               <li>{{ref}}</li>
             </ul>
           </blockquote>
         </div>
         <p class="control has-addons">
           <div class="control is-grouped">
             <p class="control">
               <a v-if="record.email" class="button" :href="'mailto:' + record.email">
                 <span class="icon is-small">
                   <i class="fa fa-envelope-o"></i>
                 </span>
                 <span>Email Author</span>
               </a>
             </p>
             <p class="control">
               <a v-if="record.code" :href="record.code" class="button">
                 <span class="icon is-small">
                   <i v-bind:class="gh(record.code) ? 'fa fa-github' : 'fa fa-code' "></i>
                 </span>
                 <span>Code</span>
               </a>
             </p>
           </div>
   </div>
 </section>
  <!-- <tbody >
  <tr>
    <td>
      <a v-if="record.description" :data-balloon="record.description" data-balloon-length='large' data-balloon-pos="right" >
        {{record.short}}
      </a>
      <span v-else>{{record.short}}</span>
    </td>
    <td>{{record.authors}}</td>
    <td>{{record.affiliation}}</td>
    <td class="is-icon">
      <a v-if="record.email" :href="'mailto:' + record.email">
        <i class="fa fa-envelope-o"></i>
      </a>
    </td>
    <td class="is-icon">
      <span v-if="record.is_supervised">
        <i class="fa fa-check"></i>
      </span>
    </td>
    <td class="is-icon">
      <span v-if="record.uses_augmentation">
        <i class="fa fa-check"></i>
      </span>
    </td>
    <td class="is-icon">
      <a v-if="record.code" :href="record.code">
        <i v-bind:class="gh(record.code) ? 'fa fa-github' : 'fa fa-code' "></i>
      </a>
    </td>
    <td class="is-icon">
      <a v-if="record.references" :href="record.code">
        <i class="fa fa-quote-left"></i>
      </a>
    </td>
  </tr>
  </tbody>
</table> -->
  </div>
</template>

<script>
import bulma from 'bulma/css/bulma.css';

export default {
  data: function() {
    return {
      json: null
    }
  },
  filters: {
    truncate: function(string, value) {
        if( string ) {
          return string.substring(0, value) + '...';
        } else {
          return ''
        }
    },
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    gh: function(string) {
        return string.includes('github.com')
    },
    fetchData: function () {
      var xhr = new XMLHttpRequest()
      var self = this
      xhr.open('GET', '/data/metadata.json')
      xhr.onload = function () {
        self.json = JSON.parse(xhr.responseText).filter(function (d) { return d.short === self.$route.params.short ;})
      }
      xhr.send()
    }
  },
  watch: {
    '$route.params.short': 'fetchData',
  }
}
</script>

<style media="screen">
</style>
