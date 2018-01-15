function PseudoInput(wrapperId, option) {
    function getWrapper(wrapperId) {
        return document.getElementById(wrapperId) || false;
    }

    function initRealInput(wrapperId) {
        let existOne = document.getElementById('mapWith' + wrapperId);
        if (existOne) {
            return existOne;
        }

        let $RealInput = document.createElement('input');

        $RealInput.style.width = "1px";
        $RealInput.style.height = "1px";
        $RealInput.style.position = "fixed";
        $RealInput.style.top = "-100px";
        $RealInput.style.left = "-100px";
        $RealInput.id = 'mapWith' + wrapperId;
        return document.body.appendChild($RealInput);
    }

    function charT(char, type = "char") {
        let isWhiteSpace = char === ' ',
            isCursor = type === 'cursor',
            bgColor = isCursor ? option.cursorColor : 'unset',
            color;

        if (isCursor) {
            if (isWhiteSpace) {
                color = option.cursorColor;
            } else {
                color = option.backgroundColor;
            }
        } else {
            if (isWhiteSpace) {
                color = option.backgroundColor;
            } else {
                color = option.color;
            }
        }

        return `<span class="${type}" style="color: ${color}; background: ${bgColor}" >${isWhiteSpace ? '_' : char}</span>`;
    }

    function update($wrapper, $realInput, valueChanged) {
        userInput = $realInput.value.split("");
        let isCursor = (idx) => idx >= $realInput.selectionStart && idx <= $realInput.selectionEnd
            , isSpaceCursor = $realInput.selectionStart === userInput.length
            , spaceBgColor = isSpaceCursor ? option.cursorColor : 'unset'
            , spaceColor = isSpaceCursor ? option.cursorColor : option.backgroundColor
            , space = `<span style="color: ${spaceColor}; background: ${spaceBgColor}">_</span>`;

        typedUserInput = userInput.map((ch, idx) => [ch, isCursor(idx) ? 'cursor' : 'char']);
        $wrapper.innerHTML = typedUserInput.map(input => charT(...input)).join("") + space;
	if(valueChanged && option.onChange){
	    option.onChange($reallInput.value);
	}
    }

    function onCursorMove($realInput, cb) {
        $realInput.onkeyup = (evt) => {
            const move = ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(evt.code)
                , selectAll = evt.ctrlKey && evt.code === 'KeyA'
                , enter = evt.code === 'Enter';
            if (move || selectAll) {
                cb && cb(evt);
            }

            if (enter) {
                option.onEnter && option.onEnter($realInput.value)
            }
        }
    }

    function beautify($wrapper, $realInput) {
        $wrapper.style.fontFamily = "monospace";
        $wrapper.style.fontSize = option.fontSize || "16px";
        $wrapper.style.backgroundColor = option.backgroundColor || '#fff';
        $wrapper.style.color = option.color || '#000';
    }

    function init(wrapperId) {
        option = Object.assign({
            color: '#000',
            backgroundColor: '#fff',
            cursorColor: '#000',
            fontSize: '16px'
        }, option);
        $wrapper = getWrapper(wrapperId);
        $realInput = initRealInput(wrapperId);
        userInput = [];
        typedUserInput = [];

        beautify($wrapper);
        update($wrapper, $realInput);
        onCursorMove($realInput, () => update($wrapper, $realInput));

        $realInput.oninput = (evt) => {
            update($wrapper, evt.target);
        };
        $realInput.focus();
        $realInput.onblur = $realInput.focus;
    }

    function blur() {
        $wrapper.innerHTML = userInput.join("");
    }

    function focus() {
        $realInput.focus();
        update($wrapper, $realInput);
    }

    let $wrapper, $realInput, userInput, typedUserInput;

    init(wrapperId);

    return {
        get value() {
            return $realInput.value
        },
        set value(val) {
            $realInput.value = val;
            update($wrapper, $realInput);
        },
	 set onEnter (onEnter) {
            if(typeof onEnter === 'function') {
                option.onEnter = onEnter
            }
        },
        set onChange (onChange) {
            if(typeof onChange === 'function') {
                option.onChange = onChange
            }
        },
        blur: blur,
        focus: focus,
        focusOn(newWrapperId) {
            if (newWrapperId === wrapperId) {
                this.focus();
            } else {
                this.blur();
                init(newWrapperId);
            }
        }
    }
}
