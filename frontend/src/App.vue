<template>
  <!-- layout-wrapper растягивает страницу на весь экран и прижимает футер вниз -->
  <div class="layout-wrapper">
    <header class="navbar">
      <div class="inner">
        <!-- Логотип сайта — две части разного цвета -->
        <RouterLink to="/" class="logo">Tutor<span>Game</span></RouterLink>
        <nav>
          <RouterLink to="/">Гайды</RouterLink>
          <RouterLink to="/games">Игры</RouterLink>
        </nav>
      </div>
    </header>

    <!-- main растягивается и заполняет всё пространство между navbar и footer -->
    <main class="layout-content">
      <RouterView />
    </main>

    <footer class="footer">
      <div class="container">
        TutorGame © 2024 — База знаний для геймеров
      </div>
    </footer>
  </div>
</template>
