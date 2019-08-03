import * as React from 'react'
import { View, Image, Spacer, Text, Button } from '.'
import styles from './Popup.css'
import {treatNewline} from '../../data/StringUtil'

const Popup = ({children, width, hidden, minWidth, maxWidth, minHeight, maxHeight, type,
                 title, message, submessage, image, buttonTitle, onButtonClick, cancelTitle, onCancelClick, ...props}) => {
  const bgProps = {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'overlay'
  }

  const bodyProps = {
    backgroundColor: 'white',
    minWidth: '320px',
    ...props
  }

  const bgStyle = [
    hidden && styles['hidden']
  ]

  const bodyStyle = [
    width !== undefined && {width: width},
    maxWidth !== undefined && {maxWidth: maxWidth},
    minWidth !== undefined && {minWidth: minWidth},
    minHeight !== undefined && {minHeight: minHeight},
    maxHeight !== undefined && {maxHeight: maxHeight}
  ]

  return (
    <View style={[styles.root, bgStyle]} {...bgProps}>
      <View boxShadow style={[bodyStyle]} {...bodyProps}>
        { type === undefined &&
          children
        }
        { (type === 'success' || type === 'fail' || type === 'error' || type === 'check') &&
          <PopupResult title={title}
                       message={treatNewline(message)}
                       submessage={submessage}
                       image={image}
                       submitTitle={buttonTitle}
                       onSubmitClick={onButtonClick}
                       cancelTitle={cancelTitle}
                       onCancelClick={onCancelClick}
          />

        }
      </View>
    </View>
  )
}

type PopupResultProps = {
  image?: string,
  title?: string,
  message: string,
  submessage?: string,
  submitTitle?: string,
  onSubmitClick: () => void,
  cancelTitle?: string,
  onCancelClick?: () => void
}

class PopupResult extends React.Component<PopupResultProps, State> {

  constructor(props:Props) {
    super(props)
  }

  componentDidMount() {
    document.addEventListener('keyup', this.keyUpHandler)
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.keyUpHandler)
  }

  keyUpHandler = (event: KeyboardEvent) => {
    if (event.key === "Enter" && this.props.cancelTitle === undefined) {
      this.props.onSubmitClick()
    }
  }

  render() {
    const { title, message, submessage, image, submitTitle, cancelTitle, onSubmitClick, onCancelClick } = this.props
    return (
      <View minWidth={320} maxWidth={400}
            phonePaddingHorizontal="small"
            padding="large"
            flex='fill'>
        {
          image &&
          <React.Fragment>
            <View alignItems='center'>
              <Image source={image} width={40} height={40}/>
            </View>
            <Spacer size='medium'/>
          </React.Fragment>
        }
        {
          !image &&
          <Spacer size='small'/>
        }
        {
          title &&
          <React.Fragment>
            <Text fontSize='medium' fontWeight='bold' textAlign='center'>
              {title}
            </Text>
            <Spacer size='medium'/>
          </React.Fragment>
        }

        <Text fontSize='small' textAlign='center'>
          {message}
        </Text>
        {
          submessage &&
            <React.Fragment>
              <Spacer size='xlarge'/>
              <Text fontSize='small' textAlign='center'>
                {submessage}
              </Text>
            </React.Fragment>
        }
        { !submitTitle && <Spacer size='small'/> }
        {
          submitTitle && !cancelTitle &&
          <View>
            <Spacer size='xlarge'/>
            <Button title={submitTitle}
                    flex="fill"
                    color="iris"
                    titleColor="white"
                    onPress={onSubmitClick}/>
          </View>
        }
        {
          submitTitle && cancelTitle &&
          <View>
            <Spacer size='xlarge'/>

            <View flexHorizontal>
              <Button title={cancelTitle}
                      flex="fill"
                      onPress={onCancelClick}/>
              <Spacer />

              {
                submitTitle === 'Mobile Authentication' &&
                <Button title={submitTitle}
                        flex="fill"
                        height={45}
                        color="iris"
                        titleColor="white"
                        onPress={onSubmitClick}/>
              }

              {
                submitTitle !== 'Mobile Authentication' &&
                <Button title={submitTitle}
                        flex="fill"
                        color="iris"
                        titleColor="white"
                        onPress={onSubmitClick}/>
              }


            </View>
          </View>
        }
      </View>
    )
  }
}

export default Popup
