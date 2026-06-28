/**
 * Netflix数据分析 - 前端交互脚本
 */

// ==================== Navigation ====================

// 导航栏滚动效果
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ==================== Stats Animation ====================

// 数字滚动动画
const animateStats = () => {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  statNumbers.forEach(stat => {
    const target = parseFloat(stat.dataset.target);
    const suffix = stat.dataset.suffix || '';
    const duration = 2000; // 动画持续时间（毫秒）
    const steps = 60; // 动画步数
    const stepDuration = duration / steps;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      // 格式化数字
      if (Number.isInteger(target)) {
        stat.textContent = Math.floor(current) + suffix;
      } else {
        stat.textContent = current.toFixed(1) + suffix;
      }
    }, stepDuration);
  });
};

// 触发数字动画（当元素进入视口）
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats();
      statsObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// 观察统计数字区域
const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
  statsObserver.observe(statsSection);
}

// ==================== Scroll Animation ====================

// 元素进入视口时的动画
const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeInObserver.unobserve(entry.target);
    }
  });
}, {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
});

// 为所有需要动画的元素添加观察
document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
  fadeInObserver.observe(el);
});

// ==================== Tabs ====================

// 标签页切换
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;

    // 移除所有active类
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    // 添加active类
    btn.classList.add('active');
    document.getElementById(tabId).classList.add('active');
  });
});

// ==================== Code Copy ====================

// 复制代码功能
function copyCode(btn) {
  const codeBlock = btn.closest('.code-block');
  const code = codeBlock.querySelector('code').textContent;

  navigator.clipboard.writeText(code).then(() => {
    const originalText = btn.textContent;
    btn.textContent = '已复制!';
    btn.style.background = '#28a745';
    btn.style.borderColor = '#28a745';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.borderColor = '';
    }, 2000);
  }).catch(err => {
    console.error('复制失败:', err);
    btn.textContent = '复制失败';
    setTimeout(() => {
      btn.textContent = '复制代码';
    }, 2000);
  });
}

// ==================== Lightbox ====================

// 打开灯箱
function openLightbox(element) {
  const img = element.querySelector('img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// 关闭灯箱
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// 点击灯箱背景关闭
document.getElementById('lightbox')?.addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') {
    closeLightbox();
  }
});

// ESC键关闭灯箱
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

// ==================== Smooth Scroll ====================

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==================== Gallery Hover Effect ====================

// 图片画廊悬停效果增强
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transform = 'scale(1.02)';
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

// ==================== Active Navigation ====================

// 根据当前页面高亮导航链接
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});

// ==================== Page Load Animation ====================

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
  // 移除页面加载动画类
  document.body.classList.add('loaded');

  // 延迟添加动画效果
  setTimeout(() => {
    document.querySelectorAll('.hero-content > *').forEach((el, index) => {
      el.style.animationDelay = `${index * 0.2}s`;
    });
  }, 100);
});

// ==================== Console Branding ====================

console.log('%c Netflix数据分析 ', 'background: #E50914; color: white; font-size: 20px; padding: 10px;');
console.log('案例报告 - 小组分工完成');
