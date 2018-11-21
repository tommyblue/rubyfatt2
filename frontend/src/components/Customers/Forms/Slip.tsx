import { capitalize, includes, replace } from "lodash";
import * as React from "react";

import TextField from "@material-ui/core/TextField";

interface IProps {
    onValueChange: (key: string, value: string) => void;
    values? : {[fieldName: string]: any};
}

export default class extends React.Component<IProps, {}> {
    public render(): JSX.Element {
        const requiredFields = ["title"];
        return (
            <form noValidate autoComplete="off">
                {
                    [
                        "name",
                        "rate",
                    ].map((fieldName, index) => (
                        <TextField
                            key={`input_${index}`}
                            autoFocus={index===0}
                            required={includes(requiredFields, fieldName)}
                            label={capitalize(replace(fieldName, "_", " "))}
                            defaultValue={this.props.values ? this.props.values[fieldName] : ""}
                            margin="normal"
                            fullWidth
                            onChange={(e) => this.props.onValueChange(fieldName, e.target.value)}
                        />
                    ))
                }
            </form>
        );
    }
}
