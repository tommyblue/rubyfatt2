import { clone, map, includes, remove } from "lodash";
import * as React from "react";

import { withStyles, Theme } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';

interface CheckOption {
    value: string;
    label: string;
}

interface IProps {
    classes: any;
    handleChange: (key: string, value: string[]) => void;
    label: string;
    name: string;
    options: CheckOption[];
    selectedValue: string[];
    helpText?: string;
    castValueFn: (value: string) => any;
}

const styles = (theme: Theme) => ({
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 200,
    },
  });

class FormRadio extends React.Component<IProps, {}> {
    public render() {
        const { classes } = this.props;
        return (
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">{this.props.label}</FormLabel>
                <FormGroup>
                    {map(this.props.options, (option, index) =>
                        <FormControlLabel
                            key={`checkbox_${index}`}
                            control={
                            <Checkbox
                                checked={includes(this.props.selectedValue, this.props.castValueFn(option.value))}
                                onChange={this.handleChange.bind(this, option.value)}
                                value={option.value}
                            />
                            }
                            label={option.label}
                        />
                    )}
                </FormGroup>
                <FormHelperText>{this.props.helpText}</FormHelperText>
            </FormControl>
        );
    }

    private handleChange(value: string) {
        const newSelectedValue = clone(this.props.selectedValue)
        if (includes(this.props.selectedValue, value)) {
            remove(newSelectedValue, (v) => v === this.props.castValueFn(value));
        } else {
            newSelectedValue.push(this.props.castValueFn(value));
        }
        this.props.handleChange(this.props.name, newSelectedValue);
    }
}

export default withStyles(styles)(FormRadio);
