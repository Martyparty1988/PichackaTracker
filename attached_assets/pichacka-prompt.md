# Kompletní zadání pro vývoj aplikace "Píchačka"

## Přehled a účel aplikace
Vytvořte moderní a uživatelsky přívětivou webovou aplikaci "Píchačka" pro sledování pracovní doby, výpočet výdělků a správu rodinných financí pro manželský pár. Aplikace musí fungovat spolehlivě na všech zařízeních (s důrazem na mobilní zobrazení a iPad), musí mít přihlašovací systém pro sdílení dat mezi členy rodiny a musí nabízet bohaté vizuální prvky a animace pro zlepšení uživatelského zážitku.

## Klíčové funkce

### 1. Časovač práce a sledování odpracovaného času
- **Časovač na hlavní obrazovce** - velké, snadno použitelné tlačítky
- **Persistence časovače** - musí pokračovat i když se aplikace zavře nebo se vypne zařízení
- **Výběr osoby** - jednoduchý přepínač mezi Maru (275 Kč/h, srážka 1/3) a Marty (400 Kč/h, srážka 1/2)
- **Volba aktivity** - kategorizace práce pro lepší přehled
- **Automatický výpočet** - výpočet výdělku a srážky na základě odpracovaného času

### 2. Správa financí s automatickým výpočtem
- **Zvláštní zpracování příjmů v CZK** - automatické odečítání výdělků
- **Oddělené zachování příjmů v EUR a USD** - cizí měny se neodečítají a vedou se samostatně
- **Správa společných financí** - sledování srážek, které jdou primárně na nájem a pak na dluhy

### 3. Výpočetní logika financí
- **Výpočet čistého zůstatku**:
  ```
  Zůstatek = (počet hodin Martyho × 400 × 0,5) + (počet hodin Marušky × 275 × 0,67) + ostatní příjmy v CZK
  ```
  
- **Správa srážek**:
  ```
  Srážky celkem = (počet hodin Martyho × 400 × 0,5) + (počet hodin Marušky × 275 × 0,33)
  ```
  
- **Priorita plateb z fondu srážek**:
  1. Nájem (24,500 Kč, automaticky každý měsíc 1. den)
  2. Splátky dluhů (až po zaplacení nájmu)

### 4. Přihlašovací systém
- **Registrace a přihlášení** pro různé členy rodiny
- **Sdílení dat** mezi různými zařízeními
- **Zabezpečení** osobních a finančních údajů
- **Persistence přihlášení** pro pohodlí uživatelů

### 5. Statistiky a přehledy
- **Denní, týdenní a měsíční souhrny** odpracovaného času
- **Grafy výdělků a srážek** pro vizuální reprezentaci dat
- **Sledování dluhů a splátek** s přehlednou vizualizací
- **Export dat** pro další použití

## Designové požadavky

### Barevné schéma
- **Pastelové barvy** - vyhněte se zelené, modré a růžové
- **Doporučené barvy**: 
  - Primární: pastelově fialová (#B39DDB)
  - Sekundární: pastelově oranžová (#FFCC80)
  - Doplňková: pastelově žlutá (#FFF59D)
  - Neutrální: béžová (#E6D7C3) a světle šedá (#F5F5F5)
  - Tmavá: tmavě šedá (#424242) pro text a ikony

### Uživatelské rozhraní
- **Zaoblené rohy** u všech prvků (karty, tlačítka, formuláře)
- **Stínování a hloubka** pro vytvoření hierarchie prvků
- **Konzistentní typografie** s dobrou čitelností na všech zařízeních
- **Dostatek prostoru** mezi prvky pro pohodlné používání na dotykovém zařízení
- **Responzivní design** optimalizovaný pro mobilní zařízení i tablety

### Animace a interakce
- **Plynulé přechody** mezi obrazovkami a stavy
- **Animace časovače** - vizuální zpětná vazba při běžícím časovači
  - Pulzující efekt nebo postupné vyplňování kruhu
  - Animovaný přechod mezi stavy (spuštěno, pauza, zastaveno)
- **Mikroanimace** při interakci s tlačítky a ovládacími prvky
- **Animované grafy** s postupným vykreslováním dat
- **Jemné přechody** při přepínání mezi záložkami

## Technická specifikace

### Frontend
- **Framework**: React.js s Vite pro rychlý vývoj
- **Styling**: Tailwind CSS pro konzistentní a responzivní design
- **Komponenty**: ShadCN UI pro elegantní a moderní prvky uživatelského rozhraní
- **Animace**: Framer Motion pro plynulé a profesionální animace
- **Grafy**: Chart.js nebo Recharts pro interaktivní vizualizace dat
- **State Management**: React Context nebo Zustand pro jednoduchou správu stavu
- **Formuláře**: React Hook Form s Zod pro validaci

### Backend
- **API**: Node.js s Express
- **Databáze**: MongoDB pro flexibilní ukládání dat
- **Autentizace**: JWT (JSON Web Tokens) pro bezpečné přihlašování
- **Serverless Functions**: Možné využití pro menší mikroslužby

### Persistence dat
- **Lokální ukládání**: IndexedDB nebo localStorage pro offline funkcionalitu
- **Synchronizace**: Automatická synchronizace s cloudem, když je zařízení online
- **Zálohování**: Automatické pravidelné zálohování dat

## Struktura aplikace

### Struktura souborů
```
pichacka/
├── public/                  # Statické soubory
│   ├── favicon.ico
│   ├── logo.svg
│   ├── manifest.json
│   └── icons/
│
├── src/
│   ├── assets/              # Obrázky, fonty, atd.
│   │
│   ├── components/          # Znovu použitelné komponenty
│   │   ├── ui/              # Základní UI komponenty
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/          # Komponenty rozvržení
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── timer/           # Komponenty pro časovač
│   │   │   ├── Timer.jsx
│   │   │   ├── TimerControls.jsx
│   │   │   └── TimerDisplay.jsx
│   │   │
│   │   ├── finance/         # Komponenty pro finance
│   │   │   ├── IncomeForm.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   └── FinanceSummary.jsx
│   │   │
│   │   └── auth/            # Komponenty pro přihlašování
│   │       ├── LoginForm.jsx
│   │       └── RegisterForm.jsx
│   │
│   ├── contexts/            # React kontexty
│   │   ├── AuthContext.jsx
│   │   ├── TimerContext.jsx
│   │   └── FinanceContext.jsx
│   │
│   ├── hooks/               # Vlastní React hooks
│   │   ├── useTimer.js
│   │   ├── useWorkLogs.js
│   │   └── useFinances.js
│   │
│   ├── lib/                 # Pomocné funkce a knihovny
│   │   ├── api.js           # API volání
│   │   ├── storage.js       # Práce s localStorage/IndexedDB
│   │   ├── calculations.js  # Finanční výpočty
│   │   └── animations.js    # Animační funkce
│   │
│   ├── pages/               # Hlavní stránky aplikace
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── WorkLogs.jsx
│   │   ├── Finances.jsx
│   │   ├── Debts.jsx
│   │   └── Settings.jsx
│   │
│   ├── styles/              # Styly
│   │   ├── global.css
│   │   └── animations.css
│   │
│   ├── App.jsx              # Hlavní komponenta
│   ├── main.jsx             # Vstupní bod aplikace
│   └── routes.jsx           # Definice cest
│
├── server/                  # Backend kód (pokud je potřeba)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── .env.example             # Příklad proměnných prostředí
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

### Hlavní obrazovky aplikace

1. **Přihlašovací obrazovka**
   - Přihlašovací formulář
   - Registrační formulář
   - Logo a animované prvky

2. **Dashboard (Hlavní obrazovka)**
   - Velký časovač s tlačítky Start/Pauza/Stop
   - Přepínač osob (Maru/Marty)
   - Výběr aktivity
   - Souhrn aktuálního dne (odpracovaný čas, výdělek, srážky)
   - Rychlý přehled financí

3. **Pracovní záznamy**
   - Seznam odpracovaných časů
   - Filtrování a řazení
   - Možnost manuální editace a přidání záznamů
   - Grafy odpracovaného času podle dne/týdne/měsíce

4. **Finance**
   - Přehled příjmů a výdajů
   - Stav společného účtu srážek
   - Sledování nájmu
   - Formulář pro přidání příjmů s automatickým odečtem
   - Grafy a vizualizace toku peněz

5. **Dluhy a splátky**
   - Seznam dluhů s progress bary
   - Historie splátek
   - Přidání nového dluhu
   - Výpočet dostupných prostředků pro splátky

6. **Nastavení**
   - Úprava sazeb a procent srážek
   - Správa kategorií aktivit
   - Nastavení nájmu
   - Export/import dat
   - Správa účtu

## Detailní popis časovače

### Funkce časovače
- **Persistence**: Musí pokračovat i po zavření aplikace, využití localStorage a serverové synchronizace
- **Spuštění**: Po stisknutí "Start" se zaznamená čas spuštění do localStorage
- **Pauza**: Po stisknutí "Pauza" se uloží doba běhu, časovač se pozastaví
- **Zastavení**: Po stisknutí "Stop" se vypočítá celkový odpracovaný čas, výdělek a srážka
- **Výpočty** se provedou na základě vybrané osoby a hodinové sazby

### Animace časovače
- **Spuštěný stav**: Pulzující prvek nebo postupné vyplňování kruhu reprezentující uplynulý čas
- **Pozastavený stav**: Animace "zamrzne" a vizuálně indikuje pauzu
- **Zastavený stav**: Animace reset a vizuální potvrzení o uložení záznamu

## Detailní popis finančních výpočtů

### Výpočet výdělku a srážek
```javascript
// Výpočet výdělku
function calculateEarnings(person, minutes) {
  const hourlyRate = person === 'maru' ? 275 : 400;
  return (minutes / 60) * hourlyRate;
}

// Výpočet srážky
function calculateDeduction(person, earnings) {
  const deductionRate = person === 'maru' ? 1/3 : 1/2;
  return earnings * deductionRate;
}
```

### Správa příjmů v CZK s automatickým odečtem
```javascript
function processIncomeCZK(amount, dailyEarnings) {
  // Odečíst výdělky od příjmu
  const offsetAmount = Math.min(amount, dailyEarnings);
  const finalAmount = amount - offsetAmount;
  
  return {
    originalAmount: amount,
    offsetByEarnings: offsetAmount,
    finalAmountToSubmit: finalAmount
  };
}
```

### Výpočet dostupnosti prostředků ze srážek
```javascript
function calculateAvailableDeductions(totalDeductions, rent) {
  // Nejprve pokrýt nájem
  const remainingAfterRent = totalDeductions - rent;
  
  // Pokud je zůstatek záporný, nájem není plně pokryt
  if (remainingAfterRent < 0) {
    return {
      rentCovered: false,
      rentShortage: Math.abs(remainingAfterRent),
      availableForDebts: 0
    };
  }
  
  // Pokud je zůstatek kladný, lze ho použít na dluhy
  return {
    rentCovered: true,
    rentShortage: 0,
    availableForDebts: remainingAfterRent
  };
}
```

## Případy užití

### Případ užití 1: Sledování pracovní doby
1. Uživatel se přihlásí do aplikace
2. Na hlavní obrazovce vybere osobu (Maru/Marty)
3. Vybere aktivitu, na které bude pracovat
4. Stiskne tlačítko "Start" pro zahájení časovače
5. Během práce může časovač pozastavit tlačítkem "Pauza"
6. Po dokončení práce stiskne "Stop"
7. Aplikace automaticky vypočítá odpracovaný čas, výdělek a srážku
8. Záznam se uloží a synchronizuje s cloudem

### Případ užití 2: Zadání příjmu v CZK s automatickým odečtem
1. Uživatel přejde do sekce "Finance"
2. Vyplní formulář pro nový příjem (částka, popis, datum)
3. Vybere měnu CZK
4. Aplikace automaticky vypočítá, kolik z částky lze odečíst z denního výdělku
5. Zobrazí se původní částka, odečtená částka a finální částka k odevzdání
6. Uživatel potvrdí a příjem se zaznamená

### Případ užití 3: Správa nájmu a dluhů
1. Na začátku měsíce se automaticky vygeneruje náklad na nájem
2. Aplikace vypočítá, zda jsou srážky dostatečné pro pokrytí nájmu
3. Pokud po zaplacení nájmu zůstanou prostředky, rozdělí se na splátky dluhů
4. Uživatel na dashboardu vidí aktuální stav nájmu a dluhů
5. V sekci "Dluhy" může sledovat progress splátek jednotlivých dluhů

## Poznámky pro vývojáře

### Kritické komponenty
- **Persistence časovače**: Použijte kombinaci localStorage a serverové synchronizace
- **Finanční výpočty**: Důsledně testujte přesnost všech výpočtů
- **Offline funkcionalita**: Aplikace musí fungovat i bez připojení k internetu
- **Synchronizace dat**: Řešte konflikty při synchronizaci změn z více zařízení

### Optimalizace výkonu
- **Lazy loading** pro méně důležité komponenty
- **Virtualizace seznamů** pro velké množství záznamů
- **Web Workers** pro náročné výpočty
- **Service Worker** pro offline funkcionalitu

### Bezpečnost
- **Šifrování citlivých dat** v lokálním úložišti
- **HTTPS** pro veškerou komunikaci
- **Cross-Site Request Forgery (CSRF)** ochrana
- **Content Security Policy (CSP)** pro prevenci XSS

## Priority vývoje
1. Základní přihlašovací systém a persistence dat
2. Časovač s persistencí a výpočty
3. Finanční výpočty a správa srážek
4. Uživatelské rozhraní a animace
5. Grafy a statistiky
6. Offline funkcionalita a synchronizace
7. Exporty a importy dat

## Závěr
Aplikace "Píchačka" má sloužit jako komplexní nástroj pro správu pracovní doby a financí manželského páru. Klíčový důraz je kladen na intuitivní uživatelské rozhraní s pěknými animacemi, persistence časovače i při zavření aplikace a přesné finanční výpočty s automatickým odečítáním výdělků od příjmů v CZK. Aplikace musí mít přihlašovací systém pro sdílení dat mezi různými zařízeními a musí využívat pastelové barvy (mimo modrou, zelenou a růžovou) s důrazem na moderní design se zaoblenými rohy.