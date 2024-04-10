export interface CustomFont {
    family?: string;
    kind?: string;
    fileUrl?: string;
    files?: {
        [key: string]: string;
    };
}
export declare const getFontCss: ({ customFonts }: {
    customFonts?: CustomFont[];
}) => string;
export declare const getCss: ({ cssCode, contentId }: {
    cssCode?: string;
    contentId?: string;
}) => string;
export declare const getDefaultStyles: (isNested: boolean | undefined) => "" | "\n.builder-button {\n  all: unset;\n}\n\n.builder-text > p:first-of-type, .builder-text > .builder-paragraph:first-of-type {\n  margin: 0;\n}\n.builder-text > p, .builder-text > .builder-paragraph {\n  color: inherit;\n  line-height: inherit;\n  letter-spacing: inherit;\n  font-weight: inherit;\n  font-size: inherit;\n  text-align: inherit;\n  font-family: inherit;\n}\n";