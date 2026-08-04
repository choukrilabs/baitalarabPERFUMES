export type Language = 'ar' | 'fr';

export interface Translations {
  [key: string]: {
    ar: string;
    fr: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Navigation & Header
  'nav.home': { ar: 'الرئيسية', fr: 'Accueil' },
  'nav.catalog': { ar: 'الكتالوج والمنتجات', fr: 'Catalogue' },
  'nav.products': { ar: 'تصفّح المنتجات', fr: 'Nos Produits' },
  'nav.about': { ar: 'عن المتجر', fr: 'À Propos' },
  'nav.contact': { ar: 'العنوان والتواصل', fr: 'Contact & Accès' },
  'nav.offers': { ar: 'العروض الخاصة', fr: 'Offres Spéciales' },
  'nav.wholesale': { ar: 'البيع بالجملة', fr: 'Vente en Gros' },
  'nav.search_placeholder': { ar: 'ابحث عن عطور، عود، مسك، بخور، زيوت...', fr: 'Rechercher parfum, oud, musc, bakhoor...' },
  'nav.google_review': { ar: 'تقييم جوجل', fr: 'Avis Google' },
  'nav.wishlist': { ar: 'المفضلة', fr: 'Favoris' },
  'nav.cart': { ar: 'سلة الطلبات', fr: 'Panier' },
  'nav.account': { ar: 'حسابي', fr: 'Mon Compte' },
  'nav.my_account': { ar: 'حسابي', fr: 'Mon Compte' },
  'nav.login_register': { ar: 'دخول / تسجيل', fr: 'Connexion' },
  'nav.admin': { ar: 'لوحة الإدارة', fr: 'Administration' },
  'nav.language': { ar: 'اللغة', fr: 'Langue' },
  'nav.lang_switch_label': { ar: 'اللغة', fr: 'Langue' },
  'nav.neighborhood': { ar: 'حي الحبوس التاريخي', fr: 'Quartier Habous Historique' },
  'nav.habous_store': { ar: 'متجرنا بالحبوس، الدار البيضاء', fr: 'Boutique aux Habous, Casablanca' },
  'nav.delivery_morocco': { ar: 'توصيل لجميع مدن المغرب والدفع عند الاستلام', fr: 'Livraison au Maroc & Paiement à la réception' },

  // Hero Section
  'hero.badge': { ar: 'من قلب حي الحبوس العريق • الدار البيضاء', fr: 'Au Cœur du Quartier Historique des Habous • Casablanca' },
  'hero.title_brand': { ar: 'عطور بيت العرب', fr: 'Parfums Bait Al Arab' },
  'hero.title_sub': { ar: 'بيت العرب', fr: 'Bait Al Arab' },
  'hero.description': {
    ar: 'وجهتكم الأولى لأفخر أنواع العود والعطور الشرقية الأصيلة، والبخور والزيوت الطبيعية، بالإضافة إلى تشكيلة مختارة من الملابس.',
    fr: 'Votre destination d’exception pour les parfums orientaux authentiques, oud précieux, encens de luxe, huiles pures et prêt-à-porter traditionnel.',
  },
  'hero.desc': {
    ar: 'وجهتكم الأولى لأفخر أنواع العود والعطور الشرقية الأصيلة، والبخور والزيوت الطبيعية، بالإضافة إلى تشكيلة مختارة من الملابس.',
    fr: 'Votre destination d’exception pour les parfums orientaux authentiques, oud précieux, encens de luxe, huiles pures et prêt-à-porter traditionnel.',
  },
  'hero.feature_1': { ar: 'عطور ثابته وأصيلة', fr: 'Parfums Authentiques & Longue Tenue' },
  'hero.feat_perfumes': { ar: 'عطور ثابته وأصيلة', fr: 'Parfums Authentiques & Longue Tenue' },
  'hero.feature_2': { ar: 'زيوت طبيعية وبخور', fr: 'Huiles Pures & Bakhoor Précieux' },
  'hero.feat_oils': { ar: 'زيوت طبيعية وبخور', fr: 'Huiles Pures & Bakhoor Précieux' },
  'hero.feature_3': { ar: 'بيع بالجملة والتفصيل', fr: 'Vente en Gros & Détail' },
  'hero.feat_wholesale': { ar: 'بيع بالجملة والتفصيل', fr: 'Vente en Gros & Détail' },
  'hero.whatsapp_trust': {
    ar: 'اطلب عبر واتساب — نؤكد التوصيل لمدينتك قبل الدفع',
    fr: 'Commandez par WhatsApp — Confirmation & Livraison partout au Maroc',
  },
  'trust.badge': {
    ar: 'اطلب عبر واتساب — نؤكد التوصيل لمدينتك قبل الدفع',
    fr: 'Commandez par WhatsApp — Confirmation & Livraison partout au Maroc',
  },
  'hero.cta_explore': { ar: 'تصفّح التشكيلة الكاملة', fr: 'Découvrir la Collection' },
  'hero.cta_whatsapp': { ar: 'تواصل عبر واتساب', fr: 'Commander par WhatsApp' },
  'hero.follow_us': { ar: 'تابعونا على:', fr: 'Suivez-nous sur :' },
  'hero.instagram': { ar: 'انستغرام', fr: 'Instagram' },
  'hero.facebook': { ar: 'فيسبوك', fr: 'Facebook' },
  'hero.showcase_tag': { ar: 'مجموعة العود والمسك', fr: 'Collection Oud & Musc' },
  'hero.showcase_title': { ar: 'مجموعة العود والمسك', fr: 'Collection Oud & Musc' },
  'hero.showcase_badge': { ar: 'أصلي 100%', fr: '100% Authentique' },
  'hero.showcase_loc': { ar: 'حي الحبوس • الدار البيضاء', fr: 'Quartier Habous • Casablanca' },
  'hero.showcase_sub': { ar: 'زنقة مولاي إسماعيل، متجر عطور بيت العرب', fr: 'Rue Moulay Ismaïl, Parfumerie Bait Al Arab' },

  // Promotional Banner & Special Offers
  'banner.badge': { ar: '✨ عرض حصري لفترة محدودة', fr: '✨ Offre Exclusive Limitée' },
  'banner.headline': {
    ar: 'تخفيضات خاصة تصل إلى 30% على أرقى تشكيلات العطور الشرقية ودهن العود الملكي!',
    fr: 'Jusqu’à -30% sur nos collections de parfums orientaux et dahn oud royal !',
  },
  'banner.subtext': {
    ar: 'استفد من تخفيض فوري وتوصيل سريع مع إمكانية الدفع عند الاستلام لجميع مدن المغرب.',
    fr: 'Profitez d’une remise immédiate et d’une livraison rapide avec paiement à la livraison au Maroc.',
  },
  'banner.cta': { ar: 'تسوق العروض الآن', fr: 'Découvrir les Offres' },
  'banner.countdown': { ar: 'ينتهي العرض قريباً', fr: 'Offre bientôt terminée' },
  'banner.title_section': { ar: 'الشريط الترويجي والعروض الخاصة', fr: 'Bannière promotionnelle & Offres spéciales' },
  'banner.tab_name': { ar: 'الشريط الترويجي والعروض', fr: 'Bannière Promo & Offres' },
  'banner.close_aria': { ar: 'إغلاق الإعلان الترويجي', fr: 'Fermer l’offre promotionnelle' },
  'banner.exclusive_aria': { ar: 'إعلان ترويجي وعروض خاصة', fr: 'Offre promotionnelle exclusive' },

  // Categories
  'category.all': { ar: 'جميع المنتجات', fr: 'Tous les Produits' },
  'category.all_desc': { ar: 'تصفح تشكيلتنا الكاملة من عطور، بخور، زيوت طبيعية وملابس', fr: 'Découvrez toute notre collection de parfums, encens, huiles et vêtements' },
  'category.perfumes': { ar: 'العطور والروائح', fr: 'Parfums & Senteurs' },
  'category.perfumes_desc': { ar: 'دهن عود كمبودي، عنبر فاخر، ومسك أصيل برائحة تدوم طويلاً', fr: 'Oud cambodgien pur, ambre précieux et musc oriental longue tenue' },
  'category.incense': { ar: 'البخور', fr: 'Encens & Bakhoor' },
  'category.incense_desc': { ar: 'بخور عود فاخر، بخور مسك وعنبر للمنازل والمناسبات', fr: 'Bakhoor d’oud royal, encens musc et ambre pour maisons et réceptions' },
  'category.clothes': { ar: 'الملابس', fr: 'Vêtements Traditionnels' },
  'category.clothes_desc': { ar: 'تشكيلة مختارة من الملابس المتنوعة', fr: 'Collection raffinée de vêtements et tenues traditionnelles' },
  'category.oils': { ar: 'الزيوت الطبيعية', fr: 'Huiles Naturelles' },
  'category.oils_desc': { ar: 'زيوت طبيعية أصلية للعناية بالجسم والشعر', fr: 'Huiles pures et bienfaisantes pour le corps et les cheveux' },
  'category.wholesale': { ar: 'البيع بالجملة', fr: 'Vente en Gros' },
  'category.wholesale_desc': { ar: 'عطور شرقية، بخور، وزيوت طبيعية بالجملة للشركات مع ضمان الجودة العالية', fr: 'Parfums, bakhoor et huiles en gros pour professionnels' },
  'category.other': { ar: 'منتجات أخرى', fr: 'Autres Articles' },
  'category.other_desc': { ar: 'مباخر تقليدية ومنتجات متنوعة أخرى', fr: 'Brûleurs d’encens traditionnels et accessoires' },
  'category.browse_title': { ar: 'تصفّح حسب القسم', fr: 'Explorer par Catégorie' },
  'category.product_unit': { ar: 'منتج', fr: 'produit' },
  'category.products_unit': { ar: 'منتجات', fr: 'produits' },

  // Filters & Sorting
  'filter.title': { ar: 'تصفية وبحث متقدم', fr: 'Filtres & Tri' },
  'filter.sort_by': { ar: 'ترتيب حسب', fr: 'Trier par' },
  'filter.sort_featured': { ar: 'الأكثر تميزاً وشهرة', fr: 'En Vedette' },
  'filter.sort_price_asc': { ar: 'السعر: من الأقل إلى الأعلى', fr: 'Prix : Croissant' },
  'filter.sort_price_desc': { ar: 'السعر: من الأعلى إلى الأقل', fr: 'Prix : Décroissant' },
  'filter.sort_rating': { ar: 'التقييم الأعلى', fr: 'Mieux Notés' },
  'filter.sort_newest': { ar: 'الأحدث إضافة', fr: 'Nouveautés' },
  'filter.gender': { ar: 'الفئة / الاستخدام', fr: 'Genre / Utilisation' },
  'filter.gender_all': { ar: 'الكل', fr: 'Tous' },
  'filter.gender_men': { ar: 'رجالي', fr: 'Homme' },
  'filter.gender_women': { ar: 'نسائي', fr: 'Femme' },
  'filter.gender_unisex': { ar: 'للجنسين', fr: 'Unisexe' },
  'filter.price_range': { ar: 'النطاق السعري', fr: 'Gamme de Prix' },
  'filter.price_all': { ar: 'جميع الأسعار', fr: 'Tous les prix' },
  'filter.price_under150': { ar: 'أقل من 150 درهم', fr: 'Moins de 150 DH' },
  'filter.price_150_300': { ar: '150 - 300 درهم', fr: '150 à 300 DH' },
  'filter.price_300_600': { ar: '300 - 600 درهم', fr: '300 à 600 DH' },
  'filter.price_above600': { ar: 'أكثر من 600 درهم', fr: 'Plus de 600 DH' },
  'filter.price_custom': { ar: 'سعر مخصص', fr: 'Personnalisé' },
  'filter.min': { ar: 'الحد الأدنى', fr: 'Min' },
  'filter.max': { ar: 'الحد الأقصى', fr: 'Max' },
  'filter.apply': { ar: 'تطبيق', fr: 'Appliquer' },
  'filter.availability': { ar: 'حالة التوفر والعروض', fr: 'Disponibilité & Promotions' },
  'filter.avail_all': { ar: 'الكل', fr: 'Tous' },
  'filter.avail_instock': { ar: 'متوفر بالمخزن فقط', fr: 'En stock uniquement' },
  'filter.avail_onsale': { ar: 'العروض والتخفيضات فقط', fr: 'En promotion uniquement' },
  'filter.type': { ar: 'نوع المنتج بالتفصيل', fr: 'Type de produit' },
  'filter.all_types': { ar: 'جميع الأنواع', fr: 'Tous les types' },
  'filter.reset': { ar: 'إعادة ضبط الفلاتر', fr: 'Réinitialiser les filtres' },
  'filter.results_count': { ar: 'عرض {count} من أصل {total} منتج', fr: 'Affichage de {count} sur {total} produit(s)' },
  'filter.no_results': { ar: 'لا توجد منتجات مطابقة للبحث', fr: 'Aucun produit ne correspond à votre recherche' },
  'filter.no_results_desc': { ar: 'جرب تغيير خيارات التصفية أو البحث عن كلمة أخرى.', fr: 'Essayez d’ajuster vos filtres ou de rechercher un autre mot-clé.' },
  'filter.active_filters': { ar: 'الفلاتر النشطة', fr: 'Filtres actifs' },
  'filter.toggle_filters': { ar: 'فلاتر البحث', fr: 'Filtres' },

  // Product Card & Actions
  'product.add_to_cart': { ar: 'أضف للسلة', fr: 'Ajouter au Panier' },
  'product.in_cart': { ar: 'في السلة', fr: 'Dans le Panier' },
  'product.out_of_stock': { ar: 'نفد من المخزن', fr: 'Épuisé' },
  'product.in_stock': { ar: 'متوفر بالمخزن', fr: 'En Stock' },
  'product.featured': { ar: 'مميز', fr: 'Vedette' },
  'product.discount': { ar: 'تخفيض', fr: 'Promo' },
  'product.quick_view': { ar: 'عرض التفاصيل', fr: 'Voir Détails' },
  'product.order_whatsapp': { ar: 'طلب سريع عبر واتساب', fr: 'Commander par WhatsApp' },
  'product.inquire_whatsapp': { ar: 'استفسار عن التوفر', fr: 'Demander la disponibilité' },
  'product.free_delivery': { ar: 'توصيل لجميع مدن المغرب', fr: 'Livraison partout au Maroc' },
  'product.cash_on_delivery': { ar: 'الدفع عند الاستلام', fr: 'Paiement à la livraison' },
  'product.quality_guarantee': { ar: 'أصلي ومضمون 100%', fr: 'Authentique & Garanti 100%' },
  'product.notes': { ar: 'المكونات والنوتات العطرية:', fr: 'Notes Olfactives :' },
  'product.volume': { ar: 'الحجم / السعة:', fr: 'Contenance :' },
  'product.type': { ar: 'نوع المنتج:', fr: 'Type de Produit :' },
  'product.reviews': { ar: 'تقييمات الزبائن', fr: 'Avis Clients' },
  'product.add_review': { ar: 'أضف تقييمك', fr: 'Laisser un avis' },
  'product.share': { ar: 'مشاركة الرابط', fr: 'Partager' },
  'product.link_copied': { ar: 'تم نسخ الرابط بنجاح!', fr: 'Lien copié dans le presse-papiers !' },
  'product.related': { ar: 'منتجات ذات صلة', fr: 'Produits Similaires' },
  'product.back_to_catalog': { ar: 'العودة للمتجر', fr: 'Retour au Catalogue' },
  'product.quantity': { ar: 'الكمية:', fr: 'Quantité :' },
  'product.total': { ar: 'المجموع:', fr: 'Total :' },
  'product.ask_question': { ar: 'اسأل عن العطر عبر واتساب', fr: 'Poser une question via WhatsApp' },
  'product.rate_product': { ar: 'تقييم المنتج', fr: 'Évaluer le produit' },
  'product.write_review': { ar: 'اكتب رأيك وتجربتك...', fr: 'Partagez votre expérience...' },
  'product.your_name': { ar: 'اسمك الكريم', fr: 'Votre nom' },
  'product.submit_review': { ar: 'إرسال التقييم', fr: 'Publier mon avis' },
  'product.no_reviews': { ar: 'لا توجد تقييمات بعد. كن أول من يقيّم هذا المنتج!', fr: 'Aucun avis pour l’instant. Soyez le premier à donner votre avis !' },

  // Cart Drawer
  'cart.title': { ar: 'سلة الطلبات', fr: 'Votre Panier' },
  'cart.empty_title': { ar: 'سلتك فارغة حالياً', fr: 'Votre panier est vide' },
  'cart.empty_desc': { ar: 'تصفح تشكيلة عطور بيت العرب وأضف ما ينال إعجابك لإتمام الطلب.', fr: 'Découvrez la collection Bait Al Arab et ajoutez vos parfums préférés.' },
  'cart.browse_now': { ar: 'ابدأ التسوق الآن', fr: 'Commencer vos achats' },
  'cart.items_count': { ar: '{count} منتج في السلة', fr: '{count} article(s) dans le panier' },
  'cart.subtotal': { ar: 'مجموع المنتجات:', fr: 'Sous-total :' },
  'cart.delivery': { ar: 'التوصيل:', fr: 'Livraison :' },
  'cart.delivery_morocco': { ar: 'توصيل سريع لجميع المدن المغربية', fr: 'Livraison rapide partout au Maroc' },
  'cart.total': { ar: 'المجموع الكلي:', fr: 'Total TTC :' },
  'cart.checkout_whatsapp': { ar: 'إتمام الطلب عبر واتساب', fr: 'Valider la commande sur WhatsApp' },
  'cart.checkout_notice': { ar: 'سيتم إرسال سلتك المحددة مباشرة إلى فريقنا لتأكيد التوصيل', fr: 'Votre panier sera transmis directement sur WhatsApp pour confirmation et livraison.' },
  'cart.clear': { ar: 'تفريغ السلة', fr: 'Vider le panier' },
  'cart.saved_addresses': { ar: 'عناوين التوصيل المحفوظة', fr: 'Adresses enregistrées' },
  'cart.enter_address': { ar: 'بيانات التوصيل (اختياري)', fr: 'Informations de livraison' },
  'cart.name': { ar: 'الاسم الكامل', fr: 'Nom complet' },
  'cart.phone': { ar: 'رقم الهاتف', fr: 'Numéro de téléphone' },
  'cart.city': { ar: 'المدينة', fr: 'Ville' },
  'cart.street': { ar: 'العنوان / الحي', fr: 'Adresse / Quartier' },
  'cart.guest_checkout': { ar: 'إتمام الطلب بدون تسجيل', fr: 'Commander en tant qu’invité' },
  'cart.trust_sub': { ar: 'الدفع عند الاستلام مع فحص الطلب عند التسليم', fr: 'Paiement à la livraison avec vérification du colis' },
  'cart.order_fast_delivery': { ar: 'تأكيد سريع وتوصيل لجميع المدن', fr: 'Confirmation express et livraison partout au Maroc' },
  'cart.per_unit': { ar: 'درهم / حبة', fr: 'DH / unité' },
  'cart.change_address': { ar: 'تغيير العنوان', fr: 'Changer d’adresse' },
  'cart.hide_addresses': { ar: 'إخفاء العناوين', fr: 'Masquer les adresses' },
  'cart.no_addresses': { ar: 'لم تحفظ أي عنوان بعد في حسابك. يمكنك إضافة عنوان سريع:', fr: 'Aucune adresse enregistrée. Saisissez votre adresse ci-dessous :' },
  'cart.have_account': { ar: 'هل لديك حساب؟ سجّل الدخول لاستخدام عناوينك المحفوظة', fr: 'Vous avez un compte ? Connectez-vous pour utiliser vos adresses' },
  'cart.directing_whatsapp': { ar: 'جاري توجيهك إلى واتساب لتأكيد الطلب...', fr: 'Redirection vers WhatsApp pour confirmer votre commande...' },
  'cart.item_removed': { ar: 'تم حذف {name} من السلة', fr: '{name} a été retiré du panier' },
  'cart.cart_cleared': { ar: 'تم تفريغ سلة الطلبات', fr: 'Votre panier a été vidé' },
  'cart.selected_address': { ar: 'تم اختيار عنوان: {title}', fr: 'Adresse sélectionnée : {title}' },
  'cart.send_whatsapp_btn': { ar: 'تأكيد وإرسال الطلب بالواتساب ({count})', fr: 'Confirmer la commande sur WhatsApp ({count})' },
  'cart.guest_title': { ar: 'عنوان التوصيل', fr: 'Adresse de livraison' },
  'cart.guest_customer': { ar: 'العميل', fr: 'Client' },

  // Wishlist Drawer
  'wishlist.title': { ar: 'قائمة المفضلة', fr: 'Mes Favoris' },
  'wishlist.empty_title': { ar: 'قائمة المفضلة فارغة', fr: 'Aucun favori pour le moment' },
  'wishlist.empty_desc': { ar: 'اضغط على رمز القلب لحفظ المنتجات التي تعجبك هنا للرجوع إليها لاحقاً.', fr: 'Cliquez sur l’icône cœur pour conserver vos coups de cœur.' },
  'wishlist.add_all': { ar: 'إضافة الكل إلى السلة', fr: 'Tout ajouter au panier' },
  'wishlist.items_count': { ar: '{count} منتج في المفضلة', fr: '{count} article(s) favori(s)' },
  'wishlist.item_removed': { ar: 'تم حذف {name} من المفضلة', fr: '{name} a été retiré des favoris' },
  'wishlist.added_to_cart': { ar: 'تمت إضافة {name} إلى السلة', fr: '{name} ajouté au panier' },
  'wishlist.all_added_to_cart': { ar: 'تمت إضافة جميع المفضلة إلى السلة ({count})', fr: 'Tous les favoris ajoutés au panier ({count})' },
  'wishlist.browse_collection': { ar: 'تصفح التشكيلة', fr: 'Explorer la Collection' },

  // About Section
  'about.badge': { ar: 'عن متجر عطور بيت العرب', fr: 'À Propos de Bait Al Arab' },
  'about.title': { ar: 'أصالة العطور الشرقية ودفء الأصالة المغربية في حي الحبوس العريق', fr: 'L’Authenticité des Parfums d’Orient et la Tradition Marocaine aux Habous' },
  'about.p1': {
    ar: 'في قلب أزقة حي الحبوس التاريخي بالدار البيضاء، تأسست محلات عطور بيت العرب لتكون العنوان الأول لكل من يبحث عن الجودة والتميز. نجمع لكم في متجرنا أرقى أصناف العود والعطور الشرقية، إلى جانب تشكيلة فاخرة من الملابس والزيوت الطبيعية والبخور.',
    fr: 'Au cœur des ruelles historiques du quartier des Habous à Casablanca, la maison Parfums Bait Al Arab est la référence incontournable de l’élégance et de la tradition. Nous sélectionnons pour vous les plus nobles essences de oud, ambre, musc, encens précieux, huiles bienfaisantes et tenues traditionnelles.',
  },
  'about.p2': {
    ar: 'نحن نرحب بزوارنا الكرام ومحبي الفخامة، ونوفر جميع منتجاتنا للبيع بالجملة والتفصيل مع إمكانية التوصيل المباشر والتواصل عبر الواتساب.',
    fr: 'Nous accueillons chaleureusement les amateurs de raffinement et proposons nos gammes au détail comme en gros, avec expédition rapide partout au Maroc.',
  },
  'about.loc_tag': { ar: 'متجرنا العريق في الدار البيضاء', fr: 'Notre boutique à Casablanca' },
  'about.loc_sub': { ar: 'زنقة مولاي إسماعيل، حي الحبوس التاريخي', fr: 'Rue Moulay Ismaïl, Quartier des Habous' },

  // Location & Contact
  'contact.badge': { ar: 'زورونا أو تواصلوا معنا', fr: 'Visitez-nous ou Contactez-nous' },
  'contact.title': { ar: 'موقع المتجر ووسائل التواصل', fr: 'Adresse & Contact' },
  'contact.desc': {
    ar: 'يسعدنا استقبالكم في متجرنا بالحبوس بالدار البيضاء، أو الإجابة على استفساراتكم عبر الواتساب ومواقع التواصل الاجتماعي.',
    fr: 'Nous sommes ravis de vous accueillir dans notre boutique aux Habous à Casablanca ou de répondre à vos messages via WhatsApp et réseaux sociaux.',
  },
  'contact.address_title': { ar: 'عنوان المتجر', fr: 'Adresse de la Boutique' },
  'contact.phone_title': { ar: 'الهاتف والواتساب المباشر', fr: 'Téléphone & WhatsApp' },
  'contact.phone_sub': { ar: 'متاح للطلبات والاستفسارات يومياً', fr: 'Disponible 7j/7 pour commandes et conseils' },
  'contact.email_title': { ar: 'البريد الإلكتروني', fr: 'E-mail' },
  'contact.hours_title': { ar: 'أوقات العمل', fr: 'Horaires d’Ouverture' },
  'contact.hours_val': { ar: 'يومياً: من 9:00 صباحاً حتى 8:30 مساءً', fr: 'Tous les jours : de 09h00 à 20h30' },
  'contact.socials': { ar: 'حساباتنا الرسمية على مواقع التواصل:', fr: 'Nos Réseaux Sociaux :' },
  'contact.instagram': { ar: 'إنستغرام', fr: 'Instagram' },
  'contact.facebook': { ar: 'فيسبوك', fr: 'Facebook' },
  'contact.msg_whatsapp': { ar: 'مراسلة عبر الواتساب المباشر', fr: 'Message direct sur WhatsApp' },
  'contact.open_maps': { ar: 'فتح في خرائط جوجل (Google Maps)', fr: 'Ouvrir dans Google Maps' },
  'contact.google_rate': { ar: 'تقييمنا على جوجل', fr: 'Nos avis sur Google' },

  // Footer
  'footer.about': {
    ar: 'متجر متخصص في عطور العود والمسك الشرقية الفاخرة، بالإضافة إلى تشكيلة مختارة من البخور والزيوت الطبيعية والملابس من قلب حي الحبوس بالدار البيضاء.',
    fr: 'Boutique de référence spécialisée dans les parfums d’oud, musc oriental, bakhoor, huiles pures et tenues traditionnelles au cœur des Habous, Casablanca.',
  },
  'footer.quick_links': { ar: 'روابط سريعة', fr: 'Liens Rapides' },
  'footer.contact_us': { ar: 'تواصل معنا', fr: 'Contactez-nous' },
  'footer.rights': { ar: 'جميع الحقوق محفوظة.', fr: 'Tous droits réservés.' },
  'footer.currency': { ar: 'درهم مغربي (MAD)', fr: 'Dirham Marocain (MAD)' },

  // Floating WhatsApp
  'whatsapp.need_help': { ar: 'هل تحتاج مساعدة في اختيار عطر؟', fr: 'Besoin d’aide pour choisir un parfum ?' },
  'whatsapp.chat_now': { ar: 'تحدث معنا مباشرة عبر واتساب', fr: 'Discutez avec nous sur WhatsApp' },

  // Auth & Profile
  'auth.login': { ar: 'تسجيل الدخول', fr: 'Connexion' },
  'auth.register': { ar: 'إنشاء حساب جديد', fr: 'Créer un compte' },
  'auth.email': { ar: 'البريد الإلكتروني', fr: 'Adresse e-mail' },
  'auth.password': { ar: 'كلمة المرور', fr: 'Mot de passe' },
  'auth.name': { ar: 'الاسم الكامل', fr: 'Nom complet' },
  'auth.google_login': { ar: 'الدخول بحساب Google', fr: 'Continuer avec Google' },
  'auth.guest_continue': { ar: 'متابعة كزائر', fr: 'Continuer en tant qu’invité' },
  'profile.title': { ar: 'حسابي وعناويني', fr: 'Mon Profil & Adresses' },
  'profile.my_orders': { ar: 'سجل طلباتي', fr: 'Historique des Commandes' },
  'profile.addresses': { ar: 'دفتر العناوين', fr: 'Mes Adresses' },
  'profile.add_address': { ar: 'إضافة عنوان جديد', fr: 'Ajouter une adresse' },
  'profile.logout': { ar: 'تسجيل الخروج', fr: 'Déconnexion' },

  // Currency
  'currency': { ar: 'د.م', fr: 'DH' },
};

// Helper dictionary for Moroccan Cities French mapping
export const MOROCCAN_CITIES_FR: Record<string, string> = {
  'الدار البيضاء': 'Casablanca',
  'الرباط': 'Rabat',
  'مراكش': 'Marrakech',
  'فاس': 'Fès',
  'طنجة': 'Tanger',
  'أكادير': 'Agadir',
  'مكناس': 'Meknès',
  'وجدة': 'Oujda',
  'القنيطرة': 'Kénitra',
  'تطوان': 'Tétouan',
  'تمارة': 'Témara',
  'سلا': 'Salé',
  'الجديدة': 'El Jadida',
  'المحمدية': 'Mohammédia',
  'بني ملال': 'Béni Mellal',
  'خريبكة': 'Khouribga',
  'آسفي': 'Safi',
  'الناظور': 'Nador',
  'سطات': 'Settat',
  'الصويرة': 'Essaouira',
  'العيون': 'Laâyoune',
  'الداخلة': 'Dakhla',
  'ورزازات': 'Ouarzazate',
  'تارودانت': 'Taroudant',
  'أخرى': 'Autre',
};

// Product attributes dictionary for automatic French translation of perfume terms
export const PERFUME_TERMS_FR: Record<string, string> = {
  'ماء عطر فاخر': 'Eau de Parfum de Luxe',
  'دهن عود وزيت': 'Dahn Oud & Huile Pure',
  'بخور ومبخرة': 'Bakhoor & Encens',
  'أزياء تقليدية': 'Prêt-à-Porter Traditionnel',
  'زيوت طبيعية': 'Huiles Naturelles Pures',
  'قطعة واحدة': '1 Pièce',
  '100 مل': '100 ml',
  '50 مل': '50 ml',
  '30 مل': '30 ml',
  '12 مل (تولة)': '12 ml (Tola)',
  '6 مل (نصف تولة)': '6 ml (1/2 Tola)',
  '3 مل (ربع تولة)': '3 ml (1/4 Tola)',
  '1 كجم': '1 kg',
  '500 غرام': '500 g',
  '250 غرام': '250 g',
  'عود كمبودي': 'Oud Cambodgien',
  'مسك أبيض': 'Musc Blanc',
  'عنبر': 'Ambre Oriental',
  'ورد طائفي': 'Rose de Taïf',
  'خشب الصندل': 'Bois de Santal',
  'زعفران': 'Safran Pur',
  'ياسمين': 'Jasmin',
  'فانيلا': 'Vanille Gourmande',
  'مسك أسود': 'Musc Noir',
  'باتشولي': 'Patchouli',
  'هيل': 'Cardamome',
  'جلد ملكي': 'Cuir Royal',
  'زهور بيضاء': 'Fleurs Blanches',
  'بخور العود': 'Bakhoor Oud',
};

// Promotional Banner bilingual translation dictionary for presets & custom text
export const PROMO_BANNER_TRANSLATIONS_DICT: {
  arToFr: Record<string, string>;
  frToAr: Record<string, string>;
} = {
  arToFr: {
    '✨ عرض حصري لفترة محدودة': '✨ Offre Exclusive Limitée',
    '✨ عرض حصري 30%': '✨ Offre Exclusive -30%',
    '👑 دهن العود والمسك': '👑 Dehn Al Oud & Musc Royal',
    '🔥 عرض نهاية الأسبوع': '🔥 Offre Spéciale Week-end',
    '🚚 شحن مجاني': '🚚 Livraison Gratuite',
    'تخفيضات خاصة تصل إلى 30% على أرقى تشكيلات العطور الشرقية ودهن العود الملكي!':
      'Jusqu’à -30% sur nos collections de parfums orientaux et dahn oud royal !',
    'تخفيضات تصل إلى 30% على أرقى تشكيلات العطور الشرقية الملكية!':
      'Jusqu’à 30% de réduction sur les plus prestigieuses collections de parfums royaux !',
    'عرض خاص على أرقى أدهان العود الكمبودي والمسك الصافي الفاخر!':
      'Offre spéciale sur les meilleurs Dehn Al Oud cambodgiens et musc pur !',
    'خصم خاص 20% إضافي على مجموعات العطور والمخلطات المميزة!':
      'Remise spéciale supplémentaire de 20% sur les coffrets de parfums exclusifs !',
    'توصيل مجاني لجميع مدن المغرب + هدية عينة مسك مع كل طلبية تفوق 300 درهم!':
      'Livraison gratuite partout au Maroc + échantillon de musc dès 300 DH !',
    'استفد من تخفيض فوري وتوصيل سريع مع إمكانية الدفع عند الاستلام لجميع مدن المغرب.':
      'Profitez d’une remise immédiate et d’une livraison rapide avec paiement à la livraison au Maroc.',
    'شحن سريع لجميع مدن المغرب مع إمكانية الدفع عند الاستلام.':
      'Livraison rapide partout au Maroc avec paiement sécurisé à la livraison.',
    'ضمان الجودة والثبات العالي مع عينات مجانية مع كل طلبية.':
      'Qualité garantie et haute tenue avec échantillons offerts pour chaque commande.',
    'تغليف هدايا فاخر وبطاقة إهداء مخصصة مجاناً.':
      'Emballage cadeau luxueux et carte personnalisée offerts.',
    'الدفع عند الاستلام بعد فحص الطلبية.':
      'Paiement à la livraison après inspection de votre colis.',
    'تسوق العروض الآن': 'Découvrir les Offres',
    'استكشف تشكيلة العود والزيوت': 'Explorer Oud & Huiles',
    'شاهد مجموعات العطور': 'Voir les Coffrets',
    'تسوق جميع التشكيلات': 'Voir tout le Catalogue',
    'ينتهي العرض قريباً': 'Offre bientôt terminée',
    'الكمية محدودة جداً': 'Quantités très limitées',
    'ساري حتى مساء الأحد': 'Jusqu’à dimanche',
    'عرض هذا الأسبوع': 'Offre de la semaine',
  },
  frToAr: {
    '✨ Offre Exclusive Limitée': '✨ عرض حصري لفترة محدودة',
    '✨ Offre Exclusive -30%': '✨ عرض حصري 30%',
    '👑 Dehn Al Oud & Musc Royal': '👑 دهن العود والمسك',
    '👑 Dehn Al Oud & Musc': '👑 دهن العود والمسك',
    '🔥 Offre Spéciale Week-end': '🔥 عرض نهاية الأسبوع',
    '🔥 Offre Week-end': '🔥 عرض نهاية الأسبوع',
    '🚚 Livraison Gratuite': '🚚 شحن مجاني',
    'Jusqu’à -30% sur nos collections de parfums orientaux et dahn oud royal !':
      'تخفيضات خاصة تصل إلى 30% على أرقى تشكيلات العطور الشرقية ودهن العود الملكي!',
    'Jusqu’à 30% de réduction sur les plus prestigieuses collections de parfums royaux !':
      'تخفيضات تصل إلى 30% على أرقى تشكيلات العطور الشرقية الملكية!',
    'Offre spéciale sur les meilleurs Dehn Al Oud cambodgiens et musc pur !':
      'عرض خاص على أرقى أدهان العود الكمبودي والمسك الصافي الفاخر!',
    'Remise spéciale supplémentaire de 20% sur les coffrets de parfums exclusifs !':
      'خصم خاص 20% إضافي على مجموعات العطور والمخلطات المميزة!',
    'Livraison gratuite partout au Maroc + échantillon de musc dès 300 DH !':
      'توصيل مجاني لجميع مدن المغرب + هدية عينة مسك مع كل طلبية تفوق 300 درهم!',
    'Profitez d’une remise immédiate et d’une livraison rapide avec paiement à la livraison au Maroc.':
      'استفد من تخفيض فوري وتوصيل سريع مع إمكانية الدفع عند الاستلام لجميع مدن المغرب.',
    'Livraison rapide partout au Maroc avec paiement sécurisé à la livraison.':
      'شحن سريع لجميع مدن المغرب مع إمكانية الدفع عند الاستلام.',
    'Qualité garantie et haute tenue avec échantillons offerts pour chaque commande.':
      'ضمان الجودة والثبات العالي مع عينات مجانية مع كل طلبية.',
    'Emballage cadeau luxueux et carte personnalisée offerts.':
      'تغليف هدايا فاخر وبطاقة إهداء مخصصة مجاناً.',
    'Paiement à la livraison après inspection de votre colis.':
      'الدفع عند الاستلام بعد فحص الطلبية.',
    'Découvrir les Offres': 'تسوق العروض الآن',
    'Découvrir les offres': 'تسوق العروض الآن',
    'Explorer Oud & Huiles': 'استكشف تشكيلة العود والزيوت',
    'Voir les Coffrets': 'شاهد مجموعات العطور',
    'Voir les coffrets': 'شاهد مجموعات العطور',
    'Voir tout le Catalogue': 'تسوق جميع التشكيلات',
    'Voir tout le catalogue': 'تسوق جميع التشكيلات',
    'Offre bientôt terminée': 'ينتهي العرض قريباً',
    'Quantités très limitées': 'الكمية محدودة جداً',
    'Jusqu’à dimanche': 'ساري حتى مساء الأحد',
    'Offre de la semaine': 'عرض هذا الأسبوع',
  },
};

/**
 * Intelligent helper to auto-translate promo banner fields between French and Arabic
 */
export function translateBannerText(text: string | undefined, isFrench: boolean): string {
  if (!text) return '';
  const trimmed = text.trim();

  if (isFrench) {
    if (PROMO_BANNER_TRANSLATIONS_DICT.arToFr[trimmed]) {
      return PROMO_BANNER_TRANSLATIONS_DICT.arToFr[trimmed];
    }
    // Fuzzy match for common Arabic promotional keywords
    if (trimmed.includes('تخفيضات خاصة') || (trimmed.includes('تخفيضات') && trimmed.includes('30%'))) {
      return 'Jusqu’à -30% sur nos collections de parfums orientaux et dahn oud royal !';
    }
    if (trimmed.includes('استفد من تخفيض فوري')) {
      return 'Profitez d’une remise immédiate et d’une livraison rapide avec paiement à la livraison au Maroc.';
    }
    if (trimmed.includes('عرض حصري لفترة محدودة') || trimmed.includes('عرض حصري')) {
      return '✨ Offre Exclusive Limitée';
    }
    if (trimmed.includes('تسوق العروض')) {
      return 'Découvrir les Offres';
    }
    if (trimmed.includes('ينتهي العرض')) {
      return 'Offre bientôt terminée';
    }
    if (trimmed.includes('دهن العود والمسك')) {
      return '👑 Dehn Al Oud & Musc Royal';
    }
    if (trimmed.includes('شحن مجاني') || trimmed.includes('توصيل مجاني')) {
      return '🚚 Livraison Gratuite';
    }
    return trimmed;
  } else {
    // Arabic mode
    if (PROMO_BANNER_TRANSLATIONS_DICT.frToAr[trimmed]) {
      return PROMO_BANNER_TRANSLATIONS_DICT.frToAr[trimmed];
    }
    if (trimmed.toLowerCase().includes('-30%') || trimmed.toLowerCase().includes('30% de réduction')) {
      return 'تخفيضات خاصة تصل إلى 30% على أرقى تشكيلات العطور الشرقية ودهن العود الملكي!';
    }
    if (trimmed.toLowerCase().includes('offre exclusive')) {
      return '✨ عرض حصري لفترة محدودة';
    }
    if (trimmed.toLowerCase().includes('découvrir les offres')) {
      return 'تسوق العروض الآن';
    }
    if (trimmed.toLowerCase().includes('bientôt terminée')) {
      return 'ينتهي العرض قريباً';
    }
    return trimmed;
  }
}
