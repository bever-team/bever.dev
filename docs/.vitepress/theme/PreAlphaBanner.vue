<template>
  <div class="bever-banner" role="note">
    <span class="bever-banner-long">Bever is pre-alpha. The language, APIs, and packages will change in breaking ways between releases.</span>
    <span class="bever-banner-short">Bever is pre-alpha. Expect breaking changes.</span>
    <a href="/guide/what-is-bever#status">Read more</a>
  </div>
</template>

<style scoped>
.bever-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--vp-z-index-layout-top);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-sizing: border-box;
  height: var(--vp-layout-top-height);
  padding: 0 16px;
  background: #0f1e24;
  color: #ffffff;
  font-size: 13px;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
}

/* The dark page background is Ink too, so the banner gets the raised surface and a divider. */
:global(.dark .bever-banner) {
  background: #132730;
  border-bottom: 1px solid rgba(124, 195, 205, 0.2);
}

.bever-banner a {
  color: #7cc3cd;
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.bever-banner-short {
  display: none;
}

@media (max-width: 767px) {
  .bever-banner-long {
    display: none;
  }

  .bever-banner-short {
    display: inline;
  }
}
</style>
