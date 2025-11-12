// ========== FAQ アコーディオン機能 ==========
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const h4 = item.querySelector('h4');
        const p = item.querySelector('p');

        // 初期状態では回答を非表示にしない（常に表示）
        // クリック時のアコーディオン機能は以下で実装

        h4.addEventListener('click', function() {
            p.style.display = p.style.display === 'none' ? 'block' : 'none';
            h4.style.cursor = 'pointer';
            h4.style.userSelect = 'none';
            h4.classList.toggle('active');
        });
    });

    // ========== スムーズスクロール対応 ==========
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========== ナビゲーション ハイライト機能 ==========
    const navLinks = document.querySelectorAll('.nav a');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // ========== スクロール時のアニメーション ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // カード要素をアニメーション対象にする
    const cards = document.querySelectorAll('.problem-card, .product-card, .review-card, .solution-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // ========== モバイルメニュー（オプション） ==========
    // 必要に応じてハンバーガーメニューを実装

    // ========== 動画の遅延読み込み ==========
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.setAttribute('preload', 'none');
        video.addEventListener('play', function() {
            // 動画が再生されるまで読み込みを遅延
        });
    });

    console.log('relax heal website initialized');
});

// ========== スクロール位置を保存 ==========
window.addEventListener('beforeunload', function() {
    sessionStorage.setItem('scrollPosition', window.scrollY);
});

window.addEventListener('load', function() {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
    }
});
