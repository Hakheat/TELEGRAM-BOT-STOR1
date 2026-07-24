import { create } from "zustand";

export type Language = "en" | "km";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    products: "Products",
    stock_keys: "Stock / Keys",
    orders: "Orders",
    users: "Users",
    broadcast: "Broadcast",
    settings: "Settings",
    search_placeholder: "🔍 Search orders, keys, users...",
    dark_mode: "Dark Mode",
    active_users: "Active Users",
    total_sales: "Total Sales",
    total_products: "Total Products",
    live_feed: "Live Activity Feed",
    save_config: "Save Bot Configuration",
    bot_token: "Telegram Bot Token",
    bot_token_desc: "This token controls connection with the Telegram API. The bot will automatically hot-reload when updated.",
    logout: "Log Out",
    welcome: "Welcome",
    quick_stats: "Quick Stats Summary",
    sales_overview: "Sales Overview",
    no_recent_activities: "No recent activities found.",
    loading: "Loading...",
    executive_analytics: "📊 Executive Analytics",
    real_time_metrics: "Real-time performance metrics and live automated bot activity feed.",
    system_live: "System Live & Connected",
    today_revenue: "Today Revenue",
    all_automated_sales: "All automated sales today",
    sold_today: "Sold Today",
    successfully_delivered: "Successfully delivered keys",
    low_stock_warning: "Low Stock Warning",
    items_with_low_stock: "Items with stock <= 5",
    total_bot_users: "Total Bot Users",
    registered_customers: "Registered Telegram customers",
    revenue_sales_analytics: "📈 Revenue & Sales Analytics",
    hour_volume_trend: "24-hour volume trend",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    system_settings: "⚙️ System Settings",
    system_settings_desc: "Configure bot credentials and server environment.",
    bot_config: "Telegram Bot Configuration",
    bot_config_desc: "Settings related to your active Telegram bot instance",
    bot_father_desc: "Obtained from Telegram's @BotFather. Keep this token secret. Updating this token will dynamically restart the bot connection with the new bot identity.",
    saving: "Saving changes...",
    success_save: "Settings updated and Telegram bot hot-reloaded successfully!",
    fail_load: "Failed to load system settings.",
    fail_save: "Failed to save settings.",
  },
  km: {
    dashboard: "ផ្ទាំងគ្រប់គ្រង",
    products: "ផលិតផល",
    stock_keys: "ស្តុក / កូដ",
    orders: "ការបញ្ជាទិញ",
    users: "អ្នកប្រើប្រាស់",
    broadcast: "ផ្សព្វផ្សាយ",
    settings: "ការកំណត់",
    search_placeholder: "🔍 ស្វែងរកការបញ្ជាទិញ កូដ សមាជិក...",
    dark_mode: "របៀបងងឹត",
    active_users: "សមាជិកសកម្ម",
    total_sales: "ការលក់សរុប",
    total_products: "ផលិតផលសរុប",
    live_feed: "សកម្មភាពបច្ចុប្បន្នភាពផ្ទាល់",
    save_config: "រក្សាទុកការកំណត់ Bot",
    bot_token: "Token របស់ Telegram Bot",
    bot_token_desc: "Token នេះប្រើសម្រាប់តភ្ជាប់ជាមួយ Telegram API។ Bot នឹងដំណើរការឡើងវិញភ្លាមៗដោយស្វ័យប្រវត្តបន្ទាប់ពីរក្សាទុក។",
    logout: "ចាកចេញ",
    welcome: "ស្វាគមន៍",
    quick_stats: "សេចក្តីសង្ខេបស្ថិតិរហ័ស",
    sales_overview: "ទិដ្ឋភាពទូទៅនៃការលក់",
    no_recent_activities: "មិនទាន់មានសកម្មភាពថ្មីៗនៅឡើយទេ។",
    loading: "កំពុងទាញទិន្នន័យ...",
    executive_analytics: "📊 ស្ថិតិវិភាគទូទៅ",
    real_time_metrics: "របាយការណ៍ស្ថិតិលម្អិត និងសកម្មភាពរបស់ Telegram Bot ក្នុងពេលជាក់ស្តែង។",
    system_live: "ប្រព័ន្ធដំណើរការធម្មតា & បានតភ្ជាប់",
    today_revenue: "ចំណូលថ្ងៃនេះ",
    all_automated_sales: "ចំណូលលក់ស្វ័យប្រវត្តថ្ងៃនេះ",
    sold_today: "លក់បានថ្ងៃនេះ",
    successfully_delivered: "កូដដែលបានប្រគល់ជូនអតិថិជនជោគជ័យ",
    low_stock_warning: "ផលិតផលជិតអស់ពីស្តុក",
    items_with_low_stock: "ចំនួនទំនិញដែលមានក្នុងស្តុក <= ៥",
    total_bot_users: "សមាជិក Bot សរុប",
    registered_customers: "អតិថិជនដែលបានចុះឈ្មោះក្នុង Telegram",
    revenue_sales_analytics: "📈 ស្ថិតិវិភាគចំណូល និងការលក់",
    hour_volume_trend: "និន្នាការលក់ក្នុងរយៈពេល ២៤ ម៉ោង",
    daily: "ប្រចាំថ្ងៃ",
    weekly: "ប្រចាំសប្តាហ៍",
    monthly: "ប្រចាំខែ",
    system_settings: "⚙️ ការកំណត់ប្រព័ន្ធ",
    system_settings_desc: "Configure bot credentials and server environment.",
    bot_config: "ការកំណត់ Telegram Bot",
    bot_config_desc: "កំណត់រចនាសម្ព័ន្ធព័ត៌មាន Bot របស់លោកអ្នកដែលកំពុងដំណើរការ",
    bot_father_desc: "ទទួលបានពី @BotFather របស់ Telegram។ សូមរក្សាទុកវាជាការសម្ងាត់។ ការកែប្រែនឹងធ្វើឱ្យ Bot ដំណើរការឡើងវិញដោយស្វ័យប្រវត្តជាមួយគណនី Bot ថ្មី។",
    saving: "កំពុងរក្សាទុក...",
    success_save: "បានរក្សាទុកការកំណត់ និងដំណើរការ Bot ឡើងវិញដោយជោគជ័យ!",
    fail_load: "បរាជ័យក្នុងការទាញយកការកំណត់ប្រព័ន្ធ។",
    fail_save: "បរាជ័យក្នុងការរក្សាទុកការកំណត់。",
  },
};

export const useLanguageStore = create<LanguageState>((set, get) => {
  // Safe access to localStorage on client side
  const getInitialLanguage = (): Language => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dashboard_lang");
      if (stored === "en" || stored === "km") {
        return stored;
      }
    }
    return "km"; // Default to Khmer
  };

  return {
    language: getInitialLanguage(),
    setLanguage: (lang: Language) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("dashboard_lang", lang);
      }
      set({ language: lang });
    },
    t: (key: string) => {
      const lang = get().language;
      return translations[lang][key] || key;
    },
  };
});
