;(function($) {
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
			var field_width_offset = ($field.outerWidth() - $field.width())/2;
			var field_height_offset = ($field.outerHeight() - $field.height())/2;
			var starting_position = label_pos.left + field_width_offset + opts.padding_start;
			var ending_position = starting_position + $field.width() - $label.outerWidth() - opts.padding_end;
      var current_length = 0;
      var read_value = $field.val;
      var tagname = $field.get(0).tagName.toLowerCase();
      if (tagname == 'div') { read_value = $field.text; }

			$label.css({
				top: label_pos.top + field_height_offset,
				left: starting_position,
			}).mousedown(function(e) {
        e.preventDefault();
        $field.focus();
      });

			$field.addClass('placheld').focus(function() {
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
      }).bind('keyup keypress', function(e) {
        current_length = read_value.call($field).length
        if (event && event.type === 'keypress') { current_length += 1; }
        if (current_length > opts.vanishing_length) {
          $label.hide();
        } else {
          $label.show();
        }
      }).keyup();

      active_ele = document.activeElement
      if (active_ele) {
        if ((active_ele) === this) { $field.focus(); }
      }
		});
	};

	$.fn.placeholder.defaults = {
		focus_speed: 600,
		blur_speed: 600,
		padding_start: 1,
		padding_end: 3,
    vanishing_length: 5,
    slide: true
	}
})(jQuery);
