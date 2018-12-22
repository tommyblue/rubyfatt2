import { map } from "lodash";
import * as React from "react";

import { withStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

interface SelectOption {
    value: string;
    label: string;
}

interface IProps {
    classes: any;
    handleChange: (key: string, value: string) => void;
    options: SelectOption[];
    name: string;
    label: string;
    selectedValue: string;
    castValueFn: (value: string) => any;
}

const styles = (theme: Theme) => ({
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2,
    },
});

class SelectElement extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public render(): JSX.Element {
        return (
            <FormControl className={this.props.classes.formControl}>
                <InputLabel>{this.props.label}</InputLabel>
                <Select
                    value={this.props.selectedValue || ""}
                    onChange={this.handleChange}
                    inputProps={{
                        name: this.props.name
                    }}
                >
                    <MenuItem value="">
                        <em>Please select</em>
                    </MenuItem>
                    {map(this.props.options, (option, i) => (
                        <MenuItem
                            key={`select_${i}`}
                            value={this.props.castValueFn(option.value)}
                        >{option.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }

    private handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.props.handleChange(this.props.name, event.target.value);
    }
}

export default withStyles(styles)(SelectElement);
