import React, { useState, useEffect } from 'react';
import convert from 'color-convert';
import { Input, Space, Slider, InputNumber } from 'antd';
import { contrast, genColor, formatNumber } from './func';
import styled from 'styled-components';

/******************************************************
 *********************** Style *************************
 ******************************************************/

const Title = styled.div`
	line-height: 1;
	font-size: 32px;
	font-weight: 600;
	margin-right: 32px;
`;

const Header = styled.div`
	padding: 32px 16px;
	display: flex;
	align-items: center;
	width: 100vw;
	box-shadow: 0 4px 16px rgba(0, 0, 0, .1);
`;

const Body = styled.div`
	width: 100vw;
	padding: 32px 16px;
`;

const View = styled.div`
	max-width: 1800px;
	width: 100%;
	margin: 0 auto;
`;

const ColorGroup = styled.div`
	display: flex;
	flex-wrap: wrap;
`;

const ValueBox = styled.div`
	width: 180px;
`;

const ColorBox = styled.div`
	width: 100%;
	height: 100px;
`;

/******************************************************
 ************************* Dom *************************
 ******************************************************/

export default () => {
  const [target, setTarget]           = useState(207);
  const [group, setGroup]             = useState([]);
  const [hRotateList, setHRotateList] = useState([-7, -4, 0, 3, 5, 7, 8, 8, 8, 8]);
  const [sList, setSList]             = useState([80, 40, 16, 12, 12, 12, 16, 20, 24, 32]);
  const [cList, setCList]             = useState([18.42, 15.08, 6.98, 2.85, 1.83, 1.41, 1.14, 1.09, 1.07, 1.04]);
  const [lList, setLList]             = useState([]);

  useEffect(() => {
    const tempGroup = [];
    sList.forEach((s, index) => {
      const tempHSL = [target + hRotateList[index], s, 0];
      if (index < sList.length - lList.length) {
        tempGroup.push(genColor(tempHSL, cList[index]));
      } else {
        tempGroup.push([target + hRotateList[index], s, lList[index - (sList.length - lList.length)]]);
      }

    });
    setGroup(tempGroup);
  }, [target, hRotateList, sList, cList, lList]);

  const mapColor = (c, index) => {
    const hex = '#' + convert.hsl.hex(c);
    return (
      <ValueBox key={index}>
        <ColorBox style={{ background: hex }} />
        <Input addonBefore='HSL' value={c.join(',')} />
        <Input addonBefore='HEX' value={hex} />
        <Input addonBefore='CST' value={contrast(hex)} />
      </ValueBox>
    );
  };

  return (
    <>
      <Header>
        <View>
          <Space>
            <Title>
              🌈 AntColor
            </Title>
            <Slider
              min={0}
              max={360}
              onChange={(e) => setTarget(e)}
              style={{ width: 180 }}
              value={typeof target === 'number' ? target : 0}
            />
            <InputNumber
              min={0}
              max={360}
              style={{ width: 72 }}
              value={target}
              onChange={(e) => setTarget(e)}
            />
            <Input addonBefore='H旋转' defaultValue={hRotateList}
                   onChange={e => setHRotateList(formatNumber(e.target.value))} />
            <Input addonBefore='S数组' defaultValue={sList} onChange={e => setSList(formatNumber(e.target.value))} />
            <Input addonBefore='C对比数组' defaultValue={cList} onChange={e => setCList(formatNumber(e.target.value))} />
            <Input addonBefore='L固定亮度' defaultValue={lList} onChange={e => setLList(formatNumber(e.target.value))} />
          </Space>
        </View>
      </Header>
      <Body>
        <View>
          <ColorGroup>
            {group.map(mapColor)}
          </ColorGroup>
        </View>
      </Body>
    </>
  );
}
