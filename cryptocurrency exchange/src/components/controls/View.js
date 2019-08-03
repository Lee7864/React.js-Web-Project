// @flow

import * as React from 'react'

import viewStyles from './View.css'
import globalStyles from '../../styles/StyleGuide.css'

const styles = { ...viewStyles, ...globalStyles }

const extract = (style: Style, classNames = [], styleObject = {}) => {
  if (style instanceof Array) {
    for (var s of style) {
      extract(s, classNames, styleObject)
    }
  } else if (typeof style === 'string') {
    if (!classNames.includes(style)) {
      classNames.push(style)
    }
  } else if (typeof style === 'object') {
    Object.assign(styleObject, style)
  }

  return {
    classNames,
    styleObject
  }
}

type Style = string | {} | void | boolean | Style[]
type Flex = 'fill'
type FlexDirection = 'column' | 'column-reverse' | 'row' | 'row-reverse'
type Color = 'white' | 'gray' | 'light-gray' | 'divider' | 'overlay' | 'up-red' | 'down-blue' | 'light-blue' | 'submenu' | 'red' | 'disabled' | 'error' | 'normal' | 'iris' | 'grass' | 'default' | 'dark-gray' | 'emerald' | 'light-blue-gray' | 'light-iris' | 'black' | 'deep-blue' | 'dark-blue-grey' | 'pale-grey' | 'sell-quantity-blue' | 'sell-price-blue' | 'sell-selected-price-blue' | 'buy-quantity-red' | 'buy-price-red' | 'buy-selected-price-red'
type Padding = 'xsmall' | 'small' | 'medium' | 'large' | 'none' | 'tiny' | 'xlarge' | 'medium-large' | 'huge'
type JustifyContent = 'center' | 'space-between' | 'flex-end' | 'space-around' | 'space-evenly'
type AlignItems = 'center' | 'flex-end'
type AlignSelf = 'center' | 'stretch' | 'start'
type BorderRadius = 'xsmall' | 'small' | 'tiny' | 'inherit' | 'none'
type Border = 'normal' | 'thick' | 'thin' | 'thicker' | 'none'
type BorderType = 'bottom' | 'topbottom' | 'top'
type FontWeight = 'bold' | 'semibold' | 'normal'
type Overflow = 'auto' | 'hidden' | 'y'

type Props = {
  children?: React.Node,
  style?: Style,
  component?: React.ElementType,
  matchId?: string,
  flex?: Flex,
  flexGrow?: number,
  flexDirection?: FlexDirection,
  flexHorizontal?: boolean,
  flexWrap?: boolean,
  phoneFlexVertical?: boolean,
  phoneFlexHorizontal?: boolean,
  tabletFlexHorizontal?: boolean,
  tabletFlexVertical?: boolean,
  justifyContent?: JustifyContent,
  alignItems?: AlignItems,
  alignSelf?: AlignSelf,
  padding?: Padding,
  paddingNum?: number,
  paddingVertical?: Padding,
  paddingHorizontal?: Padding,
  paddingHorizontalNum?: number,
  phonePaddingHorizontal?: Padding,
  phonePaddingVertical?: Padding,
  tabletPaddingVertical?: Padding,
  backgroundColor?: Color,
  backgroundImage?: string,
  width?: number | string,
  height?: number | string,
  minWidth?: number | string,
  maxWidth?: number | string,
  maxHeight?: number | string,
  minHeight?: number | string,
  borderRadius?: BorderRadius,
  borderColor?: Color,
  borderType?: BorderType,
  border?: Border,
  boxShadow?: boolean,
  boxLightShadow?: boolean,
  hidden?: boolean,
  phoneHidden?: boolean,
  tabletHidden?: boolean,
  desktopHidden?: boolean,
  phoneOnlyShown?: boolean,
  overflow?: Overflow,
  opacity?: number,
  rotate?: string,
  innerRef?: Object,
  lineHeight?: number,
  cursor?: string,
  zIndex?: number,
  position?: string
}

const View = ({
  children, style, component, matchId,
  flex, flexGrow, flexDirection, flexHorizontal, flexWrap, phoneFlexVertical, tabletFlexHorizontal, tabletFlexVertical, phoneFlexHorizontal,
  justifyContent, alignItems, alignSelf,
  padding, paddingNum, paddingVertical, paddingHorizontal, paddingHorizontalNum, phonePaddingHorizontal, phonePaddingVertical,
  tabletPaddingVertical,
  borderRadius,
  borderColor, backgroundImage, border, borderType,
  backgroundColor,
  width, minWidth, maxWidth, maxHeight, minHeight,
  height,
  hidden,
  phoneHidden, tabletHidden, desktopHidden,
  phoneOnlyShown,
  boxShadow, boxLightShadow,
  opacity,
  rotate,
  overflow, innerRef, lineHeight, cursor, zIndex, position,
  ...restProps
}: Props) => {
  const {
    classNames,
    styleObject
  } = extract([
    styles.root,
    //
    flex && styles[`flex-${flex}`],
    flexGrow !== undefined && {flexGrow: flexGrow},
    flexDirection && styles[`flex-direction-${flexDirection}`],
    flexHorizontal && styles['horizontal'],
    flexWrap && styles['wrap'],
    phoneFlexVertical && styles['phone-vertical'],
    phoneFlexHorizontal && styles['phone-flex-horizontal'],
    tabletFlexHorizontal && styles['tablet-flex-horizontal'],
    tabletFlexVertical && styles['tablet-flex-vertical'],
    justifyContent && styles[`justify-content-${justifyContent}`],
    alignItems && styles[`align-items-${alignItems}`],
    alignSelf && styles[`align-self-${alignSelf}`],
    //
    backgroundColor && styles[`background-color-${backgroundColor}`],
    backgroundImage && styles[`background-image-${backgroundImage}`],
    //
    padding && styles[`padding-${padding}`],
    paddingNum !== undefined && {padding: paddingNum},
    paddingVertical && styles[`padding-vertical-${paddingVertical}`],
    paddingHorizontal && styles[`padding-horizontal-${paddingHorizontal}`],
    paddingHorizontalNum !== undefined && {paddingLeft: paddingHorizontalNum, paddingRight: paddingHorizontalNum},
    phonePaddingHorizontal && styles[`phone-padding-horizontal-${phonePaddingHorizontal}`],
    phonePaddingVertical && styles[`phone-padding-vertical-${phonePaddingVertical}`],
    tabletPaddingVertical && styles[`tablet-padding-vertical-${tabletPaddingVertical}`],
    //
    borderRadius && styles[`border-radius-${borderRadius}`],
    borderColor && styles[`border-color-${borderColor}`],
    borderType && styles[`border-type-${borderType}`],
    border && styles[`border-${border}`],
    //width && styles[`width-${width}`],
    width !== undefined && {width: width},
    height !== undefined && {height: height},
    minWidth !== undefined && {minWidth: minWidth},
    maxWidth !== undefined && {maxWidth: maxWidth},
    maxHeight !== undefined && {maxHeight: maxHeight},
    minHeight !== undefined && {minHeight: minHeight},
    //
    hidden && styles['hidden'],
    phoneHidden && styles['phone-hidden'],
    tabletHidden && styles['tablet-hidden'],
    desktopHidden && styles['desktop-hidden'],
    phoneOnlyShown && styles['phone-only-shown'],
    //
    boxShadow && styles['box-shadow'],
    boxLightShadow && styles['box-light-shadow'],
    //
    opacity !== undefined && {opacity: opacity},
    //
    rotate && styles[`rotate-${rotate}`],
    //
    overflow && styles[`overflow-${overflow}`],
    //
    style, innerRef,
    lineHeight !== undefined && {lineHeight: lineHeight},
    cursor && styles[`cursor-${cursor}`],
    zIndex !== undefined && {zIndex: zIndex},
    position !== undefined && {position: position}
  ])

  const Component: React.ElementType = component || 'div'

  return (
    <Component className={classNames.join(' ')} style={styleObject} ref={innerRef} {...restProps}>
      {children}
    </Component>
  )
}

export type {
  Props,
  Color,
  Padding,
  FontWeight,
  Style,
  Border,
  Overflow
}

export default View
