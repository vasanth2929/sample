import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

export const ToolTipText = ({ children, limit = 0 }) => {
  let allowedText = children;
  if (limit && children.length > limit) {
    allowedText = children?.substring(0, limit) + '...';
  }
  return (
    <Tooltip title={children}>
      <span>{allowedText}</span>
    </Tooltip>
  );
};
