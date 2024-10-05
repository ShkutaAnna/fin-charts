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