// النصوص المتاحة باللغات المختلفة
const translations = {
    ar: {
        pageTitle: "محول العملات",
        languageLabel: "اللغة:",
        appTitle: "محول العملات",
        amountLabel: ":المبلغ",
        fromCurrencyLabel: ":من",
        toCurrencyLabel: ":إلى",
        convertButton: "تحويل",
        resultText: ":النتيجة",
    },
    en: {
        pageTitle: "Currency Converter",
        languageLabel: "Language:",
        appTitle: "Currency Converter",
        amountLabel: "Amount:",
        fromCurrencyLabel: "From:",
        toCurrencyLabel: "To:",
        convertButton: "Convert",
        resultText: "Result:",
    },
};

// وظيفة لتحديث النصوص بناءً على اللغة المحددة
function changeLanguage() {
    const language = document.getElementById("languageSelector").value;

    // تحديث النصوص في التطبيق
    document.getElementById("pageTitle").textContent = translations[language].pageTitle;
    document.getElementById("languageLabel").textContent = translations[language].languageLabel;
    document.getElementById("appTitle").textContent = translations[language].appTitle;
    document.getElementById("amountLabel").textContent = translations[language].amountLabel;
    document.getElementById("fromCurrencyLabel").textContent = translations[language].fromCurrencyLabel;
    document.getElementById("toCurrencyLabel").textContent = translations[language].toCurrencyLabel;
    document.getElementById("convertButton").textContent = translations[language].convertButton;

    // تحديث النتيجة إذا كانت موجودة
    const resultText = document.getElementById("resultText");
    if (resultText.textContent) {
        resultText.textContent = translations[language].resultText + resultText.textContent.split(":")[1];
    }
}

// تحميل البيانات عند بدء تشغيل التطبيق
document.addEventListener("DOMContentLoaded", () => {
    changeLanguage(); // تعيين اللغة الافتراضية عند التحميل
});
// جلب أسعار العملات من API
async function fetchExchangeRates(baseCurrency) {
    const apiUrl = `https://open.er-api.com/v6/latest/${baseCurrency}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.result === "success") {
            return data.rates;
        } else {
            throw new Error("Failed to fetch exchange rates.");
        }
    } catch (error) {
        alert("Error fetching exchange rates: " + error.message);
        return {};
    }
}

// إعداد القوائم بالعملات
async function populateCurrencyOptions() {
    const rates = await fetchExchangeRates("USD");
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");

    // مسح الخيارات القديمة
    fromCurrency.innerHTML = "";
    toCurrency.innerHTML = "";

    Object.keys(rates).forEach(currency => {
        const optionFrom = new Option(currency, currency);
        const optionTo = new Option(currency, currency);
        fromCurrency.add(optionFrom);
        toCurrency.add(optionTo);
    });

    // تعيين القيم الافتراضية
    fromCurrency.value = "USD";
    toCurrency.value = "EUR";
}

// دالة تحويل العملات
async function convertCurrency() {
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document.getElementById("fromCurrency").value;
    const toCurrency = document.getElementById("toCurrency").value;

    if (isNaN(amount) || amount <= 0) {
        alert("يرجى إدخال مبلغ صالح.");
        return;
    }

    const rates = await fetchExchangeRates(fromCurrency);

    if (!rates[toCurrency]) {
        alert("فشل في العثور على سعر الصرف للعملة المحددة.");
        return;
    }

    const convertedAmount = amount * rates[toCurrency];
    document.getElementById("resultText").textContent = `النتيجة: ${convertedAmount.toFixed(2)} ${toCurrency}`;
}

// تحميل القوائم عند تشغيل التطبيق
populateCurrencyOptions();
