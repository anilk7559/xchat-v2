import { Component } from 'react';

class Progress extends Component<any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="ProgressBar">
        <div className="Progress" style={{ width: `${this.props.progress}%` }} />
      </div>
    );
  }
}

export default Progress;
