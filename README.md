#jq-placeholder

Improved placeholder behaviour for input fields.

Typically placeholders appear in a field and disappear as soon as that
field has focus. This plugin leaves the text in place until a character
is typed, and places the placeholder back when the text is removed. It
also allows placeholders to work within content editable divs.

##Usage

Call `.jq_placeholder()` on an text field, textarea, or content editable
div. Ensure that this element has a data-placeholder attribute with the
placeholder text.

##Settings

###Opacity
Change the opacity of the placeholder text by using the `opacity`
setting. It defaults to `0.4`

###Padding
Change the padding start of the placeholder text by using the
`padding_start` setting. It defaults to `8`

##Example
The base.html file contains a few test cases that can be used as
examples.
