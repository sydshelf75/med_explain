declare module "lingo.dev" {
    export class LingoDotDevEngine {
        constructor(options: { apiKey: string });
        localizeText(
            text: string,
            options: { sourceLocale: string; targetLocale: string }
        ): Promise<string>;
    }
}
