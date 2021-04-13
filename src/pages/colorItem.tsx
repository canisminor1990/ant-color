import React from 'react';
import { ColorBox, ColorGroup, ValueBox } from './index';
import { Input, message } from 'antd';
import { contrast } from '@/utils';
import convert from 'color-convert';
import Copy from 'react-copy-to-clipboard';

export default ({ group }) => {

  const mapColor = (c, index) => {
    const hsl = c.join(',');
    const hex = '#' + convert.hsl.hex(c);
    const rgb = convert.hsl.rgb(c).join(',');
    return (
      <ValueBox key={index}>
        <Copy text={hex} onCopy={() => message.success(`${hex} 拷贝成功`)}>
          <ColorBox style={{ background: hex }} />
        </Copy>
        <Input addonBefore='HSL' value={hsl} />
        <Input addonBefore='RGB' value={rgb} />
        <Input addonBefore='HEX' value={hex} />
        <Input addonBefore='CST' value={contrast(hex)} />
      </ValueBox>
    );
  };

  return (
    <div style={{ marginTop: 32 }}>
      <ColorGroup>
        {group.map(mapColor)}
      </ColorGroup>
    </div>
  );
}