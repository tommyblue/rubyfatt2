import * as React from "react";

import AccountCircle from "@material-ui/icons/AccountCircle";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Lock from "@material-ui/icons/Lock";

interface IProps {
    currentValue: string;
    onChange: (key: string, value: string) => void;
    containerClassName: string;
}

export const EmailInput = (props: IProps) => (
    <FormGroup className={props.containerClassName}>
        <FormControl>
            <InputLabel htmlFor="input-email">Email</InputLabel>
            <Input
                id="input-email"
                startAdornment={
                    <InputAdornment position="start">
                        <AccountCircle />
                    </InputAdornment>
                }
                type="email"
                autoComplete="email"
                value={props.currentValue}
                onChange={(e) => props.onChange("email", e.target.value)}
            />
        </FormControl>
    </FormGroup>
);

export const PasswordInput = (props: IProps) => (
    <FormGroup className={props.containerClassName}>
        <FormControl>
            <InputLabel htmlFor="input-password">password</InputLabel>
            <Input
                id="input-password"
                startAdornment={
                    <InputAdornment position="start">
                        <Lock />
                    </InputAdornment>
                }
                type="password"
                autoComplete="password"
                value={props.currentValue}
                onChange={(e) => props.onChange("password", e.target.value)}
            />
        </FormControl>
    </FormGroup>
);
