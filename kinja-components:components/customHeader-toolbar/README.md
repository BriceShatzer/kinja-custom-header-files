# Custom Header Toolbar ![under-review](status-images/under-review.svg)

Custom Header Toolbar renders three buttons: Save, Open and Close that handle the state of the Custom Header's edit mode.

[Storybook Demo](/?path=/story/4-components-custom-header-toolbar--customheadertoolbar)

<!-- STORY -->

This component takes the following props

```javascript
type Props = {
	isEditMode: boolean,
	saveHandler: Function
}
```

## Props

### isEditMode

type: _Boolean_

isEditMode toggles the buttons in the component, depending on the edit state.

### saveHandler

type: _Function_

Function that is responsible for the saving of the Curation Module state.
