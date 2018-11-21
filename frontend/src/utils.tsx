import { isEmpty } from "lodash";
import * as moment from "moment";
import * as React from "react";

import Clear from '@material-ui/icons/Clear';
import Done from '@material-ui/icons/Done';

export const toMoney = (val: number) => ( `${val.toFixed(2)}€` );

export const getCheckIcon = (val: boolean): JSX.Element => (
    val ? <Done /> : <Clear />
);

export const parseDate = (val: string): string => (
    moment.utc(val).format("DD/MM/YYYY")
);

export const getErrMsg = (err?: any): any => {
    return !isEmpty(err) ? err : [{"Error": "An error has occurred"}];
};
