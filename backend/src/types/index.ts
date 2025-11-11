export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

import { Request as ExpressRequest } from 'express';

export interface Request extends ExpressRequest {
    user?: User;
}