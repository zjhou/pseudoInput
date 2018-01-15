# pseudoInput
a toy &lt;Input />

### Usage
``` javascript
const Input = PseudoInput("wrappId"[, option ]);
Input.value // get value
Input.value = "Hello world" // set value
Input.onChange = (val) => {/* do something with val */}
Input.onEnter = (val) => {/* do something with val */}
```

### Option
- `option.color` text color
- `option.backgroundColor` background color
- `option.cursorColor` cursor color
- `option.fontSize` font size
