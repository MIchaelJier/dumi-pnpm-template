import React, { Component, useCallback, useEffect, useState } from 'react';
import { Input, Modal } from 'antd';

interface ITextAreaBigModalProps {
  value: string;
  visible: boolean;
  onOk: (value: string) => void;
  onCancel: () => void;
  width?: string | number;
  handleChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function TextAreaBigModal(props: ITextAreaBigModalProps) {
  const [bigValue, setBigValue] = useState('');

  const { visible, onCancel, value, onOk, width, handleChange, ...otherProps } =
    props;

  const handleOk = useCallback(() => {
    onOk(bigValue);
  }, [bigValue]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setBigValue(e.target.value);
    },
    [],
  );

  useEffect(() => {
    setBigValue(value);
  }, [value, visible]);

  const modalOpts = {
    title: '',
    width: width || '800px',
    className: 'table-custom-column big-textarea',
    maskClosable: false,
    visible,
    onCancel,
    onOk: handleOk,
    okText: '确定',
    cancelText: '取消',
  };
  return (
    <Modal {...modalOpts}>
      <Input.TextArea
        {...otherProps}
        value={bigValue}
        onChange={handleInputChange}
      />
    </Modal>
  );
}

export default TextAreaBigModal;
