import axios from "axios";

// إنشاء EventTarget لإرسال أحداث مخصصة للـ UI
export const axiosEvent = new EventTarget();

const BASE_URL = "https://localhost:7184/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // إرسال الـ Cookies (Http-Only) مع كل طلب
});

// --- Interceptor للطلبات (Request) ---
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// --- Interceptor للاستجابات (Response) ---
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. إذا لم يوجد رد من السيرفر (Network Error / Server Down)
    if (!error.response) {
      if (!originalRequest?.skipGlobalErrorHandler) {
        axiosEvent.dispatchEvent(
          new CustomEvent("axios-error", { detail: "/error/0" })
        );
      }
      return Promise.reject(error);
    }

    const { status } = error.response;

    // 2. معالجة انتهاء السيشن (401 Unauthorized)
    // نضعها في البداية مع return لمنع الكود من الوصول للـ switch تحت
    if (status === 401) {
      axiosEvent.dispatchEvent(
        new CustomEvent("axios-error", { detail: "session-expired" })
      );
      // نرفض الطلب هنا فوراً لمنع أي توجيه لصفحات الخطأ
      return Promise.reject(error);
    }

    // 3. أخطاء البيانات أو التعارض (Validation / Conflict)
    // نترك المعالجة للـ Component نفسه (مثل عرض رسالة خطأ تحت الإدخال)
    if (status === 400 || status === 409) {
      return Promise.reject(error);
    }

    // 4. تحديد مسار التوجيه لصفحات الخطأ العالمية
    let targetRoute = null;

    switch (status) {
      case 403:
        targetRoute = "/error/403";
        break;
      case 404:
        // نتحقق إذا كان المبرمج طلب تجاهل الخطأ العالمي لهذا الريكويست
        if (!originalRequest?.skipGlobalErrorHandler) {
          targetRoute = "/error/404";
        }
        break;
      default:
        // التعامل مع أخطاء السيرفر 500 وما فوق فقط
        if (status >= 500) {
          targetRoute = "/error/500";
        }
        break;
    }

    // 5. إرسال حدث التوجيه فقط إذا تم تحديد مسار ولم يُطلب التجاهل
    if (targetRoute && !originalRequest?.skipGlobalErrorHandler) {
      axiosEvent.dispatchEvent(
        new CustomEvent("axios-error", { detail: targetRoute })
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;