export interface NavLink {
  href: string;
  label: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
}

export interface User {
  name?: string;
}

export interface RootState {
  auth: {
    isLoggedIn: boolean;
    user: string | null;
  };
}
