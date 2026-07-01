(function () {
  "use strict";

  const isCategoryPage = window.location.pathname.includes("/categories/");
  const basePath = isCategoryPage ? ".." : ".";

  function getInitials(name) {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }

  function getCategory(slug) {
    return CATEGORIES.find((c) => c.slug === slug);
  }

  function getProduct(id) {
    return PRODUCTS.find((p) => p.id === id);
  }

  function renderLogo() {
    return `<img src="${basePath}/images/logo.png" alt="Gifting Catalogue" class="logo-img" width="150" height="50">`;
  }

  /* ── Header / Footer injection ── */

  function renderHeader() {
    const header = document.querySelector("[data-site-header]");
    if (!header) return;

    const currentPage = document.body.dataset.page || "";
    const categorySlug = document.body.dataset.category || "";

    const categoryLinks = CATEGORIES.map(
      (cat) =>
        `<a href="${basePath}/categories/${cat.slug}.html">
          ${renderCategoryIcon(cat.slug, "cat-icon")}${cat.name}
        </a>`
    ).join("");

    const drawerCategoryLinks = CATEGORIES.map(
      (cat) =>
        `<a href="${basePath}/categories/${cat.slug}.html">
          ${renderCategoryIcon(cat.slug)}${cat.name}
        </a>`
    ).join("");

    header.innerHTML = `
      <div class="container header-inner">
        <a href="${basePath}/index.html" class="logo">${renderLogo()}</a>

        <nav aria-label="Main navigation">
          <ul class="nav-desktop">
            <li><a href="${basePath}/index.html" class="${currentPage === "home" ? "active" : ""}">Home</a></li>
            <li class="nav-dropdown">
              <button class="nav-dropdown-toggle" aria-expanded="false" aria-haspopup="true">
                Categories <span class="chevron">▼</span>
              </button>
              <div class="nav-dropdown-menu" role="menu">${categoryLinks}</div>
            </li>
            <li><a href="${basePath}/about.html" class="${currentPage === "about" ? "active" : ""}">About</a></li>
            <li><a href="${basePath}/contact.html" class="${currentPage === "contact" ? "active" : ""}">Contact</a></li>
          </ul>
        </nav>

        <div class="header-actions">
          <a href="${basePath}/contact.html" class="btn btn-primary nav-cta">Request Quote</a>
          <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">
            <span class="nav-toggle-icon">
              <span></span><span></span><span></span>
            </span>
          </button>
        </div>
      </div>

      <div class="nav-overlay" aria-hidden="true"></div>
      <nav class="nav-drawer" aria-label="Mobile navigation" aria-hidden="true">
        <div class="nav-drawer-header">
          <a href="${basePath}/index.html" class="logo">${renderLogo()}</a>
          <button class="nav-drawer-close" aria-label="Close menu">&times;</button>
        </div>
        <div class="nav-drawer-links">
          <a href="${basePath}/index.html" class="${currentPage === "home" ? "active" : ""}">Home</a>
          <a href="${basePath}/about.html" class="${currentPage === "about" ? "active" : ""}">About</a>
          <a href="${basePath}/contact.html" class="${currentPage === "contact" ? "active" : ""}">Contact</a>
        </div>
        <div class="nav-drawer-categories">
          <h4>Categories</h4>
          ${drawerCategoryLinks}
        </div>
        <div class="nav-drawer-cta">
          <a href="${basePath}/contact.html" class="btn btn-primary">Request a Quote</a>
        </div>
      </nav>
    `;

    initNavigation();
    initHeaderScroll();
  }

  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    function updateScroll() {
      header.classList.toggle("scrolled", window.scrollY > 8);
    }

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
  }

  function initScrollReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal:not([data-reveal-observed])").forEach((el) => {
      el.setAttribute("data-reveal-observed", "");
      observer.observe(el);
    });
  }

  function renderFooter() {
    const footer = document.querySelector("[data-site-footer]");
    if (!footer) return;

    const categoryLinks = CATEGORIES.map(
      (cat) => `<a href="${basePath}/categories/${cat.slug}.html">${cat.name}</a>`
    ).join("");

    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="${basePath}/index.html" class="logo">${renderLogo()}</a>
            <p>Premium corporate gifting solutions for businesses of all sizes. Custom branding, bulk orders, and nationwide delivery.</p>
          </div>
          <div class="footer-col">
            <h4>Categories</h4>
            ${categoryLinks}
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <a href="${basePath}/about.html">About Us</a>
            <a href="${basePath}/contact.html">Contact</a>
            <a href="${basePath}/contact.html">Request a Quote</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} Gifting Catalogue. All rights reserved.</p>
          <div class="footer-social">
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Instagram">ig</a>
            <a href="#" aria-label="Twitter">X</a>
          </div>
        </div>
      </div>
    `;
  }

  /* ── Navigation ── */

  function initNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const drawer = document.querySelector(".nav-drawer");
    const overlay = document.querySelector(".nav-overlay");
    const closeBtn = document.querySelector(".nav-drawer-close");
    const dropdown = document.querySelector(".nav-dropdown");
    const dropdownToggle = document.querySelector(".nav-dropdown-toggle");

    function openDrawer() {
      drawer.classList.add("open");
      overlay.classList.add("open");
      toggle.classList.add("active");
      toggle.setAttribute("aria-expanded", "true");
      drawer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
      drawer.classList.remove("open");
      overlay.classList.remove("open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    if (toggle) toggle.addEventListener("click", openDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (overlay) overlay.addEventListener("click", closeDrawer);

    if (dropdown && dropdownToggle) {
      dropdownToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle("open");
        dropdownToggle.setAttribute("aria-expanded", String(isOpen));
      });

      document.addEventListener("click", () => {
        dropdown.classList.remove("open");
        dropdownToggle.setAttribute("aria-expanded", "false");
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDrawer();
        closeModal();
        if (dropdown) {
          dropdown.classList.remove("open");
          if (dropdownToggle) dropdownToggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  /* ── Product Card ── */

  function renderProductImage(product, context) {
    if (product.image) {
      const imgPath = `${basePath}/${product.image}`;
      const alt = product.name;
      if (context === "modal") {
        return `<div class="modal-image"><img src="${imgPath}" alt="${alt}"></div>`;
      }
      return `<div class="product-card-image"><img src="${imgPath}" alt="${alt}" loading="lazy"><span class="product-card-hint">View details</span></div>`;
    }

    const initials = getInitials(product.name);
    if (context === "modal") {
      return `<div class="modal-image product-image-placeholder" style="background: linear-gradient(135deg, ${product.color}, ${product.color}99)">${initials}</div>`;
    }
    return `<div class="product-card-image product-image-placeholder" style="background: linear-gradient(135deg, ${product.color}, ${product.color}99)">${initials}<span class="product-card-hint">View details</span></div>`;
  }

  function renderProductCard(product) {
    return `
      <article class="product-card" data-product-id="${product.id}" tabindex="0" role="button" aria-label="View ${product.name}">
        ${renderProductImage(product)}
        <div class="product-card-body">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-card-meta">
            <span class="product-tag">MOQ: ${product.moq}</span>
            <span class="product-tag">${product.sku}</span>
          </div>
          <div class="product-card-footer">
            <button class="btn btn-primary btn-sm" data-quote-id="${product.id}">Request Quote</button>
          </div>
        </div>
      </article>
    `.trim();
  }

  function bindProductCards(container) {
    if (!container) return;

    container.addEventListener("click", (e) => {
      const quoteBtn = e.target.closest("[data-quote-id]");
      if (quoteBtn) {
        e.stopPropagation();
        const product = getProduct(quoteBtn.dataset.quoteId);
        if (product) {
          window.location.href = `${basePath}/contact.html?product=${encodeURIComponent(product.name)}`;
        }
        return;
      }

      const card = e.target.closest(".product-card");
      if (card) {
        openModal(card.dataset.productId);
      }
    });

    container.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const card = e.target.closest(".product-card");
        if (card) {
          e.preventDefault();
          openModal(card.dataset.productId);
        }
      }
    });
  }

  /* ── Modal ── */

  let modalEl = null;

  function ensureModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement("div");
    modalEl.className = "modal-overlay";
    modalEl.setAttribute("role", "dialog");
    modalEl.setAttribute("aria-modal", "true");
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.innerHTML = `<div class="modal" role="document"></div>`;
    document.body.appendChild(modalEl);

    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) closeModal();
    });

    return modalEl;
  }

  function openModal(productId) {
    const product = getProduct(productId);
    if (!product) return;

    const overlay = ensureModal();
    const modal = overlay.querySelector(".modal");
    const category = getCategory(product.category);

    modal.innerHTML = `
      <div class="modal-header-wrap">
        ${renderProductImage(product, "modal")}
        <button class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body">
        <h2>${product.name}</h2>
        <div class="modal-meta">
          <span class="product-tag">${category ? category.name : product.category}</span>
          <span class="product-tag">SKU: ${product.sku}</span>
          <span class="product-tag">MOQ: ${product.moq}</span>
        </div>
        <p>${product.description}</p>
        <div class="modal-section">
          <h4>Specifications</h4>
          <ul>${product.specs.map((s) => `<li>${s}</li>`).join("")}</ul>
        </div>
        <div class="modal-section">
          <h4>Customization Options</h4>
          <ul>${product.customization.map((c) => `<li>${c}</li>`).join("")}</ul>
        </div>
        <div class="modal-actions">
          <a href="${basePath}/contact.html?product=${encodeURIComponent(product.name)}" class="btn btn-primary">Request Quote</a>
          <button class="btn btn-outline modal-close-btn">Close</button>
        </div>
      </div>
    `;

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    modal.querySelector(".modal-close").addEventListener("click", closeModal);
    modal.querySelector(".modal-close-btn").addEventListener("click", closeModal);
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove("open");
    modalEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function renderCategoryCardImage(slug, name) {
    const imgPath = `${basePath}/images/categories/${slug}.jpg`;
    return `
      <div class="category-card-image">
        <img src="${imgPath}" alt="${name} corporate gifts" loading="lazy" width="720" height="480">
      </div>
    `;
  }

  /* ── Home Page ── */

  function initHome() {
    const categoryGrid = document.querySelector("[data-category-grid]");
    if (categoryGrid) {
      categoryGrid.innerHTML = CATEGORIES.map((cat) => {
        const count = PRODUCTS.filter((p) => p.category === cat.slug).length;
        return `
          <a href="${basePath}/categories/${cat.slug}.html" class="category-card reveal">
            ${renderCategoryCardImage(cat.slug, cat.name)}
            <div class="category-card-body">
              <span class="category-card-count">${count} product${count !== 1 ? "s" : ""}</span>
              <h3>${cat.name}</h3>
              <p>${cat.description}</p>
              <span class="category-card-link">Browse products →</span>
            </div>
          </a>
        `;
      }).join("");
      initScrollReveal();
    }

    const featuredGrid = document.querySelector("[data-featured-products]");
    if (featuredGrid) {
      const featured = PRODUCTS.filter((p) => p.featured);
      featuredGrid.innerHTML = featured.map(renderProductCard).join("");
      bindProductCards(featuredGrid);
    }
  }

  /* ── Category Page ── */

  function initCategoryPage() {
    const slug = document.body.dataset.category;
    if (!slug) return;

    const category = getCategory(slug);
    if (!category) return;

    const titleEl = document.querySelector("[data-category-title]");
    const descEl = document.querySelector("[data-category-desc]");
    const breadcrumbEl = document.querySelector("[data-breadcrumb-category]");
    const headerEl = document.querySelector(".category-header");

    if (titleEl) titleEl.textContent = category.name;
    if (descEl) descEl.textContent = category.description;
    if (breadcrumbEl) breadcrumbEl.textContent = category.name;

    if (headerEl && titleEl && descEl) {
      const titleText = titleEl.textContent;
      const descText = descEl.textContent;
      headerEl.innerHTML = `
        <div class="category-header-icon">${renderCategoryIcon(slug)}</div>
        <div class="category-header-text">
          <h1 data-category-title>${titleText}</h1>
          <p data-category-desc>${descText}</p>
        </div>
      `;
    }

    document.title = `${category.name} — Gifting Catalogue`;

    const sidebarNav = document.querySelector("[data-sidebar-nav]");
    const chipsContainer = document.querySelector("[data-category-chips]");
    const navLinks = CATEGORIES.map(
      (cat) =>
        `<a href="${cat.slug}.html" class="${cat.slug === slug ? "active" : ""}">
          ${renderCategoryIcon(cat.slug)}${cat.name}
        </a>`
    ).join("");

    if (sidebarNav) sidebarNav.innerHTML = navLinks;

    const chipLinks = CATEGORIES.map(
      (cat) =>
        `<a href="${cat.slug}.html" class="category-chip ${cat.slug === slug ? "active" : ""}">
          ${renderCategoryIcon(cat.slug)} ${cat.name}
        </a>`
    ).join("");
    if (chipsContainer) chipsContainer.innerHTML = chipLinks;

    const grid = document.querySelector("[data-product-grid]");
    const searchInput = document.querySelector("[data-product-search]");
    const countEl = document.querySelector("[data-product-count]");

    let categoryProducts = PRODUCTS.filter((p) => p.category === slug);

    function renderGrid(products) {
      if (!grid) return;

      if (products.length === 0) {
        grid.innerHTML = `<div class="no-results"><p>No products match your search. Try a different term.</p></div>`;
        if (countEl) countEl.textContent = "0 products";
        return;
      }

      grid.innerHTML = products.map(renderProductCard).join("");
      bindProductCards(grid);
      if (countEl) {
        countEl.textContent = `${products.length} product${products.length !== 1 ? "s" : ""}`;
      }
    }

    renderGrid(categoryProducts);

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();
        const filtered = categoryProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.sku.toLowerCase().includes(query)
        );
        renderGrid(filtered);
      });
    }
  }

  /* ── Contact Page ── */

  function initContactPage() {
    const form = document.querySelector("[data-contact-form]");
    const successEl = document.querySelector("[data-form-success]");
    const productSelect = document.querySelector("#product-interest");

    if (productSelect) {
      CATEGORIES.forEach((cat) => {
        const products = PRODUCTS.filter((p) => p.category === cat.slug);
        if (products.length === 0) return;
        const optgroup = document.createElement("optgroup");
        optgroup.label = cat.name;
        products.forEach((p) => {
          const option = document.createElement("option");
          option.value = p.name;
          option.textContent = p.name;
          optgroup.appendChild(option);
        });
        productSelect.appendChild(optgroup);
      });
    }

    const params = new URLSearchParams(window.location.search);
    const prefillProduct = params.get("product");
    if (prefillProduct && productSelect) {
      productSelect.value = prefillProduct;
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        form.classList.add("hidden");
        if (successEl) successEl.classList.add("visible");
      });
    }
  }

  /* ── Init ── */

  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    initScrollReveal();

    const page = document.body.dataset.page;
    if (page === "home") initHome();
    if (page === "category") initCategoryPage();
    if (page === "contact") initContactPage();
  });
})();
