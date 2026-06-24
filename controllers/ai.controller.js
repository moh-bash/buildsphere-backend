// 1. استيراد المكتبة
const puter = require('@heyputer/puter.js');

// 2. إثبات صلاحية الحساب بتمرير التوكن الصريح من ملف .env مباشرة للمكتبة
if (process.env.PUTER_AUTH_TOKEN) {
} else {
    console.error("❌ تحذير: PUTER_AUTH_TOKEN غير موجود في ملف الـ .env");
}

const generate3DModel = async (req, res, next) => {
    try {
        console.log("🔄 جاري إرسال طلب نصي واختبار الاتصال الموثق مع Puter AI...");

        // التحقق الإضافي داخل الدالة لحماية السيرفر
        if (!process.env.PUTER_AUTH_TOKEN) {
            return res.status(500).json({
                status: "failed",
                message: "التوكن مفقود في ملف الـ .env، يرجى إضافته باسم PUTER_AUTH_TOKEN"
            });
        }

        // إرسال الطلب النصي البسيط للتأكد من استجابة الموديل بحسابك
        const response = await puter.ai.chat("مرحباً، أنا أختبر الاتصال الموثق بك من خادمي الخاص. أجب بجملة قصيرة تؤكد نجاح الاتصال.");

        console.log("✅ تم الاتصال بنجاح واستلام الرد الموثق!");

        // استخراج النص المستلم بناءً على هيكلية ردود Puter
        const textResponse = response?.message?.content || response;

        // إرسال النتيجة الناجحة لبوستمان
        res.status(200).json({ 
            status: "success",
            message: 'تم التحقق من التوكن والاتصال بنجاح',
            resultData: textResponse 
        });

    } catch (error) {
        console.error('❌ فشل الاتصال بالرغم من وضع التوكن:', error);
        
        // إرجاع تفاصيل الخطأ لبوستمان للمساعدة في الفحص
        res.status(500).json({
            status: "failed",
            message: error.message || "حدث خطأ أثناء الاتصال بـ Puter",
            errorDetails: error
        });
    }
};

module.exports = {
    generate3DModel
};