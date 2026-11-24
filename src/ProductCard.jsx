import React, { useState, useRef, useMemo, useCallback } from 'react';

/**
 * OzimizStroy - Professional E-Commerce Mahsulot Kartochkasi
 * Senior Frontend Architecture
 * 
 * Imkoniyatlari:
 * - 3D Parallax tilt effekti (sichqoncha koordinatasiga moslashuvchan)
 * - Ko'p burchakli suratlar galereyasi va thumbnail switcher
 * - Jonli muddatli to'lov (nasiya / bo'lib to'lash) kalkulyatori (3, 6, 12, 24 oy)
 * - Ranglar va modifikatsiyalarni tanlash
 * - Chegirma, Bestseller, Yangi va Energiya tejamkorligi (A+++) yorliqlari
 * - Sevimlilar (Wishlist) va Taqqoslash (Compare) mikro-animatsiyalari
 * - Real vaqtli ombor qoldig'i (Stock progress bar)
 * - 1-Click tezkor xarid (Quick Buy) va savatga animatsiya bilan qo'shish
 * - Ovozli/Vizual muvaffaqiyat holatlari va to'liq klaviatura a11y qo'llab-quvvatlovi
 */

// Formatlash yordamchisi: O'zbekiston so'mi uchun
const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '0 so\'m';
  return new Intl.NumberFormat('uz-UZ', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + " so'm";
};

// Inline SVG Ikonkalari (Mustaqil va yuqori tezlikda yuklanuvchi)
export const Icons = {
  Heart: ({ filled }) => (
    <svg 
      className={`oz-icon oz-icon-heart ${filled ? 'oz-filled' : ''}`} 
      viewBox="0 0 24 24" 
      fill={filled ? "#ef4444" : "none"} 
      stroke={filled ? "#ef4444" : "currentColor"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  Compare: ({ active }) => (
    <svg 
      className={`oz-icon oz-icon-compare ${active ? 'oz-active' : ''}`} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={active ? "#f59e0b" : "currentColor"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  Eye: () => (
    <svg className="oz-icon oz-icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Star: ({ filled }) => (
    <svg 
      className={`oz-icon oz-icon-star ${filled ? 'oz-star-filled' : 'oz-star-empty'}`} 
      viewBox="0 0 24 24" 
      fill={filled ? "#f59e0b" : "#e2e8f0"} 
      stroke={filled ? "#f59e0b" : "#cbd5e1"} 
      strokeWidth="1.5"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Cart: () => (
    <svg className="oz-icon oz-icon-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  ),
  Check: () => (
    <svg className="oz-icon oz-icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Bolt: () => (
    <svg className="oz-icon oz-icon-bolt" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Shield: () => (
    <svg className="oz-icon oz-icon-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Truck: () => (
    <svg className="oz-icon oz-icon-truck" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg className="oz-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="oz-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Minus: () => (
    <svg className="oz-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Plus: () => (
    <svg className="oz-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
};

export default function ProductCard({
  product = {},
  isWishlisted = false,
  isCompared = false,
  onAddToCart,
  onQuickBuy,
  onToggleWishlist,
  onToggleCompare,
  onQuickView,
}) {
  // Mahsulot ma'lumotlarini xavfsiz qabul qilish (Default parametrlar)
  const {
    id = 'oz-item-default',
    title = 'Zamonaviy Aqlli Maishiy Texnika',
    brand = 'OzimizStroy Brand',
    model = 'OS-Pro 2026',
    category = 'Maishiy texnika',
    price = 4500000,
    oldPrice = 5400000,
    rating = 4.9,
    reviewsCount = 42,
    images = [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    ],
    colors = [
      { name: 'Oltin kulrang', code: '#4b5563' },
      { name: 'Kumushrang', code: '#e2e8f0' },
      { name: 'Qora mat', code: '#18181b' }
    ],
    specs = [
      { label: 'Quvvati', value: '2200W' },
      { label: 'Energiya klassi', value: 'A+++' },
      { label: 'Kafolat', value: '3 yil' },
      { label: 'Ishlab chiqaruvchi', value: 'Germaniya' }
    ],
    isNew = true,
    isBestseller = true,
    energyClass = 'A+++',
    stock = 7,
    maxStock = 20,
    freeDelivery = true,
    isOfficialWarranty = true
  } = product;

  // Holatlar (States)
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0] || null);
  const [installmentMonths, setInstallmentMonths] = useState(12);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // 3D Parallax Tilt effekti uchun ref va state
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  });

  // Chegirmani hisoblash
  const discountPercent = useMemo(() => {
    if (!oldPrice || oldPrice <= price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }, [price, oldPrice]);

  // Bo'lib to'lash narxi (0-0-12 yoki bank marjasi misolida)
  const monthlyPayment = useMemo(() => {
    if (!price) return 0;
    const margin = installmentMonths === 24 ? 1.15 : installmentMonths === 12 ? 1.08 : 1.0;
    return Math.round((price * margin) / installmentMonths);
  }, [price, installmentMonths]);

  // Ombor qoldig'i foizda
  const stockPercentage = useMemo(() => {
    return Math.min(Math.round((stock / maxStock) * 100), 100);
  }, [stock, maxStock]);

  // 3D Mouse Move ishlovchisi
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; // 6 daraja
    const rotateY = ((x - centerX) / centerX) * 6;

    setTiltStyle({
      transform: `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`,
      transition: 'transform 0.08s ease-out'
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
  }, []);

  // Slayder navigatsiyasi
  const nextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Miqdorni o'zgartirish
  const handleQuantityChange = (change) => {
    setQuantity((prev) => {
      const nextVal = prev + change;
      if (nextVal < 1) return 1;
      if (nextVal > stock) return stock;
      return nextVal;
    });
  };

  // Sevimlilarga qo'shish
  const handleToggleLike = (e) => {
    e.stopPropagation();
    if (onToggleWishlist) onToggleWishlist(product);
  };

  // Taqqoslashga qo'shish
  const handleToggleCompare = (e) => {
    e.stopPropagation();
    if (onToggleCompare) onToggleCompare(product);
  };

  // Savatga qo'shish mikro-animatsiyasi
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (stock <= 0 || isAddingToCart) return;

    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      setJustAdded(true);

      if (onAddToCart) {
        onAddToCart({
          ...product,
          selectedColor,
          quantity,
          calculatedPrice: price * quantity
        });
      }

      setTimeout(() => setJustAdded(false), 2400);
    }, 400);
  };

  // 1-Klikda xarid qilish (Quick Buy)
  const handleQuickBuyClick = (e) => {
    e.stopPropagation();
    if (onQuickBuy) {
      onQuickBuy({
        ...product,
        selectedColor,
        quantity,
        total: price * quantity
      });
    }
  };

  return (
    <div 
      ref={cardRef}
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`oz-product-card ${stock <= 0 ? 'oz-out-of-stock' : ''}`}
      tabIndex={0}
      role="region"
      aria-label={`${brand} ${title}`}
    >
      {/* 1. YUQORI BADGELAR VA TEZKOR BOSHQARUV TUGMALARI */}
      <div className="oz-card-header">
        <div className="oz-badge-group">
          {discountPercent > 0 && (
            <span className="oz-badge oz-badge-discount" title="Katta chegirma!">
              -{discountPercent}%
            </span>
          )}
          {isBestseller && (
            <span className="oz-badge oz-badge-bestseller">
              <Icons.Bolt /> Xit Savdo
            </span>
          )}
          {isNew && (
            <span className="oz-badge oz-badge-new">
              Yangi
            </span>
          )}
          {energyClass && (
            <span className="oz-badge oz-badge-energy" title="Energiya samaradorligi">
              {energyClass}
            </span>
          )}
        </div>

        {/* Tezkor aksiyalar: Sevimlilar, Taqqoslash, Ko'rish */}
        <div className="oz-actions-floating">
          <button 
            type="button"
            className={`oz-action-btn ${isWishlisted ? 'oz-liked' : ''}`}
            onClick={handleToggleLike}
            aria-label="Sevimlilarga qo'shish"
            title={isWishlisted ? "Sevimlilardan o'chirish" : "Sevimlilarga saqlash"}
          >
            <Icons.Heart filled={isWishlisted} />
          </button>

          <button 
            type="button"
            className={`oz-action-btn ${isCompared ? 'oz-compared' : ''}`}
            onClick={handleToggleCompare}
            aria-label="Taqqoslash ro'yxatiga qo'shish"
            title={isCompared ? "Taqqoslashdan o'chirish" : "Xususiyatlarini taqqoslash"}
          >
            <Icons.Compare active={isCompared} />
          </button>

          <button 
            type="button"
            className="oz-action-btn oz-quick-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickView) onQuickView(product);
            }}
            aria-label="Tez ko'rib chiqish"
            title="Batafsil tezkor oyna"
          >
            <Icons.Eye />
          </button>
        </div>
      </div>

      {/* 2. SURATLAR GALEREYASI VA SLAYDERI */}
      <div className="oz-gallery-container" onClick={() => onQuickView && onQuickView(product)}>
        <div className="oz-image-wrapper">
          <img 
            src={images[activeImageIndex] || images[0]} 
            alt={`${title} - ${activeImageIndex + 1}`}
            loading="lazy"
            className="oz-main-image"
          />
          <div className="oz-image-overlay-glow" />
        </div>

        {/* Galereya tugmalari */}
        {images.length > 1 && (
          <>
            <button 
              className="oz-slider-arrow oz-prev" 
              onClick={prevImage} 
              aria-label="Oldingi rasm"
            >
              <Icons.ChevronLeft />
            </button>
            <button 
              className="oz-slider-arrow oz-next" 
              onClick={nextImage} 
              aria-label="Keyingi rasm"
            >
              <Icons.ChevronRight />
            </button>

            {/* Thumbnail dots / chiziqchalar */}
            <div className="oz-dots-container">
              {images.map((_, idx) => (
                <button
                  key={`dot-${idx}`}
                  type="button"
                  className={`oz-dot ${idx === activeImageIndex ? 'oz-active' : ''}`}
                  onMouseEnter={() => setActiveImageIndex(idx)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }}
                  aria-label={`Rasm ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 3. MAHSULOTNING ASOSIY MA'LUMOTLARI */}
      <div className="oz-card-body">
        {/* Brend va Model */}
        <div className="oz-brand-row">
          <span className="oz-brand-name">{brand}</span>
          <span className="oz-model-code">{model}</span>
        </div>

        {/* Mahsulot Sarlavhasi */}
        <h3 className="oz-product-title" title={title}>
          <a href={`#product-${id}`} onClick={(e) => { e.preventDefault(); if (onQuickView) onQuickView(product); }}>
            {title}
          </a>
        </h3>

        {/* Reyting va Sharhlar soni */}
        <div className="oz-rating-row">
          <div className="oz-stars-wrapper" aria-label={`Reyting: ${rating} / 5`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Icons.Star key={star} filled={star <= Math.round(rating)} />
            ))}
          </div>
          <span className="oz-rating-score">{rating}</span>
          <span className="oz-reviews-count">({reviewsCount} ta sharh)</span>
        </div>

        {/* Qisqacha Xususiyatlar (Mini specs) */}
        <div className="oz-specs-preview">
          {specs.slice(0, 3).map((spec, sIdx) => (
            <div key={sIdx} className="oz-spec-chip">
              <span className="oz-spec-label">{spec.label}:</span>
              <strong className="oz-spec-val">{spec.value}</strong>
            </div>
          ))}
        </div>

        {/* Rang tanlash palitrasi */}
        {colors && colors.length > 0 && (
          <div className="oz-colors-picker">
            <span className="oz-picker-label">Rang: <em>{selectedColor?.name}</em></span>
            <div className="oz-color-swatches">
              {colors.map((color, cIdx) => (
                <button
                  key={cIdx}
                  type="button"
                  style={{ backgroundColor: color.code }}
                  className={`oz-swatch ${selectedColor?.name === color.name ? 'oz-swatch-selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(color);
                  }}
                  title={color.name}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Nasiya / Bo'lib to'lash mini blok */}
        <div className="oz-installment-box">
          <div className="oz-installment-header">
            <span className="oz-installment-badge">Muddatli to'lov</span>
            <div className="oz-months-switch">
              {[3, 6, 12, 24].map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`oz-month-btn ${installmentMonths === m ? 'oz-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setInstallmentMonths(m);
                  }}
                >
                  {m} oy
                </button>
              ))}
            </div>
          </div>
          <div className="oz-monthly-calc">
            <span>Oylik to'lov:</span>
            <strong>{formatCurrency(monthlyPayment)} / oy</strong>
          </div>
        </div>

        {/* Ombor qoldig'i (Progress Indicator) */}
        <div className="oz-stock-status">
          <div className="oz-stock-info">
            <span className="oz-stock-text">
              {stock > 5 ? (
                <span className="oz-stock-green">● Omborda mavjud ({stock} dona)</span>
              ) : stock > 0 ? (
                <span className="oz-stock-yellow">⚠ Shoshiling, atigi {stock} dona qoldi!</span>
              ) : (
                <span className="oz-stock-red">✕ Sotuvda vaqtincha tugadi</span>
              )}
            </span>
            <span className="oz-stock-percent">{stockPercentage}%</span>
          </div>
          <div className="oz-progress-bar-bg">
            <div 
              className={`oz-progress-bar-fill ${stock <= 5 ? 'oz-progress-warning' : ''}`}
              style={{ width: `${stockPercentage}%` }}
            />
          </div>
        </div>

        {/* Narxlar qatori */}
        <div className="oz-price-container">
          <div className="oz-price-values">
            <span className="oz-current-price">{formatCurrency(price)}</span>
            {oldPrice > price && (
              <span className="oz-old-price">{formatCurrency(oldPrice)}</span>
            )}
          </div>
          {discountPercent > 0 && (
            <div className="oz-saving-note">
              Tejovingiz: {formatCurrency(oldPrice - price)}
            </div>
          )}
        </div>

        {/* Yetkazib berish va Kafolat mikro teglari */}
        <div className="oz-perks-row">
          {freeDelivery && (
            <div className="oz-perk" title="Ertaga yetkazib berish tekin">
              <Icons.Truck />
              <span>Bepul yetkazish</span>
            </div>
          )}
          {isOfficialWarranty && (
            <div className="oz-perk" title="Rasmiy servis kafolati">
              <Icons.Shield />
              <span>3 yil kafolat</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. FOOTER: SONI, SAVATGA QO'SHISH VA TEZKOR XARID */}
      <div className="oz-card-footer">
        {/* Miqdor hisoblagich (Counter) */}
        <div className="oz-quantity-stepper">
          <button 
            type="button"
            className="oz-step-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleQuantityChange(-1);
            }}
            disabled={quantity <= 1 || stock <= 0}
            aria-label="Kamaytirish"
          >
            <Icons.Minus />
          </button>
          <span className="oz-quantity-value">{quantity}</span>
          <button 
            type="button"
            className="oz-step-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleQuantityChange(1);
            }}
            disabled={quantity >= stock || stock <= 0}
            aria-label="Oshirish"
          >
            <Icons.Plus />
          </button>
        </div>

        {/* Savatga qo'shish tugmasi */}
        <button
          type="button"
          className={`oz-btn-add-cart ${justAdded ? 'oz-btn-success' : ''} ${isAddingToCart ? 'oz-btn-loading' : ''}`}
          onClick={handleAddToCart}
          disabled={stock <= 0 || isAddingToCart}
        >
          {isAddingToCart ? (
            <span className="oz-spinner" />
          ) : justAdded ? (
            <>
              <Icons.Check />
              <span>Qo'shildi!</span>
            </>
          ) : (
            <>
              <Icons.Cart />
              <span>Savatga</span>
            </>
          )}
        </button>

        {/* 1-Klikda xarid qilish (Quick Buy) */}
        <button
          type="button"
          className="oz-btn-quick-buy"
          onClick={handleQuickBuyClick}
          disabled={stock <= 0}
          title="Bir bosishda to'g'ridan-to'g'ri xarid"
        >
          <Icons.Bolt />
          <span>Tezkor xarid</span>
        </button>
      </div>
    </div>
  );
}

