document.addEventListener('DOMContentLoaded', function () {
    // Initialize Splide slider
    new Splide('#splide-slider', {
      perPage: 4,
      gap: '1rem',
      arrows: true,
      pagination: true,
      breakpoints: {
        1024: { perPage: 3 },
        767: { perPage: 2 }
      }
    }).mount();

    // Add-to-Cart handler
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', async function () {
        const variantId = this.dataset.variantId;

        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: 1 })
        });

        if (response.ok) {
          const notice = document.querySelector('.mini-cart-notice');
          notice.classList.remove('hidden');
          setTimeout(() => notice.classList.add('hidden'), 3000);
        }
      });
    });

    // Variant change from dropdown
    document.querySelectorAll('.variant-select').forEach(select => {
      select.addEventListener('change', function () {
        const selected = this.options[this.selectedIndex];
        const slide = this.closest('.splide__slide');
        const image = selected.dataset.image;
        const price = selected.dataset.price;
        const variantId = selected.value;

        slide.querySelector('.product-image').src = image;
        const btn = slide.querySelector('.add-to-cart-btn');
        btn.setAttribute('data-variant-id', variantId);
        btn.innerHTML = `ADD - ${price}`;
      });
    });

    // Color swatch click logic
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', function () {
        const color = this.dataset.color;
        const slide = this.closest('.splide__slide');

        // Toggle selected class
        slide.querySelectorAll('.color-swatch').forEach(btn => btn.classList.remove('ring', 'ring-offset-2'));
        this.classList.add('ring', 'ring-offset-2');

        // Get selected size
        const sizeSelect = slide.querySelector('.size-select');
        const size = sizeSelect ? sizeSelect.value : null;

        // Find matching variant
        const variantSelect = slide.querySelector('.variant-select');
        let matchedVariant = null;

        for (const option of variantSelect.options) {
          const title = option.dataset.title;
          if (size && title.includes(size) && title.includes(color)) {
            matchedVariant = option;
            break;
          } else if (!size && title.includes(color)) {
            matchedVariant = option;
            break;
          }
        }

        if (matchedVariant) {
          const image = matchedVariant.dataset.image;
          const price = matchedVariant.dataset.price;
          const variantId = matchedVariant.value;

          slide.querySelector('.product-image').src = image;
          const btn = slide.querySelector('.add-to-cart-btn');
          btn.setAttribute('data-variant-id', variantId);
          btn.innerHTML = `ADD - ${price}`;
        }
      });
    });

    // Optional: Size change updates variant too
    document.querySelectorAll('.size-select').forEach(sizeSelect => {
      sizeSelect.addEventListener('change', function () {
        const slide = this.closest('.splide__slide');
        const colorBtn = slide.querySelector('.color-swatch.ring');
        const color = colorBtn ? colorBtn.dataset.color : null;
        const size = this.value;

        const variantSelect = slide.querySelector('.variant-select');
        let matchedVariant = null;

        for (const option of variantSelect.options) {
          const title = option.dataset.title;
          if (color && title.includes(color) && title.includes(size)) {
            matchedVariant = option;
            break;
          } else if (!color && title.includes(size)) {
            matchedVariant = option;
            break;
          }
        }

        if (matchedVariant) {
          const image = matchedVariant.dataset.image;
          const price = matchedVariant.dataset.price;
          const variantId = matchedVariant.value;

          slide.querySelector('.product-image').src = image;
          const btn = slide.querySelector('.add-to-cart-btn');
          btn.setAttribute('data-variant-id', variantId);
          btn.innerHTML = `ADD - ${price}`;
        }
      });
    });

  });
