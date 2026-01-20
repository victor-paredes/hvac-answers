$(function () {

  // ======================================================
  // SIDEBAR OPEN / CLOSE (delegated, async-safe)
  // ======================================================

  function openSidebar() {
    $('#sidebar').addClass('active');
    $('.overlay').addClass('active');
    $('#sidebarToggler').attr('aria-expanded', 'true');
  }

  function closeSidebar() {
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
    $('#sidebarToggler').attr('aria-expanded', 'false');
  }

  // Delegated because sidebar/header markup may be injected
  $(document).on('click', '#sidebarToggler', openSidebar);
  $(document).on('click', '#dismiss, .overlay', closeSidebar);


  // ======================================================
  // RESPONSIVE NAV REFLOW (HEADER <-> SIDEBAR)
  // ======================================================

  let resizeTimer;

  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeWindow, 100);
  });

  function resizeWindow() {
    var vpWidth = viewport().width;

    // Mobile / tablet (Bootstrap < lg)
    if (vpWidth < 992) {
      $("#subNavContainer").insertAfter("#slideMenuTop");
      $('#subNavContainer .dropdown-menu').addClass('d-block');
      $("#mainNav").insertAfter("#slideMenuBottom");

    // Desktop (Bootstrap lg+)
    } else {
      $("#subNavContainer").prependTo("#subNavContainerContainer");
      $('#subNavContainer .dropdown-menu').removeClass('d-block');
      $("#mainNav").appendTo("#mainNavContainerContainer");
    }
  }

  function viewport() {
    return {
      width: window.innerWidth || document.documentElement.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight
    };
  }


  // ======================================================
  // ASYNC PARTIAL LOADING (HEADER + MAIN MENU)
  // ======================================================

  // Header and menu must both exist before resize logic runs
  Promise.all([
    fetch('/partials/site-header.html')
      .then(r => r.text())
      .then(html => $('#p-site-header').html(html)),

    fetch('/partials/main-menu.html')
      .then(r => r.text())
      .then(html => $('#p-main-menu').html(html))
  ]).then(resizeWindow);




  
  // ======================================================
  // FOOTER PARTIALS (ASYNC, NO LAYOUT DEPENDENCIES)
  // ======================================================

  fetch('/partials/footer-buttons.html')
    .then(r => r.text())
    .then(html => $('#p-footer-buttons').html(html));

  fetch('/partials/site-footer.html')
    .then(r => r.text())
    .then(html => $('#p-site-footer').html(html));



  // ======================================================
  // REPAIR OR REPLACE PARTIAL (ASYNC, NO LAYOUT DEPENDENCIES)
  // ======================================================

  fetch('/repair-or-replace-content.html')
    .then(r => r.text())
    .then(html => $('#p-repair-or-replace').html(html));




  // ======================================================
  // BOOTSTRAP MEGAMENU SAFETY
  // ======================================================

  // Prevent clicks inside megamenus from closing dropdowns
  $(document).on('click', '.megamenu', function (e) {
    e.stopPropagation();
  });


  // ======================================================
  // GLOBAL MODAL IFRAME RESET (ALL PAGES)
  // ======================================================

  // Ensures any iframe inside any Bootstrap modal is reset
  // when the modal closes (audio, video, forms, scroll state)
  $(document).on('hidden.bs.modal', '.modal', function () {
    $(this).find('iframe').each(function () {
      var src = $(this).attr('src');
      if (src) {
        $(this).attr('src', src);
      }
    });
  });


  // ======================================================
  // GLOBAL UI HELPERS (SAFE ACROSS ALL PAGES)
  // ======================================================

  // Auto-update copyright year if element exists
  if ($('#currentYear').length) {
    $('#currentYear').text(new Date().getFullYear());
  }

  // Enable Bootstrap tooltips where present
  $('[data-toggle="tooltip"]').tooltip();

  // Utility class to suppress default click behavior
  $(document).on('click', '.preventDefault', function (e) {
    e.preventDefault();
  });


  // ======================================================
  // ACCORDION ICON TOGGLE (PLUS / MINUS)
  // ======================================================

  // Works for any accordion using this structure on any page
  $('body').on(
    'shown.bs.collapse hidden.bs.collapse',
    '.accordion-group .collapse',
    function (e) {
      $(this)
        .prev()
        .find('img')
        .attr(
          'src',
          e.type === 'shown'
            ? '/img/minus.svg'
            : '/img/plus.svg'
        );
    }
  );


  // ======================================================
  // ACCORDION SCROLL AND EXPAND (QUERY PARAMETER)
  // ======================================================

  // Handles ?question=accordionItem3 query parameter to scroll and expand accordions
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const question = urlParams.get('question');
  
  if (question) {
    // Use the query parameter directly as the collapse ID (e.g., "accordionItem3")
    const collapseId = question;
    // Construct header ID by appending "Header" (e.g., "accordionItem3Header")
    const headerId = collapseId + 'Header';
    
    const $header = $('#' + headerId);
    const $collapse = $('#' + collapseId);
    
    if ($header.length && $collapse.length) {
      // Smooth scroll to the accordion header
      $('html, body').animate({
        scrollTop: $header.offset().top - 30
      }, 1000, function() {
        // Expand the accordion after scrolling completes
        $collapse.collapse('show');
        
        // Set focus on the header for accessibility
        $header.attr('tabindex', '-1');
        $header.focus();
      });
    }
  }


  // ======================================================
  // EXTERNAL LINK HANDLING
  // ======================================================

  // Ensure EcoRebates product links always open in new tab
  $(document).on('click', '.ecr-view-product', function () {
    $(this).attr('target', '_blank');
  });




(function () {
  const ARROW_CLASS = 'link-arrow';

  function addArrowToLink(link) {
    if (link.querySelector('.' + ARROW_CLASS)) return;

    const span = document.createElement('span');
    span.className = ARROW_CLASS;
    span.textContent = '→';
    link.appendChild(span);
  }

  // Handle links already in DOM
  document.querySelectorAll('a.ecr-view-product').forEach(addArrowToLink);

  // Watch for Angular-injected links
  new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;

        if (node.matches?.('a.ecr-view-product')) {
          addArrowToLink(node);
        }

        node.querySelectorAll?.('a.ecr-view-product').forEach(addArrowToLink);
      });
    });
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
})();





/* ============================
   INLINE SVG INJECTOR
   ============================ */
(function injectExtHomeSVG() {
  const target = document.getElementById('img-ext-home');
  if (!target) return;

  // Prevent double-injection
  if (target.dataset.loaded === 'true') return;
  target.dataset.loaded = 'true';

  fetch('/img/svg/ext-home.html')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load ext-home SVG');
      return res.text();
    })
    .then(svgMarkup => {
      target.innerHTML = svgMarkup;
    })
    .catch(err => {
      console.warn('SVG inject error:', err);
    });
})();






  // ======================================================
  // EFFECTS
  // ======================================================



// Smooth scroll for all anchor links, including href="#"
let isScrollingToAnchor = false;

document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  e.preventDefault();

  const href = link.getAttribute('href');

  // If it's a jumplink-item, add active class and remove from others
  if (link.classList.contains('jumplink-item')) {
    document.querySelectorAll('.jumplink-item').forEach(item => {
      item.classList.remove('jumplink-active');
    });
    link.classList.add('jumplink-active');
    isScrollingToAnchor = true;
  }

  // href="#" → scroll to top
  if (href === '#') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => { isScrollingToAnchor = false; }, 500);
    return;
  }

  const target = document.querySelector(href);
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = targetPosition - 50; // 50px above the anchor

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
  
  // Reset flag after scroll completes
  setTimeout(() => { isScrollingToAnchor = false; }, 1000);
});

// Remove active class on manual scroll (but not programmatic scroll)
let scrollTimeout;
window.addEventListener('scroll', function() {
  if (isScrollingToAnchor) return; // Don't remove during anchor navigation
  
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(function() {
    document.querySelectorAll('.jumplink-item').forEach(item => {
      item.classList.remove('jumplink-active');
    });
  }, 150);
});





// /* grey background for category pages */

// function updateFeaturedBackground() {
//   const featuredEl = $('#articles-featured');
//   const wrapperEl = $('.articles-page-wrapper');
  
//   if (featuredEl.length && featuredEl.children().length > 0 && wrapperEl.length) {
//     const wrapperTop = wrapperEl.offset().top;
//     const lastChild = featuredEl.children().last();
//     const lastChildBottom = lastChild.offset().top + lastChild.outerHeight(true);
//     const totalHeight = lastChildBottom - wrapperTop;
    
//     $('#featured-articles-background').height(totalHeight);
//   }
// }

// $(document).ready(function() {
//   // Call after content loads with delays to ensure DOM is ready
//   setTimeout(updateFeaturedBackground, 100);
//   setTimeout(updateFeaturedBackground, 500);
//   setTimeout(updateFeaturedBackground, 1000);
  
//   // Update on window resize
//   $(window).on('resize', updateFeaturedBackground);
  

//   // Use MutationObserver to detect when articles-featured content changes
//   const observer = new MutationObserver(function() {
//     setTimeout(updateFeaturedBackground, 50);
//   });
//   const featuredEl = document.getElementById('articles-featured');
//   if (featuredEl) {
//     observer.observe(featuredEl, { childList: true, subtree: true });
//   }
// });







const jumpMenu = document.getElementById('jumpMenuSide');
const sentinel = document.getElementById('jumpMenuSentinel');

if (
  jumpMenu &&
  sentinel &&
  !jumpMenu.closest('.pdp-jumpmenu')
) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        jumpMenu.classList.add('is-stuck');
      } else {
        jumpMenu.classList.remove('is-stuck');
      }
    },
    {
      threshold: 0,
      rootMargin: '0px'
    }
  );

  observer.observe(sentinel);
}














});
