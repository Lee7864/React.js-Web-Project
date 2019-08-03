// @flow

import * as React from 'react'
import type {TickSize} from '../../types/Trading'
import Decimal from 'decimal.js'
import LocalizedStrings from 'localized-strings'
import commaNumber from 'comma-number'
import {Image, Spacer, Text, View} from '../controls'
import Dropdown from '../controls/Dropdown'
import Slider from 'rc-slider/es/Slider'
import {findPriceForSnapToMarket, formatPriceToTickSize} from '../../data/NumberUtils'
import styles from '../../styles/StyleGuide.css'

const strings = new LocalizedStrings({
  en: {
    body: {
      type: 'Type',
      price: 'Price',
      quantity: 'Amount',
      amount: 'Total',
      condition: 'Condition',
      buy: 'Buy {0}',
      sell: 'Sell {0}',
      popupTitle: 'Buy Order Confirmation',
      limit: 'LIMIT',
      market: 'MARKET',
      boxTop: 'BOX-TOP',
      snapToPrimary: 'SNAP-TO-PRIMARY',
      snapToMarket: 'SNAP-TO-MARKET',
      min: 'min. ',
      full: 'Full',
      yourAmount: 'Amount'
    },
    popup: {
      minTitle: 'Min Total Amount',
      minMessage: 'Total amount is more than {0} {1}',
      priceEmptyTitle: 'No Price',
      priceEmptyMessage: 'Please input a price.'
    },
    tradeType: {
      limit: 'LIMIT',
      market: 'MARKET',
      boxTop: 'BOX-TOP',
      snapToPrimary: 'SNAP-TO-PRIMARY',
      snapToMarket: 'SNAP-TO-MARKET'
    }
  },
  ko: {
    body: {
      type: '주문유형',
      price: '주문가격',
      quantity: '주문수량',
      amount: '주문총액',
      condition: '주문조건',
      buy: '{0} 매수',
      sell: '{0} 매도',
      popupTitle: '매수 주문 확인',
      limit: '지정가',
      market: '시장가',
      boxTop: '최유리',
      snapToPrimary: '최우선',
      snapToMarket: '최우선유리',
      min: '최소 ',
      full: '가',
      yourAmount: '잔고대비'
    },
    popup: {
      minTitle: '최소 주문 금액 부족',
      minMessage: '최소 주문 금액이 {0} {1} 이상 되어야 합니다.',
      priceEmptyTitle: '주문 가격 없음',
      priceEmptyMessage: '주문 가격을 먼저 입력해주세요.'
    },
    tradeType: {
      limit: '지정가',
      market: '시장가',
      boxTop: '최유리',
      snapToPrimary: '최우선',
      snapToMarket: '최우선유리'
    }
  }
})

type Props = {
  pricingCurrencyDecimalPlaces: number,
  baseDecimalPlaces: number,
  pricingSymbol: string,
  baseSymbol: string,
  tickSizeRanges: TickSize[],
  onOrderClick: () => void,
  isBuy: boolean,
  onShowPopup: (popup: Object) => void,
  onClosePopup: () => void,
  popupVisible: boolean,
  language: string,
  tradeType: string,
  onTradeTypeClick: (value: string) => void,
  condition: string,
  onConditionClick: (value: string) => void,
  quantity: Decimal,
  onQuantityChange: (event: SyntheticEvent<HTMLInputElement>) => void,
  price: Decimal,
  onPriceChange: (event: SyntheticEvent<HTMLInputElement>) => void,
  onPriceClick: (priceNumber: Decimal | null, isBuy: boolean, index: number) => void,
  amount: Decimal,
  sliderValue: number,
  onSliderChange: (value: number) => void,
  expectedAvgPrice: Decimal,
  paddingNum?: number,
  hiddenTradeType?: boolean,
  fontSize?: number,
  buttonFontSize?: number
}

type State = {
  visibleSlider: boolean
}

const sliderMarks = {
  '0': '0%',
  '25': '25%',
  '50': '50%',
  '75': '75%',
  '100': '100%',
}

class BuySellCard extends React.PureComponent<Props, State> {
  state = {
    visibleSlider: false
  }

  priceInputElement: HTMLInputElement
  quantityInputElement: HTMLInputElement

  componentDidUpdate() {
    const {price, quantity, baseDecimalPlaces, tickSizeRanges} = this.props

    if (!this.priceInputElement) {
      const element = document.getElementById('price_input')

      if (element instanceof HTMLInputElement)
        this.priceInputElement = element
    }

    if (!this.quantityInputElement) {
      const element = document.getElementById('quantity_input')

      if (element instanceof HTMLInputElement)
        this.quantityInputElement = element
    }

    if (document.activeElement !== this.priceInputElement) {
      if (this.priceInputElement) {
        if (price !== null && price.greaterThan(0)) {
          this.priceInputElement.value = commaNumber(formatPriceToTickSize(price, tickSizeRanges))
        } else {
          this.priceInputElement.value = '0'
        }
      }
    }

    if (document.activeElement !== this.quantityInputElement) {
      if (this.quantityInputElement) {
        if (quantity !== null && quantity.greaterThan(0)) {
          this.quantityInputElement.value = quantity.toFixed(baseDecimalPlaces)
        } else {
          this.quantityInputElement.value = '0'
        }
      }
    }
  }

  handlePriceBlur = (event: SyntheticEvent<HTMLInputElement>) => {
    const {price, tickSizeRanges} = this.props
    if (price !== null) {
      event.currentTarget.value = commaNumber(formatPriceToTickSize(price, tickSizeRanges))
    }
  }

  handleFullClick = () => {
    const {onSliderChange, price, onShowPopup, onClosePopup} = this.props

    if (price === null || price.equals(0)) {
      onShowPopup({type: 'fail', title: strings.popup.priceEmptyTitle, message: strings.popup.priceEmptyMessage, onClose: onClosePopup})
    } else {
      onSliderChange(100)
    }
  }

  handlePercentClick = () => {
    this.setState({
      visibleSlider: !this.state.visibleSlider
    })
  }

  handleMinusClick = () => {
    const {price, tickSizeRanges, onPriceClick, isBuy} = this.props

    if (price === null || price.equals(0)) {
      return
    }

    const resultPrice = findPriceForSnapToMarket(price, tickSizeRanges, -1)

    if (resultPrice !== null && resultPrice.greaterThan(0)) {
      onPriceClick(resultPrice, isBuy, 0) // 0 은 임시로 넣어주는 값, 왜냐면 index 를 현재 buySellCard 에서 알 수 있는 방법이 없음...
    }
  }

  handlePlusClick = () => {
    const {price, tickSizeRanges, onPriceClick, isBuy} = this.props

    if (price === null || price.equals(0)) {
      return
    }

    const resultPrice = findPriceForSnapToMarket(price, tickSizeRanges, 1)

    if (resultPrice !== null && resultPrice.greaterThan(0)) {
      onPriceClick(resultPrice, isBuy, 0) // 0 은 임시로 넣어주는 값, 왜냐면 index 를 현재 buySellCard 에서 알 수 있는 방법이 없음...
    }
  }

  render() {
    const {
      tickSizeRanges,
      pricingSymbol,
      baseSymbol,
      isBuy,
      tradeType,
      language,
      onTradeTypeClick,
      condition,
      onConditionClick,
      onQuantityChange,
      onPriceChange,
      amount,
      sliderValue,
      onSliderChange,
      expectedAvgPrice,
      onOrderClick,
      paddingNum,
      hiddenTradeType,
      fontSize,
      buttonFontSize
    } = this.props

    const {visibleSlider} = this.state

    strings.setLanguage(language)
    const isLimit = tradeType === 'LIMIT'

    return (
      <View flex='fill' paddingNum={paddingNum ? paddingNum : 20} justifyContent='space-between'>
        <View flexHorizontal alignItems='center' height={40} style={styles.dontshrink} hidden={hiddenTradeType ? hiddenTradeType : false}>
          <View minWidth={52} alignItems='center'>
            <Text textColor='gray'>{strings.body.type}</Text>
          </View>

          <View width={10} style={styles.dontshrink}/>

          <View flex="fill" flexHorizontal alignItems='center' height={40}>
            <View flexGrow={159} height={40}>
              <View width='100%' position='absolute' height={40}>
                <Dropdown onItemClick={onTradeTypeClick} selectedValue={tradeType} color='light-gray' border='normal' fontSize='small' noPadding={true} borderRadius='xsmall'>
                  <Dropdown.Item title={strings.tradeType.limit} value='LIMIT'/>
                  <Dropdown.Item title={strings.tradeType.market} value='MARKET'/>
                  <Dropdown.Item title={strings.tradeType.boxTop} value='BOX_TOP'/>
                  <Dropdown.Item title={strings.tradeType.snapToPrimary} value='SNAP_TO_PRIMARY'/>
                  <Dropdown.Item title={strings.tradeType.snapToMarket} value='SNAP_TO_MARKET'/>
                </Dropdown>
              </View>
            </View>

            <View width={10}/>

            <View flexGrow={119} height={40}>
              <View width='100%' position='absolute' height={40}>
                {(tradeType === 'LIMIT' || tradeType === 'BOX_TOP') &&
                <Dropdown onItemClick={onConditionClick} selectedValue={condition} color='light-gray' border='normal' fontSize='small' noPadding={true} borderRadius='xsmall'>
                  <Dropdown.Item title='GTC' value='GTC'/>
                  <Dropdown.Item title='IOC' value='IOC'/>
                  <Dropdown.Item title='FOK' value='FOK'/>
                </Dropdown>
                }
                {tradeType === 'MARKET' &&
                <Dropdown onItemClick={onConditionClick} selectedValue={condition} color='light-gray' border='normal' fontSize='small' noPadding={true} borderRadius='xsmall'>
                  <Dropdown.Item title='IOC' value='IOC'/>
                  <Dropdown.Item title='FOK' value='FOK'/>
                </Dropdown>
                }
                {(tradeType === 'SNAP_TO_PRIMARY' || tradeType === 'SNAP_TO_MARKET') &&
                <View overflow='hidden' borderColor='light-gray' border='normal' backgroundColor='white' padding='xsmall' height='100%' justifyContent='center' borderRadius='xsmall'>
                  <Text textColor='dark-blue-grey' fontSize='small'>GTC</Text>
                </View>
                }
              </View>
            </View>
          </View>
        </View>

        <View flexHorizontal height={40} alignItems='center' style={styles.dontshrink}>
          <View minWidth={52} alignItems='center'>
            <Text textColor='gray' fontSizeNum={fontSize ? fontSize : 14}>{strings.body.price}</Text>
          </View>

          <View width={10} style={styles.dontshrink}/>

          <View flex="fill" flexHorizontal alignItems='center' height={40}>
            <View flex="fill" height={40}>
              <View width='100%' position='absolute' height={40} border='normal' borderColor='light-gray' flexHorizontal backgroundColor={isLimit ? 'white' : 'disabled'} borderRadius='xsmall' justifyContent='flex-end'>
                <View flex='fill' height='100%' overflow='hidden'>
                  {isLimit && <View height='100%' component='input' id='price_input' onChange={onPriceChange} onBlur={this.handlePriceBlur} style={{textAlign: 'right', outline: 'none', background: 'transparent', fontSize: fontSize ? fontSize : 14}}/>}
                  {!isLimit &&
                  <View height='100%' style={{textAlign: 'right', outline: 'none', background: 'transparent'}}  justifyContent='center'>
                    <Text fontWeight='semibold' fontSizeNum={fontSize ? fontSize : 14}>{commaNumber(formatPriceToTickSize(expectedAvgPrice, tickSizeRanges))}</Text>
                  </View>
                  }
                </View>
                <Spacer size='tiny'/>
                <View height='100%' component='label' htmlFor='price_input' justifyContent='center' style={styles.dontshrink}>
                  <Text textColor='disabled' fontWeight='normal' fontSizeNum={fontSize ? fontSize : 14}>{pricingSymbol}</Text>
                </View>
                <Spacer size='tiny'/>
              </View>
            </View>

            <View width={10} style={styles.dontshrink}/>

            <View width={85} height='100%' style={styles.dontshrink}>
              <View width='100%' position='absolute' height='100%' flexHorizontal justifyContent='space-between'>
                <View width={40} height='100%' border='normal' borderColor='light-gray' justifyContent='center' alignItems='center' onClick={this.handleMinusClick} cursor='pointer' borderRadius='xsmall'>
                  <Image source='/images/trading_minus.svg' width={12} height={3}/>
                </View>
                <View width={40} height='100%' border='normal' borderColor='light-gray' justifyContent='center' alignItems='center' onClick={this.handlePlusClick} cursor='pointer' borderRadius='xsmall'>
                  <Image source='/images/trading_plus.svg' width={12} height={13}/>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View flexHorizontal height={40} alignItems='center' style={styles.dontshrink}>
          <View minWidth={52} alignItems='center'>
            <Text textColor='gray' fontSizeNum={fontSize ? fontSize : 14}>{strings.body.quantity}</Text>
          </View>

          <View width={10} style={styles.dontshrink}/>

          <View flex="fill" flexHorizontal alignItems='center' height={40}>
            <View flex="fill" height='100%'>
              <View width='100%' position='absolute' height='100%' border='normal' borderColor='light-gray' flexHorizontal hidden={visibleSlider} borderRadius='xsmall' justifyContent='flex-end' overflow='hidden'>
                <View width='100%' height='100%' component='input' id='quantity_input' onChange={onQuantityChange} style={{textAlign: 'right', outline: 'none', background: 'transparent', fontSize: fontSize ? fontSize : 14}}/>
                <Spacer size='tiny'/>
                <View height='100%' component='label' htmlFor='quantity_input' justifyContent='center'>
                  <Text textColor='disabled' fontWeight='normal' fontSizeNum={fontSize ? fontSize : 14}>{baseSymbol}</Text>
                </View>
                <Spacer size='tiny'/>
              </View>

              <View width='100%' position='absolute' height='100%' hidden={!visibleSlider} paddingHorizontal='medium' paddingVertical='tiny'>
                <Slider min={0} max={100} onChange={onSliderChange} marks={sliderMarks} value={sliderValue}/>
              </View>
            </View>

            <View width={10} style={styles.dontshrink}/>

            <View width={85} height='100%' style={styles.dontshrink}>
              <View width='100%' position='absolute' height='100%' flexHorizontal justifyContent='space-between'>
                <View width={40} height='100%' border={visibleSlider ? 'thick' : 'normal'} borderColor='light-gray' justifyContent='center' cursor='pointer' onClick={this.handlePercentClick} borderRadius='xsmall'>
                  <Text textAlign='center' cursor='pointer' fontWeight={visibleSlider ? 'bold' : 'normal'} textColor='dark-gray'>%</Text>
                </View>
                <View width={40} height='100%' border='normal' borderColor='light-gray' justifyContent='center' onClick={this.handleFullClick} cursor='pointer' borderRadius='xsmall'>
                  <Text textAlign='center' cursor='pointer' textColor='dark-gray'>{strings.body.full}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View flexHorizontal height={40} alignItems='center' style={styles.dontshrink}>
          <View minWidth={52} alignItems='center'>
            <Text textColor='gray' fontSizeNum={fontSize ? fontSize : 14}>{strings.body.amount}</Text>
          </View>

          <View width={10} style={styles.dontshrink}/>

          <View flex="fill" flexHorizontal alignItems='center' height='100%'>
            <View flex="fill" height='100%'>
              <View width='100%' position='absolute' height='100%' border='normal' borderColor='light-gray' flexHorizontal borderRadius='xsmall'>
                <View width='100%' height='100%' style={{textAlign: 'right', outline: 'none', background: 'transparent'}}  justifyContent='center'>
                  <Text fontWeight='semibold' fontSizeNum={fontSize ? fontSize : 14}>{commaNumber(formatPriceToTickSize(amount, tickSizeRanges))}</Text>
                </View>
                <Spacer size='tiny'/>
                <View height='100%' component='label' justifyContent='center'>
                  <Text textColor='disabled' fontWeight='normal' fontSizeNum={fontSize ? fontSize : 14}>{pricingSymbol}</Text>
                </View>
                <Spacer size='tiny'/>
              </View>
            </View>

            <View width={10} style={styles.dontshrink}/>

            <View width={85} height='100%' style={styles.dontshrink}>
              <View width='100%' position='absolute' height='100%' justifyContent='center'>
                <Text fontSizeNum={fontSize ? fontSize : 13} textAlign='center' textColor='dark-gray'>{strings.body.yourAmount}</Text>
                <Spacer size='tiny'/>
                <Text fontSizeNum={fontSize ? fontSize : 13} textAlign='center' textColor='dark-gray'>{sliderValue + '%'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{background: isBuy ? 'linear-gradient(to bottom, #f16635, #de3618)' : 'linear-gradient(to bottom, #4a90e2, #5865c1)', flexShrink: 0}}
          justifyContent='center'
          alignItems='center'
          borderRadius='xsmall'
          onClick={onOrderClick}
          cursor='pointer'
          height={40}
        >
          <Text textColor='white' fontWeight='semibold' cursor='pointer' fontSizeNum={buttonFontSize ? buttonFontSize : 16}>{strings.formatString(isBuy ? strings.body.buy : strings.body.sell, baseSymbol)}</Text>
        </View>
      </View>
    )
  }
}

export default BuySellCard