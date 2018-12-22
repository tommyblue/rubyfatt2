import * as moment from "moment";
import * as React from "react";

import { withStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

interface IProps {
    classes: any;
    label: string;
    name: string;
    selectedValue: string;
    handleChange: (key: string, value: string) => void;
};

const styles = (theme: Theme) => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 200,
  },
});

function DatePickers(props: IProps) {
    const { classes } = props;

    return (
        <TextField
            id="date"
            label={props.label}
            type="date"
            value={props.selectedValue}
            className={classes.textField}
            InputLabelProps={{
                shrink: true,
            }}
            onChange={(e: any) => props.handleChange(props.name, e.target.value)}
        />
    );
}

export default withStyles(styles)(DatePickers);
