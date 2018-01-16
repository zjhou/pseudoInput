import PseudoInput from './lib/pseudoInput.js'
try {
    module.exports = PseudoInput;
}catch(e){
    window.PseudoInput = PseudoInput;
}
