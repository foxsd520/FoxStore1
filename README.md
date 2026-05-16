# Fox Store (React Native + Expo + Firebase)

تطبيق متجر تطبيقات للأندرويد باسم **Fox Store**.

- **Android Package**: `com.foxsd.foxstore`
- **Owner/Admin**: `foxsd520@gmail.com`

## الميزات المنفذة
1. تسجيل دخول بجوجل عبر Firebase Auth.
2. ملف شخصي (الاسم، الايميل، الصورة، UID، وعدد التطبيقات المرفوعة).
3. دردشة عامة عبر Firestore.
4. رفع تطبيق APK/AAB + صورة + وصف إلى Firebase Storage.
5. عرض التطبيقات مع تقييم (5 نجوم).
6. نظام تعليقات لكل تطبيق (Firebase Firestore).
7. لوحة تحكم للأدمن (تظهر فقط للمالك `foxsd520@gmail.com`) للموافقة/الرفض وحذف رسائل الشات.
8. إعدادات لغة عربي/إنجليزي + ثيم داكن/فاتح.
9. دعم RTL عند العربية.
10. فلترة التطبيقات حسب التصنيف: ألعاب، إنتاجية، تعليم.
11. نظام كوتا للمطورين: 100MB مجاني للتطبيقات والصور، مع منع الرفع عند تجاوز الحد.
12. ثيم موحد بالألوان المطلوبة (#FF6B35) باستخدام React Navigation Theme + React Native Paper مع حفظ اختيار الثيم في AsyncStorage.
13. إعدادات الرفع من لوحة المالك (مجاني/مدفوع لكل رفع/اشتراك شهري) مع حفظها في store_settings وتسجيل المدفوعات في payments.

## التشغيل المحلي
```bash
npm install
npm run start
```

## ربط Firebase
1. أنشئ مشروع Firebase.
2. فعّل:
   - Authentication > Google
   - Firestore
   - Storage
3. أنشئ Web App في Firebase وخذ المفاتيح.
4. انسخ `.env.example` إلى `.env` واملأ القيم.
5. أضف Google OAuth Web Client ID في:
   - `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`

## قواعد Firebase
- Firestore rules: `firebase/firestore.rules`
- Storage rules: `firebase/storage.rules`

## بناء APK مباشر للتجربة (رابط تحميل)
بعد تثبيت EAS CLI وتسجيل الدخول:
```bash
npm i -g eas-cli
eas login
eas build -p android --profile preview
```
بعد انتهاء البناء، EAS يعرض **رابط مباشر لتحميل APK** تقدر تجربه مباشرة.

## ملاحظات مهمة
- لا أقدر من داخل هذه البيئة أرفع الملف بنفسي على حسابك أو أصدر رابط عام بدون صلاحيات حساب Expo/Firebase الخاصة بك.
- لكن المشروع جاهز للبناء، والخطوات أعلاه تعطيك رابط APK مباشر فورًا.


## بناء APK تلقائيًا عبر GitHub Actions
تمت إضافة Workflow جاهز في: `.github/workflows/android-apk.yml`

### الإعداد مرة واحدة
1. في GitHub افتح: **Settings > Secrets and variables > Actions**.
2. أضف Secret باسم: `EXPO_TOKEN`.
3. خذ التوكن من Expo عبر: `expo token:create` (أو من حساب Expo).

### التشغيل
- شغّل الـ workflow يدويًا من تبويب **Actions** (Workflow: `Build Android APK (EAS)`).
- أو سيتم تشغيله تلقائيًا عند Push على فرع `main` أو `work`.

بعد التنفيذ ستجد رابط تتبع/تنزيل الـ APK داخل **Job Summary** في GitHub Actions.
