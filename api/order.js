export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  if (req.method !== "POST") {
    return Response.json({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    const { channel, customer, items, delivery, date, instructions, subtotal, total } = body;

    if (!channel || !customer?.name || !items?.length) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const itemsList = items.map(i => `${i.name} (${i.option}) x${i.qty} — $${(i.price * i.qty).toFixed(2)}`).join("\n");

    if (channel === "email") {
      const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_PUBLIC_KEY,
          template_params: {
            customer_name: customer.name,
            customer_phone: customer.phone,
            items_list: itemsList,
            delivery_method: delivery.method,
            delivery_fee: `$${delivery.fee.toFixed(2)}`,
            subtotal: `$${subtotal.toFixed(2)}`,
            total: `$${total.toFixed(2)}`,
            order_date: date,
            special_instructions: instructions || "None"
          }
        })
      });

      if (!emailRes.ok) {
        const errText = await emailRes.text();
        throw new Error(`EmailJS failed: ${errText}`);
      }

      return Response.json({ success: true });
    }

    if (channel === "whatsapp") {
      const phoneId = process.env.WHATSAPP_PHONE_ID;
      const token = process.env.WHATSAPP_TOKEN;
      const kaylaNumber = process.env.KAYLA_WHATSAPP_NUMBER;

      if (!phoneId || !token || !kaylaNumber) {
        return Response.json({ success: false, error: "WhatsApp not configured yet. Try Email." }, { status: 503 });
      }

      const message = `🧁 *NEW ORDER*\n\n` +
        `*Customer:* ${customer.name}\n` +
        `*Phone:* ${customer.phone}\n` +
        `*Date:* ${date}\n\n` +
        `*Items:*\n${itemsList}\n\n` +
        `*Delivery:* ${delivery.method} — $${delivery.fee.toFixed(2)}\n` +
        `*Total:* $${total.toFixed(2)}\n\n` +
        `*Instructions:* ${instructions || "None"}`;

      const waRes = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: kaylaNumber,
          type: "text",
          text: { body: message }
        })
      });

      if (!waRes.ok) {
        const errData = await waRes.json();
        throw new Error(`WhatsApp API error: ${JSON.stringify(errData)}`);
      }

      return Response.json({ success: true });
    }

    return Response.json({ success: false, error: "Unknown channel" }, { status: 400 });

  } catch (err) {
    console.error("Order API error:", err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
