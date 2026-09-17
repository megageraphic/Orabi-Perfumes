// ملف مستقل لتجهيز وإرسال الطلب عبر الواتساب وتحديث الإجمالي تلقائياً
function changeQty(btn, change) {
    const qtySpan = btn.parentElement.querySelector('.qty-val');
    let currentQty = parseInt(qtySpan.textContent) || 0;
    currentQty += change;
    if (currentQty < 0) currentQty = 0;
    qtySpan.textContent = currentQty;
    
    // حساب الإجمالي الكلي المباشر بعد تغيير الكمية
    updateTotalPrice();
}

function updateTotalPrice() {
    const rows = document.querySelectorAll('.menu-table tbody tr');
    let grandTotal = 0;

    rows.forEach(row => {
        const qtySpans = row.querySelectorAll('.qty-val');
        qtySpans.forEach(span => {
            const qty = parseInt(span.textContent) || 0;
            if (qty > 0) {
                const price = parseInt(span.getAttribute('data-price')) || 0;
                grandTotal += (qty * price);
            }
        });
    });

    // تحديث نص إجمالي المبلغ في الصفحة باللون الأحمر
    const totalDisplay = document.getElementById('total-amount-display');
    if (totalDisplay) {
        totalDisplay.textContent = grandTotal + ' ج';
    }
}

function sendOrderToWhatsApp() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();

    // تجميع العطور والكميات المحددة
    const rows = document.querySelectorAll('.menu-table tbody tr');
    let itemsList = [];
    let totalPrice = 0;

    rows.forEach(row => {
        const perfName = row.getAttribute('data-name');
        const qtySpans = row.querySelectorAll('.qty-val');
        
        qtySpans.forEach(span => {
            const qty = parseInt(span.textContent) || 0;
            if (qty > 0) {
                const size = span.getAttribute('data-size');
                const price = parseInt(span.getAttribute('data-price')) || 0;
                const itemTotal = qty * price;
                totalPrice += itemTotal;
                itemsList.push(`• ${perfName} (${size}) - العدد: ${qty} - السعر: ${itemTotal} ج`);
            }
        });
    });

    if (itemsList.length === 0) {
        alert('برجاء تحديد العطور والكميات المطلوبة أولاً!');
        return;
    }

    if (!name) {
        alert('برجاء كتابة الاسم الكامل!');
        document.getElementById('cust-name').focus();
        return;
    }

    if (!phone) {
        alert('برجاء كتابة رقم الهاتف!');
        document.getElementById('cust-phone').focus();
        return;
    }

    if (!address) {
        alert('برجاء كتابة عنوان التوصيل!');
        document.getElementById('cust-address').focus();
        return;
    }

    // صياغة رسالة الواتساب المنسقة
    let message = `*طلب جديد من عرابي للعطور* 🌸\n\n`;
    message += `*الطلبات:*\n`;
    message += itemsList.join('\n') + `\n\n`;
    message += `*الإجمالي:* ${totalPrice} جنيه\n\n`;
    message += `*بيانات التوصيل:*\n`;
    message += `👤 *الاسم:* ${name}\n`;
    message += `📞 *الهاتف:* ${phone}\n`;
    message += `📍 *العنوان:* ${address}`;

    // رقم الواتساب المخصص لاستقبال الطلبات
    const targetWhatsapp = "201035234373";
    const whatsappUrl = `https://wa.me/${targetWhatsapp}?text=${encodeURIComponent(message)}`;

    // فتح رابط الواتساب مباشرة
    window.open(whatsappUrl, '_blank');
}