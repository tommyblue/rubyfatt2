import { capitalize, includes, replace, isNil } from "lodash";
import * as React from "react";

export interface FormField {
    type: React.ComponentType<any>;
    name: string;
    helperText?: string;
    componentProps?: any;
    multiline?: number;
    fullWidth?: boolean;
    extraAttrs?: any;
}

interface IProps {
    onValueChange: (key: string, value: string) => void;
    values? : {[fieldName: string]: any};
    requiredFields?: string[];
    fields: FormField[];
}

export default class extends React.Component<IProps, {}> {
    public render(): JSX.Element {
        const requiredFields = this.props.requiredFields  || [];
        return (
            <form noValidate autoComplete="off">
                {
                    this.props.fields.map((field, index) => (this.renderField(field, requiredFields, index)))
                }
            </form>
        );
    }

    private renderField(field: FormField, requiredFields: string[], index: number): JSX.Element {
        if (field.componentProps !== undefined) {
            return <field.type key={`field_${index}`} name={field.name} {...field.componentProps} />
        }
        return this.renderTextField(field, requiredFields, index);
    }

    private renderTextField(field: FormField, requiredFields: string[], index: number): JSX.Element {
        const extraAttrs = field.extraAttrs || {}
        return (
            <field.type
                key={`field_${index}`}
                autoFocus={index===0}
                required={includes(requiredFields, field.name)}
                label={capitalize(replace(field.name, "_", " "))}
                value={!isNil(this.props.values) && !isNil(this.props.values[field.name]) ? this.props.values[field.name] : ""}
                margin="normal"
                fullWidth={field.fullWidth || true}
                multiline={field.multiline ? true : false}
                rows={`${field.multiline}` || null}
                onChange={(e: any) => this.props.onValueChange(field.name, e.target.value)}
                helperText={field.helperText || ""}
                {...extraAttrs}
            />
        );
    }
}
