export interface voucherTypes {
    id: number;
    type:string;
    email: string;
    code: string;
    amount: number;
    is_used: boolean;
    created_at: Date;
}