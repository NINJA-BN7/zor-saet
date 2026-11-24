import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ProductCard, { Icons } from './ProductCard.jsx';
import './App.css';

/**
 * OZIMIZSTROY - MAISHIY TEXNIKA VA QURILISH MOLLARI INTERNET DO'KONI
 * Senior Frontend Architecture
 * 
 * Ushbu fayl do'konning to'liq funksional tizimini o'z ichiga oladi:
 * - Canli qidiruv va avtomatik takliflar (Live Search & Suggestions)
 * - Ko'p bosqichli kategoriya va brend filtrlari
 * - Dinamik narx va saralash mexanizmi
 * - Flash Deals (Jonli soniya hisoblagichli mega aksiya)
 * - Interaktiv savat (Cart Drawer) va promokod tizimi (Masalan: OZIMIZ2026)
 * - Sevimlilar (Wishlist Drawer) va Taqqoslash (Compare Modal)
 * - Tezkor xarid (1-Click Buy) va to'liq rasmiylashtirish (Checkout Modal)
 * - Mahsulotni tez ko'rish oynasi (Quick View Modal)
 * - FAQ akkordeoni, mijozlar sharhlari va brendlar vitrinasi
 * - Bildirishnomalar tizimi (Toast Notification System)
 */

// Formatlash yordamchisi: O'zbekiston so'mi
const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '0 so\'m';
  return new Intl.NumberFormat('uz-UZ', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + " so'm";
};

// DO'KONNING BOYITILGAN MAHSULOTLAR BAZASI (MOCK DATA)
const INITIAL_PRODUCTS = [
  {
    id: 'oz-101',
    title: 'Samsung No-Frost Ikki Kamerali Smart Muzlatgich 450L',
    brand: 'Samsung',
    model: 'RB38T600FSA',
    category: 'Muzlatgichlar',
    price: 8490000,
    oldPrice: 10200000,
    rating: 4.9,
    reviewsCount: 68,
    isBestseller: true,
    isNew: false,
    energyClass: 'A+++',
    stock: 6,
    maxStock: 15,
    freeDelivery: true,
    isOfficialWarranty: true,
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=700&q=80'
    ],
    colors: [
      { name: 'Oltin kulrang (Inox)', code: '#64748b' },
      { name: 'Qora Premium', code: '#1e293b' },
      { name: 'Oq marvarid', code: '#f8fafc' }
    ],
    specs: [
      { label: 'Umumiy hajm', value: '450 litr' },
      { label: 'Kompressor', value: 'Raqamli Inverter' },
      { label: 'Shovqin darajasi', value: '35 dB (juda sokin)' },
      { label: 'Kafolat', value: '10 yil motor kafolati' }
    ],
    description: 'All-Around Cooling texnologiyasi bilan har bir burchakda bir xil harorat. Kam energiya sarfi va sovuqni uzoq muddat saqlash kafolatlangan.'
  },
  {
    id: 'oz-102',
    title: 'LG AI DD Bug\' Funktsiyali Aqlli Kir Yuvish Mashinasi 9kg',
    brand: 'LG',
    model: 'F4V5VS9B',
    category: 'Kir yuvish',
    price: 6790000,
    oldPrice: 7990000,
    rating: 4.8,
    reviewsCount: 52,
    isBestseller: true,
    isNew: true,
    energyClass: 'A+++',
    stock: 4,
    maxStock: 12,
    freeDelivery: true,
    isOfficialWarranty: true,
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=700&q=80'
    ],
    colors: [
      { name: 'Grafit Qora', code: '#334155' },
      { name: 'Klassik Oq', code: '#ffffff' }
    ],
    specs: [
      { label: 'Sig\'imi', value: '9 kg' },
      { label: 'Siqish tezligi', value: '1400 ayl/daq' },
      { label: 'Texnologiya', value: 'AI DD Sun\'iy intellekt' },
      { label: 'Bug\' bilan yuvish', value: 'Steam+ allergiyaga qarshi' }
    ],
    description: 'Matoni avtomatik aniqlovchi AI DD datchiklari matoning holatiga qarab optimal aylanish naqshini tanlaydi.'
  },
  {
    id: 'oz-103',
    title: 'Samsung 65" Neo QLED 4K Ultra Slim Smart Televizor',
    brand: 'Samsung',
    model: 'QN85C Series',
    category: 'Televizorlar',
    price: 13900000,
    oldPrice: 16500000,
    rating: 5.0,
    reviewsCount: 39,
    isBestseller: false,
    isNew: true,
    energyClass: 'A++',
    stock: 8,
    maxStock: 10,
    freeDelivery: true,
    isOfficialWarranty: true,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=700&q=80'
    ],
    colors: [
      { name: 'Titan kumush', code: '#94a3b8' },
      { name: 'Chuqur qora', code: '#0f172a' }
    ],
    specs: [
      { label: 'Ekran diagonali', value: '65 dyuym (165 sm)' },
      { label: 'Ruxsati', value: '4K Ultra HD (3840x2160)' },
      { label: 'Yangilanish tezligi', value: '120Hz' },
      { label: 'Ovoz tizimi', value: 'Dolby Atmos 60W' }
    ],
    description: 'Quantum Matrix texnologiyasi va Neo Quantum 4K protsessori bilan tasvirning har bir detallari jonli va chuqur ko\'rinadi.'
  },
  {
    id: 'oz-104',
    title: 'Dyson V15 Detect Simsiz Kuchli Aqlli Changyutgich',
    brand: 'Dyson',
    model: 'V15 Total Clean',
    category: 'Tozalash',
    price: 8900000,
    oldPrice: 9800000,
    rating: 4.9,
    reviewsCount: 84,
    isBestseller: true,
    isNew: false,
    energyClass: 'A+++',
    stock: 5,
    maxStock: 14,
    freeDelivery: true,
    isOfficialWarranty: true,
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=700&q=80'
    ],
    colors: [
      { name: 'Nikel & Oltin sariq', code: '#d97706' },
      { name: 'Temir kulrang', code: '#475569' }
    ],
    specs: [
      { label: 'So\'rish quvvati', value: '240 AW' },
      { label: 'Ishlash vaqti', value: '60 daqiqagacha' },
      { label: 'Filtratsiya', value: '99.99% HEPA mikron' },
      { label: 'Lazerli datchik', value: 'Mavjud' }
    ],
    description: 'Yashirin changlarni ko\'rsatib beruvchi maxsus yashil lazer nuri va zarrachalar hajmini o\'lchovchi piezo-datchik.'
  },
  {
    id: 'oz-105',
    title: 'Artel Inverter 12HP Tezkor Sovituvchi Konditsioner',
    brand: 'Artel',
    model: 'Inverter Grand 12',
    category: 'Iqlim nazorati',
    price: 4950000,
    oldPrice: 5600000,
    rating: 4.7,
    reviewsCount: 110,
    isBestseller: true,
    isNew: false,
    energyClass: 'A++',
    stock: 12,
    maxStock: 25,
    freeDelivery: true,
    isOfficialWarranty: true,
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80'
    ],
    colors: [
      { name: 'Oq porloq', code: '#ffffff' },
      { name: 'Oyna effektli qora', code: '#18181b' }
    ],
    specs: [
      { label: 'Maydon', value: '35-40 kv.m gacha' },
      { label: 'Freon turi', value: 'R32 ekologik' },
      { label: 'Qizdirish / Sovitish', value: '-15°C dan +52°C gacha' },
      { label: 'Wi-Fi boshqaruv', value: 'Smart Life ilovasi' }
    ],
    description: 'Tejamkor Inverter texnologiyasi elektr energiyasini 40% gacha tejaydi va havoni ionlashtiruvchi filtrlar bilan tozalaydi.'
  },
  {
    id: 'oz-106',
    title: 'DeLonghi Magnifica S Avtomatik Qahva Mashinasi',
    brand: 'DeLonghi',
    model: 'ECAM 22.110.B',
    category: 'Oshxona texnikasi',
    price: 5290000,
    oldPrice: 6200000,
    rating: 4.9,
    reviewsCount: 47,
    isBestseller: false,
    isNew: true,
    energyClass: 'A',
    stock: 3,
    maxStock: 10,
    freeDelivery: true,
    isOfficialWarranty: true,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=700&q=80'
    ],
    colors: [
      { name: 'Klassik Qora', code: '#1e293b' },
      { name: 'Kumushrang Inox', code: '#cbd5e1' }
    ],
    specs: [
      { label: 'Nasos bosimi', value: '15 bar' },
      { label: 'Donli qahva hajmi', value: '250 g' },
      { label: 'Suv idishi', value: '1.8 litr' },
      { label: 'Kapuchinator', value: 'Manual Cappuccino System' }
    ],
    description: 'Yangi maydalangan qahva donalaridan Italiya standarti bo\'yicha mukammal espresso va nozik ko\'pikli kapuchino tayyorlang.'
  },
  {
    id: 'oz-107',
    title: 'Bosch Akkumulyatorli Zarbali Drel-Shurupovyort 18V',
    brand: 'Bosch',
    model: 'GSB 18V-50 Professional',
    category: 'Qurilish asboblari',
    price: 2190000,
    oldPrice: 2650000,
    rating: 4.9,
    reviewsCount: 95,
    isBestseller: true,
    isNew: false,
    energyClass: 'A+++',
    stock: 9,
    maxStock: 20,
    freeDelivery: true,
    isOfficialWarranty: true,
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=700&q=80'
    ],
    colors: [
      { name: 'Professional Ko\'k', code: '#1d4ed8' }
    ],
    specs: [
      { label: 'Kuchlanish', value: '18V Li-Ion (2x 2.0Ah)' },
      { label: 'Aylanish momenti', value: '50 Nm' },
      { label: 'Dvigatel', value: 'Brushless (Cho\'tkasiz)' },
      { label: 'Komplekt', value: 'L-BOXX chamadoni + 2 batareya' }
    ],
    description: 'Mustahkam metall patron va cho\'tkasiz motor uzoq xizmat muddati hamda og\'ir qurilish ishlarida yuqori quvvat beradi.'
  },
  {
    id: 'oz-108',
    title: 'Philips Avtomatik Mikroto\'lqinli Pech Grill Bilan 25L',
    brand: 'Philips',
    model: 'HD4928 SmartGrill',
    category: 'Oshxona texnikasi',
    price: 1850000,
    oldPrice: 2200000,
    rating: 4.6,
    reviewsCount: 34,
    isBestseller: false,
    isNew: false,
    energyClass: 'A',
    stock: 14,
    maxStock: 20,
    freeDelivery: true,
    isOfficialWarranty: true,
    images: [
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=700&q=80'
    ],
    colors: [
      { name: 'Qora & Zanglamas metall', code: '#334155' }
    ],
    specs: [
      { label: 'Hajmi', value: '25 litr' },
      { label: 'Quvvati', value: '900W / Grill 1000W' },
      { label: 'Dasturlar', value: '12 ta avtomatik pishirish' },
      { label: 'Ichki qoplama', value: 'Bio-keramika' }
    ],
    description: 'Tez muzdan tushirish, tiniq tilla rangli grill qobig\'i hosil qilish va qulay teginish orqali boshqaruv paneli.'
  }
];

// HERO BANNER SLAYDLARI
const HERO_SLIDES = [
  {
    id: 1,
    tag: 'Katta Bahoriy Chegirmalar',
    title: 'Aqlli Maishiy Texnikalarda 45% gacha Chegirma',
    desc: 'Eng so\'nggi modeldagi muzlatgich, kir yuvish mashinalari va televizorlar rasmiy kafolat bilan "OzimizStroy"da.',
    cta: 'Xaridlarni Boshlash',
    bg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    category: 'Barchasi'
  },
  {
    id: 2,
    tag: 'Nasiya 0-0-12',
    title: 'Boshlang\'ich To\'lovsiz 12 Oyga Bo\'lib To\'lang',
    desc: 'Ortiqcha hujjatlarsiz, pasportingizning o\'zi kifoya. Barcha yirik maishiy texnika va asboblar uchun qulay muddatli to\'lov.',
    cta: 'Katalogga O\'tish',
    bg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    category: 'Muzlatgichlar'
  },
  {
    id: 3,
    tag: 'Professional Uskunalar',
    title: 'Ustalar Uchun Original Nemis Asboblari',
    desc: 'Bosch, DeWalt va Makita brendlarining original zarbali drel, perforator va silliqlash mashinalari kafolati bilan.',
    cta: 'Asboblarni Ko\'rish',
    bg: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80',
    category: 'Qurilish asboblari'
  }
];

export default function App() {
  // 1. ASOSIY HOLATLAR (STATE MANAGEMENT)
  const [products] = useState(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [selectedBrand, setSelectedBrand] = useState('Barchasi');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Savat, Sevimlilar, Taqqoslash
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Modallar
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [quickBuyProduct, setQuickBuyProduct] = useState(null);

  // Promokod va chegirmalar
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code: 'OZIMIZ2026', discountPercent: 10 }

  // Banner Slayderi
  const [activeSlide, setActiveSlide] = useState(0);

  // Jonli Ticking Timer (Flash Deal uchun: Masalan 18 soat, 44 daqiqa, 22 soniya)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 48 });

  // Toast Bildirishnomalar
  const [toasts, setToasts] = useState([]);

  // FAQ Akkordeon holati
  const [activeFaq, setActiveFaq] = useState(0);

  // Buyurtma formasi holati
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: '',
    phone: '+998 ',
    city: 'Toshkent shahri',
    address: '',
    paymentMethod: 'payme',
    comment: ''
  });
  const [orderSuccess, setOrderSuccess] = useState(false);

  // 2. YORDAMCHI EFFEKTLAR (EFFECTS)
  // Scroll monitoring
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Flash Sale Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hero Carousel Auto Play
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, []);

  // Toast bildirishnoma qo'shish funksiyasi
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // 3. SAVAT VA XARID LOGIKASI
  const handleAddToCart = useCallback((productWithDetails) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === productWithDetails.id && item.selectedColor?.name === productWithDetails.selectedColor?.name
      );
      if (existing) {
        return prev.map((item) =>
          item.id === productWithDetails.id && item.selectedColor?.name === productWithDetails.selectedColor?.name
            ? { ...item, quantity: item.quantity + productWithDetails.quantity }
            : item
        );
      }
      return [...prev, productWithDetails];
    });
    showToast(`"${productWithDetails.title.slice(0, 28)}..." savatga qo'shildi!`, 'success');
  }, [showToast]);

  const handleUpdateCartQuantity = (itemId, colorName, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId && item.selectedColor?.name === colorName) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveFromCart = (itemId, colorName) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === itemId && item.selectedColor?.name === colorName))
    );
    showToast("Mahsulot savatdan o'chirildi.", 'warning');
  };

  // Sevimlilar (Wishlist) toggle
  const handleToggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast("Sevimlilardan olib tashlandi.", 'warning');
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast("Sevimlilar ro'yxatiga saqlandi!", 'success');
        return [...prev, product];
      }
    });
  }, [showToast]);

  // Taqqoslash (Compare) toggle
  const handleToggleCompare = useCallback((product) => {
    setCompareList((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast("Taqqoslashdan olib tashlandi.", 'warning');
        return prev.filter((item) => item.id !== product.id);
      } else {
        if (prev.length >= 4) {
          showToast("Maksimal 4 ta mahsulotni taqqoslash mumkin!", 'warning');
          return prev;
        }
        showToast("Taqqoslash ro'yxatiga qo'shildi!", 'info');
        return [...prev, product];
      }
    });
  }, [showToast]);

  // Promokod qo'llash
  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCodeInput.trim().toUpperCase() === 'OZIMIZ2026') {
      setAppliedPromo({ code: 'OZIMIZ2026', discountPercent: 10 });
      showToast("Tabriklaymiz! 10% promokod chegirmasi qo'llandi.", 'success');
    } else {
      showToast("Noto'g'ri yoki muddati o'tgan promokod!", 'warning');
    }
  };

  // Savat hisob-kitoblari
  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cartItems]);

  const promoDiscountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    return Math.round((cartSubtotal * appliedPromo.discountPercent) / 100);
  }, [cartSubtotal, appliedPromo]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - promoDiscountAmount);
  }, [cartSubtotal, promoDiscountAmount]);

  // Barcha kategoriyalar ro'yxati
  const categories = useMemo(() => {
    return ['Barchasi', 'Muzlatgichlar', 'Kir yuvish', 'Televizorlar', 'Oshxona texnikasi', 'Iqlim nazorati', 'Tozalash', 'Qurilish asboblari'];
  }, []);

  // Barcha brendlar
  const brands = useMemo(() => {
    return ['Barchasi', 'Samsung', 'LG', 'Bosch', 'Artel', 'Dyson', 'DeLonghi', 'Philips'];
  }, []);

  // 4. FILTRLASH VA SARALASH MEXANIZMI
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Qidiruv so'zi bo'yicha
      const matchSearch = searchQuery.trim() === '' || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Kategoriya bo'yicha
      const matchCategory = selectedCategory === 'Barchasi' || p.category === selectedCategory;

      // Brend bo'yicha
      const matchBrand = selectedBrand === 'Barchasi' || p.brand === selectedBrand;

      return matchSearch && matchCategory && matchBrand;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') {
        const discA = a.oldPrice ? a.oldPrice - a.price : 0;
        const discB = b.oldPrice ? b.oldPrice - b.price : 0;
        return discB - discA;
      }
      return 0; // popular
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, sortBy]);

  // Canli Qidiruv natijalari
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    return products
      .filter((p) => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [products, searchQuery]);

  // Buyurtmani yakunlash
  const handleFinalOrderSubmit = (e) => {
    e.preventDefault();
    if (!checkoutForm.fullName || checkoutForm.phone.length < 9) {
      showToast("Iltimos, ismingiz va to'liq telefon raqamingizni kiriting!", 'warning');
      return;
    }
    setOrderSuccess(true);
    setTimeout(() => {
      setCartItems([]);
      setAppliedPromo(null);
      setCheckoutModalOpen(false);
      setQuickBuyProduct(null);
      setOrderSuccess(false);
      showToast("Buyurtmangiz qabul qilindi! Operatorimiz tez orada bog'lanadi.", 'success');
    }, 2800);
  };

  return (
    <div className="oz-app">
      {/* ====================================================================
          1. HEADER (TOPBAR, ASOSIY NAVBAR, KATEGORIYALAR)
          ==================================================================== */}
      <header className={`oz-header ${isScrolled ? 'oz-header-scrolled' : ''}`}>
        {/* Topbar */}
        <div className="oz-topbar">
          <div className="oz-container oz-topbar-inner">
            <div className="oz-topbar-left">
              <span className="oz-topbar-item">
                <Icons.Truck /> O'zbekiston bo'ylab 24 soat ichida bepul yetkazib berish
              </span>
              <span className="oz-topbar-item oz-topbar-highlight">
                0-0-12 Boshlang'ich to'lovsiz muddatli to'lov!
              </span>
            </div>
            <div className="oz-topbar-right">
              <a href="tel:+998712000000" className="oz-topbar-item">
                📞 +998 (71) 200-00-00 (24/7 Qo'llab-quvvatlash)
              </a>
              <span className="oz-topbar-item">📍 Toshkent sh., Chilonzor 19-mavze</span>
            </div>
          </div>
        </div>

        {/* Asosiy Navbar */}
        <div className="oz-nav-main">
          <div className="oz-container oz-nav-row">
            {/* Logo */}
            <a href="#" className="oz-logo" onClick={(e) => { e.preventDefault(); setSelectedCategory('Barchasi'); }}>
              <div className="oz-logo-icon">
                <Icons.Bolt />
              </div>
              <div className="oz-logo-text">
                <span>OzimizStroy</span>
                <span className="oz-logo-subtitle">Texnika & Qurilish</span>
              </div>
            </a>

            {/* Qidiruv Qutisi (Live Search) */}
            <div className="oz-search-box">
              <form className="oz-search-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  className="oz-search-input"
                  placeholder="Muzlatgich, televizor, drel yoki brend nomi bo'yicha qidiring..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                />
                <button type="submit" className="oz-search-btn" aria-label="Qidirish">
                  <Icons.Eye />
                </button>
              </form>

              {/* Canli qidiruv tavsiyalari (Dropdown) */}
              {isSearchFocused && searchSuggestions.length > 0 && (
                <div className="oz-search-dropdown">
                  {searchSuggestions.map((item) => (
                    <div 
                      key={item.id} 
                      className="oz-search-result-item"
                      onClick={() => {
                        setQuickViewProduct(item);
                        setIsSearchFocused(false);
                      }}
                    >
                      <img src={item.images[0]} alt={item.title} className="oz-search-result-thumb" />
                      <div className="oz-search-result-info">
                        <h4>{item.title}</h4>
                        <span className="oz-search-result-price">{formatCurrency(item.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Header Amallari: Sevimlilar, Taqqoslash, Savat */}
            <div className="oz-header-actions">
              <button 
                type="button" 
                className="oz-header-btn" 
                onClick={() => setIsCompareOpen(true)}
                title="Taqqoslangan tovarlar"
              >
                <Icons.Compare active={compareList.length > 0} />
                <span>Taqqoslash</span>
                {compareList.length > 0 && (
                  <span className="oz-badge-count">{compareList.length}</span>
                )}
              </button>

              <button 
                type="button" 
                className="oz-header-btn" 
                onClick={() => setIsWishlistOpen(true)}
                title="Saralanganlar ro'yxati"
              >
                <Icons.Heart filled={wishlist.length > 0} />
                <span>Sevimlilar</span>
                {wishlist.length > 0 && (
                  <span className="oz-badge-count">{wishlist.length}</span>
                )}
              </button>

              <button 
                type="button" 
                className="oz-header-btn oz-cart-preview-badge" 
                onClick={() => setIsCartOpen(true)}
                title="Savatni ko'rish"
              >
                <Icons.Cart />
                <span>Savat</span>
                <span className="oz-badge-count">{cartItems.reduce((sum, i) => sum + i.quantity, 0)}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Kategoriyalar Gorizontal Scroll Bar */}
        <div className="oz-nav-categories">
          <div className="oz-container">
            <div className="oz-cat-scroll-wrapper">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`oz-cat-pill ${selectedCategory === cat ? 'oz-active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'Barchasi' ? '⚡ Barcha Mahsulotlar' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================
          2. HERO BANNER SLAYDERI VA YON REKLAMALAR
          ==================================================================== */}
      <section className="oz-hero-section">
        <div className="oz-container">
          <div className="oz-hero-grid">
            {/* Asosiy Katta Slayder */}
            <div className="oz-hero-slider">
              {HERO_SLIDES.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`oz-hero-slide ${index === activeSlide ? 'oz-slide-active' : ''}`}
                  style={{ backgroundImage: `url(${slide.bg})` }}
                >
                  <div className="oz-hero-slide-overlay" />
                  <div className="oz-hero-content">
                    <span className="oz-hero-tag">{slide.tag}</span>
                    <h1 className="oz-hero-title">{slide.title}</h1>
                    <p className="oz-hero-desc">{slide.desc}</p>
                    <button
                      type="button"
                      className="oz-hero-cta"
                      onClick={() => {
                        setSelectedCategory(slide.category);
                        window.scrollTo({ top: 820, behavior: 'smooth' });
                      }}
                    >
                      <span>{slide.cta}</span>
                      <Icons.ChevronRight />
                    </button>
                  </div>
                </div>
              ))}

              {/* Slayder Navigatsiyasi */}
              <div className="oz-hero-nav">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`oz-hero-dot ${i === activeSlide ? 'oz-active' : ''}`}
                    onClick={() => setActiveSlide(i)}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Yon Tomondagi Mini Aksiya Bannerlari */}
            <div className="oz-hero-sidecards">
              <div 
                className="oz-sidecard" 
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80)' }}
              >
                <div className="oz-sidecard-overlay" />
                <div className="oz-sidecard-content">
                  <h3 className="oz-sidecard-title">Qahva Mashinalari</h3>
                  <p className="oz-sidecard-sub">Italiya sifatidagi DeLonghi modellari</p>
                  <span className="oz-sidecard-link">Tanlash <Icons.ChevronRight /></span>
                </div>
              </div>

              <div 
                className="oz-sidecard" 
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80)' }}
              >
                <div className="oz-sidecard-overlay" />
                <div className="oz-sidecard-content">
                  <h3 className="oz-sidecard-title">Bosch Uskunalari</h3>
                  <p className="oz-sidecard-sub">Qurilish va ta'mirlash uchun -20%</p>
                  <span className="oz-sidecard-link">Batafsil <Icons.ChevronRight /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. AFZALLIKLAR VA ISHONCH STRIP (FEATURES)
          ==================================================================== */}
      <section className="oz-features-strip">
        <div className="oz-container">
          <div className="oz-features-grid">
            <div className="oz-feature-card">
              <div className="oz-feature-icon-box">
                <Icons.Truck />
              </div>
              <div className="oz-feature-texts">
                <h4>Tezkor va Bepul Yetkazish</h4>
                <p>Respublika bo'yicha 24 soatda eshikkacha</p>
              </div>
            </div>

            <div className="oz-feature-card">
              <div className="oz-feature-icon-box">
                <Icons.Shield />
              </div>
              <div className="oz-feature-texts">
                <h4>3 Yillik Rasmiy Kafolat</h4>
                <p>Faqat original va sertifikatlangan tovarlar</p>
              </div>
            </div>

            <div className="oz-feature-card">
              <div className="oz-feature-icon-box">
                <Icons.Bolt />
              </div>
              <div className="oz-feature-texts">
                <h4>Bo'lib To'lash (0-0-12)</h4>
                <p>Bankka bormasdan, onlayn tasdiqlash</p>
              </div>
            </div>

            <div className="oz-feature-card">
              <div className="oz-feature-icon-box">
                <Icons.Check />
              </div>
              <div className="oz-feature-texts">
                <h4>14 Kun Qaytarish Huquqi</h4>
                <p>Muammo bo'lsa darhol almashtirib beramiz</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. FLASH DEALS (JONLI TIKING TIMERLI CHEGIRMA BLOKI)
          ==================================================================== */}
      <section className="oz-flash-section">
        <div className="oz-container">
          <div className="oz-flash-header">
            <div className="oz-flash-title-wrap">
              <span className="oz-flash-badge">
                <Icons.Bolt /> Flash Taklif
              </span>
              <h3>Kun Chegirmalari — Vaqt Cheklangan!</h3>
            </div>
            <div className="oz-flash-timer">
              <span>Tugashiga qoldi:</span>
              <div className="oz-timer-block">{String(timeLeft.hours).padStart(2, '0')}</div>
              <span className="oz-timer-sep">:</span>
              <div className="oz-timer-block">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <span className="oz-timer-sep">:</span>
              <div className="oz-timer-block">{String(timeLeft.seconds).padStart(2, '0')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. MAHSULOTLAR KATALOGI VA FILTRLASH GRIDI
          ==================================================================== */}
      <main className="oz-catalog-section">
        <div className="oz-container">
          {/* Katalog Toolbar (Saralash va Natijalar soni) */}
          <div className="oz-section-header">
            <div className="oz-section-title-wrap">
              <h2>{selectedCategory === 'Barchasi' ? 'Ommabop Mahsulotlar' : selectedCategory}</h2>
              <p>Jami {filteredProducts.length} ta zamonaviy model topildi</p>
            </div>

            <div className="oz-catalog-toolbar">
              {/* Brend filtri */}
              <select 
                className="oz-sort-select"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                {brands.map((b) => (
                  <option key={b} value={b}>{b === 'Barchasi' ? 'Barcha brendlar' : b}</option>
                ))}
              </select>

              {/* Narx va Reyting bo'yicha saralash */}
              <select 
                className="oz-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Ommabopligi bo'yicha</option>
                <option value="price-asc">Narx: Arzondan Qimmatga</option>
                <option value="price-desc">Narx: Qimmatdan Arzonga</option>
                <option value="rating">Yuqori reyting bo'yicha</option>
                <option value="discount">Katta chegirmalar</option>
              </select>
            </div>
          </div>

          {/* Mahsulotlar Gridi */}
          {filteredProducts.length > 0 ? (
            <div className="oz-products-grid">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isWishlisted={wishlist.some((w) => w.id === prod.id)}
                  isCompared={compareList.some((c) => c.id === prod.id)}
                  onAddToCart={handleAddToCart}
                  onQuickBuy={(p) => setQuickBuyProduct(p)}
                  onToggleWishlist={handleToggleWishlist}
                  onToggleCompare={handleToggleCompare}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="oz-empty-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h3>Afsuski, hech qanday mahsulot topilmadi</h3>
              <p style={{ color: '#64748b', margin: '10px 0 20px' }}>Qidiruv so'zini o'zgartirib ko'ring yoki boshqa kategoriyani tanlang.</p>
              <button 
                type="button" 
                className="oz-btn-checkout" 
                style={{ width: 'auto', display: 'inline-block' }}
                onClick={() => {
                  setSelectedCategory('Barchasi');
                  setSelectedBrand('Barchasi');
                  setSearchQuery('');
                }}
              >
                Filtrlarni tozalash
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ====================================================================
          6. BRENDLAR VITRINASI (OFFICIAL BRAND PARTNERS)
          ==================================================================== */}
      <section className="oz-brands-section">
        <div className="oz-container">
          <div className="oz-brands-row">
            <span className="oz-brand-item">SAMSUNG</span>
            <span className="oz-brand-item">LG Electronics</span>
            <span className="oz-brand-item">BOSCH</span>
            <span className="oz-brand-item">Artel</span>
            <span className="oz-brand-item">dyson</span>
            <span className="oz-brand-item">DeLonghi</span>
            <span className="oz-brand-item">PHILIPS</span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. FAQ (KO'P BERILADIGAN SAVOLLARGA JAVOBLAR)
          ==================================================================== */}
      <section className="oz-faq-section">
        <div className="oz-container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontFamily: 'var(--oz-font-display)', fontSize: '2rem', fontWeight: 800 }}>
              Ko'p Beriladigan Savollar
            </h2>
            <p style={{ color: '#64748b' }}>Do'konimiz, yetkazib berish va kafolat haqida bilishingiz kerak bo'lgan ma'lumotlar</p>
          </div>

          <div className="oz-faq-list">
            {[
              {
                q: "Muddatli to'lov (nasiya) qanday tartibda amalga oshiriladi?",
                a: "Do'konimizda barcha maishiy texnika va asboblarni 3, 6, 12 va 24 oyga bo'lib to'lashga xarid qilishingiz mumkin. Buning uchun faqat pasport yoki ID karta talab qilinadi. Boshlang'ich to'lov 0%!"
              },
              {
                q: "Viloyatlarga yetkazib berish qancha vaqt oladi va narxi qancha?",
                a: "O'zbekistonning barcha viloyat markazlariga 24 soat ichida, tuman va chekka qishloqlarga 48 soat ichida to'g'ridan-to'g'ri uyingiz eshigigacha bepul yetkazib beriladi."
              },
              {
                q: "Rasmiy kafolat xizmati bormi?",
                a: "Albatta. Biz sotadigan barcha texnikalar brendlarning O'zbekistondagi rasmiy vakolatxonalaridan olingan va ularga 3 yildan 10 yilgacha bepul servis kafolati beriladi."
              },
              {
                q: "Mahsulot yoqmasa yoki nuqsonli bo'lsa qaytarsa bo'ladimi?",
                a: "Ha, iste'molchilar huquqlari to'g'risidagi qonunga muvofiq, tovar xarid qilingan kundan boshlab 14 kun ichida shikastlanmagan holatda bo'lsa, uni to'liq almashtirish yoki pulingizni qaytarib olish huquqiga egasiz."
              }
            ].map((faq, fIdx) => (
              <div key={fIdx} className="oz-faq-card">
                <div 
                  className="oz-faq-question"
                  onClick={() => setActiveFaq(activeFaq === fIdx ? null : fIdx)}
                >
                  <span>{faq.q}</span>
                  <span>{activeFaq === fIdx ? '−' : '+'}</span>
                </div>
                {activeFaq === fIdx && (
                  <div className="oz-faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. SAVAT DRAWERI (CART DRAWER)
          ==================================================================== */}
      {isCartOpen && (
        <div className="oz-backdrop" onClick={() => setIsCartOpen(false)}>
          <div className="oz-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="oz-drawer-header">
              <div className="oz-drawer-title">
                <Icons.Cart />
                <span>Savat ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
              </div>
              <button 
                type="button" 
                className="oz-close-btn"
                onClick={() => setIsCartOpen(false)}
                aria-label="Yopish"
              >
                ✕
              </button>
            </div>

            <div className="oz-drawer-body">
              {cartItems.length > 0 ? (
                <>
                  {cartItems.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="oz-cart-item">
                      <img src={item.images[0]} alt={item.title} className="oz-cart-item-img" />
                      <div className="oz-cart-item-info">
                        <h4 className="oz-cart-item-title">{item.title}</h4>
                        {item.selectedColor && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                            Rang: <strong>{item.selectedColor.name}</strong>
                          </div>
                        )}
                        <div className="oz-cart-item-price">{formatCurrency(item.price * item.quantity)}</div>

                        {/* Sonini boshqarish */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="oz-quantity-stepper" style={{ height: '32px' }}>
                            <button
                              type="button"
                              className="oz-step-btn"
                              onClick={() => handleUpdateCartQuantity(item.id, item.selectedColor?.name, -1)}
                            >
                              -
                            </button>
                            <span className="oz-quantity-value">{item.quantity}</span>
                            <button
                              type="button"
                              className="oz-step-btn"
                              onClick={() => handleUpdateCartQuantity(item.id, item.selectedColor?.name, 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer' }}
                            onClick={() => handleRemoveFromCart(item.id, item.selectedColor?.name)}
                          >
                            O'chirish
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Promokod kiritish formasi */}
                  <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <input
                      type="text"
                      placeholder="Promokod (masalan: OZIMIZ2026)"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      className="oz-form-input"
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                    <button type="submit" className="oz-btn-add-cart" style={{ height: 'auto', whiteSpace: 'nowrap' }}>
                      Qo'llash
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                  <p style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Savatingiz hozircha bo'sh</p>
                  <p style={{ fontSize: '0.85rem' }}>O'zingizga ma'qul bo'lgan texnikalarni tanlang va savatga qo'shing.</p>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="oz-drawer-footer">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                  <span>Oraliq summa:</span>
                  <span>{formatCurrency(cartSubtotal)}</span>
                </div>
                {appliedPromo && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#10b981', marginBottom: '6px' }}>
                    <span>Chegirma ({appliedPromo.code}):</span>
                    <span>-{formatCurrency(promoDiscountAmount)}</span>
                  </div>
                )}
                <div className="oz-cart-total-row">
                  <span>Jami to'lov:</span>
                  <span style={{ color: 'var(--oz-primary)' }}>{formatCurrency(cartTotal)}</span>
                </div>

                <button
                  type="button"
                  className="oz-btn-checkout"
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutModalOpen(true);
                  }}
                >
                  Buyurtmani Rasmiylashtirish
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          9. SEVIMLILAR DRAWERI (WISHLIST DRAWER)
          ==================================================================== */}
      {isWishlistOpen && (
        <div className="oz-backdrop" onClick={() => setIsWishlistOpen(false)}>
          <div className="oz-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="oz-drawer-header">
              <div className="oz-drawer-title">
                <Icons.Heart filled={true} />
                <span>Sevimlilar ({wishlist.length})</span>
              </div>
              <button 
                type="button" 
                className="oz-close-btn"
                onClick={() => setIsWishlistOpen(false)}
                aria-label="Yopish"
              >
                ✕
              </button>
            </div>

            <div className="oz-drawer-body">
              {wishlist.length > 0 ? (
                wishlist.map((item) => (
                  <div key={item.id} className="oz-cart-item">
                    <img src={item.images[0]} alt={item.title} className="oz-cart-item-img" />
                    <div className="oz-cart-item-info">
                      <h4 className="oz-cart-item-title">{item.title}</h4>
                      <div className="oz-cart-item-price">{formatCurrency(item.price)}</div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                        <button
                          type="button"
                          className="oz-btn-add-cart"
                          style={{ height: '32px', fontSize: '0.75rem', padding: '0 10px' }}
                          onClick={() => {
                            handleAddToCart({ ...item, quantity: 1 });
                            handleToggleWishlist(item);
                          }}
                        >
                          Savatga olish
                        </button>
                        <button
                          type="button"
                          style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.78rem', cursor: 'pointer' }}
                          onClick={() => handleToggleWishlist(item)}
                        >
                          O'chirish
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                  <p>Hozircha sevimlilar ro'yxatingiz bo'sh</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          10. TAQQOSLASH OYNASI (COMPARE MODAL)
          ==================================================================== */}
      {isCompareOpen && (
        <div className="oz-backdrop" onClick={() => setIsCompareOpen(false)}>
          <div className="oz-modal-box" style={{ maxWidth: '1000px' }} onClick={(e) => e.stopPropagation()}>
            <div className="oz-drawer-header">
              <h3 className="oz-drawer-title">
                <Icons.Compare active={true} /> Mahsulotlar Xususiyatlarini Taqqoslash
              </h3>
              <button 
                type="button" 
                className="oz-close-btn"
                onClick={() => setIsCompareOpen(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '24px', overflowX: 'auto' }}>
              {compareList.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0', width: '20%' }}>Parametrlar</th>
                      {compareList.map((item) => (
                        <th key={item.id} style={{ padding: '12px', borderBottom: '2px solid #e2e8f0', width: `${80 / compareList.length}%` }}>
                          <img src={item.images[0]} alt={item.title} style={{ height: '100px', objectFit: 'contain', margin: '0 auto 8px' }} />
                          <div style={{ fontWeight: 700 }}>{item.title}</div>
                          <div style={{ color: 'var(--oz-primary)', fontWeight: 800, marginTop: '4px' }}>{formatCurrency(item.price)}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>Brend</td>
                      {compareList.map((item) => (
                        <td key={item.id} style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>{item.brand}</td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>Kafolat</td>
                      {compareList.map((item) => (
                        <td key={item.id} style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>3 yil rasmiy</td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>Energiya klassi</td>
                      {compareList.map((item) => (
                        <td key={item.id} style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>{item.energyClass}</td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>Amallar</td>
                      {compareList.map((item) => (
                        <td key={item.id} style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                          <button
                            type="button"
                            className="oz-btn-add-cart"
                            style={{ height: '36px', fontSize: '0.8rem', width: '100%' }}
                            onClick={() => {
                              handleAddToCart({ ...item, quantity: 1 });
                            }}
                          >
                            Savatga olish
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p style={{ textAlign: 'center', color: '#64748b' }}>Taqqoslash uchun kamida 2 ta mahsulot tanlang.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          11. MAHSULOTNI TEZ KO'RISH OYNASI (QUICK VIEW MODAL)
          ==================================================================== */}
      {quickViewProduct && (
        <div className="oz-backdrop" onClick={() => setQuickViewProduct(null)}>
          <div className="oz-modal-box" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="oz-close-btn oz-modal-close-top"
              onClick={() => setQuickViewProduct(null)}
            >
              ✕
            </button>

            <div className="oz-quickview-grid">
              <div>
                <img 
                  src={quickViewProduct.images[0]} 
                  alt={quickViewProduct.title} 
                  className="oz-quickview-img"
                />
              </div>

              <div>
                <span className="oz-brand-name">{quickViewProduct.brand}</span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '6px 0 12px' }}>
                  {quickViewProduct.title}
                </h2>
                <div className="oz-current-price" style={{ fontSize: '1.75rem', marginBottom: '14px' }}>
                  {formatCurrency(quickViewProduct.price)}
                </div>

                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  {quickViewProduct.description}
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Asosiy Texnik Parametrlari:</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {quickViewProduct.specs.map((s, idx) => (
                      <li key={idx} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '4px' }}>
                        <span style={{ color: '#64748b' }}>{s.label}:</span>
                        <strong>{s.value}</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className="oz-btn-checkout"
                  onClick={() => {
                    handleAddToCart({ ...quickViewProduct, quantity: 1 });
                    setQuickViewProduct(null);
                  }}
                >
                  Savatga Qo'shish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          12. BUYURTMA RASMIYLASHTIRISH VA TEZKOR XARID MODALI
          ==================================================================== */}
      {(checkoutModalOpen || quickBuyProduct) && (
        <div className="oz-backdrop" onClick={() => { setCheckoutModalOpen(false); setQuickBuyProduct(null); }}>
          <div className="oz-modal-box" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div className="oz-drawer-header">
              <h3 className="oz-drawer-title">
                {quickBuyProduct ? '⚡ 1-Bosishda Tezkor Xarid' : '📦 Buyurtmani Rasmiylashtirish'}
              </h3>
              <button 
                type="button" 
                className="oz-close-btn"
                onClick={() => { setCheckoutModalOpen(false); setQuickBuyProduct(null); }}
              >
                ✕
              </button>
            </div>

            {orderSuccess ? (
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icons.Check />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Rahmat! Buyurtmangiz Qabul Qilindi!</h3>
                <p style={{ color: '#64748b' }}>Operatorimiz 5 daqiqa ichida siz bilan bog'lanib, yetkazib berish vaqtini aniqlashtiradi.</p>
              </div>
            ) : (
              <form onSubmit={handleFinalOrderSubmit} className="oz-checkout-form">
                {quickBuyProduct && (
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img src={quickBuyProduct.images[0]} alt={quickBuyProduct.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{quickBuyProduct.title}</div>
                      <div style={{ color: 'var(--oz-primary)', fontWeight: 800 }}>{formatCurrency(quickBuyProduct.price)}</div>
                    </div>
                  </div>
                )}

                <div className="oz-form-group">
                  <label className="oz-form-label">To'liq Ismingiz *</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Azizbek Karimov"
                    className="oz-form-input"
                    value={checkoutForm.fullName}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })}
                  />
                </div>

                <div className="oz-form-group">
                  <label className="oz-form-label">Telefon Raqamingiz *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+998 90 123 45 67"
                    className="oz-form-input"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                  />
                </div>

                <div className="oz-form-group">
                  <label className="oz-form-label">Yetkazib Berish Manzili *</label>
                  <input
                    type="text"
                    required
                    placeholder="Shahar, tuman, ko'cha, uy raqami"
                    className="oz-form-input"
                    value={checkoutForm.address}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  />
                </div>

                <div className="oz-form-group">
                  <label className="oz-form-label">To'lov Usuli</label>
                  <div className="oz-payment-options">
                    {['payme', 'click', 'naqd'].map((method) => (
                      <div
                        key={method}
                        className={`oz-payment-pill ${checkoutForm.paymentMethod === method ? 'oz-active' : ''}`}
                        onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: method })}
                      >
                        {method.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="oz-btn-checkout" style={{ marginTop: '14px' }}>
                  Buyurtmani Tasdiqlash ({formatCurrency(quickBuyProduct ? quickBuyProduct.price : cartTotal)})
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          13. TOAST BILDIRISHNOMALARI
          ==================================================================== */}
      <div className="oz-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`oz-toast oz-toast-${toast.type}`}>
            <Icons.Check />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* ====================================================================
          14. FOOTER (KOMPANIYA HAQIDA VA BOG'LANISH)
          ==================================================================== */}
      <footer className="oz-footer">
        <div className="oz-container">
          <div className="oz-footer-grid">
            <div className="oz-footer-brand">
              <a href="#" className="oz-logo" style={{ color: 'white' }}>
                <div className="oz-logo-icon">
                  <Icons.Bolt />
                </div>
                <div className="oz-logo-text">
                  <span style={{ color: 'white' }}>OzimizStroy</span>
                  <span className="oz-logo-subtitle">Texnika & Qurilish</span>
                </div>
              </a>
              <p>
                "OzimizStroy" — O'zbekistondagi eng yirik zamonaviy maishiy texnika va professional qurilish asboblari onlayn gipermarketi. Sifat, kafolat va qulay muddatli to'lov bizning bosh shiorimiz!
              </p>
              <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                Ish vaqti: Har kuni 09:00 dan 22:00 gacha
              </div>
            </div>

            <div>
              <h4 className="oz-footer-title">Katalog</h4>
              <ul className="oz-footer-links">
                <li><a href="#cat" onClick={() => setSelectedCategory('Muzlatgichlar')}>Muzlatgichlar</a></li>
                <li><a href="#cat" onClick={() => setSelectedCategory('Kir yuvish')}>Kir Yuvish Mashinalari</a></li>
                <li><a href="#cat" onClick={() => setSelectedCategory('Televizorlar')}>Smart Televizorlar</a></li>
                <li><a href="#cat" onClick={() => setSelectedCategory('Iqlim nazorati')}>Konditsionerlar</a></li>
                <li><a href="#cat" onClick={() => setSelectedCategory('Qurilish asboblari')}>Qurilish Asboblari</a></li>
              </ul>
            </div>

            <div>
              <h4 className="oz-footer-title">Mijozlarga</h4>
              <ul className="oz-footer-links">
                <li><a href="#faq">Bo'lib to'lash shartlari</a></li>
                <li><a href="#faq">Yetkazib berish xizmati</a></li>
                <li><a href="#faq">Rasmiy kafolat</a></li>
                <li><a href="#faq">Tovarni qaytarish</a></li>
                <li><a href="#faq">Servis markazlari</a></li>
              </ul>
            </div>

            <div>
              <h4 className="oz-footer-title">Aloqa & Yangiliklar</h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '14px', color: '#cbd5e1' }}>
                Yangi chegirmalar va aksiyalardan birinchilardan bo'lib xabardor bo'ling:
              </p>
              <form onSubmit={(e) => { e.preventDefault(); showToast("Obuna muvaffaqiyatli qabul qilindi!", "success"); }} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="email" 
                  placeholder="Elektron pochtangiz" 
                  required
                  className="oz-form-input" 
                  style={{ padding: '8px 12px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                />
                <button type="submit" className="oz-btn-add-cart" style={{ height: 'auto', padding: '0 16px' }}>
                  OK
                </button>
              </form>
            </div>
          </div>

          <div className="oz-footer-bottom">
            <span>© 2026 OzimizStroy. Barcha huquqlar himoyalangan.</span>
            <span>To'lov turlari: Uzcard, Humo, Payme, Click, Uzum Nasiya, Naqd</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

