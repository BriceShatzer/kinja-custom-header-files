# Stream Header ![under review](status-images/under-review.svg) ![new](status-images/new.svg)

Renders a customizable header on for the story type and category pages

[Storybook demo](http://localhost:8001/?path=/story/4-components-stream-header--stream-header)

<!-- STORY -->

## Props

```javascript
type CustomHeaderJSON = {
  storyTypeId?: StoryTypeId,
  categoryId?: CategoryId, // Either storyTypeId or categoryId must be defined
  content: {
  	background?: CustomHeaderColor | CustomHeaderImage,
  	primary?: CustomHeaderPlainText | CustomHeaderImage,
  	secondary?: CustomHeaderPlainText,
  	tertiary?: CustomHeaderLinks
};

```

### content.background  
```javascript
type CustomHeaderColor = {
  type: 'color',
  value: string
};

type CustomHeaderImage = {
  type: 'image',
  // ImageProps;
  uid: string,
  altText?: ?string,
  originalWidth?: ?number,
  originalHeight?: ?number,
  format: ImageFormat
}
```

### content.primary/secondary/tertiary  
```javascript
type CustomHeaderImage = {
  type: 'image',
  // ImageProps;
  uid: string,
  altText?: ?string,
  originalWidth?: ?number,
  originalHeight?: ?number,
  format: ImageFormat
}

type CustomHeaderPlainText = {
  type: 'plainText',
  value: string
};

type CustomHeaderLinks = {
  type: 'links',
  value: Array<{ text: string, url: string }>
};

```

<!--
### authors

Type: _Array [required]_

An array of authors who contributed to post. An author object consists of the following data:

```
type author = {
	id: string,
	screenName: string,
	displayName: string,
	status: UserStatus,
	isSuperuser: boolean,
	avatar: SimpleImageJSON
}
```

### isAmp

Type: _Boolean [required]_

Value determining if an amp page will load.

### authorUserProperties

Type: _Array [required]_

Array of property objects that define what an author will display in their bio. 
A property Object follows the format below:
-->