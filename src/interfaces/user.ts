export interface IUser {
    id: number;
    full_name: string;
    name: string;
    email: string;
    email_verified_at?: string | null;
    address?:[];
    phone_number?: string | null;
    role: string;
    date_of_birth?: string | null;
    gender?: string | null;
    status: string;
    created_at?: string;
    updated_at?: string;
    avatar?: string | null;
    password?: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserRegister {
    name: string;
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    address: string;
    phone_number: string;
    date_of_birth: string;
    gender: string;
}
