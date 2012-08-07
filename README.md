#jq-placeholder

Improved placeholder behaviour for input fields and content editable
divs.

Placeholder gives you a few options for placeholder behaviour:
 - Placeholder text can be specified by either adding a data-placeholder
   attribute to the element, or adding a label before the element with
   the placeholder text.
 - The placeholder can slide to the right when the field is selected,
   and optionally vanish after a configurable number of characters are
   typed.
 - The placeholder can also be configured to vanish when the content is
   entered, and reappear when it is removed (like a html5 placeholder).

##Usage

Call `.placeholder()` on an text field, textarea, or content editable
div. Ensure that this element either has a data-placeholder attribute with the
placeholder text, or a label preceding it with the desired placeholder
text. The attribute supercedes the label.

##Settings

###Style
The placeholder will be given a `placeholder` class, and the element to
which it belongs a `placeheld` class.  You can use these to add style to
the element if desired.

###Slide
By default the placeholder will slide to the right when the field is
selected, to prevent this, and simply have it disappear when content is
entered, pass the option `slide: false`

###Vanishing length
By default, when `slide` is `true`, the placeholder will disappear after
five characters are entered.  To change this, set the
`vanishing_length` option. This option is ignored if `slide` is `false`.

###Padding
The pluggin accounts for padding on the editable element in order to
position the placeholder text correctly.  You can also set the padding
using the padding\_X attributes, or by styling the `placeholder` class
in your css.

###Focus and Blur speeds
The speed with which the placeholder slides can be customized with the
`focus_speed` and `blur_speed` options.

##Example
The base.html file contains a few test cases that can be used as
examples.

##Known Issues
If `.placeholder()` is called prior to the element being rendered in the
DOM (which often happens in frameworks like backbone.js), the padding
will not be computed properly.  There are two solutions to this:
1. You can set it yourself, by either styling the 'placeholder' class,
   or by setting the `padding-X` options mentioned above.
2. You can ensure you only call it after rendering is complete.
