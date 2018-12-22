import { map } from "lodash";
import * as React from "react";

import { withStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

interface RadioOption {
    value: string;
    label: string;
}

interface IProps {
    classes: any;
    handleChange: (key: string, value: string) => void;
    label: string;
    name: string;
    options: RadioOption[];
    selectedValue: any;
}

const styles = (theme: Theme) => ({
    root: {
      display: 'flex',
    },
    formControl: {
      margin: theme.spacing.unit,
    },
    group: {
      margin: `${theme.spacing.unit}px 0`,
    },
  });

class FormRadio extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        const { classes } = this.props;
        return (
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">{this.props.label}</FormLabel>
                <RadioGroup
                    aria-label={this.props.label}
                    name={this.props.name}
                    className={classes.group}
                    value={this.props.selectedValue}
                    onChange={this.handleChange}
                >
                    {map(this.props.options, (option, index) =>
                        <FormControlLabel
                            key={`radio_${index}`}
                            value={option.value}
                            control={<Radio />}
                            label={option.label}
                        />
                    )}
                </RadioGroup>
            </FormControl>
        );
    }

    private handleChange(_: object, value: string) {
        this.props.handleChange(this.props.name, value);
    }
}

export default withStyles(styles)(FormRadio);
