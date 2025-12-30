// js/script.js
// Relax Heal brand top page interactions

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Hero carousel (infinite loop + center-aligned)
  // =========================
  const carousel = document.querySelector(".hero-carousel");
  const track = carousel?.querySelector(".carousel-track");
  const windowEl = carousel?.querySelector(".carousel-window");
  const nextBtn = carousel?.querySelector(".carousel-btn.next");
  const dotsContainer = carousel?.querySelector(".carousel-dots");

  if (carousel && track && windowEl && nextBtn && dotsContainer) {
    let slides = Array.from(track.children);
    const slideCount = slides.length;

    // create dots
    dotsContainer.innerHTML = "";
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `${index + 1}枚目へ`);
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    // デバイス判定関数
    const isMobileDevice = () => window.innerWidth < 1024;

    // PC用に複数クローンを生成、スマホは1つのみ
    const leftClonesToCreate = isMobileDevice() ? 1 : 4;
    const rightClonesToCreate = isMobileDevice() ? 1 : 4;

    // 左側にクローンを追加（逆順で4,3,2,1）
    for (let i = slideCount - 1; i >= Math.max(0, slideCount - leftClonesToCreate); i--) {
      const clone = slides[i].cloneNode(true);
      clone.classList.add("is-clone");
      track.insertBefore(clone, track.firstChild);
    }

    // 右側にクローンを追加（順順で1,2,3,4）
    for (let i = 0; i < rightClonesToCreate; i++) {
      const clone = slides[i].cloneNode(true);
      clone.classList.add("is-clone");
      track.appendChild(clone);
    }

    slides = Array.from(track.children);

    let currentIndex = leftClonesToCreate; // PC: 4, モバイル: 1
    let isAnimating = false;
    let autoPlayInterval = null;

    const updateCarousel = () => {
      const activeSlide = slides[currentIndex];
      if (!activeSlide || !windowEl) return;

      const slideWidth = activeSlide.offsetWidth;
      const slideLeft = activeSlide.offsetLeft;
      const windowWidth = windowEl.offsetWidth;

      // スライド中央 - ウィンドウ中央 の差分を求める
      const offset = slideLeft + slideWidth / 2 - windowWidth / 2;
      track.style.transform = `translateX(${-offset}px)`;

      // is-center クラスの付け替え
      slides.forEach((slide, index) => {
        slide.classList.toggle("is-center", index === currentIndex);
      });

      // ドットの更新（クローンを除外）
      const realIndex = ((currentIndex - leftClonesToCreate + slideCount) % slideCount);
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === realIndex);
      });
    };

    const goToIndex = (index) => {
      if (isAnimating) return;
      isAnimating = true;
      currentIndex = index;
      track.style.transition = "transform 0.6s ease";
      updateCarousel();
    };

    // 自動再生機能
    const startAutoPlay = () => {
      if (autoPlayInterval) return;
      autoPlayInterval = setInterval(() => {
        goToIndex(currentIndex + 1);
      }, 2000);
    };

    const stopAutoPlay = () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    };

    const restartAutoPlay = () => {
      stopAutoPlay();
      setTimeout(() => {
        startAutoPlay();
      }, 5000);
    };

    // 初期表示
    track.style.display = "flex";
    updateCarousel();
    startAutoPlay();

    // ボタンイベント
    nextBtn.addEventListener("click", () => {
      restartAutoPlay();
      goToIndex(currentIndex + 1);
    });

    // transitionend で無限ループを実現
    track.addEventListener("transitionend", () => {
      const currentSlide = slides[currentIndex];
      if (currentSlide && currentSlide.classList.contains("is-clone")) {
        if (isMobileDevice()) {
          // スマホ：遅延ジャンプで「パチッ」緩和
          setTimeout(() => {
            track.style.transition = "none";
            // 右端到達時
            if (currentIndex >= slides.length - rightClonesToCreate) {
              currentIndex = leftClonesToCreate;
            }
            // 左端到達時
            else if (currentIndex < leftClonesToCreate) {
              currentIndex = slides.length - rightClonesToCreate - 1;
            }
            updateCarousel();
            setTimeout(() => {
              track.style.transition = "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
              isAnimating = false;
            }, 60);
          }, 200);
        } else {
          // PC：即座にジャンプ（次スライドとの連続感で目立たない）
          track.style.transition = "none";
          // 右端到達時
          if (currentIndex >= slides.length - rightClonesToCreate) {
            currentIndex = leftClonesToCreate;
          }
          // 左端到達時
          else if (currentIndex < leftClonesToCreate) {
            currentIndex = slides.length - rightClonesToCreate - 1;
          }
          updateCarousel();
          setTimeout(() => {
            track.style.transition = "transform 0.6s ease";
            isAnimating = false;
          }, 50);
        }
      } else {
        // 通常スライド → 即座にフラグ解除
        isAnimating = false;
      }
    });

    // ドットクリック
    dots.forEach((dot, dotIndex) => {
      dot.addEventListener("click", () => {
        restartAutoPlay();
        goToIndex(dotIndex + leftClonesToCreate); // クローン分オフセット
      });
    });

    // リサイズ対応
    window.addEventListener("resize", () => {
      updateCarousel();
    });

    // ページ離脱時のクリーンアップ
    window.addEventListener("beforeunload", () => {
      stopAutoPlay();
    });
  }

  // =========================
  // Category panel accordion
  // =========================
  const categoryButtons = document.querySelectorAll(
    ".category-panel .category-item > button, .category-panel-mobile .category-item > button"
  );

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.parentElement;

      // is-lockedクラスがある場合はクリック無視（PC用）
      if (item.classList.contains("is-locked") && window.innerWidth >= 1024) {
        return;
      }

      const isExpanded = button.getAttribute("aria-expanded") === "true";
      const content = button.nextElementSibling;

      button.setAttribute("aria-expanded", (!isExpanded).toString());
      item.classList.toggle("is-open", !isExpanded);

      if (content && content.tagName === "UL") {
        content.style.maxHeight = !isExpanded
          ? content.scrollHeight + "px"
          : "0px";
      }
    });
  });

  // open default category if marked
  const defaultOpenItems = document.querySelectorAll(".category-item.is-open");
  defaultOpenItems.forEach((defaultOpenItem) => {
    const defaultButton = defaultOpenItem.querySelector("button");
    const defaultContent = defaultOpenItem.querySelector("ul");
    defaultButton?.setAttribute("aria-expanded", "true");
    if (defaultContent) {
      defaultContent.style.maxHeight = defaultContent.scrollHeight + "px";
    }
  });

  // =========================
  // Hamburger menu toggle
  // =========================
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const globalNav = document.querySelector(".global-nav");
  const mobileDropdowns = document.querySelectorAll(".global-nav .has-dropdown");

  if (hamburgerBtn && globalNav) {
    hamburgerBtn.addEventListener("click", () => {
      const isOpen = hamburgerBtn.classList.toggle("is-open");
      globalNav.classList.toggle("is-open");
      hamburgerBtn.setAttribute("aria-expanded", isOpen.toString());
    });

    // モバイルメニュー内のドロップダウントグル
    mobileDropdowns.forEach((dropdown) => {
      const link = dropdown.querySelector("a");
      if (link && window.innerWidth <= 768) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          dropdown.classList.toggle("is-open");
        });
      }
    });

    // メニュー外をクリックしたら閉じる
    document.addEventListener("click", (e) => {
      if (!globalNav.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        hamburgerBtn.classList.remove("is-open");
        globalNav.classList.remove("is-open");
        hamburgerBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

});
