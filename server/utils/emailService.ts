import nodemailer from "nodemailer";

export interface InvoiceData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryDetails?: {
    nationalAddress: string;
    shortCode?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingFee: number;
  totalAmount: number;
  isSubscription: boolean;
}

export const sendInvoiceEmail = async (data: InvoiceData) => {
  const storeEmail = "gamezoom100@gmail.com";
  
  // Format the item rows for HTML
  const itemRowsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee; text-align: right; font-family: 'Cairo', sans-serif;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee; text-align: center; font-family: 'Cairo', sans-serif;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee; text-align: left; font-family: 'Cairo', sans-serif;">${item.price} ر.س</td>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee; text-align: left; font-family: 'Cairo', sans-serif; font-weight: bold;">${item.price * item.quantity} ر.س</td>
    </tr>
  `
    )
    .join("");

  const deliveryDetailsHtml = !data.isSubscription
    ? `
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #eef2f3; direction: rtl; text-align: right;">
      <h3 style="margin-top: 0; color: #1a1a1a; font-family: 'Cairo', sans-serif; border-bottom: 1px solid #eef2f3; padding-bottom: 8px;">تفاصيل التوصيل الشحن 📦</h3>
      <p style="margin: 6px 0; font-size: 13px; color: #555;"><strong style="color: #000;">الاسم بالكامل:</strong> ${data.customerName}</p>
      <p style="margin: 6px 0; font-size: 13px; color: #555;"><strong style="color: #000;">رقم الجوال:</strong> ${data.customerPhone}</p>
      <p style="margin: 6px 0; font-size: 13px; color: #555;"><strong style="color: #000;">العنوان الوطني:</strong> ${data.deliveryDetails?.nationalAddress || "غير متوفر"}</p>
      ${data.deliveryDetails?.shortCode ? `<p style="margin: 6px 0; font-size: 13px; color: #555;"><strong style="color: #000;">المختصر:</strong> ${data.deliveryDetails.shortCode}</p>` : ""}
    </div>
  `
    : `
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #eef2f3; direction: rtl; text-align: right;">
      <h3 style="margin-top: 0; color: #1a1a1a; font-family: 'Cairo', sans-serif; border-bottom: 1px solid #eef2f3; padding-bottom: 8px;">بيانات الاشتراك والتفعيل ⚡</h3>
      <p style="margin: 6px 0; font-size: 13px; color: #555;"><strong style="color: #000;">البريد الإلكتروني المخصص للإرسال:</strong> ${data.customerEmail}</p>
      <p style="margin: 6px 0; font-size: 13px; color: #555;"><strong style="color: #000;">حالة التفعيل:</strong> تفعيل فوري وتلقائي على حسابك الشخصي</p>
    </div>
  `;

  // Create highly polished HTML invoice
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>فاتورة شراء - متجر خطفة</title>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;800&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: 'Cairo', Arial, sans-serif; direction: rtl; text-align: right;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 20px 0;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eef2f3;">
              
              <!-- Brand Header -->
              <tr style="background-color: #000000; text-align: center; color: #ffffff;">
                <td style="padding: 30px 20px;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px; font-family: 'Cairo', sans-serif; color: #ffffff;">مَتجر خطفة ⚡</h1>
                  <p style="margin: 5px 0 0 0; font-size: 13px; color: #a8a8a8; font-family: 'Cairo', sans-serif;">تجربة طلبات ذكية، سريعة ومضمونة</p>
                </td>
              </tr>
              
              <!-- Greeting Body -->
              <tr>
                <td style="padding: 30px 30px 20px 30px;">
                  <h2 style="margin: 0 0 10px 0; font-size: 18px; color: #1a1a1a; font-family: 'Cairo', sans-serif;">يا هلا والله ${data.customerName || "عميلنا الغالي"}، 👋</h2>
                  <p style="margin: 0; font-size: 14px; color: #555555; line-height: 1.6; font-family: 'Cairo', sans-serif;">
                    نسعد بخدمتك ونشكرك على ثقتك بمتجر خطفة! تم تأكيد طلبك بنجاح، وتحت هذا الإشعار تجد تفاصيل الفاتورة الإلكترونية لطلبك رقم <span style="font-family: monospace; font-weight: bold; background-color: #f0f0f0; padding: 2px 6px; border-radius: 4px;">#${data.orderId.toUpperCase()}</span>.
                  </p>
                </td>
              </tr>

              <!-- Order / Delivery Info Block -->
              <tr>
                <td style="padding: 10px 30px 10px 30px;">
                  ${deliveryDetailsHtml}
                </td>
              </tr>

              <!-- Invoice Items Table -->
              <tr>
                <td style="padding: 10px 30px 20px 30px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #eef2f3;">
                    <thead>
                      <tr style="background-color: #f9f9f9; border-bottom: 2px solid #eef2f3;">
                        <th style="padding: 12px; text-align: right; font-size: 13px; color: #000000; font-family: 'Cairo', sans-serif; font-weight: bold;">المنتج</th>
                        <th style="padding: 12px; text-align: center; font-size: 13px; color: #000000; font-family: 'Cairo', sans-serif; font-weight: bold;">الكمية</th>
                        <th style="padding: 12px; text-align: left; font-size: 13px; color: #000000; font-family: 'Cairo', sans-serif; font-weight: bold;">السعر الفردي</th>
                        <th style="padding: 12px; text-align: left; font-size: 13px; color: #000000; font-family: 'Cairo', sans-serif; font-weight: bold;">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemRowsHtml}
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Pricing Summary -->
              <tr>
                <td style="padding: 0px 30px 30px 30px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 2px solid #eeeeee; padding-top: 15px;">
                    ${
                      !data.isSubscription
                        ? `
                    <tr>
                      <td style="padding: 4px 0; font-size: 13px; color: #777777; font-family: 'Cairo', sans-serif;">المجموع الفرعي:</td>
                      <td style="padding: 4px 0; font-size: 13px; color: #1a1a1a; text-align: left; font-family: 'Cairo', sans-serif; font-weight: bold;">${data.totalAmount - data.shippingFee} ر.س</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; font-size: 13px; color: #777777; font-family: 'Cairo', sans-serif;">رسوم الشحن والتوصيل:</td>
                      <td style="padding: 4px 0; font-size: 13px; color: #1a1a1a; text-align: left; font-family: 'Cairo', sans-serif; font-weight: bold;">${data.shippingFee} ر.س</td>
                    </tr>
                    `
                        : ""
                    }
                    <tr>
                      <td style="padding: 8px 0; font-size: 16px; color: #000000; font-family: 'Cairo', sans-serif; font-weight: 800;">المبلغ الإجمالي المدفوع:</td>
                      <td style="padding: 8px 0; font-size: 20px; color: #10b981; text-align: left; font-family: 'Cairo', sans-serif; font-weight: 900;">${data.totalAmount} ر.س</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Support Note -->
              <tr style="background-color: #fafbfc; border-top: 1px solid #eef2f3; text-align: center;">
                <td style="padding: 25px 20px; font-family: 'Cairo', sans-serif; font-size: 12px; color: #777777; line-height: 1.6;">
                  إذا كان لديك أي استفسار أو واجهتك أي مشكلة، لا تتردد بالرد على هذا الإيميل مباشرة،<br> أو تواصل مع الدعم الفني لمتجر خطفة عبر الواتساب في أي وقت. ❤️
                  <p style="margin: 15px 0 0 0; font-weight: bold; color: #000000;">© 2026 متجر خطفة. جميع الحقوق محفوظة لـ gamezoom.win.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Try sending via SMTP if configuration is available
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  console.log(`[Invoice Processor] Preparing invoice for Order #${data.orderId}...`);
  console.log(`[Invoice Processor] Customer: ${data.customerName} (${data.customerEmail})`);
  console.log(`[Invoice Processor] Store Owner Copied: ${storeEmail}`);

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: parseInt(smtpPort, 10) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // Send to customer
      await transporter.sendMail({
        from: `"متجر خطفة" <${smtpUser}>`,
        to: data.customerEmail,
        subject: `⚡ فاتورة شراء جديدة رقم ${data.orderId.toUpperCase()} - متجر خطفة`,
        html: htmlContent,
      });

      // Send copy to store
      await transporter.sendMail({
        from: `"نظام الفواتير - خطفة" <${smtpUser}>`,
        to: storeEmail,
        subject: `🔔 طلب جديد وتم دفع الفاتورة رقم ${data.orderId.toUpperCase()} - العميل ${data.customerName}`,
        html: htmlContent,
      });

      console.log(`[Email Service] Success! SMTP Emails sent securely to ${data.customerEmail} and ${storeEmail}`);
      return { success: true, method: "smtp" };
    } catch (err) {
      console.error("[Email Service] SMTP Error (Falling back to console-logging):", err);
    }
  }

  // Fallback simulator logs
  console.log("\n======================================================================================");
  console.log(`⚡ [SIMULATED EMAIL SENT TO CUSTOMER: ${data.customerEmail}]`);
  console.log(`⚡ [SIMULATED EMAIL COPY SENT TO STORE: ${storeEmail}]`);
  console.log(`[SUBJECT]: ⚡ فاتورة شراء جديدة رقم ${data.orderId.toUpperCase()} - متجر خطفة`);
  console.log("======================================================================================");
  console.log(`[CUSTOMER DETAILS]:\nName: ${data.customerName}\nPhone: ${data.customerPhone}\nEmail: ${data.customerEmail}`);
  if (!data.isSubscription) {
    console.log(`[DELIVERY ADDRESS]: ${data.deliveryDetails?.nationalAddress} | Short Code: ${data.deliveryDetails?.shortCode || 'None'}`);
  }
  console.log("[INVOICE ITEMS]:");
  data.items.forEach(i => console.log(` - ${i.name} | Qty: ${i.quantity} | Price: ${i.price} SAR`));
  console.log(`[SHIPPING]: ${data.shippingFee} SAR`);
  console.log(`[TOTAL AMOUNT]: ${data.totalAmount} SAR`);
  console.log("======================================================================================\n");

  return { success: true, method: "simulator" };
};
