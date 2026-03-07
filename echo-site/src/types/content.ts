export interface SiteContacts {
  phoneMain: string;
  phoneTollFree: string;
  phoneTollFreeHref: string;
  email: string;
  address: string;
  requisites: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  contacts: SiteContacts;
}

export interface ServiceItem {
  slug: string;
  title: string;
  desc: string;
  steps: string[];
}

export interface SpecialItem {
  title: string;
  badge: string;
}

export interface FaqItem {
  q: string;
  a: string;
}
