import * as React from "react";
import styles from './startStyles'

interface Props {
}

class Star extends React.PureComponent<Props, {}> {

  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
        <div style={styles.star} />
    );
  }


}

export default Star
