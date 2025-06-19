export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    avatar: string;
    status: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserRegister {
    name: string;
    email: string;
    password: string;
}
