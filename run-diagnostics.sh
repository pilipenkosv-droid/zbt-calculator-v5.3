#!/bin/bash

echo "🔍 Запуск диагностики слайдеров ZBT Calculator"
echo "=============================================="

# Проверяем, что сервер запущен
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "❌ Сервер не запущен на localhost:3001"
    echo "Запустите: npm run dev"
    exit 1
fi

echo "✅ Сервер запущен на localhost:3001"
echo ""
echo "📋 Доступные способы диагностики:"
echo ""
echo "1. 🌐 Диагностическая страница:"
echo "   Откройте: file://$(pwd)/diagnostics.html"
echo ""
echo "2. 🔧 Консоль основного приложения:"
echo "   Откройте: http://localhost:3001"
echo "   Нажмите F12 → Console"
echo "   Вставьте содержимое файла: console-diagnostics.js"
echo ""
echo "3. 📄 Просмотр диагностических файлов:"
echo "   - diagnostics.html - автономная диагностическая страница"
echo "   - console-diagnostics.js - скрипт для консоли браузера"
echo ""

# Открываем диагностическую страницу
echo "🚀 Открываем диагностическую страницу..."
open diagnostics.html

echo ""
echo "✅ Диагностика запущена!"
echo "Проверьте результаты в браузере."
