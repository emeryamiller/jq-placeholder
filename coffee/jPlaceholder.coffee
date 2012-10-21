(($, window, document, undefined_)->
  $.widget "opus.jqplaceholder",
    options:
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
      debug : false
      auto_resize : true

    _create: ->
      @$field = @element
      placeholder_text = @$field.data("placeholder")

      if placeholder_text
        @$label = @_create_label(placeholder_text)
      else
        @$label = @$field.prev("label")

      unless @$label
        throw 'Please provide placeholder text by either difining a label for the field, or by adding a data-placeholder attribute'

      @$field.parent().css position: "relative"
      @_attach_label()
      if @options.auto_resize
        $(window).bind 'resize.jqplaceholder', =>
          @_refresh()

    _create_label: (placeholder_text)->
      name_or_id = @$field.attr('id') || @$field.attr('name')
      unless name_or_id
        @$field.attr 'name', 'placeheld'
        name_or_id = 'placeheld'

      $label = $("<label class='#{@options.holder_class}' for='#{name_or_id}'>" + placeholder_text + '</label>')
      @$field.after $label
      $label

    _attach_label: ->
      @$label.css position: "absolute" # Remove it from the flow

    _position_label: ->
      @$label.css @_compute_label_offset()

    _compute_label_offset: ->
      #TODO - too many side effects
      field_pos = @$field.position()
      field_surround = @_field_padding(@$field)
      label_top = field_pos.top + field_surround.top + @options.padding_top
      @label_left = field_pos.left + field_surround.left + @options.padding_left
      label_right = field_pos.left + @$field.outerWidth(true) - field_surround.right - @options.padding_right
      @label_rightmost_left = label_right - @$label.outerWidth(true)
      if label_rightmost_left < @label_left
        label_rightmost_left = @label_left
        @options.slide = false #TODO - Not thrilled about side effect
      {top: label_top, left: @label_left}

    _init: ->
      #TODO - needs to be refactored a bit
      @_position_label()
      @options.vanishing_length = 0  unless @options.slide
      current_length = 0

      @enable()

      @_apply_placeholder() if @_length_of_current_value(@$field)
      @_animate(@_length_of_current_value(@$field))

      @_focus_if_active()
      @

    refresh: ->
      @_init()

    enable: ->
      @disable()
      @$label.bind 'mousedown.jplaceholder', (event)=>
        @_on_mousedown(event)

      @$field.addClass(@options.holdee_class)
      .focus(=> @_apply_placeholder())
      .blur(=> @_reset_placeholder())
      .on("keyup.jqplaceholder keypress.jqplaceholder", null, @, (event)=> @_on_keystroke(event))

    disable: ->
      @element.unbind '.jqplaceholder'

    destroy: ->
      @disable()
      $.Widget::destroy.call @

    _setOption: (key, value)->
      # currently does nothing
      $.Widget::_setOption.apply this, arguments
      if $.isPlainObject(key)
        @options = $.extend(true, @options, key)
      else if key and typeof value is "undefined"
        return @options[key]
      else
        @options[key] = value
      this

    _focus_if_active: ->
      active_ele = document.activeElement
      @$field.focus() if (active_ele) is @element.get(0)

    _on_mousedown: (event)->
      event.preventDefault()
      event.target = @$field[0]
      @options.label_click.apply(this, [event]) if @options.label_click #TODO- replace with a trigger
      @$field.focus()

    _apply_placeholder: ->
      if @options.slide
        @$label.stop().animate
          left: @label_rightmost_left
        , @options.focus_speed

    _reset_placeholder: ->
      if not @_length_of_current_value(@$field) and @options.slide
        @$label.stop().animate
          left: @label_left
        , @options.blur_speed

    _pixels_to_int: (pixels)->
      parseInt pixels.replace("px", "")

    _field_padding: ($fld)->
      result = {}
      $.each ["top", "left", "right", "bottom"], (index, area)=>
        result[area] = 0
        $.each ["margin", "border", "padding"], (index, kind)=>
          selector = "#{kind}-#{area}"
          selector += "-width" if kind is "border"
          result[area] += @_pixels_to_int($fld.css(selector))
      result

    _length_of_current_value: ($field)->
      tagname = $field.get(0).tagName.toLowerCase()
      val = if tagname is "input" or tagname is "textarea"
        $field.val()
      else
        $field.text()
      val.length

    _on_keystroke: (event)->
      current_length = @_length_of_current_value(@$field)
      current_length += 1  if event and event.type is "keypress"
      @_animate(current_length)

    _animate: (current_length)->
      if current_length >= @options.vanishing_length
        if @options.slide
          @$label.fadeOut()
        else
          @$label.hide()
      else
        @$label.show()
) jQuery, window, document
