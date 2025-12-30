// AURORA — minimal, elegant interactions: header, scroll progress, tabs, gallery lightbox, actions.

const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => [...root.querySelectorAll(q)];

const header = $("#header");
const progress = $("#progress");
const year = $("#year");

const navToggle = $("#navToggle");
const navLinks = $("#navLinks");

const lightbox = $("#lightbox");
const lightboxImg = $("#lightboxImg");
const lightboxClose = $("#lightboxClose");

const menuMed = $("#menuMed");
const menuDrinks = $("#menuDrinks");
const tabs = $$(".tab");

const toast = $("#toast");
const callBtn = $("#callBtn");
const mapBtn = $("#mapBtn");
const shareBtn = $("#shareBtn");
const langBtn = $("#langBtn");

year.textContent = new Date().getFullYear();

// ---- Menu data (EDIT freely) ----
// İçecekler: ALKOLSÜZ
const MENU = {
  med: [
    { name: "Burrata & Narenciye", desc: "Burrata, kan portakalı, fesleğen yağı, fındık kırığı", price: "₺420", tags: ["Soğuk"] },
    { name: "Ahtapot Izgara", desc: "Köz patlıcan kreması, limon kabuğu, kapari", price: "₺690", tags: ["İmza", "Deniz"] },
    { name: "Trüflü Mantarlı Risotto", desc: "Arborio pirinç, porcini, trüf yağı, parmesan", price: "₺640", tags: ["Vejetaryen"] },
    { name: "Levrek – Tereyağlı Sos", desc: "Rezene salatası, beurre blanc, dereotu", price: "₺780", tags: ["Deniz"] },
    { name: "Kuzu Konfi", desc: "Biberiye, kök sebze, nar ekşisi glaze", price: "₺860", tags: ["Ana"] },
    { name: "Limonlu Tart", desc: "Limon kreması, çıtır taban, vanilya", price: "₺320", tags: ["Tatlı"] },
  ],
  drinks: [
    { name: "Aurora Spritz (0.0)", desc: "Narenciye, köpüren 0.0, aromatik bitter (alkolsüz)", price: "₺290", tags: ["Mocktail"] },
    { name: "Rosemary Lemonade", desc: "Biberiye, limon, hafif tuz dokunuşu", price: "₺220", tags: ["İmza"] },
    { name: "Cold Brew Tonic", desc: "Soğuk demleme kahve, tonic, portakal kabuğu", price: "₺240", tags: ["Kafein"] },
    { name: "Hibiscus Iced Tea", desc: "Hibiskus, hafif pembe notalar, limon", price: "₺210", tags: ["Çay"] },
    { name: "Ev Yapımı Kombucha", desc: "Günün aroması (zencefil / yaban mersini / limon)", price: "₺260", tags: ["Fermente"] },
    { name: "Soda & Citrus", desc: "Maden suyu, lime, taze nane", price: "₺160", tags: ["Fresh"] },
  ],
};

// ---- Render menu ----
function badge(text) {
  return `<span class="badge">${escapeHtml(text)}</span>`;
}

function itemCard(it) {
  const tags = (it.tags || []).slice(0, 3).map(badge).join("");
  return `
    <article class="item">
      <div class="item__main">
        <h4 class="item__name">${escapeHtml(it.name)}</h4>
        <p class="item__desc">${escapeHtml(it.desc)}</p>
        <div class="item__meta">
          <span class="price">${escapeHtml(it.price)}</span>
          ${tags}
        </div>
      </div>
    </article>
  `;
}

function renderMenu() {
  if (menuMed) menuMed.innerHTML = MENU.med.map(itemCard).join("");
  if (menuDrinks) menuDrinks.innerHTML = MENU.drinks.map(itemCard).join("");
}

renderMenu();

// ---- Tabs ----
tabs.forEach((t) =>
  t.addEventListener("click", () => {
    tabs.forEach((x) => x.classList.remove("is-active"));
    t.classList.add("is-active");

    const key = t.dataset.tab;
    $("#panel-med")?.classList.toggle("is-active", key === "med");
    $("#panel-drinks")?.classList.toggle("is-active", key === "drinks");

    tabs.forEach((x) => x.setAttribute("aria-selected", x === t ? "true" : "false"));
  })
);

// ---- Gallery lightbox ----
$$(".cardImg").forEach((card) => {
  card.addEventListener("click", () => {
    const src = card.dataset.src;
    if (!src) return;
    openLightbox(src);
  });
});

function openLightbox(src) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
}

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// ---- Header scroll + progress ----
window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);

  const doc = document.documentElement;
  const denom = doc.scrollHeight - doc.clientHeight;
  const scrolled = denom > 0 ? doc.scrollTop / denom : 0;
  if (progress) progress.style.width = `${Math.max(0, Math.min(1, scrolled)) * 100}%`;
});

// ---- Mobile nav ----
navToggle?.addEventListener("click", () => {
  const open = navLinks?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

$$("a", navLinks || document.createElement("div")).forEach((a) =>
  a.addEventListener("click", () => {
    navLinks?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  })
);

// ---- Actions: call/map/share ----
callBtn?.addEventListener("click", () => {
  window.location.href = "tel:+905000000000"; // TODO: değiştir
});

mapBtn?.addEventListener("click", () => {
  const q = encodeURIComponent("Örnek Mah. Şef Sok. No:12, İstanbul"); // TODO: değiştir
  window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank", "noopener");
});

shareBtn?.addEventListener("click", async () => {
  const data = { title: document.title, text: "AURORA menü", url: window.location.href };
  try {
    if (navigator.share) await navigator.share(data);
    else {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link kopyalandı.");
    }
  } catch {
    showToast("Paylaşım iptal edildi.");
  }
});

// ---- Language button (optional) ----
langBtn?.addEventListener("click", () => {
  showToast("Dil özelliği hazır: istersen EN metinlerini de ekleriz.");
});

// ---- Toast ----
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("is-show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("is-show"), 2200);
}

// ---- Helpers ----
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
