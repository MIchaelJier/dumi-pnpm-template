import React, { Component } from 'react';
import { Input } from 'antd';
import TextAreaBigModal from './TextAreaBigModal';

import './style/index';

declare type HTMLTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export interface RcTextAreaProps extends HTMLTextareaProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  autoSize?: boolean | Object;
  onPressEnter?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  onResize?: (size: { width: number; height: number }) => void;
}

interface IParam {
  target: {
    value: string;
  };
}

export interface ITextAreaProps extends RcTextAreaProps {
  /**
   * @description onChange事件
   */
  onChange?: (param: IParam) => void;
  /**
   * @description 弹窗Textarea的autoSize
   */
  bigAutoSize?: Object;
  /**
   * @description 是否显示弹窗
   */
  needBigModal?: boolean;
  /**
   * @description 文本框值
   */
  value?: string;
}

interface ITextAreaState {
  visible: boolean;
}

/**
 * @tags TextArea
 * @owner zpu
 */
class TextArea extends Component<ITextAreaProps, ITextAreaState> {
  static defaultProps: {
    bigAutoSize: { minRows: number; maxRows: number };
    needBigModal: boolean;
  };
  constructor(props: ITextAreaProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  openModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (value: string) => {
    this.setState(
      {
        visible: false,
      },
      () =>
        this.props.onChange &&
        this.props.onChange({
          target: {
            value,
          },
        }),
    );
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    // console.log('props',this.props)
    const { visible } = this.state;
    const { bigAutoSize, needBigModal, value, ...otherProps } = this.props;
    const modalOpts = {
      visible,
      onCancel: this.handleCancel,
      value: value || '',
      onOk: this.handleOk,
      autoSize: {
        maxRows: 20,
        ...bigAutoSize,
      },
    };
    return (
      <>
        <Input.TextArea
          onDoubleClick={needBigModal ? this.openModal : () => {}}
          {...otherProps}
          value={value}
        />
        <TextAreaBigModal {...modalOpts} />
      </>
    );
  }
}

TextArea.defaultProps = {
  bigAutoSize: {
    minRows: 10,
    maxRows: 30,
  },
  needBigModal: true,
};

export default TextArea;
