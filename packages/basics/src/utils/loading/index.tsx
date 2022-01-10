import React from 'react';
import ReactDom from 'react-dom';
import './style.less';

export class Spinner extends React.PureComponent {
  render() {
    return (
      <div className="dzg-spinner-container">
        <div className="dzg-spinner">
          <div className="dzg-circle-container container1">
            <div className="circle1" />
            <div className="circle2" />
            <div className="circle3" />
            <div className="circle4" />
          </div>
          <div className="dzg-circle-container container2">
            <div className="circle1" />
            <div className="circle2" />
            <div className="circle3" />
            <div className="circle4" />
          </div>
          <div className="dzg-circle-container container3">
            <div className="circle1" />
            <div className="circle2" />
            <div className="circle3" />
            <div className="circle4" />
          </div>
        </div>
        <span>正在加载中</span>
      </div>
    );
  }
}

export interface SpinnerInstance {
  destroy: () => void;
}

function createLoadingInstance(callback: (instance: SpinnerInstance) => void) {
  const div = document.createElement('div');
  div.className = 'dzg-spinner-root';
  document.body.appendChild(div);
  var called = false;
  function ref() {
    if (called) {
      return;
    }
    called = true;
    callback({
      destroy: function destroy() {
        ReactDom.unmountComponentAtNode(div);
        div.parentNode && div.parentNode.removeChild(div);
      },
    });
  }
  ReactDom.render(React.createElement(Spinner, { ref: ref }), div);
}

class Loading {
  instance?: 'pending' | SpinnerInstance | null;
  constructor() {
    this.start = this.start.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  start() {
    if (this.instance) {
      return;
    }
    this.instance = 'pending';
    createLoadingInstance((instance) => (this.instance = instance));
  }

  destroy() {
    if (this.instance && this.instance !== 'pending') {
      this.instance.destroy();
    }
    this.instance = null;
  }

  getInstance() {
    return this.instance;
  }
}

const loading = new Loading();

export default loading;
