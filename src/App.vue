<template>
  <div>
    <section class="hero is-default is-bold">
     <div class="hero-head">
       <div class="container">
         <nav class="nav has-shadow">
           <div class="container">
             <div class="nav-left">
               <a class="nav-item" href="/">
                 <h1 class="title is-4">SiSEC MUS</h1>
               </a>
             </div>
             <div class="nav-right">
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
         <span><img src="./assets/logo_INRIA.png" alt="Inria" width="100px"></span>
         <span><img src="./assets/alabs_logo.svg" alt="audiolab" width="100px"></span>
       </p>
       <p>
         The source code of this website is licensed
         <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
         is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC ANS 4.0</a>.
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
.nav-left {
  padding-left: 1em;
}
</style>
