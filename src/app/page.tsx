'use client';
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'book-1',
          price: 500, // 500 рублей
          description: 'Электронная книга "Как выучить Next.js"',
        }),
      });

      const data = await response.json();
      
      // Если ЮKassa вернула ссылку на оплату, перенаправляем пользователя
      if (data.confirmation_url) {
        window.location.href = data.confirmation_url;
      }
    } catch (error) {
      console.error('Ошибка оплаты:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-lg max-w-sm">
        <h1 className="text-2xl font-bold mb-4">React/Next.js Мастер-класс</h1>
        <p className="text-gray-600 mb-6">Получите мгновенный доступ к материалам после оплаты.</p>
        <div className="text-3xl font-bold mb-6">500 ₽</div>
        
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Создание платежа...' : 'Оплатить'}
        </button>
      </div>
    </main>
  );
}