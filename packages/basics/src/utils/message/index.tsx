import * as React from 'react';
import './style.less';
import Notification from './Notification';
import icons from './icons';

let defaultDuration = 3;
let defaultTop: number;
let messageInstance: any;
let key = 1;
let prefixCls = 'dzg-common-utils-message';
let transitionName = 'move-up';
let getContainer: () => HTMLElement;
let maxCount: number;

function getMessageInstance(callback: (i: any) => void) {
  if (messageInstance) {
    callback(messageInstance);
    return;
  }
  Notification.newInstance(
    {
      prefixCls,
      transitionName,
      style: { top: defaultTop }, // 覆盖原来的样式
      getContainer,
      maxCount,
    },
    (instance: any) => {
      if (messageInstance) {
        callback(messageInstance);
        return;
      }
      messageInstance = instance;
      callback(instance);
    },
  );
}

export type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

export interface ThenableArgument {
  (val: any): void;
}

export interface MessageType {
  (): void;
  then: (fill: ThenableArgument, reject: ThenableArgument) => Promise<void>;
  promise: Promise<void>;
}

export interface ArgsProps {
  content: React.ReactNode;
  duration: number | null;
  type: NoticeType;
  onClose?: () => void;
  icon?: React.ReactNode;
  key?: string | number;
}

const iconMap = {
  info: icons.InfoCircleFilled,
  success: icons.CheckCircleFilled,
  error: icons.CloseCircleFilled,
  warning: icons.ExclamationCircleFilled,
  loading: icons.LoadingOutlined,
};

const CloseIcon = icons.CloseOutlined;

function notice(args: ArgsProps): MessageType {
  const duration =
    args.duration !== undefined ? args.duration : defaultDuration;
  const IconComponent = iconMap[args.type];

  const target = args.key || key++;
  const closePromise = new Promise((resolve) => {
    const callback = () => {
      if (typeof args.onClose === 'function') {
        args.onClose();
      }
      return resolve(true);
    };
    getMessageInstance((instance) => {
      instance.notice({
        key: target,
        duration,
        style: {},
        content: (
          <div
            className={`${prefixCls}-custom-content${
              args.type ? ` ${prefixCls}-${args.type}` : ''
            }`}
          >
            {args.icon || (IconComponent && <IconComponent />)}
            <span style={{ position: 'relative', paddingRight: '16px' }}>
              {args.content}
              <CloseIcon
                style={{
                  position: 'absolute',
                  right: '-4px',
                  marginRight: 0,
                  color: 'rgb(102, 102, 102)',
                  cursor: 'pointer',
                }}
                onClick={() => instance.removeNotice(target)}
              />
            </span>
          </div>
        ),
        onClose: callback,
      });
    });
  });
  const result: any = () => {
    if (messageInstance) {
      messageInstance.removeNotice(target);
    }
  };
  result.then = (filled: ThenableArgument, rejected: ThenableArgument) =>
    closePromise.then(filled, rejected);
  result.promise = closePromise;
  return result;
}

type ConfigContent = React.ReactNode | string;
type ConfigDuration = number | (() => void);
type JointContent = ConfigContent | ArgsProps;
export type ConfigOnClose = () => void;

function isArgsProps(content: JointContent): content is ArgsProps {
  return (
    Object.prototype.toString.call(content) === '[object Object]' &&
    !!(content as ArgsProps).content
  );
}

export interface ConfigOptions {
  top?: number;
  duration?: number;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
  transitionName?: string;
  maxCount?: number;
}

const api: any = {
  open: notice,
  config(options: ConfigOptions) {
    if (options.top !== undefined) {
      defaultTop = options.top;
      messageInstance = null; // delete messageInstance for new defaultTop
    }
    if (options.duration !== undefined) {
      defaultDuration = options.duration;
    }
    if (options.prefixCls !== undefined) {
      prefixCls = options.prefixCls;
    }
    if (options.getContainer !== undefined) {
      getContainer = options.getContainer;
    }
    if (options.transitionName !== undefined) {
      transitionName = options.transitionName;
      messageInstance = null; // delete messageInstance for new transitionName
    }
    if (options.maxCount !== undefined) {
      maxCount = options.maxCount;
      messageInstance = null;
    }
  },
  destroy() {
    if (messageInstance) {
      messageInstance.destroy();
      messageInstance = null;
    }
  },
};

['success', 'info', 'warning', 'error', 'loading'].forEach((type) => {
  api[type] = (
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ) => {
    if (isArgsProps(content)) {
      return api.open({ ...content, type });
    }

    if (typeof duration === 'function') {
      onClose = duration;
      duration = undefined;
    }

    return api.open({ content, duration, type, onClose });
  };
});

api.warn = api.warning;

export interface MessageApi {
  info(
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ): MessageType;
  success(
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ): MessageType;
  error(
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ): MessageType;
  warn(
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ): MessageType;
  warning(
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ): MessageType;
  loading(
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ): MessageType;
  open(args: ArgsProps): MessageType;
  config(options: ConfigOptions): void;
  destroy(): void;
}

export default api as MessageApi;
