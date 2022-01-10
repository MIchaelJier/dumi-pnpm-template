import React from 'react';

const iconPrefix = 'dzg-anticon';

const LoadingOutlined: React.FC = () => {
  return (
    <span
      role="img"
      aria-label="loading"
      className={`${iconPrefix} ${iconPrefix}-info-loading`}
    >
      <svg
        viewBox="0 0 1024 1024"
        focusable="false"
        className={`${iconPrefix}-spin`}
        data-icon="loading"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
      </svg>
    </span>
  );
};

const ExclamationCircleFilled: React.FC = () => {
  return (
    <span
      role="img"
      aria-label="exclamation-circle"
      className={`${iconPrefix} ${iconPrefix}-exclamation-circle`}
    >
      <svg
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="exclamation-circle"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path>
      </svg>
    </span>
  );
};

const CloseCircleFilled: React.FC = () => {
  return (
    <span
      role="img"
      aria-label="close-circle"
      className={`${iconPrefix} ${iconPrefix}-close-circle`}
    >
      <svg
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="close-circle"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
      </svg>
    </span>
  );
};

const CheckCircleFilled: React.FC = () => {
  return (
    <span
      role="img"
      aria-label="check-circle"
      className={`${iconPrefix} ${iconPrefix}-check-circle`}
    >
      <svg
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="check-circle"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
      </svg>
    </span>
  );
};

const InfoCircleFilled: React.FC = () => {
  return (
    <span
      role="img"
      aria-label="exclamation-circle"
      className={`${iconPrefix} ${iconPrefix}-info-circle`}
    >
      <svg
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="info-circle"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path>
      </svg>
    </span>
  );
};

export interface IconProps {
  style: React.CSSProperties;
  onClick: () => void;
}

const CloseOutlined: React.ForwardRefRenderFunction<
  HTMLSpanElement,
  IconProps
> = (props, ref) => {
  return (
    <span
      role="img"
      aria-label="close"
      className={`${iconPrefix} ${iconPrefix}-close`}
      {...props}
    >
      <svg
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="close"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
      </svg>
    </span>
  );
};

export declare interface IconComponents {
  LoadingOutlined: React.FC;
  ExclamationCircleFilled: React.FC;
  CloseCircleFilled: React.FC;
  CheckCircleFilled: React.FC;
  InfoCircleFilled: React.FC;
  CloseOutlined: React.ForwardRefRenderFunction<HTMLSpanElement, IconProps>;
}

const icons: IconComponents = {
  LoadingOutlined,
  ExclamationCircleFilled,
  CloseCircleFilled,
  CheckCircleFilled,
  InfoCircleFilled,
  CloseOutlined,
};

export default icons;
