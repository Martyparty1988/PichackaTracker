# Píchačka

Komplexní aplikace pro sledování času a správu rodinných financí, navržená pro optimalizaci sdílených finančních aktivit a osobní produktivity páru.

## Funkce

- **Sledování pracovní doby**: Přesné měření odpracovaného času s výběrem osoby a aktivity
- **Výpočet výdělků**: Automatické výpočty výdělků na základě odpracovaných hodin
- **Správa financí**: Evidování příjmů, výdajů v různých měnách
- **Sledování dluhů**: Správa dluhů mezi partnery
- **PWA podpora**: Funguje jako Progressive Web App s offline funkcionalitou
- **Responzivní design**: Optimalizováno pro desktop i mobilní zařízení

## Technologie

- React s TypeScript
- Zustand pro správu stavu
- Express backend
- TailwindCSS pro stylování
- Wouter pro směrování

## Instalace a spuštění

1. Naklonujte repozitář:
```bash
git clone https://github.com/VASE_UZIVATELSKE_JMENO/pichacka.git
cd pichacka
```

2. Nainstalujte závislosti:
```bash
npm install
```

3. Spusťte vývojový server:
```bash
npm run dev
```

4. Aplikace bude dostupná na `http://localhost:5000`

## Struktura projektu

- `/client` - Frontend aplikace (React, TypeScript)
- `/server` - Backend aplikace (Express)
- `/shared` - Sdílené typy a schémata

## Vývojové pokyny

- Pro přidání nových funkcí použijte architekturu založenou na komponentách
- Dodržujte typovou bezpečnost s TypeScript
- Pro nové API endpointy aktualizujte interface IStorage

## Licence

MIT