import * as React from "react";

import { ICustomer } from "../store/domain";

interface IProps {
    customer: ICustomer;
}

export default class extends React.Component<IProps, {}> {
    public render(): JSX.Element {
        return (
            <div>
                {this.props.customer.title}
            </div>
        );
    }
}
