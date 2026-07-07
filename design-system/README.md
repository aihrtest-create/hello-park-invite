# @mega-park/design-system

Design system для проектов **Hello Park · Конструктор ДР**.  
Токены, CSS-переменные, React-компоненты, утилиты.

---

## Установка в другой проект

### Вариант 1 — локальная ссылка (без публикации)

В `package.json` целевого проекта:

```json
{
  "dependencies": {
    "@mega-park/design-system": "file:../DR-construct-Mega/design-system"
  }
}
```

Затем:

```bash
npm install
```

### Вариант 2 — npm publish (если нужен как пакет)

```bash
cd design-system
npm publish --access public
```

Потом в другом проекте:

```bash
npm install @mega-park/design-system
```

---

## Подключение стилей

В `main.tsx` (или главном `.css`) целевого проекта:

```ts
// Всё разом (шрифты + CSS-переменные + анимации)
import "@mega-park/design-system/styles";
```

Или по-отдельности:

```ts
import "@mega-park/design-system/fonts";  // Gilroy + Nunito
import "@mega-park/design-system/theme";  // CSS custom properties
```

### Tailwind CSS v4

Добавь путь к пакету в конфиг Tailwind, чтобы он видел классы компонентов:

```css
/* tailwind.css */
@import "tailwindcss";
@source "../node_modules/@mega-park/design-system/src";
```

---

## Использование

### Токены

```ts
import { colors, shadows, radius, v3 } from "@mega-park/design-system";

// Прямые значения цветов
console.log(colors.orange);       // "#FF6022"
console.log(colors.purpleDeep);   // "#5B2EBE"
console.log(shadows.cta);         // "0 12px 28px rgba(255, 96, 34, 0.32)"
```

### Компоненты

```tsx
import {
  Button,
  Pill,
  Stepper,
  AddButton,
  SectionTitle,
  ItemCard,
  BottomBar,
} from "@mega-park/design-system";

// Кнопка CTA
<Button variant="cta" size="xl">Выбрать пакет</Button>
<Button variant="purple" size="xl">Перейти к оплате</Button>

// Пилюля / тег
<Pill variant="hit">Хит!</Pill>
<Pill variant="top">Топ</Pill>
<Pill variant="premium">Хит продаж</Pill>

// Карточка товара
<ItemCard
  title="Квест «Путешествие в джунгли»"
  description="60 минут приключений для 8-15 детей"
  emoji="🌴"
  price={5000}
  badge="hit"
  selected={selected}
  onToggle={() => setSelected(!selected)}
  variant="row"   // или "tile"
/>

// Степпер количества
<Stepper value={count} onDec={() => setCount(c => c - 1)} onInc={() => setCount(c => c + 1)} min={1} max={20} />

// Нижняя CTA-панель
<BottomBar
  label="Продолжить"
  price={totalPrice}
  caption="8 детей · будни"
  variant="primary"   // или "purple"
  onClick={handleNext}
/>

// Заголовок раздела
<SectionTitle caption="Выберите один или несколько">
  Шоу-программы
</SectionTitle>
```

### Утилиты

```ts
import { cn, formatPrice } from "@mega-park/design-system";

cn("text-sm", isActive && "font-bold")  // → tailwind-merge + clsx
formatPrice(5000)                        // → "5 000 ₽"
formatPrice(0)                           // → "0 ₽"
```

---

## Структура пакета

```
design-system/
├── src/
│   ├── index.ts                 # главный экспорт
│   ├── tokens.ts                # все токены (цвета, тени, радиусы, шрифты)
│   ├── styles/
│   │   ├── index.css            # fonts + theme + animations
│   │   ├── theme.css            # CSS custom properties + @theme inline
│   │   ├── fonts.css            # Gilroy, Nunito
│   │   └── animations.css       # float, shake, bubble-btn, app-viewport
│   ├── components/
│   │   ├── Button.tsx           # CTA / purple / стандартные варианты
│   │   ├── Pill.tsx             # теги: hit / top / premium / exclusive
│   │   ├── Stepper.tsx          # счётчик количества
│   │   ├── AddButton.tsx        # круглая кнопка +/−
│   │   ├── SectionTitle.tsx     # заголовок раздела с подписью
│   │   ├── ItemCard.tsx         # карточка товара (row / tile)
│   │   └── BottomBar.tsx        # фиксированная нижняя кнопка
│   └── utils/
│       ├── cn.ts                # tailwind-merge + clsx
│       └── formatPrice.ts       # форматирование рублей
└── package.json
```

---

## Цветовая палитра

| Токен                | HEX       | Использование                     |
|---------------------|-----------|-----------------------------------|
| `colors.orange`     | `#FF6022` | Основной CTA, кольцо фокуса       |
| `colors.purpleDeep` | `#5B2EBE` | Заголовки, выбранные элементы     |
| `colors.lavender`   | `#E9DEFF` | Фон выбранных карточек            |
| `colors.yellowSun`  | `#FFB81C` | Пакет «Базовый»                   |
| `colors.pinkHit`    | `#FF5C8A` | Пакет «Премиум», хит-теги         |
| `colors.greenTag`   | `#7DEAA0` | Теги «Хит!» / «Топ!»             |
| `colors.ink`        | `#1A1A1A` | Основной текст                    |
| `colors.inkSoft`    | `#5C5170` | Второстепенный текст              |

---

## Peer Dependencies

Пакет требует в проекте:

- `react >= 18`
- `lucide-react >= 0.4`
- `motion >= 12` (BottomBar анимация)
- `class-variance-authority >= 0.7`
- `tailwind-merge >= 2`
- `clsx >= 2`
- `@radix-ui/react-slot >= 1`
