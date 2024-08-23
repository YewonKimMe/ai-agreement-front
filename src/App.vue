<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted } from 'vue';
import IconMoonStartsFill from './components/icons/IconMoonStarsFill.vue'
import IconSunFill from './components/icons/IconSunFill.vue';

let isDarkMode = ref(false);
function toggleTheme() {
  // 현재 테마를 가져옴
  var currentTheme = document.documentElement.getAttribute('data-bs-theme');

  console.log("currentTheme=" + currentTheme)

  let checkbox = (currentTheme === 'light') ? 'true' : 'false';

  // 테마를 변경
  var newTheme = (currentTheme === 'light') ? 'dark' : 'light';
  isDarkMode.value = (newTheme === 'light') ? false : true;
  
  console.log("currentTheme=" + currentTheme + ", " + "isDarkMode.value=" + isDarkMode.value)

  document.documentElement.setAttribute('data-bs-theme', newTheme);

  localStorage.setItem('themeSwitchState', checkbox);
}

function moveTop(){
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
}
function moveBottom(){
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
}

onMounted(() => {
  localStorage.setItem('themeSwitchState', 'true'); // 추가, 처음 접속 시 항상 다크모드이게
  let savedThemeState = localStorage.getItem('themeSwitchState');
  console.log("savedThemeState=" + savedThemeState)
  isDarkMode.value = savedThemeState === 'true';
  const initialTheme = isDarkMode.value ? 'dark' : 'light';

  console.log("isDarkMode.value=" + isDarkMode.value);
  console.log("initialTheme=" + initialTheme)
  document.documentElement.setAttribute('data-bs-theme', initialTheme);
});


</script>

<template>
  <div class="main">
    <nav class="navbar navbar-expand-lg d-flex justify-content-evenly sticky-top bg-body-tertiary shadow-sm bg-opacity-75">
      <div class="container-lg">
        <h3>계약서 ai 검증 테스트 / art team 2 / vue.js</h3>
        <button class="navbar-toggler me-2 fs-6" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">

            <!--event tab-->
          </ul>
        </div>
      </div>
      <ul class="flex-fill"></ul>
      <div class="d-flex align-items-center">
        <!--login, user-->
        <!--다크모드 버튼-->
        <div class="btn me-4 p-2" id="themeSwitch2" @click="toggleTheme">
          <component :is="isDarkMode ? IconSunFill : IconMoonStartsFill" />
        </div>
      </div>
    </nav>
    <RouterView />
  </div>
  
</template>

<style scoped>
.main {
  font-family: 'GowunDodum';
}
</style>
