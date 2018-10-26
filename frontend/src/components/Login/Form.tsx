import * as React from "react";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import { IState } from "../../containers/Login";
import { EmailInput, PasswordInput } from "./Inputs";

interface IProps {
    classes: any;
    state: IState;
    onChange: (key: string, value: string|number) => void;
    onSubmit: () => void;
}

export const Form = (props: IProps) => (
    <Card>
        <CardContent>
            <Typography component="h3" variant="h3" gutterBottom>Sign In</Typography>
            <EmailInput
                containerClassName={props.classes.inputGroup}
                currentValue={props.state.email}
                onChange={props.onChange}
            />
            <PasswordInput
                containerClassName={props.classes.inputGroup}
                currentValue={props.state.password}
                onChange={props.onChange}
            />
        </CardContent>
        <CardActions>
            <Button
                variant="contained"
                color="primary"
                className={props.classes.button}
                onClick={props.onSubmit}
            >Sign In</Button>
        </CardActions>
    </Card>
);
