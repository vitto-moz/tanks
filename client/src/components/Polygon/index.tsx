import * as React from "react";
import {Message, Action} from "../../model";
import styles from './polygonStyles'
import Tank from '../Tank';
import {ITanks, ITank} from '../../services/socketService/interfaces';

interface Props {
    gameState: ITanks
}

interface State {
    messages: Message[];
}

class Polygon extends React.Component<Props, any> {

    private listElement: HTMLDivElement | null = null;

    state: State = {
        messages: []
    };

    render() {
        return (
            <div style={styles.polygon}>
                {
                    Object.keys(this.props.gameState).map(id => {
                        return <Tank key={id} tank={this.props.gameState[id]}/>
                    })
                }
            </div>
        );
    }
}

export default Polygon
