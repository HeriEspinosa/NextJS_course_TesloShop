import { IProduct } from '../interfaces';

export type FetchProducts =
    | { status: string; message: string; products?: [] }
    | { status: string; products: IProduct[] };
