$ = jQuery
$.fn.placeholder = (options) ->
  pixels_to_int = (pixels) ->
    parseInt pixels.replace("px", "")

  field_padding = ($fld) ->
    result = {}
    $.each ["top", "left", "right", "bottom"], (index, area) ->
      result[area] = 0
      $.each ["margin", "border", "padding"], (index, kind) ->
        selector = "#{kind}-#{area}"
        selector += "-width" if kind is "border"
        result[area] += pixels_to_int($fld.css(selector))
    result

  @each ->
    opts = $.extend({}, $.fn.placeholder.defaults, options)
    $field = $(this)

    if $field.data("placeholder_active")
      keystroke_handler?()
      return
    else
      $field.data "placeholder_active", true

    placeholder_text = $field.data("placeholder")
    if placeholder_text
      name_or_id = $field.attr('id') || $field.attr('name')
      unless name_or_id
        $field.attr 'name', 'placeheld'
        name_or_id = 'placeheld'

      $label = $("<label class='#{opts.holder_class}' for='#{name_or_id}'>" + placeholder_text + '</label>')
    else
      $label = $field.prev("label")
      placeholder_text = $label.text()

    return unless placeholder_text

    $field.parent().css position: "relative"
    $field.after $label
    $label.css position: "absolute" # Remove it from the flow
    field_pos = $field.position()
    field_surround = field_padding($field)
    label_top = field_pos.top + field_surround.top + opts.padding_top
    label_left = field_pos.left + field_surround.left + opts.padding_left
    label_right = field_pos.left + $field.outerWidth(true) - field_surround.right - opts.padding_right
    label_rightmost_left = label_right - $label.outerWidth(true)
    if label_rightmost_left < label_left
      label_rightmost_left = label_left
      opts.slide = false
    opts.vanishing_length = 0  unless opts.slide
    current_length = 0
    tagname = $field.get(0).tagName.toLowerCase()
    read_value = $field.val
    read_value = $field.text unless tagname is "input" or tagname is "textarea"
    keystroke_handler = (e) ->
      current_length = read_value.call($field).length
      current_length += 1  if e and e.type is "keypress"
      if current_length > opts.vanishing_length
        if opts.slide
          $label.fadeOut()
        else
          $label.hide()
      else
        $label.show()

    $label.css
      top: label_top
      left: label_left
    .mousedown (e) ->
      e.preventDefault()
      e.target = $field[0]
      opts.label_click.apply(this, [e]) if opts.label_click
      $field.focus()

    $field.addClass(opts.holdee_class).focus ->
      if opts.slide
        $label.stop().animate
          left: label_rightmost_left
        , opts.focus_speed
    .blur ->
      if not current_length and opts.slide
        $label.stop().animate
          left: label_left
        , opts.blur_speed
    .bind "keyup keypress", keystroke_handler

    keystroke_handler()
    active_ele = document.activeElement
    $field.focus()  if (active_ele) is this  if active_ele

$.fn.placeholder.defaults =
  focus_speed: 600
  blur_speed: 600
  padding_top: 0
  padding_left: 1
  padding_right: 0
  padding_bottom: 0
  vanishing_length: 5
  slide: true
  holder_class: 'placeholder'
  holdee_class: 'placeheld'
  label_click: null

