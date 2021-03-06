import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

export interface NoticeProps {
  prefixCls: string;
  style?: React.CSSProperties;
  className?: string;
  duration?: number | null;
  children?: React.ReactNode;
  update?: boolean;
  closeIcon?: React.ReactNode;
  closable?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onClose: () => void;

  /** @private Only for internal usage. We don't promise that we will refactor this */
  holder?: HTMLDivElement;
}

export default class Notice extends Component<NoticeProps> {
  static defaultProps = {
    onClose() {},
    duration: 1.5,
    style: {
      right: '50%',
    },
  };

  closeTimer?: number | null;

  componentDidMount() {
    this.startCloseTimer();
  }

  componentDidUpdate(prevProps: NoticeProps) {
    if (this.props.duration !== prevProps.duration || this.props.update) {
      this.restartCloseTimer();
    }
  }

  componentWillUnmount() {
    this.clearCloseTimer();
  }

  close = (e?: React.MouseEvent<HTMLAnchorElement>) => {
    if (e) {
      e.stopPropagation();
    }
    this.clearCloseTimer();
    this.props.onClose();
  };

  startCloseTimer = () => {
    if (this.props.duration) {
      this.closeTimer = window.setTimeout(() => {
        this.close();
      }, this.props.duration * 1000);
    }
  };

  clearCloseTimer = () => {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  };

  restartCloseTimer() {
    this.clearCloseTimer();
    this.startCloseTimer();
  }

  render() {
    const {
      prefixCls,
      className,
      closable,
      closeIcon,
      style,
      onClick,
      children,
      holder,
    } = this.props;
    const componentClass = `${prefixCls}-notice`;
    const node = (
      <div
        className={classNames(componentClass, className, {
          [`${componentClass}-closable`]: closable,
        })}
        style={style}
        onMouseEnter={this.clearCloseTimer}
        onMouseLeave={this.startCloseTimer}
        onClick={onClick}
      >
        <div className={`${componentClass}-content`}>{children}</div>
        {closable ? (
          <a
            tabIndex={0}
            onClick={this.close}
            className={`${componentClass}-close`}
          >
            {closeIcon || <span className={`${componentClass}-close-x`} />}
          </a>
        ) : null}
      </div>
    );

    if (holder) {
      return ReactDOM.createPortal(node, holder);
    }

    return node;
  }
}
