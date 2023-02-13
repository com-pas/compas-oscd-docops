import { TemplateResult } from 'lit-element';
import './compas-open-plugin.js';
declare const _default: {
    title: string;
    component: string;
    argTypes: {
        allowLocalFile: {
            control: string;
        };
        selectedType: {
            control: string;
            options: string[];
        };
    };
};
export default _default;
interface Story<T> {
    (args: T): TemplateResult;
    args?: Partial<T>;
    argTypes?: Record<string, unknown>;
}
interface ArgTypes {
    allowLocalFile?: boolean;
    selectedType?: string;
    slot?: TemplateResult;
}
export declare const Regular: Story<ArgTypes>;
export declare const SelectedType: Story<ArgTypes>;
