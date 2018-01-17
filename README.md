# pseudoInput
a toy &lt;input />

### install
- `npm install pseudoinput`
- `<script src="pseudoinput.umd.js"></script`

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
- `option.disableAutoFocus` if set true, you need call `Input.focus()` then input
