<template>
  <div>
    <section class="hero is-default is-bold">
     <div class="hero-head">
       <div class="container">
         <nav class="nav has-shadow">
           <div class="container">
             <div class="nav-left">
               <a class="nav-item" href="/">
                 <h1 class="title is-4">DSD100 Evaluation Results</h1>
               </a>
             </div>
             <span class="nav-toggle">

             </span>
             <div class="nav-right nav-menu">
               <main-menu></main-menu>
             </div>
           </div>
         </nav>
       </div>
     </div>

     <div class="hero-body">
       <div class="container">
         <router-view><router-view>
       </div>
     </div>
   </section>
   <footer class="footer">
   <div class="container">
     <div class="content has-text-centered">
       <p>
         The source code of this website is licensed
         <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
         is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC ANS 4.0</a>.
       </p>
       <p>
       </p>
     </div>
   </div>
  </footer>
</div>
</template>

<script>
import bulma from 'bulma/css/bulma.css';
import MainMenu from './Menu.vue'

export default {
  components: { MainMenu }
}
</script>

<style>
</style>
