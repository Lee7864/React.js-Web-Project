
# React Native Convention

Using React Native conventions allow you to focus more on components than raw CSS. Composition allows you to build a set of re-usable CSS.

Reactive Native conventions are:

* Exclusive use of Flexbox
* Style props can be an array
* Default position is 'relative'

In combination with these conventions, many common styles are accessible through prop which make it easy to do layout and also adhere to the Style Guide. 


## Property Styles

Instead of every file having it's own CSS, or sharing global CSS, common styles are implemented as properties. This reduces the amount of CSS needed, and also makes it possible to adhere to Style Guide colors, fonts, padding and spacing.

For example:

```
<View flexHorizontal alignItems="center">
  <Text fontSize="large">Hello</Text>
</View>
```

## Style Prop

When writing components, style properties only give you common CSS. If you need more control such as pseudo-elements, media queries, etc. you can use the style prop. I can be an array of arbritrary depth – false or undefined values are skipped. CSS Modules makes it easy to namespace styles.

```
import styles from './Text.css'

style={[styles.root, bold && styles.bold]}
```

Text.css
```
.root {
  border: 1px solid red;
}

.bold {
  font-weight: bold;
}
```

# Components

```
View
  flex="..." – string such as "1 1 auto"
  flexHorizontal – flex-direction: column
  justifyContent="..." – justify-content: ...
  alignItems="..." – align-items: ...
  padding="..." – string such as "small"
  backgroundColor="..." string such as "down-blue"
  boxShadow – give the box a drop shadow
  phoneHidden – hides component using media query
  style={[...]} – react native style prop (string, array)
Text
  fontSize="..." – font size such as "large"
  fontWeight="..." – font weight such as "semibold"
  textColor="..." – font color such as "down-blue"
  textAlign="..." – text-align: ...
Image
  source
  width
  height
  resizeMode
```