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

        $RealInput.style.width = '1px';
        $RealInput.style.height = '1px';
        $RealInput.style.position = 'fixed';
        $RealInput.style.top = '-100px';
        $RealInput.style.left = '-100px';
        $RealInput.id = 'mapWith' + wrapperId;
        return document.body.appendChild($RealInput);
    }

    function charT(char, type = 'char') {
        let isWhiteSpace = char === ' ',
            isCursor = type === 'cursor',
            opacityColor = 'rgba(0,0,0,0)',
            color, bgColor;

        if(isCursor) {
            if($realInput.selectionStart !== $realInput.selectionEnd){
                bgColor = option.selectionColor;
            }else{
                bgColor = option.cursorColor;
            }
        }else{
            bgColor = 'unset';
        }

        if (isCursor) {
            if (isWhiteSpace) {
                color = opacityColor;
            }
            else {
                color = option.backgroundColor === 'unset' ? '#000' : option.backgroundColor;
            }
        }
        else {
            if (isWhiteSpace) {
                color = opacityColor;
            }
            else {
                color = option.color;
            }
        }

        return `<span class="${type}" style="color: ${color}; background: ${bgColor}" >${isWhiteSpace ? '_' : char}</span>`;
    }

    function update($wrapper, $realInput, valueChanged) {
        userInput = $realInput.value.split('');
        let isCursor = (idx) => idx >= $realInput.selectionStart && idx <= $realInput.selectionEnd
            , isSpaceCursor = $realInput.selectionStart === userInput.length
            , spaceBgColor = isSpaceCursor ? option.cursorColor : 'unset'
            , spaceColor = 'rgba(0,0,0,0)'
            , space = `<span style="color: ${spaceColor}; background: ${spaceBgColor}">_</span>`;

        typedUserInput = userInput.map((ch, idx) => [ch, isCursor(idx) ? 'cursor' : 'char']);
        $wrapper.innerHTML = typedUserInput.map(input => charT(...input)).join('') + space;
        if (valueChanged && option.onChange) {
            option.onChange($realInput.value);
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
                option.onEnter && option.onEnter($realInput.value);
            }
        };
    }

    function beautify($wrapper) {
        $wrapper.style.fontFamily = option.fontFamily;
        $wrapper.style.fontSize = option.fontSize || '16px';
        $wrapper.style.backgroundColor = option.backgroundColor || '#fff';
        $wrapper.style.color = option.color || '#000';
    }
    
    function moveCursorTo(index) {
        $realInput.selectionStart = $realInput.selectionEnd = index;
        update($wrapper, $realInput);
    }

    function ifCharClicked(doSth) {
        $wrapper.addEventListener("click", evt => {
            doSth(Array.from($wrapper.children).indexOf(evt.target), evt.target);
        })
    }

    function init(wrapperId, useOldInput) {
        option = Object.assign({
            color: '#000',
            backgroundColor: '#fff',
            cursorColor: '#000',
            fontSize: '16px',
            fontFamily: 'monospace',
            selectionColor: 'blue'
        }, option);
        $wrapper = getWrapper(wrapperId);
        if (!useOldInput) {
            $realInput = initRealInput(wrapperId);
        }
        $realInput.value = '';
        userInput = [];
        typedUserInput = [];

        beautify($wrapper);
        update($wrapper, $realInput);
        onCursorMove($realInput, () => update($wrapper, $realInput));

        ifCharClicked((there) => moveCursorTo(there));
        $realInput.oninput = (evt) => {
            update($wrapper, evt.target);
        };
        $realInput.focus();
        if (!option.disableAutoFocus) {
            $realInput.onblur = $realInput.focus;
        }
    }

    function blur() {
        $wrapper.innerHTML = userInput.join('');
    }

    function focus() {
        $realInput.focus();
        update($wrapper, $realInput);
    }

    let $wrapper, $realInput, userInput, typedUserInput;

    init(wrapperId);

    return {
        get value() {
            return $realInput.value;
        },
        set value(val) {
            $realInput.value = val;
            update($wrapper, $realInput);
        },
        set onEnter(onEnter) {
            if (typeof onEnter === 'function') {
                option.onEnter = onEnter;
            }
        },
        set onChange(onChange) {
            if (typeof onChange === 'function') {
                option.onChange = onChange;
            }
        },
        blur: blur,
        focus: focus,
        focusOn(newWrapperId) {
            if (newWrapperId === wrapperId) {
                this.focus();
            }
            else {
                this.blur();
                init(newWrapperId, true);
            }
        }
    };
}

export default PseudoInput;
