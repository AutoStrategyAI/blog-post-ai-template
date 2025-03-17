  document.addEventListener('DOMContentLoaded', function() {
    const burgerButton = document.querySelector('.burger-menu-button');
    const navMenu = document.querySelector('.nav-menu');
    
    burgerButton.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      burgerButton.classList.toggle('active');
    });
  });