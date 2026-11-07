import '../css/style.css';
import '../css/main.css';

(function($) {
  'use strict';

  $(window).on('load', function() {
    $('#preloader').delay(300).fadeOut('slow', function() {
      $(this).remove();
    });
  });

  $(document).ready(function() {
    $(window).on('scroll', function() {
      const menu_area = $('.menu-area');
      if ($(window).scrollTop() > 200) {
        menu_area.addClass('sticky-menu');
      } else {
        menu_area.removeClass('sticky-menu');
      }
    });

    $(document).on('click', '.navbar-collapse.in', function(e) {
      if ($(e.target).is('a') && $(e.target).attr('class') !== 'dropdown-toggle') {
        $(this).collapse('hide');
      }
    });

    $('body').scrollspy({
      target: '.navbar-collapse',
      offset: 195
    });

    $('a.smooth_scroll').on("click", function(e) {
      e.preventDefault();
      var anchor = $(this);
      $('html, body').stop().animate({
        scrollTop: $(anchor.attr('href')).offset().top - 50
      }, 1000);
    });

    const element = $(".typejs");

    $(function() {
      element.typed({
        strings: [
          "print(\"Hello World!\")",
          "System.out.println(\"Hello World!\");",
          "printf(\"Hello World!\\n\");",
          "echo \"Hello World!\"",
          "cout << \"Hello World!\" << endl;",
          "console.log(\"Hello World!\");",
          "Write-Output \"Hello World!\"",
          "Console.WriteLine(\"Hello World!\");",
          "?- write('Hello World!'), nl.",
          "disp('Hello World!')",
          "SELECT 'Hello World!';"
        ],
        typeSpeed: 50,
        loop: true,
        backDelay: 1000,
        contentType: 'text'
      });
    });

    /* Dark mode: remember the choice in localStorage; on first visit
       follow the visitor's system preference. The preloader covers
       the page until load, so applying here causes no visible flash. */
    var storedTheme = null;
    try { storedTheme = localStorage.getItem('theme'); } catch (e) { /* private mode */ }
    var darkMode = storedTheme
      ? storedTheme === 'dark'
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var $themeToggle = $('#dark-mode-toggle');
    function applyTheme(dark) {
      document.documentElement.classList.toggle('dark-mode', dark);
      $themeToggle.find('.fa')
        .toggleClass('fa-moon-o', !dark)
        .toggleClass('fa-sun-o', dark);
      $themeToggle.attr('aria-pressed', dark ? 'true' : 'false');
      $themeToggle.attr('title', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    applyTheme(darkMode);
    $themeToggle.on('click', function() {
      darkMode = !darkMode;
      try { localStorage.setItem('theme', darkMode ? 'dark' : 'light'); } catch (e) { /* private mode */ }
      applyTheme(darkMode);
    });

    /* Contact form: FormSubmit redirects back with ?sent=1 — show the
       thank-you note, then clean the URL so a refresh doesn't re-show it. */
    if (new URLSearchParams(window.location.search).get('sent') === '1') {
      $('#contact-thanks').show();
      if (window.history && window.history.replaceState) {
        var clean = new URL(window.location.href);
        clean.searchParams.delete('sent');
        window.history.replaceState(null, '', clean.pathname + clean.search + clean.hash);
      }
    }

    $('.portfolio').mixItUp({
      callbacks: {
        onMixEnd: function() {
          updateRoomVisibility();
        }
      }
    });
    updateRoomVisibility();

    /* Hide a room entirely when the active filter leaves it with no
       visible tiles — never show an empty room heading. Rooms are
       restored before every filter click (capture phase, so this runs
       before MixItUp reads the layout): MixItUp cannot re-show tiles
       inside a display:none container, so an empty room must never
       stay hidden across a mix. */
    document.querySelector('.filters').addEventListener('click', function() {
      $('.portfolio .room').show();
    }, true);

    function updateRoomVisibility() {
      $('.portfolio .room').each(function() {
        var visible = $(this).find('.mix').filter(function() {
          return $(this).css('display') !== 'none';
        }).length;
        $(this).toggle(visible > 0);
      });
    }

    $('.work-popup').magnificPopup({
      type: 'inline',
      zoom: {
        enabled: true,
        duration: 300,
        opener: function(element) {
          var img = element.find('img');
          return img.length ? img : element;
        }
      }
    });

    $('#carousel-example-generic').carousel({
      interval: 6000,
      cycle: true
    });
  });
})(jQuery);
