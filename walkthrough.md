# Yemen Engineer — دليل تجربة المنصة

## ملخص ما تم إنجازه

تم بناء نسخة تجريبية كاملة من منصة **Yemen Engineer** — سوق هندسي يمني يربط العملاء بالمهندسين والمكاتب والورش والوكلاء. المنصة تعمل بالكامل بدون أي خادم أو قاعدة بيانات خارجية (Vanilla JS + LocalStorage).

---

## قائمة الملفات المُنشأة

| الملف | الوصف |
|---|---|
| [index.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/index.html) | الصفحة الرئيسية مع بحث فوري وأقسام ديناميكية |
| [login.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/login.html) / [register.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/register.html) | تسجيل دخول بدور تجريبي واختيار نوع الحساب |
| [engineers.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/engineers.html) / [engineer-details.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/engineer-details.html) | دليل مهندسين قابل للفلترة مع صفحة ملف شخصي كامل |
| [offices.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/offices.html) / [office-details.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/office-details.html) | دليل مكاتب وورش |
| [services.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/services.html) | كتالوج الخدمات الهندسية بطلب مباشر |
| [stores.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/stores.html) / [store-details.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/store-details.html) | معارض الوكلاء مع قائمة منتجات وسلة شراء |
| [requests.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/requests.html) / [request-details.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/request-details.html) | سوق المشاريع: نشر الطلبات، تقديم العروض، قبولها، إتمام المشروع، التقييم |
| [messages.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/messages.html) | غرفة محادثة داخلية آمنة مع فلتر حظر بيانات التواصل |
| [dashboard.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/dashboard.html) | لوحة تحكم حسب الدور: إحصائيات، إشعارات، جداول طلبات |
| [profile.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/profile.html) | إعدادات الحساب حسب الدور: بيانات عامة + تفاصيل مهنية |
| [notifications.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/notifications.html) | صفحة الإشعارات مع تحديد مقروء وحذف |
| [admin/index.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/admin/index.html) | لوحة إدارة: إحصائيات، اعتماد المهندسين، إدارة مستخدمين وطلبات |

---

## سيناريو التجربة الكاملة

### 1. فتح المنصة وتسجيل الدخول التجريبي
- افتح [index.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/index.html) في المتصفح مباشرة
- اضغط **"تسجيل الدخول"** → انتقل إلى [login.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/login.html)
- اضغط **"دخول تجريبي كـ عميل"** لتسجيل دخول مباشر

### 2. تصفح المهندسين والخدمات (دور العميل)
- من الرئيسية، اضغط على مهندس لفتح ملفه → [engineer-details.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/engineer-details.html)
- أرسل طلب خدمة مباشرة للمهندس من الملف
- أو اذهب إلى [services.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/services.html) واختر خدمة وانشر طلباً

### 3. نشر مشروع وتلقي العروض
- انتقل إلى [requests.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/requests.html) → ابحث عن طلبات مفتوحة
- اضغط على طلب مشروع → [request-details.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/request-details.html)
- إذا دخلت كـ **مهندس**: قدّم عرضاً مالياً وضع ملاحظاتك
- إذا دخلت كـ **عميل**: راجع العروض واضغط **"قبول العرض"**

### 4. المحادثات الآمنة
- بعد قبول العرض → تفعّل زر **"فتح المحادثة"**
- انتقل إلى [messages.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/messages.html) وجرب إرسال رسالة طبيعية
- جرب إرسال رسالة تحوي رقم هاتف أو رابط واتساب → سيتم **حجب الرسالة تلقائياً**

### 5. متابعة الحالة في لوحة التحكم
- انتقل إلى [dashboard.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/dashboard.html)
- ستجد إحصائيات الطلبات، الإشعارات، وجداول المشاريع الجارية
- جرب دور **مهندس** أو **وكيل** لرؤية واجهات مختلفة

### 6. إدارة الحساب
- انتقل إلى [profile.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/profile.html) لتعديل البيانات الشخصية والمهنية
- التعديلات تُحفظ فوراً في LocalStorage

### 7. لوحة الإدارة
- سجّل دخول كـ **مدير نظام** (admin)
- ستُوجَّه تلقائياً إلى [admin/index.html](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/admin/index.html)
- راجع الطلبات المعلقة للاعتماد وأقر أحدها أو ارفضه

---

## ميزات أمنية مُنفذة

| الميزة | التفاصيل |
|---|---|
| **فلتر الرسائل** | يحجب تلقائياً أرقام الهواتف اليمنية، الإيميلات، روابط واتساب |
| **عزل الأطراف** | لا يمكن للعميل والمهندس التواصل خارج غرفة الطلب |
| **التحقق الإداري** | المهندسون والمكاتب معلقة حتى يعتمدها المدير |
| **ربط العروض بالطلبات** | لا يمكن بدء المحادثة إلا بعد قبول العرض |

---

## الحسابات التجريبية الجاهزة

| البريد | كلمة المرور | الدور |
|---|---|---|
| `client1@gmail.com` | `password` | عميل (عبدالله منصور) |
| `client2@gmail.com` | `password` | عميل (صالح باوزير) |
| `ahmed@yemeneng.com` | `password` | مهندس طاقة شمسية |
| `harazi@yemeneng.com` | `password` | مهندس معماري |
| `rowishan@yemeneng.com` | `password` | وكيل معتمد |
| `admin@yemeneng.com` | [admin](file:///c:/Users/lenovo/Desktop/New%20folder/yemen-engineer/admin/index.html#364-379) | مدير النظام |

أو استخدم أزرار **"الدخول التجريبي السريع"** في صفحة تسجيل الدخول.

---

## ملاحظات تقنية

- **التقنية:** Vanilla HTML5 / CSS3 / JavaScript فقط — لا خوادم أو APIs
- **التخزين:** LocalStorage — يعمل بالكامل من المجلد المحلي
- **إعادة ضبط البيانات:** احذف `ye_db_initialized` من LocalStorage ثم أعد تحميل الصفحة
- **المسارات:** جميع الروابط نسبية تعمل مباشرة من `file://` بدون HTTP Server
