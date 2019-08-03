// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Dropdown from 'react-bootstrap/lib/Dropdown'

import { View, Image, Spacer } from '../controls'

import { languageService } from '../../redux/services'

type ToggleProps = {
  onClick?: () => void,
  language: string,
  width?: number,
  height?: number
}

class LanguageToggle extends React.Component<ToggleProps> {

  handleClick = (e) => {
    e.preventDefault()
    if (this.props.onClick !== undefined) {
      this.props.onClick()
    }
  }

  render() {
    const { language, width, height } = this.props

    return (
      <View cursor='pointer' onClick={this.handleClick}>
        {language === 'ko' &&
        <Image source='/images/lang/flag-ko.png' width={width ? width : 24} height={height ? height : 16}/>
        }
        {language === 'en' &&
        <Image source='/images/lang/flag-en.png' width={width ? width : 24} height={height ? height : 16}/>
        }
      </View>
    )
  }
}

type Props = {
  dispatch: (obj: Object) => void,
  language: string,
  width?: number,
  height?: number,
  fontSize?: number
}

class FooterLanguageSelector extends React.Component<Props> {
  componentDidMount() {
    this.props.dispatch(
      languageService.select_default_language()
    )
  }

  onLanguageClick = (lang) => {
    this.props.dispatch(
      languageService.select_language(lang)
    )
  }

  render() {
    const { language, width, height } = this.props

    return (
      <Dropdown id='languageSelector' pullRight onSelect={this.onLanguageClick}>
        <LanguageToggle bsRole="toggle" language={language} width={width} height={height}/>
        <Dropdown.Menu id='languageSelector_dropdown'>
          <MenuItem eventKey='ko' active={language === 'ko'}>
            <View flexHorizontal id='languageSelector_item' width={55}>
              <Image source='/images/lang/flag-ko.png' width={30} height={20}/>
              <Spacer size='tiny'/>
              <div className='languageSelector_text'>KR</div>
            </View>
          </MenuItem>
          <MenuItem eventKey='en' active={language === 'en'}>
            <View flexHorizontal id='languageSelector_item' width={55}>
              <Image source='/images/lang/flag-en.png' width={30} height={20}/>
              <Spacer size='tiny'/>
              <div className='languageSelector_text'>EN</div>
            </View>
          </MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

function mapStateToProps(state) {
  const { setLanguage } = state
  const { language } = setLanguage
  return {
    language
  }
}

export default connect(mapStateToProps)(FooterLanguageSelector)