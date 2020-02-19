
// https://stackoverflow.com/questions/31402576/enable-focus-only-on-keyboard-use-or-tab-press
const cssGlobal = "using-mouse";
// Let the document know when the mouse is being used
document.body.addEventListener('mousedown', function() {
  document.body.classList.add(cssGlobal);
});
document.body.addEventListener('keydown', function() {
  document.body.classList.remove(cssGlobal);
});

export default cssGlobal;
