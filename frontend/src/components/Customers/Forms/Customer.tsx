import { capitalize, includes, replace } from "lodash";
import * as React from "react";

import TextField from "@material-ui/core/TextField";

interface IProps {
    onValueChange: (key: string, value: string) => void;
}

export default class extends React.Component<IProps, {}> {
    public render(): JSX.Element {
        const requiredFields = ["title"];
        return (
            <form noValidate autoComplete="off">
                {
                    [
                        "title", "name", "surname", "address", "zip_code", "town", "province",
                        "country", "tax_code", "vat", "info"
                    ].map((fieldName, index) => (
                        <TextField
                            autoFocus={index===0}
                            required={includes(requiredFields, fieldName)}
                            label={capitalize(replace(fieldName, "_", " "))}
                            defaultValue=""
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
