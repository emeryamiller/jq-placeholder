;(function($) {
  var pixels_to_int = function(pixels) {
    return parseInt(pixels.replace('px', ''));
  };

	$.fn.placeholder = function(options) {
		var opts = $.extend({}, $.fn.placeholder.defaults, options);
		return this.each(function() {
			var $field = $(this);
      var $label;
      var placeholder_text = $field.data('placeholder');
      if (!placeholder_text) {
        $prev_label = $field.prev('label')
        placeholder_text = $prev_label.text();
        if (placeholder_text) {$prev_label.hide();}
      }
      if (!placeholder_text) { return; }
      $label = $('<span class="placeholder">' + placeholder_text + '</span>');
      $field.after($label);
      if (!opts.slide) { opts.vanishing_length = 0; }
      $field.parent().css({ position: 'relative' })
      $label.css({position: 'absolute'});  // Remove it from the flow

			var field_pos = $field.position();
			var label_pos = $field.position();
      var field_padding_top = pixels_to_int($field.css('padding-top'))
      var field_padding_left = pixels_to_int($field.css('padding-left'))
      var field_padding_right = pixels_to_int($field.css('padding-right'))

			var starting_position = label_pos.left + field_padding_left + opts.padding_left;
			var ending_position = starting_position + $field.width() - field_padding_right - opts.padding_right;
      var current_length = 0;
      var read_value = $field.val;
      var tagname = $field.get(0).tagName.toLowerCase();
      if (tagname == 'div') { read_value = $field.text; }

      var keystroke_handler = function(e) {
          current_length = read_value.call($field).length
          if (e && e.type === 'keypress') { current_length += 1; }
          if (current_length > opts.vanishing_length) {
            $label.hide();
          } else {
            $label.show();
          }
      }

			$label.css({
				top: label_pos.top + field_padding_top + opts.padding_top,
				left: starting_position,
			}).mousedown(function(e) {
        e.preventDefault();
        $field.focus();
      });

			$field.addClass('placeheld').focus(function() {
        if (opts.slide) {
          $label.stop().animate({
            left: ending_position,
          }, opts.focus_speed);
		  	}
      }).blur(function() {
        if (!current_length && opts.slide) {
          $label.stop().animate({
            left: starting_position,
          }, opts.blur_speed);
        }
      }).bind('keyup keypress', keystroke_handler);

      keystroke_handler();
      active_ele = document.activeElement
      if (active_ele) {
        if ((active_ele) === this) { $field.focus(); }
      }
		});
	};

	$.fn.placeholder.defaults = {
		focus_speed: 600,
		blur_speed: 600,
		padding_top: 0,
		padding_left: 0,
		padding_right: 0,
		padding_bottom: 0,
    vanishing_length: 5,
    slide: true
	}

})(jQuery);
