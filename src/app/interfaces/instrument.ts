export interface IInstrument {
    id: string;
    symbol: string;
    kind: string;
    description: string;
    tickSize: number;
    currency: string;
    baseCurrency: string;
}