export interface AuthData {
    userId: string;
    token: string;
}

export interface AuthInput {
    email: string;
    password: string;
}

export interface AuthSignUpInput {
    email: string;
    password: string;
    name: string;
}

export interface HourTotals {
    week: number;
    month: number;
}