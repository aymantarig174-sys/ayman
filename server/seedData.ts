export const SEED_PRODUCTS = [
  {
    id: "star-projector",
    name: "اضاءة النجوم والمجرات",
    arabicName: "اضاءة النجوم والمجرات",
    category: "lighting",
    price: 156,
    originalPrice: 200,
    image: "/src/assets/images/galaxy_projector_thumbnail_1782560416265.jpg",
    gallery: [
      "/src/assets/images/galaxy_projector_thumbnail_1782560416265.jpg",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80",
      "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=500&q=80",
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500&q=80"
    ],
    variants: [
      { id: "v1", name: "24 قرص", price: 156 },
      { id: "v2", name: "12 قرص خيار (أ)", price: 130 },
      { id: "v3", name: "12 قرص خيار (ب)", price: 130 },
      { id: "v4", name: "10 أقراص", price: 120 },
      { id: "v5", name: "6 أقراص", price: 90 }
    ],
    description: "وفرنا لكم جهاز عرض نجوم ومجرات بخيارات أقراص متعددة لأجواء هادئة ومميزة.",
    arabicDescription: "وفرنا لكم جهاز عرض نجوم ومجرات بخيارات أقراص متعددة لأجواء هادئة ومميزة.",
    features: [
      "جودة عرض مذهلة وتأثير واقعي",
      "أجواء هادئة ومريحة",
      "تشغيل سهل عبر USB",
      "خيارات متعددة للأقراص"
    ],
    arabicFeatures: [
      "جودة عرض مذهلة وتأثير واقعي",
      "أجواء هادئة ومريحة",
      "تشغيل سهل عبر USB",
      "خيارات متعددة للأقراص"
    ],
    rating: 5,
    stock: 50,
    salesCount: 382
  },
  {
    id: "tv-lighting",
    name: "الإنارة التفاعلية",
    arabicName: "الإنارة التفاعلية",
    category: "lighting",
    price: 159,
    originalPrice: 249,
    image: "/src/assets/images/ambient_tv_lighting_1782560430963.jpg",
    description: "وفرنا لكم إضاءة خلفية تفاعلية للتلفزيون بتجربة مناسبة للأفلام والألعاب.",
    arabicDescription: "وفرنا لكم إضاءة خلفية تفاعلية للتلفزيون بتجربة مناسبة للأفلام والألعاب.",
    features: [
      "تقنية RGBIC Color Sync",
      "تفاعل مع الألوان والصوت",
      "دعم تطبيق الجوال",
      "مثالي لغرف الألعاب والسينما المنزلية"
    ],
    arabicFeatures: [
      "تقنية RGBIC Color Sync",
      "تفاعل مع الألوان والصوت",
      "دعم تطبيق الجوال",
      "مثالي لغرف الألعاب والسينما المنزلية"
    ],
    rating: 5,
    stock: 20,
    salesCount: 194
  },
  {
    id: "youtube-1y",
    name: "اشتراك YouTube - سنة",
    arabicName: "اشتراك YouTube - سنة كاملة",
    category: "subscriptions",
    price: 190,
    originalPrice: 380,
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&q=80",
    description: "مدة سنة كاملة، مشاهدة بدون إعلانات وتفعيل عبر الخطوات المرسلة.",
    arabicDescription: "مدة سنة كاملة، مشاهدة بدون إعلانات وتفعيل عبر الخطوات المرسلة.",
    features: [
      "بدون إعلانات تماماً",
      "تشغيل في الخلفية",
      "تنزيل المقاطع",
      "ضمان كامل"
    ],
    arabicFeatures: [
      "بدون إعلانات تماماً",
      "تشغيل في الخلفية",
      "تنزيل المقاطع",
      "ضمان كامل"
    ],
    rating: 5,
    isSubscription: true,
    stock: 999,
    salesCount: 412
  },
  {
    id: "chatgpt-vip",
    name: "اشتراك ChatGPT - VIP",
    arabicName: "اشتراك ChatGPT - VIP",
    category: "subscriptions",
    price: 30,
    originalPrice: 80,
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=500&q=80",
    description: "تجربة أفضل وتفعيل سريع للوصول إلى مزايا ChatGPT المتقدمة.",
    arabicDescription: "تجربة أفضل وتفعيل سريع للوصول إلى مزايا ChatGPT المتقدمة.",
    features: [
      "وصول لنموذج ذكاء اصطناعي متقدم",
      "ردود أسرع وأكثر دقة",
      "دعم مستمر وتحديثات"
    ],
    arabicFeatures: [
      "وصول لنموذج ذكاء اصطناعي متقدم",
      "ردود أسرع وأكثر دقة",
      "دعم مستمر وتحديثات"
    ],
    rating: 5,
    isSubscription: true,
    stock: 999,
    salesCount: 289
  },
  {
    id: "cloud-storage",
    name: "اشتراك Google One Cloud - سنة",
    arabicName: "اشتراك كلاود تخزيني (Google One)",
    category: "subscriptions",
    price: 59,
    originalPrice: 150,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80",
    description: "مساحة تخزينية سحابية ضخمة لحفظ صورك وملفاتك بأمان تام مع مشاركة عائلية سهلة.",
    arabicDescription: "مساحة تخزينية سحابية ضخمة لحفظ صورك وملفاتك بأمان تام مع مشاركة عائلية سهلة.",
    features: [
      "سعة تخزينية سحابية 200 جيجابايت",
      "نسخ احتياطي تلقائي للصور والملفات",
      "دعم فني متميز ومباشر",
      "إمكانية المشاركة مع 5 أفراد من عائلتك"
    ],
    arabicFeatures: [
      "سعة تخزينية سحابية 200 جيجابايت",
      "نسخ احتياطي تلقائي للصور والملفات",
      "دعم فني متميز ومباشر",
      "إمكانية المشاركة مع 5 أفراد من عائلتك"
    ],
    rating: 5,
    isSubscription: true,
    stock: 999,
    salesCount: 168
  },
  {
    id: "gemini-yearly",
    name: "اشتراك Gemini - سنة",
    arabicName: "اشتراك Gemini Google - سنة كاملة",
    category: "subscriptions",
    price: 150,
    originalPrice: 720,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80",
    description: "اشتراك Gemini Advanced حسب الباقة المتاحة، سنة كاملة من الخدمة والمزايا الذكية المتقدمة.",
    arabicDescription: "اشتراك Gemini Advanced حسب الباقة المتاحة، سنة كاملة من الخدمة والمزايا الذكية المتقدمة.",
    features: [
      "الوصول لأقوى نماذج Google Gemini 1.5 Pro",
      "تكامل ذكي مع Gmail ومستندات Google Docs",
      "مساعد ذكي فائق السرعة",
      "سنة كاملة من المزايا المستمرة"
    ],
    arabicFeatures: [
      "الوصول لأقوى نماذج Google Gemini 1.5 Pro",
      "تكامل ذكي مع Gmail ومستندات Google Docs",
      "مساعد ذكي فائق السرعة",
      "سنة كاملة من المزايا المستمرة"
    ],
    rating: 5,
    isSubscription: true,
    stock: 999,
    salesCount: 312
  },
  {
    id: "canva-pro",
    name: "اشتراك Canva",
    arabicName: "اشتراك Canva Pro",
    category: "subscriptions",
    price: 25,
    originalPrice: 180,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80",
    description: "الوصول لجميع القوالب والتصاميم المدفوعة وإزالة الخلفيات بلمسة واحدة لعمل تصاميم احترافية.",
    arabicDescription: "الوصول لجميع القوالب والتصاميم المدفوعة وإزالة الخلفيات بلمسة واحدة لعمل تصاميم احترافية.",
    features: [
      "ملايين القوالب والتصاميم المتميزة والخطوط الفاخرة",
      "إزالة خلفيات الصور والفيديوهات بلمسة واحدة بذكاء",
      "مساحة تخزين سحابية Canva Cloud لحفظ أعمالك",
      "تحميل التصاميم بأعلى دقة وبصيغ شفافة"
    ],
    arabicFeatures: [
      "ملايين القوالب والتصاميم المتميزة والخطوط الفاخرة",
      "إزالة خلفيات الصور والفيديوهات بلمسة واحدة بذكاء",
      "مساحة تخزين سحابية Canva Cloud لحفظ أعمالك",
      "تحميل التصاميم بأعلى دقة وبصيغ شفافة"
    ],
    rating: 5,
    isSubscription: true,
    stock: 999,
    salesCount: 512
  }
];
