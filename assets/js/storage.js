/**
 * storage.js - Local Storage Database Layer for Yemen Engineer Platform
 */

const STORAGE_KEYS = {
    USERS: 'ye_users',
    SERVICES: 'ye_services',
    REQUESTS: 'ye_requests',
    OFFERS: 'ye_offers',
    MESSAGES: 'ye_messages',
    NOTIFICATIONS: 'ye_notifications',
    STORES: 'ye_stores',
    PRODUCTS: 'ye_products',
    REVIEWS: 'ye_reviews',
    ADS: 'ye_ads'
};

// --- Core CRUD Helpers ---

function getData(key) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function generateId(prefix) {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

function insertRecord(key, data) {
    const records = getData(key);
    const newRecord = { id: generateId(key), createdAt: new Date().toISOString(), ...data };
    records.push(newRecord);
    saveData(key, records);
    return newRecord;
}

function updateRecord(key, id, updates) {
    const records = getData(key);
    const idx = records.findIndex(r => r.id === id);
    if (idx !== -1) {
        records[idx] = { ...records[idx], ...updates, updatedAt: new Date().toISOString() };
        saveData(key, records);
        return records[idx];
    }
    return null;
}

function deleteRecord(key, id) {
    const records = getData(key);
    const filtered = records.filter(r => r.id !== id);
    saveData(key, filtered);
}

function getById(key, id) {
    return getData(key).find(r => r.id === id) || null;
}

function trackAdClick(adId) {
    const ads = getData(STORAGE_KEYS.ADS);
    const idx = ads.findIndex(a => a.id === adId);
    if (idx !== -1) {
        ads[idx].clicks = (ads[idx].clicks || 0) + 1;
        saveData(STORAGE_KEYS.ADS, ads);
    }
}

function trackAdImpression(adId) {
    const ads = getData(STORAGE_KEYS.ADS);
    const idx = ads.findIndex(a => a.id === adId);
    if (idx !== -1) {
        ads[idx].views = (ads[idx].views || 0) + 1;
        saveData(STORAGE_KEYS.ADS, ads);
    }
}

// --- Database Initialization ---

function initDatabase() {
    if (localStorage.getItem('ye_db_initialized') === 'true') return;

    // 1. Seed Users
    const seedUsers = [
        {
            id: 'u_admin',
            fullName: 'مدير النظام',
            email: 'admin@yemeneng.com',
            password: 'admin',
            phone: '771000000',
            type: 'admin',
            governorate: 'صنعاء',
            city: 'امانة العاصمة',
            isVerified: true,
            status: 'approved',
            rating: 5.0,
            ratingCount: 0,
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
            bio: 'مدير منصة مهندسي اليمن',
            createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'u_client1',
            fullName: 'عبدالله يحيى منصور',
            email: 'client1@gmail.com',
            password: 'password',
            phone: '777111222',
            type: 'client',
            governorate: 'صنعاء',
            city: 'امانة العاصمة',
            isVerified: true,
            status: 'approved',
            rating: 4.8,
            ratingCount: 3,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            bio: 'صاحب عقار، مهتم بتطوير منزلي',
            createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'u_client2',
            fullName: 'صالح عمر باوزير',
            email: 'client2@gmail.com',
            password: 'password',
            phone: '733222333',
            type: 'client',
            governorate: 'حضرموت',
            city: 'المكلا',
            isVerified: true,
            status: 'approved',
            rating: 4.5,
            ratingCount: 1,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            bio: 'مستثمر يبحث عن خدمات هندسية موثوقة',
            createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'u_eng1',
            fullName: 'أحمد علي الهمداني',
            email: 'ahmed@yemeneng.com',
            password: 'password',
            phone: '777333444',
            type: 'engineer',
            specialty: 'طاقة شمسية',
            experienceYears: 8,
            governorate: 'صنعاء',
            city: 'شعوب',
            isVerified: true,
            status: 'approved',
            rating: 4.9,
            ratingCount: 47,
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
            bio: 'مهندس كهربائي متخصص في منظومات الطاقة الشمسية المنزلية والصناعية. خبرة 8 سنوات في تركيب وصيانة أنظمة الطاقة الشمسية.',
            certificates: ['بكالوريوس هندسة كهربائية - جامعة صنعاء', 'شهادة NABCEP الدولية للطاقة الشمسية'],
            services: ['srv_1'],
            createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'u_eng2',
            fullName: 'محمد مصلح الحرازي',
            email: 'harazi@yemeneng.com',
            password: 'password',
            phone: '771444555',
            type: 'engineer',
            specialty: 'معماري',
            experienceYears: 12,
            governorate: 'صنعاء',
            city: 'حدة',
            isVerified: true,
            status: 'approved',
            rating: 4.7,
            ratingCount: 29,
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
            bio: 'مهندس معماري خبير في التصميم والمخططات الهندسية، متخصص في الطراز اليمني التراثي وتصميم الفلل الحديثة.',
            certificates: ['بكالوريوس هندسة معمارية - جامعة صنعاء', 'ماجستير تخطيط حضري'],
            services: ['srv_2'],
            createdAt: new Date(Date.now() - 22 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'u_eng3',
            fullName: 'عمر حسين المقالح',
            email: 'maqaleh@yemeneng.com',
            password: 'password',
            phone: '777555666',
            type: 'engineer',
            specialty: 'مدني وإنشاءات',
            experienceYears: 15,
            governorate: 'تعز',
            city: 'تعز',
            isVerified: true,
            status: 'approved',
            rating: 4.8,
            ratingCount: 63,
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
            bio: 'مهندس مدني ذو خبرة واسعة في إنشاء وتصميم المباني والجسور والبنية التحتية.',
            certificates: ['بكالوريوس هندسة مدنية - جامعة تعز'],
            services: ['srv_3'],
            createdAt: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'u_eng4',
            fullName: 'سالم ناجي الجبري',
            email: 'jabri@yemeneng.com',
            password: 'password',
            phone: '774666777',
            type: 'engineer',
            specialty: 'ميكانيكا',
            experienceYears: 6,
            governorate: 'عدن',
            city: 'المعلا',
            isVerified: false,
            status: 'pending',
            rating: 0,
            ratingCount: 0,
            avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150',
            bio: 'مهندس ميكانيكي متخصص في أنظمة التبريد والتكييف وهندسة المصانع.',
            certificates: ['بكالوريوس هندسة ميكانيكية - جامعة عدن'],
            services: ['srv_4'],
            createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'u_office1',
            fullName: 'خالد محمد الشرجبي',
            email: 'sharjabi@yemeneng.com',
            password: 'password',
            phone: '777777888',
            type: 'office',
            officeName: 'مكتب الشرجبي للاستشارات الهندسية',
            specialty: 'استشارات هندسية وإشراف',
            activityType: 'مكتب استشارات هندسية',
            experienceYears: 20,
            governorate: 'صنعاء',
            city: 'شارع الزبيري',
            isVerified: true,
            status: 'approved',
            rating: 4.9,
            ratingCount: 112,
            avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150',
            bio: 'مكتب هندسي معتمد يقدم خدمات الاستشارات والتصميم والإشراف على التنفيذ بخبرة 20 عاماً.',
            createdAt: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'u_workshop1',
            fullName: 'فيصل ناصر البريقي',
            email: 'buraiki@yemeneng.com',
            password: 'password',
            phone: '771888999',
            type: 'workshop',
            workshopName: 'ورشة البريقي للطاقة الشمسية والكهرباء',
            activityType: 'صيانة وتركيب أنظمة الطاقة',
            experienceYears: 10,
            governorate: 'صنعاء',
            city: 'السنينة',
            isVerified: true,
            status: 'approved',
            rating: 4.6,
            ratingCount: 38,
            avatar: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=150',
            bio: 'ورشة متخصصة في تركيب وصيانة أنظمة الطاقة الشمسية والكهرباء المنزلية والصناعية.',
            createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'u_agent1',
            fullName: 'عبدالكريم علي الرويشان',
            email: 'rowishan@yemeneng.com',
            password: 'password',
            phone: '777000111',
            type: 'agent',
            productTypes: 'معدات طاقة شمسية ومولدات',
            brands: 'Longi Solar, Growatt, Chint',
            storeId: 's_store1',
            governorate: 'صنعاء',
            city: 'شارع الستين',
            isVerified: true,
            status: 'approved',
            rating: 4.8,
            ratingCount: 55,
            avatar: 'https://images.unsplash.com/photo-1543971268-97935dfeea5b?w=150',
            bio: 'وكيل معتمد لتوزيع معدات الطاقة الشمسية والمولدات من أبرز العلامات التجارية العالمية.',
            createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'u_agent2',
            fullName: 'طارق حمود الحداد',
            email: 'haddad@yemeneng.com',
            password: 'password',
            phone: '733111222',
            type: 'agent',
            productTypes: 'معدات طاقة شمسية ومولدات',
            storeId: 's_store2',
            governorate: 'عدن',
            city: 'كريتر',
            isVerified: true,
            status: 'approved',
            rating: 4.6,
            ratingCount: 31,
            avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150',
            bio: 'وكيل معتمد لتوريد المولدات وطاقة الليثيوم والبطاريات الوفيرة في عدن.',
            createdAt: new Date(Date.now() - 17 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'u_agent3',
            fullName: 'عبدالعزيز قاسم بلقيس',
            email: 'balqis@yemeneng.com',
            password: 'password',
            phone: '774333444',
            type: 'agent',
            productTypes: 'مضخات ري وغطاسات',
            storeId: 's_store3',
            governorate: 'حضرموت',
            city: 'المكلا',
            isVerified: true,
            status: 'approved',
            rating: 4.7,
            ratingCount: 22,
            avatar: 'https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=150',
            bio: 'وكيل معتمد للغطاسات الزراعية ومضخات الآبار والري.',
            createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString()
        }
    ];
    saveData(STORAGE_KEYS.USERS, seedUsers);

    // 2. Seed Services
    const seedServices = [
        { id: 'srv_1', name: 'تركيب وتصميم منظومات الطاقة الشمسية', category: 'طاقة شمسية', countProviders: 'متاح لدى 12 مزود', description: 'تصميم وتركيب منظومات الطاقة الشمسية المنزلية والتجارية والصناعية بالكفاءة العالية وبأحدث التقنيات والمعدات المعتمدة.', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800', relatedUserTypes: ['engineer', 'workshop', 'company'] },
        { id: 'srv_2', name: 'تصميم معماري وإعداد المخططات الهندسية', category: 'معماري', countProviders: 'متاح لدى 8 مزود', description: 'إعداد مخططات هندسية احترافية للمنشآت السكنية والتجارية مع تصميم ثلاثي الأبعاد ورخص البناء.', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', relatedUserTypes: ['engineer', 'office'] },
        { id: 'srv_3', name: 'إنشاء وتشييد المباني والبنية التحتية', category: 'مدني وإنشاءات', countProviders: 'متاح لدى 15 مزود', description: 'تنفيذ أعمال البناء والإنشاء للمباني السكنية والتجارية والطرق والجسور وأعمال البنية التحتية.', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800', relatedUserTypes: ['engineer', 'office', 'company', 'workshop'] },
        { id: 'srv_4', name: 'تركيب وصيانة أنظمة التكييف والتبريد', category: 'تكييف وتبريد', countProviders: 'متاح لدى 9 مزود', description: 'تركيب وصيانة جميع أنواع أجهزة التكييف والمبردات وأنظمة التدفئة والتهوية للمنازل والمكاتب والمصانع.', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800', relatedUserTypes: ['engineer', 'workshop'] },
        { id: 'srv_5', name: 'رسم وتصميم خرائط المساحة والتخطيط العمراني', category: 'مساحة', countProviders: 'متاح لدى 5 مزود', description: 'أعمال المساحة والرفع الطبوغرافي وتحديد الحدود وإعداد خرائط تفصيلية مصدقة للأراضي والعقارات.', image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800', relatedUserTypes: ['engineer', 'office'] },
        { id: 'srv_6', name: 'صيانة وإصلاح السيارات والمركبات الثقيلة', category: 'سيارات', countProviders: 'متاح لدى 20 مزود', description: 'إصلاح وصيانة السيارات بجميع أنواعها والمعدات الثقيلة مع توفير قطع غيار أصلية ومعتمدة.', image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800', relatedUserTypes: ['workshop'] },
        { id: 'srv_7', name: 'تصميم وتركيب شبكات الاتصالات والإنترنت', category: 'شبكات واتصالات', countProviders: 'متاح لدى 7 مزود', description: 'تصميم شبكات الداخلية للمنشآت وتركيب نقاط الوصول وكاميرات المراقبة وأنظمة التحكم الذكي.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', relatedUserTypes: ['engineer', 'workshop'] },
        { id: 'srv_8', name: 'استشارات هندسية وإشراف على التنفيذ', category: 'استشارات هندسية', countProviders: 'متاح لدى 6 مزود', description: 'تقديم الاستشارات الهندسية المتخصصة والإشراف المتكامل على تنفيذ المشاريع وضمان الجودة والمطابقة للمواصفات.', image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800', relatedUserTypes: ['engineer', 'office'] }
    ];
    saveData(STORAGE_KEYS.SERVICES, seedServices);

    // 3. Seed Stores (with embedded products)
    const seedStores = [
        {
            id: 's_store1',
            agentId: 'u_agent1',
            storeName: 'معرض الرويشان لأنظمة الطاقة والكهرباء',
            specialty: 'معدات طاقة شمسية ومولدات',
            brands: ['Longi Solar', 'Growatt', 'Chint', 'Felicity'],
            governorate: 'صنعاء',
            description: 'المركز الرائد لتوزيع ألواح لونجي سولار وإنفرترات جرووات المعتمدة وصناديق الحماية المتكاملة ضد الصواعق.',
            logo: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=150',
            products: [
                { id: 'p_prod1', name: 'لوح طاقة شمسية Longi 550W Half-Cut', brand: 'Longi Solar', specifications: 'كفاءة 21.3%, مقاوم للأتربة والرطوبة, ضمان 25 سنة على الإنتاجية', price: 65000, image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=300' },
                { id: 'p_prod2', name: 'إنفرتر شمسي Growatt 5KW Hybrid', brand: 'Growatt', specifications: 'MPPT مزدوج, متوافق مع بطاريات ليثيوم وعادية, شاشة تفاعلية', price: 240000, image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=300' },
                { id: 'p_prod2b', name: 'منظم شحن Chint 60A MPPT', brand: 'Chint', specifications: 'يدعم حتى 3000 وات من الألواح, شاشة LCD وحماية كاملة', price: 45000, image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=300' }
            ]
        },
        {
            id: 's_store2',
            agentId: 'u_agent2',
            storeName: 'الحداد لتوريد المولدات وطاقة الليثيوم والبطاريات الوفيرة',
            specialty: 'معدات طاقة شمسية ومولدات',
            brands: ['Panasonic', 'Trina Solar', 'Mustard Generator', 'Felicity'],
            governorate: 'عدن',
            description: 'تأمين المولدات بقدرات منزلية وصناعية ومجموعات ربط الأحمال التلقائية ومستلزمات الصيانة والمصافي.',
            logo: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=150',
            products: [
                { id: 'p_prod3', name: 'بطارية ليثيوم Felicity 100AH 48V LiFePO4', brand: 'Felicity', specifications: 'عمر افتراضي 6000 دورة, ضمان تشغيلي 5 سنوات, BMS ذكي مدمج', price: 650000, image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300' },
                { id: 'p_prod4', name: 'مولد ديزل كينج ماكس صامت 10 KVA', brand: 'KingMax', specifications: 'كاتم صوت متكامل, ثبات تردد عالي, تشغيل سلف وبطارية', price: 980000, image: 'https://images.unsplash.com/photo-1597476045610-d023b05f2ba8?w=300' }
            ]
        },
        {
            id: 's_store3',
            agentId: 'u_agent3',
            storeName: 'وكالة بلقيس للغطاسات الزراعية ومضخات الآبار والري',
            specialty: 'معدات طاقة شمسية ومولدات',
            brands: ['Grundfos', 'Pedrollo', 'LORENTZ'],
            governorate: 'حضرموت',
            description: 'توفير غطاسات المياه المتنوعة وبكرات الرفع الكبيرة وعدادات التدفق المحكمة للآبار الزراعية بالوادي والمحافظات المجاورة.',
            logo: 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=150',
            products: [
                { id: 'p_prod5', name: 'غطاس مائي Lorentz 15 HP لآبار ريفية', brand: 'LORENTZ', specifications: 'ضخ من أعماق حتى 180 متر, يعمل مباشرة بالطاقة الشمسية بدون بطارية', price: 1300000, image: 'https://images.unsplash.com/photo-1585713181935-d5f622cc2415?w=300' },
                { id: 'p_prod6', name: 'طلمبة Grundfos SP 3" رفع عمودي', brand: 'Grundfos', specifications: 'مناسبة للآبار الضيقة بقطر 4 بوصة, ضغط عال ومتانة في البيئات القاسية', price: 450000, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300' }
            ]
        }
    ];
    saveData(STORAGE_KEYS.STORES, seedStores);

    // 4. Seed Requests
    const seedRequests = [
        {
            id: 'req_100',
            clientId: 'u_client1',
            serviceId: 'srv_1',
            category: 'طاقة شمسية',
            title: 'تركيب منظومة طاقة شمسية منزلية 3 كيلووات مع منظم إضافي',
            description: 'أريد تركيب 6 ألواح طاقة شمسية 500 وات فوق سطح المنزل بسنح، والمنظومة تحتاج بطارية ليثيوم 100 أمبير مع تشغيل مكيف طن إنفيرتر في فترة النهار ومضخة ماء صغيرة نصف حصان.',
            governorate: 'صنعاء',
            city: 'أمانة العاصمة - السبعين',
            location: 'حي الأصبحي، جوار مدرسة بلقيس',
            budget: 350000,
            duration: 'يومين',
            images: [],
            status: 'IN_PROGRESS',
            selectedOfferId: 'off_200',
            registeredAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'req_101',
            clientId: 'u_client2',
            serviceId: 'srv_2',
            category: 'معماري',
            title: 'تصميم خارجي لفيلا من طراز صنعاني مهيب في مدينة المكلا',
            description: 'نمتلك أرضاً بمساحة 22 * 20 متر ونريد وضع سكتش أولي ثلاثي الأبعاد وتصميم للواجهة الخارجية بدمج الحجر الترافرتين الأبيض مع القمريات الصنعانية المزخرفة وتناسق النوافد.',
            governorate: 'حضرموت',
            city: 'المكلا',
            location: 'منطقة فلك جوار مستشفى المكلا الميداني الجديد',
            budget: 450000,
            duration: '10 أيام',
            images: [],
            status: 'NEW',
            registeredAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'req_102',
            clientId: 'u_client1',
            serviceId: 'srv_7',
            category: 'شبكات واتصالات',
            title: 'تصميم شبكة داخلية لمكتب تجاري من 12 جهاز وكاميرات مراقبة',
            description: 'أريد تأسيس شبكة داخلية للشركة تشمل توزيع الانترنت عبر سويتش مدار، وتركيب 6 كاميرات مراقبة إضافة إلى نقاط الواي فاي خارج الجدران.',
            governorate: 'صنعاء',
            city: 'حدة',
            location: 'مبنى المهندسين، الطابق الثاني',
            budget: 180000,
            duration: '3 أيام',
            images: [],
            status: 'NEW',
            registeredAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
        }
    ];
    saveData(STORAGE_KEYS.REQUESTS, seedRequests);

    // 5. Seed Offers
    const seedOffers = [
        {
            id: 'off_200',
            requestId: 'req_100',
            providerId: 'u_eng1',
            providerName: 'أحمد علي الهمداني',
            providerSpecialty: 'طاقة شمسية',
            providerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
            price: 330000,
            duration: '5 أيام',
            arrivalTime: 'خلال 24 ساعة من التأكيد',
            notes: 'أخي عبدالله، سأقوم بتوفير ألواح لونجي 500 وات وإنفرتر جرووات 5 كيلووات مع بطارية ليثيوم 100 أمبير. الأعمال تشمل التمديدات الكاملة وبرمجة المنظومة وتسليم شهادة ضمان.',
            status: 'accepted',
            createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'off_201',
            requestId: 'req_101',
            providerId: 'u_eng2',
            providerName: 'محمد مصلح الحرازي',
            providerSpecialty: 'معماري',
            providerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
            price: 430000,
            duration: '8 أيام',
            arrivalTime: 'البدء فوراً بعد الاتفاق التقني وإرسال مقاسات كروكي الأرض',
            notes: 'مرحباً أخي باوزير. التراث الصنعاني مدمجاً بالحجر الأبيض هو تخصصي وقد قمت بأعمال مشابهة. سأرسل لك مخططي مسقط أفقي وتصميم 3D للواجهة الرئيسية وتعديلين مجانيين.',
            status: 'submitted',
            createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
        }
    ];
    saveData(STORAGE_KEYS.OFFERS, seedOffers);

    // 6. Seed Messages
    const seedMessages = [
        {
            id: 'msg_300',
            requestId: 'req_100',
            senderId: 'SYSTEM',
            receiverId: 'u_eng1',
            content: 'نظام التوثيق والضمان بالمنصة: تم قبول العرض بنجاح وبدء الشراكة الفنية. تعد المحادثات داخل المنصة هي المرجعية الأساسية لأرشفة العمل وتأمين الحقوق. يمنع تبادل آليات التواصل المباشر.',
            timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'msg_301',
            requestId: 'req_100',
            senderId: 'u_client1',
            receiverId: 'u_eng1',
            content: 'السلام عليكم يا مهندس أحمد. يسعدني قبول عرضك للمنظومة. متى يمكنك المجيء لمعاينة السطح والبدء بالتركيب بشكل تام؟',
            timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000 - 4 * 3600 * 1000).toISOString()
        },
        {
            id: 'msg_302',
            requestId: 'req_100',
            senderId: 'u_eng1',
            receiverId: 'u_client1',
            content: 'وعليكم السلام ورحمة الله وبركاته. سنبدأ إن شاء الله غداً صباحاً. هل الألواح والبطاريات متوفرة لديك في الموقع أم ترغب مني إرشادك بشرائها؟',
            timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000 - 3 * 3600 * 1000).toISOString()
        },
        {
            id: 'msg_303',
            requestId: 'req_100',
            senderId: 'u_client1',
            receiverId: 'u_eng1',
            content: 'لقد اشتريت أغلبها من أحد الوكلاء هنا بصنعاء. ينقصنا فقط القواطع وحماية الدايود وكابلات بطول 40 متراً مقاس 10 مم.',
            timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000 - 2 * 3600 * 1000).toISOString()
        },
        {
            id: 'msg_304',
            requestId: 'req_100',
            senderId: 'u_eng1',
            receiverId: 'u_client1',
            content: 'رائع جداً، الكابلات النحاسية مقاس 10 مم ممتازة لتقليل المفاقيد. سأجلب معي القواطع المناسبة من ورشتي وسنتحاسب عليها لاحقاً. أراك غداً في تمام الساعة الثامنة صباحاً إن شاء الله.',
            timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000 - 1 * 3600 * 1000).toISOString()
        }
    ];
    saveData(STORAGE_KEYS.MESSAGES, seedMessages);

    // 7. Seed Notifications
    const seedNotifications = [
        {
            id: 'ntf_400',
            userId: 'u_client1',
            title: 'تم تقديم عرض جديد لطلبك',
            message: 'قام المهندس أحمد علي بتقديم عرض لطلب طاقة شمسية سكنية بقيمة 330,000 ريال.',
            link: 'request-details.html?id=req_100',
            read: true,
            createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'ntf_401',
            userId: 'u_eng1',
            title: 'تم قبول عرضك',
            message: 'وافق العميل عبدالله يحيى على عرضك للمنظومة الشمسية. يمكنك الآن التواصل معه داخل لوحة الطلب.',
            link: 'request-details.html?id=req_100',
            read: false,
            createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'ntf_402',
            userId: 'u_client2',
            title: 'عرض جديد متاح للمعاينة',
            message: 'تلقيت عرضاً جديداً من المهندس محمد مصلح الحرازي لفيلا صنعانية بقيمة 430,000 ريال.',
            link: 'request-details.html?id=req_101',
            read: false,
            createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
        }
    ];
    saveData(STORAGE_KEYS.NOTIFICATIONS, seedNotifications);

    // 8. Seed Advertisements
    const seedAds = [
        {
            id: 'ad_1',
            advertiserId: 'u_agent1',
            title: 'ألواح لونجي سولار - Longi Solar',
            description: 'الجيل الجديد من الألواح عالية الكفاءة 550 وات. متوفرة الآن لدى وكيلنا الحصري مع ضمانة حقيقية 25 سنة.',
            image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400',
            link: 'store-details.html?id=s_store1',
            budget: 50000,
            type: 'banner',
            clicks: 45,
            views: 1250,
            pricingModel: 'CPC',
            cpcRate: 150,
            cpmRate: 2500,
            status: 'active',
            createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'ad_2',
            advertiserId: 'u_agent2',
            title: 'بطاريات فيليسيتي Felicity الليثيوم',
            description: 'أفضل أنظمة تخزين الطاقة لمنزلك أو مكتبك. عمر افتراضي يتجاوز 6000 دورة شحن ممتدة.',
            image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400',
            link: 'store-details.html?id=s_store2',
            budget: 80000,
            type: 'sidebar',
            clicks: 92,
            views: 3100,
            pricingModel: 'CPM',
            cpcRate: 150,
            cpmRate: 2500,
            status: 'active',
            createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'ad_3',
            advertiserId: 'u_eng1',
            title: 'عروض تركيب الطاقة الشمسية - م. أحمد الهمداني',
            description: 'احصل على استشارتك المجانية لتصميم منظومتك المنزلية بموثوقية عالية وخبرة هندسية تفوق 8 سنوات.',
            image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400',
            link: 'engineer-details.html?id=u_eng1',
            budget: 30000,
            type: 'sponsored',
            clicks: 12,
            views: 380,
            pricingModel: 'CPC',
            cpcRate: 150,
            cpmRate: 2500,
            status: 'active',
            createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'ad_4',
            advertiserId: 'u_office1',
            title: 'شركة الإنشاءات اليمنية الحديثة',
            description: 'تصميم وتنفيذ المشاريع السكنية والخدمية بأحدث التقنيات الهندسية ثنائية وثلاثية الأبعاد وبأيدي كوادر مؤهلة.',
            image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
            link: 'office-details.html?id=u_office1',
            budget: 60000,
            type: 'banner',
            clicks: 18,
            views: 450,
            pricingModel: 'CPC',
            cpcRate: 150,
            cpmRate: 2500,
            status: 'active',
            createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
        }
    ];
    saveData(STORAGE_KEYS.ADS, seedAds);

    localStorage.setItem('ye_db_initialized', 'true');
    console.log('Yemen Engineer DB initialized successfully.');
}

// Auto-init
initDatabase();

// Fallback seeding: if database was already initialized before the ads system was introduced
if (localStorage.getItem('ye_db_initialized') === 'true' && !localStorage.getItem(STORAGE_KEYS.ADS)) {
    const fallbackAds = [
        {
            id: 'ad_1',
            advertiserId: 'u_agent1',
            title: 'ألواح لونجي سولار - Longi Solar',
            description: 'الجيل الجديد من الألواح عالية الكفاءة 550 وات. متوفرة الآن لدى وكيلنا الحصري مع ضمانة حقيقية 25 سنة.',
            image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400',
            link: 'store-details.html?id=s_store1',
            budget: 50000,
            type: 'banner',
            clicks: 45,
            views: 1250,
            pricingModel: 'CPC',
            cpcRate: 150,
            cpmRate: 2500,
            status: 'active',
            createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'ad_2',
            advertiserId: 'u_agent2',
            title: 'بطاريات فيليسيتي Felicity الليثيوم',
            description: 'أفضل أنظمة تخزين الطاقة لمنزلك أو مكتبك. عمر افتراضي يتجاوز 6000 دورة شحن ممتدة.',
            image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400',
            link: 'store-details.html?id=s_store2',
            budget: 80000,
            type: 'sidebar',
            clicks: 92,
            views: 3100,
            pricingModel: 'CPM',
            cpcRate: 150,
            cpmRate: 2500,
            status: 'active',
            createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'ad_3',
            advertiserId: 'u_eng1',
            title: 'عروض تركيب الطاقة الشمسية - م. أحمد الهمداني',
            description: 'احصل على استشارتك المجانية لتصميم منظومتك المنزلية بموثوقية عالية وخبرة هندسية تفوق 8 سنوات.',
            image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400',
            link: 'engineer-details.html?id=u_eng1',
            budget: 30000,
            type: 'sponsored',
            clicks: 12,
            views: 380,
            pricingModel: 'CPC',
            cpcRate: 150,
            cpmRate: 2500,
            status: 'active',
            createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
        },
        {
            id: 'ad_4',
            advertiserId: 'u_office1',
            title: 'شركة الإنشاءات اليمنية الحديثة',
            description: 'تصميم وتنفيذ المشاريع السكنية والخدمية بأحدث التقنيات الهندسية ثنائية وثلاثية الأبعاد وبأيدي كوادر مؤهلة.',
            image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
            link: 'office-details.html?id=u_office1',
            budget: 60000,
            type: 'banner',
            clicks: 18,
            views: 450,
            pricingModel: 'CPC',
            cpcRate: 150,
            cpmRate: 2500,
            status: 'active',
            createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
        }
    ];
    saveData(STORAGE_KEYS.ADS, fallbackAds);
}
