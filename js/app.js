(function($) {
  'use strict';

  $(window).on('load', function() {
    $('#preloader').delay(300).fadeOut('slow', function() {
      $(this).remove();
    });
  });

  $(document).ready(function() {
    $(window).on('scroll', function() {
      var menu_area = $('.menu-area');
      if ($(window).scrollTop() > 200) {
        menu_area.addClass('sticky-menu');
      } else {
        menu_area.removeClass('sticky-menu');
      }
    });

    $(document).on('click', '.navbar-collapse.in', function(e) {
      if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
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

    var element = $(".typejs");

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
          "Console.WriteLine(\"Hello World!\");"
        ],
        typeSpeed: 50,
        loop: true,
        backDelay: 1000,
        contentType: 'text'
      });
    });

    $('.portfolio').mixItUp();

    $('.work-popup').magnificPopup({
      type: 'inline',
      zoom: {
        enabled: true,
        duration: 300,
        opener: function(element) {
          return element.find('img');
        }
      }
    });

    $(".testimonial-list").owlCarousel({
      lazyLoad: false,
      pagination: false,
      navigation: false,
      items: 1,
      itemsDesktop: [1199, 1],
      itemsDesktopSmall: [980, 1],
      itemsTablet: [768, 1],
      itemsMobile: [479, 1],
      autoPlay: true
    });

    $('#carousel-example-generic').carousel({
      interval: 6000,
      cycle: true
    });
  });
})(jQuery);
