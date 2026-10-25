declare module 'node-printer' {
    interface PrinterInfo {
        name: string;
        isDefault: boolean;
        options: Record<string, any>;
        status: number;
    }

    interface PrintJob {
        id: number;
        name: string;
        printerName: string;
        status: string;
        priority: number;
    }

    export function getPrinters(): PrinterInfo[];
    export function getPrinter(printerName: string): PrinterInfo;
    export function getDefaultPrinterName(): string;
    export function printDirect(options: {
        data: string | Buffer;
        printer?: string;
        type?: string;
        success?: (jobId: number) => void;
        error?: (error: Error) => void;
    }): void;
    export function getSupportedPrintFormats(): string[];
    export function getJob(printerName: string, jobId: number): PrintJob;
    export function setJob(printerName: string, jobId: number, command: string): void;
}
