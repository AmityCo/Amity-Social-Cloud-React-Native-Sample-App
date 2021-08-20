declare module '*.png';
declare class FormData {
  append(name: string, value: string | Blob, fileName?: string): void;

  delete(name: string): void;

  get(name: string): string | null;

  getAll(name: string): string[];

  has(name: string): boolean;

  set(name: string, value: string | Blob, fileName?: string): void;

  forEach(callbackfn: (value: string, key: string, parent: FormData) => void, thisArg?: any): void;

  getParts(name: string): string[];
}
