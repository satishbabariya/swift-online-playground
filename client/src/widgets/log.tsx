import * as React from 'react';
import Ansi from 'ansi-to-react';
import '../styles/log.css';

import { Observer } from 'mobx-react';

export class Log extends React.Component {
  constructor(public props: any) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.output}
        <Observer render={() => <Ansi linkify>{this.props.output.join('\n')}</Ansi>} />
      </div>
    );
  }
}
