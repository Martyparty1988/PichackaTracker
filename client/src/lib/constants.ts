export const CONSTANTS = {
  RENT_AMOUNT: 24500,
  PERSONS: [
    { id: 1, name: "Maru", hourlyRate: 275, deductionRate: 1/3, initials: "MN" },
    { id: 2, name: "Marty", hourlyRate: 400, deductionRate: 1/2, initials: "MT" }
  ],
  ACTIVITIES: [
    { id: 1, name: "Vývoj software", color: "#B39DDB" },
    { id: 2, name: "Design", color: "#FFCC80" },
    { id: 3, name: "Schůzka", color: "#FFF59D" },
    { id: 4, name: "Výzkum", color: "#E6D7C3" },
    { id: 5, name: "Jiné", color: "#F5F5F5" }
  ],
  TIMER_STATUS: {
    RUNNING: "running",
    PAUSED: "paused",
    STOPPED: "stopped"
  },
  CURRENCIES: ["CZK", "EUR", "USD"],
  FINANCE_TYPES: ["income", "expense"],
  STORAGE_KEYS: {
    TIMER_STATE: "pichacka_timer_state",
    AUTH_TOKEN: "pichacka_auth_token",
    AUTH_USER: "pichacka_auth_user",
    SETTINGS: "pichacka_settings"
  }
};
