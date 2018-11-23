import { capitalize, includes, replace } from "lodash";
import * as React from "react";

export interface FormField {
    type: React.ComponentType<any>;
    name: string;
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
                    this.props.fields.map((field, index) => (
                        <field.type
                            key={`input_${index}`}
                            autoFocus={index===0}
                            required={includes(requiredFields, field.name)}
                            label={capitalize(replace(field.name, "_", " "))}
                            defaultValue={this.props.values ? this.props.values[field.name] : ""}
                            margin="normal"
                            fullWidth
                            onChange={(e: any) => this.props.onValueChange(field.name, e.target.value)}
                        />
                    ))
                }
            </form>
        );
    }
}
