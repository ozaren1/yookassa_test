import { NextResponse } from 'next/server';
import { YooCheckout } from '@a2seven/yoo-checkout';// Инициализация клиента
const checkout = new YooCheckout({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { price, description } = body;

    // Генерируем уникальный ID заказа (в реальном проекте берем из БД)
    const orderId = `order_${Date.now()}`;

    const payment = await checkout.createPayment({
      amount: {
        value: price.toFixed(2),
        currency: 'RUB',
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?order_id=${orderId}`,
      },
      capture: true, // Автоматически списывать деньги (без холдирования)
      description: description,
      metadata: {
        orderId: orderId, // Передаем свои данные, они вернутся в вебхуке
      },
    });

    return NextResponse.json({
      id: payment.id,
      confirmation_url: payment.confirmation.confirmation_url,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ошибка создания платежа' }, { status: 500 });
  }
}