/**
 * auth.js - Authentication and Session Management for Yemen Engineer Platform
 */

function getCurrentUser() {
    const userJson = localStorage.getItem('ye_current_user');
    return userJson ? JSON.parse(userJson) : null;
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('ye_current_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('ye_current_user');
    }
}

async function login(email, password, expectedRole = null) {
    const users = await getData(STORAGE_KEYS.USERS);
    const user = users.find(u => {
        const matchesEmail = u.email.toLowerCase() === email.toLowerCase();
        const matchesPassword = u.password === password;
        if (expectedRole) return matchesEmail && matchesPassword && u.type === expectedRole;
        return matchesEmail && matchesPassword;
    });
    if (user) {
        if (user.status === 'rejected') return { success: false, message: 'تم رفض تنشيط حسابك من قبل الإدارة.' };
        setCurrentUser(user);
        return { success: true, user };
    }
    return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' };
}

async function demoLogin(role) {
    const users = await getData(STORAGE_KEYS.USERS);
    const user = users.find(u => u.type === role);
    if (user) {
        setCurrentUser(user);
        return { success: true, user };
    }
    return { success: false, message: `لا يوجد مستخدم تجريبي بصلاحية: ${role}` };
}

function logout() {
    setCurrentUser(null);
    const isInAdmin = window.location.pathname.includes('/admin/');
    window.location.href = isInAdmin ? '../index.html' : 'index.html';
}

async function registerUser(userData) {
    const users = await getData(STORAGE_KEYS.USERS);
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        return { success: false, message: 'البريد الإلكتروني مسجل بالفعل.' };
    }
    if (users.some(u => u.phone === userData.phone)) {
        return { success: false, message: 'رقم الهاتف مسجل بالفعل.' };
    }
    const finalUserData = {
        ...userData,
        isVerified: userData.type === 'client' || userData.type === 'admin',
        status: userData.type === 'client' || userData.type === 'admin' ? 'approved' : 'pending',
        rating: 5.0,
        ratingCount: 0,
        projects: [],
        services: []
    };
    const newUser = await insertRecord(STORAGE_KEYS.USERS, finalUserData);
    if (newUser.type === 'agent') {
        const newStore = await insertRecord(STORAGE_KEYS.STORES, {
            agentId: newUser.id,
            storeName: `معرض ${newUser.fullName}`,
            specialty: newUser.productTypes || 'قطع غيار ومعدات هندسية',
            governorate: newUser.governorate,
            description: newUser.bio || 'وكالة تجارية معتمدة.',
            logo: 'https://images.unsplash.com/photo-1513828583845-c469f7d9e7d7?w=150',
            products: []
        });
        await updateRecord(STORAGE_KEYS.USERS, newUser.id, { storeId: newStore.id });
    }
    await insertRecord(STORAGE_KEYS.NOTIFICATIONS, {
        userId: 'u_admin',
        title: 'طلب انضمام جديد للمنصة',
        message: `سجل مستخدم جديد باسم (${newUser.fullName}) كـ ${getRoleArabicName(newUser.type)} بانتظار المراجعة.`,
        link: 'admin/users.html',
        read: false
    });
    return { success: true, user: newUser };
}

function getRoleArabicName(role) {
    const roles = {
        'client': 'عميل',
        'engineer': 'مهندس مستقل',
        'office': 'مكتب هندسي',
        'workshop': 'ورشة فنية',
        'company': 'شركة',
        'agent': 'وكيل معتمد',
        'admin': 'مدير النظام'
    };
    return roles[role] || role;
}

function requireAuth(allowedRoles = []) {
    const user = getCurrentUser();
    const isInAdmin = window.location.pathname.includes('/admin/');
    const sep = isInAdmin ? '../' : '';
    if (!user) { window.location.href = sep + 'login.html'; return; }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.type)) {
        window.location.href = sep + 'index.html';
    }
}
