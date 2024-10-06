export interface IGetInstrumentsParams {
    provider?: string;
    kind?: string;
    symbol?: string;
    page?: number;
    size?: number;
}

export interface IGetExchangesParams {
    provider?: string;
}

export interface IGetCountBackParams {
    instrumentId: string;
    provider: string;
    interval: number;
    periodicity: string;
    barsCount: number;
}

export interface IGetDateRangeParams {
    instrumentId: string;
    provider: string;
    interval: number;
    periodicity: string;
    startDate: string;
    endDate?: string;
}

export interface IGetTimeBackParams {
    instrumentId: string;
    provider: string;
    interval: number;
    periodicity: string;
    timeBack: string;
}

export interface IBarsResponse {
    data: IBarsItem[];
}

export interface IBarsItem {
    t: string;
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
}

export interface IPaging {
    page: number;
    pages: number;
    items: number;
}

export interface IInstrument {
    id: string;
    symbol: string;
    kind: string;
    description: string;
    tickSize: number;
    currency: string;
    baseCurrency: string;
}

export interface IInstrumentsResponse {
    paging: IPaging;
    data: IInstrument[];
}

export interface IProvidersResponse {
    data: string[];
}