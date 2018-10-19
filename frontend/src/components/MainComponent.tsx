import * as _ from "lodash";
import * as React from "react";

interface IState {
    selectedColor: string;
}

export default class extends React.Component<{}, IState> {
    // list of colors to pick from
    private colors: string[] = ['#80BF17', '#590F7F', '#FF3725', '#F2AC3F', '#1D66E5'];

    constructor(props: any) {
        super(props);
        this.setColor = this.setColor.bind(this);
        this.state = { selectedColor: this.pickColor() };
    }

    // Render the component
    public render(): JSX.Element {
        return (
            // Return some JSX
            <div className="hello-world" style={{color: this.getColor()}}>
                <a onClick={this.setColor}>Hello, World!</a>
            </div>
        );
    }

    // Set a color in the state
    private setColor(e: any): void {
        e.preventDefault();
        this.setState({ selectedColor: this.pickColor() });
    }

    // Get a random color from the list
    private pickColor(): string {
        return _.shuffle(this.colors)[0];
    }

    // Get the color saved in the state
    private getColor(): string {
        return this.state.selectedColor;
    }
}
