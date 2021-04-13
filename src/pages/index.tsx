import React, { useState, useEffect, useCallback } from 'react';
import convert from 'color-convert';
import { Input, Space, Slider, InputNumber, Button, message, Checkbox } from 'antd';
import { contrast, genColor, formatNumber } from '../utils';
import styled from 'styled-components';
import ColorItem from './colorItem';
import Copy from 'react-copy-to-clipboard';
import Demo from './demo';

// s: 20 c:1.12

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
	padding: 24px 16px;
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

export const ColorGroup = styled.div`
	display: flex;
	flex-wrap: wrap;
`;

export const ValueBox = styled.div`
	width: 170px;
`;

export const ColorBox = styled.div`
	width: 100%;
	height: 100px;
	cursor: pointer;
	transition: all .2s ease;

	&:hover {
		z-index: 100;
		transform: translateY(-5px);
	}

	&:active {
		transform: scale(.9);
	}
`;

/******************************************************
 ************************* Dom *************************
 ******************************************************/

export default () => {
  const [target, setTarget] = useState(207);
  const [group, setGroup] = useState([]);
  const [rotate, setRotate] = useState(false);
  const [hRotateList, setHRotateList] = useState([-7, -4, 0, 3, 5, 7, 8, 8, 8, 8]);
  const [sList, setSList] = useState([64, 32, 12, 8, 8, 12, 12, 16, 16, 24]);
  const [cList, setCList] = useState([18.42, 15.08, 6.98, 2.85, 1.83, 1.41, 1.16, 1.09, 1.07, 1.04]);
  const [lList, setLList] = useState([]);
  const [saveColors, setSaveColors] = useState([]);

  useEffect(() => {
    const tempGroup = [];
    sList.forEach((s, index) => {
      let tempHSL;
      if (rotate) {
        tempHSL = [target + hRotateList[index], s, 0];
      } else {
        tempHSL = [target, s, 0];
      }
      if (index < sList.length - lList.length) {
        tempGroup.push(genColor(tempHSL, cList[index]));
      } else {
        tempGroup.push([target + hRotateList[index], s, lList[index - (sList.length - lList.length)]]);
      }

    });
    setGroup(tempGroup);
  }, [target, rotate, hRotateList, sList, cList, lList]);

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


  const changeColor = (colors) => {
    let newColors = []
    colors.forEach(c => {
      newColors.push('#' + convert.hsl.hex(c))
    })
    return newColors
  }

  const handleChange = (e, setValue) => {
    const value = formatNumber(e.target.value);
    if (value && value.length === 10) {
      setValue(value);
    } else {
      message.warn('参数必须为 10 个');
    }
  };

  const handleSave = () => {
    setSaveColors([...saveColors, group]);
  };

  const ColorList = useCallback(() => (
    <View>
      {saveColors.map(colors => <ColorItem group={colors} />)}
    </View>
  ), [saveColors]);

  return (
    <>
      <Header>
        <View>
          <Space>
            <Title>
              🌈 AntColor
            </Title>
          </Space>
        </View>
      </Header>
      <Body>
        <View style={{ marginBottom: 32 }}>
          <Space direction='vertical'>
            <Space>
              <InputNumber
                min={0}
                max={360}
                style={{ width: 300 }}
                value={target}
                onChange={(e) => setTarget(e)}
              />
              <Slider
                min={0}
                max={360}
                onChange={(e) => setTarget(e)}
                style={{ width: 488 }}
                value={typeof target === 'number' ? target : 0}
              />
              <Input style={{ width: 250 }} addonBefore='H旋转' defaultValue={hRotateList.toString()} disabled={!rotate}
                     onChange={e => handleChange(e, setHRotateList)} />
              <Checkbox defaultChecked={rotate} onChange={(e) => setRotate(e.target.checked)}>开启旋转</Checkbox>
            </Space>
            <Space>
              <Input style={{ width: 300 }} addonBefore='S数组' defaultValue={sList.toString()}
                     onChange={e => handleChange(e, setSList)} />
              <Input style={{ width: 500 }} addonBefore='C对比数组' defaultValue={cList.toString()}
                     onChange={e => handleChange(e, setCList)} />
              <Input style={{ width: 250 }} addonBefore='L固定亮度' defaultValue={lList.toString()}
                     onChange={e => setLList(formatNumber(e.target.value))} />
              <Button type='primary' onClick={handleSave}>保存</Button>
            </Space>
          </Space>
        </View>
        <View style={{ marginBottom: 32 }}>
          <ColorGroup>
            {group.map(mapColor)}
          </ColorGroup>
        </View>
        <View>
          <Demo colors={changeColor(group)} h={target}/>
        </View>
      </Body>
    </>
  );
}
